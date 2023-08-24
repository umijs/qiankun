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
    assetTransformer?: (clone: Node, node: Node) => Node,
  ): WritableStream<string>;
  (
    target: ParentNode,
    previousSibling?: ChildNode | null,
    assetTransformer?: (clone: Node, node: Node) => Node,
  ): Writable;
};
function writableDOM(
  this: unknown,
  target: ParentNode,
  previousSibling?: ChildNode | null,
  assetTransformer?: <T extends Node>(clone: T, node: T) => T,
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
      appendInlineTextIfNeeded(pendingText, inlineHostNode);

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
          const transformedLink = typeof assetTransformer === 'function' ? assetTransformer(link, link) : link;
          transformedLink.onload = transformedLink.onerror = () => target.removeChild(transformedLink);
          target.insertBefore(transformedLink, nextSibling);
        }
      }

      walker.currentNode = blockedNode;
    } else {
      while ((node = walker.nextNode())) {
        let clone = document.importNode(node, false);
        const previousPendingText = pendingText;
        if (node.nodeType === Node.TEXT_NODE) {
          pendingText = node as Text;
        } else {
          pendingText = null;

          if (isBlocking(clone)) {
            isBlocked = true;
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            clone.onload = clone.onerror = () => {
              isBlocked = false;
              // Continue the normal content injecting walk.
              if (clone.parentNode) walk();
            };
          }
        }

        const parentNode = targetNodes.get(node.parentNode!)!;
        targetNodes.set(node, clone);

        if (isInlineHost(parentNode!)) {
          inlineHostNode = parentNode;
        } else {
          appendInlineTextIfNeeded(previousPendingText, inlineHostNode);
          inlineHostNode = null;

          if (typeof assetTransformer === 'function') {
            clone = assetTransformer(clone, node);
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

function isBlocking(node: any): node is HTMLElement {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    ((node.tagName === 'SCRIPT' &&
      node.src &&
      !(node.noModule || node.type === 'module' || node.hasAttribute('async') || node.hasAttribute('defer'))) ||
      (node.tagName === 'LINK' && node.rel === 'stylesheet' && (!node.media || matchMedia(node.media).matches)))
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

function appendInlineTextIfNeeded(pendingText: Text | null, inlineTextHostNode: Node | null) {
  if (pendingText && inlineTextHostNode) {
    inlineTextHostNode.appendChild(pendingText);
  }
}

function isInlineHost(node: Node) {
  const { tagName } = node as Element;
  return (tagName === 'SCRIPT' && !(node as HTMLScriptElement).src) || tagName === 'STYLE';
}
