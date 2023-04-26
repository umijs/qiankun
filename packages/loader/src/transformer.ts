export function defaultTransformer<T = Node>(node: T, baseURI: string): T {
  const { tagName } = node as HTMLElement;
  switch (tagName) {
    case 'SCRIPT': {
      const script = node as HTMLScriptElement;
      // Can't use script.src directly, because it will be resolved to absolute path by browser with Node.baseURI
      // Such as <script src="./foo.js"></script> will be resolved to http://localhost:8000/foo.js while read script.src
      const srcAttribute = script.getAttribute('src');
      if (srcAttribute) {
        script.src = getEntireUrl(srcAttribute, baseURI);
      }

      return script as T;
    }

    case 'LINK': {
      const link = node as HTMLLinkElement;
      const hrefAttribute = link.getAttribute('href');
      if (hrefAttribute) {
        link.href = getEntireUrl(hrefAttribute, baseURI);
      }
      return link as T;
    }

    default: {
      return node;
    }
  }
}

function getEntireUrl(uri: string, baseURI: string): string {
  const publicPath = new URL(baseURI, window.location.href);
  const entireUrl = new URL(uri, publicPath.toString());
  return entireUrl.toString();
}
