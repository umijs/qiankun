/**
 * Forked from https://github.com/marko-js/writable-dom (src/index.ts).
 *
 * Keep this file in sync with upstream: every qiankun-specific deviation is marked with a
 * `[qiankun]` comment so periodic syncs can re-apply them mechanically. The deviations are:
 * - the `assetTransformer` parameter: transforms every element in place right before insertion
 *   (enforced by assertInPlaceTransform), including inline script/style text via a grafted host.
 *   The callback is the walk's only integration seam — callers hang their own bookkeeping
 *   (e.g. marking nodes) on it, this file stays free of downstream knowledge
 * - `isSyncScript` + `clone.async = false`: preserve document order for non-blocking external
 *   scripts (see https://github.com/marko-js/writable-dom/issues/7)
 * - preload hints read the raw attributes (getAttribute) instead of the resolved properties, so
 *   the transformer can resolve them against the app entry rather than the host document
 * - an href-less stylesheet link is inert and must not block the walk
 */
enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
}

type Writable = {
  write(html: string): void;
  abort(err: Error): void;
  close(): Promise<void>;
};

// [qiankun] the transformer contract: transpile the node IN PLACE and return the same reference
type AssetTransformer = <T extends Node>(clone: T) => T;

const createHTMLDocument = () => document.implementation.createHTMLDocument('');
let createDocument = (target: ParentNode, nextSibling: ChildNode | null): Document => {
  const testDoc = createHTMLDocument();
  testDoc.write('<script>');
  /**
   * Safari and potentially other browsers strip script tags from detached documents.
   * If that's the case we'll fallback to an iframe implementation.
   */
  createDocument = testDoc.scripts.length
    ? createHTMLDocument
    : // eslint-disable-next-line @typescript-eslint/no-shadow
      (target, nextSibling) => {
        const frame = document.createElement('iframe');
        frame.src = '';
        frame.style.display = 'none';
        target.insertBefore(frame, nextSibling);
        const doc = frame.contentDocument!;
        const { close } = doc;
        doc.close = () => {
          target.removeChild(frame);
          close.call(doc);
        };

        return doc;
      };

  return createDocument(target, nextSibling);
};

function writableDOM(
  this: unknown,
  target: ParentNode,
  previousSibling?: ChildNode | null,
  // [qiankun] extra parameter, threaded through the new-call branch below
  assetTransformer?: AssetTransformer,
): Writable | WritableStream<string> {
  if (this instanceof writableDOM) {
    return new WritableStream(writableDOM(target, previousSibling, assetTransformer));
  }

  const nextSibling = previousSibling ? previousSibling.nextSibling : null;
  const owner = target.ownerDocument!;
  const doc = createDocument(target, nextSibling);
  // Seed the streaming parse root with a body and template. Besides keeping parsed
  // nodes detached, the browser parser can place entry fragments that omit an
  // explicit <body> into this template without TagTransformStream buffering to EOF.
  doc.write('<!DOCTYPE html><body><template>');
  const root = (doc.body.firstChild as HTMLTemplateElement).content;
  const walker = doc.createTreeWalker(root);
  const targetNodes = new WeakMap<Node, Node>([[root, target]]);
  const targetFragments = new WeakMap<ParentNode, DocumentFragment>();
  const isIncomplete = (node: ParentNode) => !(resolve || node.nextSibling || /<\/\w+>$/.test(curChunk));
  let appendedTargets = new Set<ParentNode>();
  let scanNode: Node | null = null;
  let resolve: void | (() => void);
  let isBlocked = false;
  let curChunk = '';

  return {
    write(chunk: string) {
      curChunk = chunk;
      doc.write(chunk);
      walk();
    },
    abort() {
      if (isBlocked) {
        (targetNodes.get(walker.currentNode) as Element).remove();
      }
    },
    close() {
      return new Promise((_) => {
        resolve = _;
        if (!isBlocked) walk();
      });
    },
  };

  // [qiankun] inline script/style text runs through the transformer before it reaches the live
  // host (sandbox-wrapping inline scripts, @scope-wrapping inline styles): graft the text onto a
  // detached copy of the host — transformers read the host's attributes (e.g. the script type) —
  // transform in place, then take the resulting text back
  function transformInlineText(host: Element, text: Text): Text {
    if (typeof assetTransformer !== 'function') return text;
    const graftedHost = owner.importNode(host, false);
    graftedHost.appendChild(text);
    assertInPlaceTransform(graftedHost, assetTransformer(graftedHost));
    return graftedHost.firstChild as Text;
  }

  function walk(): void {
    const startNode = walker.currentNode;
    let node: Node | null;
    if (isBlocked) {
      // If we are blocked, we walk ahead and preload
      // any assets we can ahead of the last checked node.
      if (scanNode) walker.currentNode = scanNode;

      while ((node = walker.nextNode())) {
        const link = getPreloadLink((scanNode = node), owner);
        if (link) {
          // [qiankun] preload hints must match what the transpiler pipeline will actually fetch
          if (typeof assetTransformer === 'function') {
            assertInPlaceTransform(link, assetTransformer(link));
          }
          link.onload = link.onerror = () => target.removeChild(link);
          target.insertBefore(link, nextSibling);
        }
      }

      walker.currentNode = startNode;
    } else {
      if (startNode.nodeType === NodeType.TEXT_NODE) {
        if (!isInlineScriptOrStyleTag((node = startNode.parentNode!))) {
          (targetNodes.get(startNode) as Text).data = (startNode as Text).data;
        } else if (!isIncomplete(node)) {
          // [qiankun] completed inline text goes through the transformer before it executes
          const host = targetNodes.get(node) as Element;
          host.appendChild(transformInlineText(host, owner.importNode(startNode as Text, false)));
        }
      }

      while ((node = walker.nextNode())) {
        const parentNode = node.parentNode!;
        if (node.nodeType === NodeType.TEXT_NODE && isInlineScriptOrStyleTag(parentNode) && isIncomplete(parentNode)) {
          break;
        }

        const cloneParent = targetNodes.get(parentNode) as ParentNode;
        let clone: Node = owner.importNode(node, false);
        let insertParent: ParentNode = cloneParent;
        // [qiankun] inline text landing in a script/style host is transformed like the
        // completed-text branch above
        if (node.nodeType === NodeType.TEXT_NODE && isInlineScriptOrStyleTag(parentNode)) {
          clone = transformInlineText(cloneParent as Element, clone as Text);
        }
        targetNodes.set(node, clone);

        if (cloneParent.isConnected) {
          appendedTargets.add(cloneParent);
          (insertParent = targetFragments.get(cloneParent)!) ||
            targetFragments.set(cloneParent, (insertParent = owner.createDocumentFragment()));
        }

        if (isBlocking(clone)) {
          isBlocked = true;
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          clone.onload = clone.onerror = () => {
            isBlocked = false;
            // Continue the normal content injecting walk.
            if (clone.parentNode) walk();
          };
        }

        if (node.nodeType === NodeType.ELEMENT_NODE) {
          // [qiankun] document.importNode resets the `async` attribute to true, set it back
          // manually to preserve document execution order for non-blocking external scripts.
          // see https://github.com/marko-js/writable-dom/issues/7
          if (isSyncScript(clone)) {
            clone.async = false;
          }

          // [qiankun] transpile the node in place right before insertion. The blocking bookkeeping
          // above stays wired to it; a transformer that also listens for load/error (e.g. the
          // entry bookkeeping in loadEntry) chains the previously wired handler after its own
          // logic, which keeps the entry deferred settling before the walk resumes.
          if (typeof assetTransformer === 'function') {
            assertInPlaceTransform(clone, assetTransformer(clone));
          }
        }

        insertParent.appendChild(clone);
        if (isBlocked) break;
      }

      for (const targetNode of appendedTargets) {
        targetNode.insertBefore(targetFragments.get(targetNode)!, targetNode === target ? nextSibling : null);
      }

      appendedTargets = new Set();

      if (isBlocked) {
        walk();
      } else if (resolve) {
        // Some blocking content could have prevented load.
        resolve();
      }
    }
  }
}

export default writableDOM as {
  new (
    target: ParentNode,
    previousSibling?: ChildNode | null,
    assetTransformer?: AssetTransformer,
  ): WritableStream<string>;
  (target: ParentNode, previousSibling?: ChildNode | null, assetTransformer?: AssetTransformer): Writable;
};

/**
 * [qiankun] The asset transformer contract: transpile the node IN PLACE and return the very same
 * reference. The walk wires its blocking bookkeeping before the transform runs — swapping the node
 * would orphan those handlers (and any the app attached itself) and leave the walk blocked
 * forever, so a violation fails loudly here instead.
 */
function assertInPlaceTransform(original: Node, transformed: Node): void {
  if (transformed !== original) {
    throw new Error(
      `[qiankun] the asset transformer must transpile <${original.nodeName.toLowerCase()}> in place, but returned a different node`,
    );
  }
}

function isBlocking(node: any): node is HTMLElement {
  return (
    node.nodeType === NodeType.ELEMENT_NODE &&
    (node.blocking === 'render' ||
      (node.tagName === 'SCRIPT' &&
        node.src &&
        !(node.noModule || node.type === 'module' || node.hasAttribute('async') || node.hasAttribute('defer'))) ||
      (node.tagName === 'LINK' &&
        node.rel === 'stylesheet' &&
        // [qiankun] an href-less stylesheet link is inert and must not block the walk
        !!node.href &&
        (!node.media || matchMedia(node.media).matches)))
  );
}

// [qiankun] see the async note in the walk above
function isSyncScript(node: any): node is HTMLScriptElement {
  return (
    node.tagName === 'SCRIPT' && !!node.src && !(node.noModule || node.type === 'module' || node.hasAttribute('async'))
  );
}

function getPreloadLink(node: any, owner: Document) {
  let link: HTMLLinkElement | undefined;
  if (node.nodeType === NodeType.ELEMENT_NODE) {
    switch (node.tagName) {
      case 'SCRIPT':
        if (node.src && !node.noModule) {
          link = owner.createElement('link');
          // [qiankun] raw attribute so the transformer can resolve it against the app entry
          link.href = node.getAttribute('src');
          if (node.getAttribute('type') === 'module') {
            link.rel = 'modulepreload';
          } else {
            link.rel = 'preload';
            link.as = 'script';
          }
        }
        break;
      case 'LINK':
        if (node.rel === 'stylesheet' && (!node.media || matchMedia(node.media).matches)) {
          link = owner.createElement('link');
          // [qiankun] raw attribute so the transformer can resolve it against the app entry
          link.href = node.getAttribute('href');
          link.rel = 'preload';
          link.as = 'style';
        }
        break;
      case 'IMG':
        link = owner.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        if (node.srcset) {
          link.imageSrcset = node.srcset;
          link.imageSizes = node.sizes;
        } else {
          // [qiankun] raw attribute so the transformer can resolve it against the app entry
          link.href = node.getAttribute('src');
        }
        break;
    }

    if (link) {
      if (node.integrity) {
        link.integrity = node.integrity;
      }

      if (node.crossOrigin) {
        link.crossOrigin = node.crossOrigin;
      }
    }
  }

  return link;
}

function isInlineScriptOrStyleTag(node: ParentNode): node is HTMLScriptElement | HTMLStyleElement {
  return (
    (node as Element).tagName === 'STYLE' ||
    ((node as Element).tagName === 'SCRIPT' && !(node as HTMLScriptElement).src)
  );
}
