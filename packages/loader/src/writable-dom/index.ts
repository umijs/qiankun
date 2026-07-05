import { markLoaderStreamedNode } from '@qiankunjs/shared';

type Writable = {
  write: (html: string) => void;
  abort: (err: Error) => void;
  close: () => Promise<void>;
};

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

type WritableDOM = {
  new (
    target: ParentNode,
    previousSibling?: ChildNode | null,
    assetTransformer?: (clone: Node) => Node,
  ): WritableStream<string>;
  (
    target: ParentNode,
    previousSibling?: ChildNode | null,
    assetTransformer?: <T extends Node>(clone: T) => T,
  ): Writable;
};
function writableDOM(
  this: unknown,
  target: ParentNode,
  previousSibling?: ChildNode | null,
  assetTransformer?: <T extends Node>(clone: T) => T,
): Writable | WritableStream<string> {
  if (this instanceof writableDOM) {
    return new WritableStream(writableDOM(target, previousSibling, assetTransformer));
  }

  const nextSibling = previousSibling ? previousSibling.nextSibling : null;
  const doc = createDocument(target, nextSibling);
  doc.write('<!DOCTYPE html><body><template>');
  const root = (doc.body.firstChild as HTMLTemplateElement).content;
  const walker = doc.createTreeWalker(root);
  const targetNodes = new WeakMap<Node, Node>([[root, target]]);
  let pendingText: Text | null = null;
  let scanNode: Node | null = null;
  let resolve: void | (() => void);
  let isBlocked = false;
  let inlineHostNode: Node | null = null;

  return {
    write(chunk: string) {
      doc.write(chunk);

      if (pendingText && !inlineHostNode) {
        // When we left on text, it's possible more text was written to the same node.
        // here we copy in the final text content from the detached dom to the live dom.
        (targetNodes.get(pendingText) as Text).data = pendingText.data;
      }

      walk();
    },
    abort() {
      if (isBlocked) {
        (targetNodes.get(walker.currentNode) as Element).remove();
      }
    },
    close() {
      appendInlineTextIfNeeded(pendingText, inlineHostNode, assetTransformer);

      return isBlocked ? new Promise<void>((_) => (resolve = _)) : Promise.resolve();
    },
  };

  function walk(): void {
    let node: Node | null;
    if (isBlocked) {
      // If we are blocked, we walk ahead and preload
      // any assets we can ahead of the last checked node.
      const blockedNode = walker.currentNode;
      if (scanNode) walker.currentNode = scanNode;

      while ((node = walker.nextNode())) {
        const link = getPreloadLink((scanNode = node));
        if (link) {
          if (typeof assetTransformer === 'function') {
            assertInPlaceTransform(link, assetTransformer(link));
          }
          link.onload = link.onerror = () => target.removeChild(link);
          target.insertBefore(link, nextSibling);
        }
      }

      walker.currentNode = blockedNode;
    } else {
      while ((node = walker.nextNode())) {
        const clone = document.importNode(node, false);
        const previousPendingText = pendingText;
        if (node.nodeType === Node.TEXT_NODE) {
          pendingText = node as Text;
        } else {
          pendingText = null;
        }

        const parentNode = targetNodes.get(node.parentNode!)!;
        targetNodes.set(node, clone);

        if (isInlineHost(parentNode!)) {
          inlineHostNode = parentNode;
        } else {
          appendInlineTextIfNeeded(previousPendingText, inlineHostNode, assetTransformer);
          inlineHostNode = null;

          // Blocking semantics are judged on the untouched clone — the transformer runs after all
          // the bookkeeping here, transpiles the node IN PLACE (enforced by assertInPlaceTransform)
          // and must honor the original's loading contract, i.e. fire load/error eventually. This
          // keeps writable-dom free of any knowledge about the transformers' internals.
          if (isBlocking(clone)) {
            isBlocked = true;
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            clone.onload = clone.onerror = () => {
              isBlocked = false;
              // Continue the normal content injecting walk.
              if (clone.parentNode) walk();
            };
          }

          // document.importNode will reset the `async` attribute to true, here we need to set it manually.
          // see https://github.com/marko-js/writable-dom/issues/7
          if (isSyncScript(clone)) {
            clone.async = false;
          }

          // let the sandbox's patched container methods tell streamed nodes (already transpiled
          // by this walk) apart from dynamic insertions made by app code
          markLoaderStreamedNode(clone);

          // A transformer that also listens for load/error (e.g. the entry bookkeeping in
          // loadEntry) chains the handler wired above after its own logic — that keeps the entry
          // deferred settling before the walk resumes and later inline scripts execute.
          if (typeof assetTransformer === 'function') {
            assertInPlaceTransform(clone, assetTransformer(clone));
          }

          if (parentNode === target) {
            target.insertBefore(clone, nextSibling);
          } else {
            parentNode.appendChild(clone);
          }
        }

        // Start walking for preloads.
        if (isBlocked) return walk();
      }

      // Some blocking content could have prevented load.
      if (resolve) resolve();
    }
  }
}

export default writableDOM as WritableDOM;

/**
 * The asset transformer contract: transpile the node IN PLACE and return the very same reference.
 * The walk wires its blocking bookkeeping before the transform runs — swapping the node would
 * orphan those handlers (and any the app attached itself) and leave the walk blocked forever, so
 * a violation fails loudly here instead.
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
    node.nodeType === Node.ELEMENT_NODE &&
    ((node.tagName === 'SCRIPT' &&
      !!node.src &&
      !(node.noModule || node.type === 'module' || node.hasAttribute('async') || node.hasAttribute('defer'))) ||
      (node.tagName === 'LINK' &&
        node.rel === 'stylesheet' &&
        // an href-less stylesheet link is inert and must not block the walk
        !!node.href &&
        (!node.media || matchMedia(node.media).matches)))
  );
}

function isSyncScript(node: any): node is HTMLScriptElement {
  return (
    node.tagName === 'SCRIPT' && !!node.src && !(node.noModule || node.type === 'module' || node.hasAttribute('async'))
  );
}

function getPreloadLink(node: any) {
  let link: HTMLLinkElement | undefined;
  if (node.nodeType === Node.ELEMENT_NODE) {
    switch (node.tagName) {
      case 'SCRIPT':
        if (node.src && !node.noModule) {
          link = document.createElement('link');
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
          link = document.createElement('link');
          link.href = node.getAttribute('href');
          link.rel = 'preload';
          link.as = 'style';
        }
        break;
      case 'IMG':
        link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        if (node.srcset) {
          link.imageSrcset = node.srcset;
          link.imageSizes = node.sizes;
        } else {
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

function appendInlineTextIfNeeded(
  pendingText: Text | null,
  inlineTextHostNode: Node | null,
  assetTransformer?: <T extends Node>(clone: T) => T,
) {
  if (pendingText && inlineTextHostNode) {
    let textNode = pendingText;

    if (typeof assetTransformer === 'function') {
      // copy the text node and host node, transform the copy in place, then graft the transformed
      // text node back onto the live host
      const graftedHost = document.importNode(inlineTextHostNode, false);
      const graftedText = document.importNode(textNode, false);
      graftedHost.appendChild(graftedText);
      assertInPlaceTransform(graftedHost, assetTransformer(graftedHost));
      textNode = graftedHost.firstChild as Text;
    }

    inlineTextHostNode.appendChild(textNode);
  }
}

function isInlineHost(node: Node) {
  const { tagName } = node as Element;
  return (tagName === 'SCRIPT' && !(node as HTMLScriptElement).src) || tagName === 'STYLE';
}
