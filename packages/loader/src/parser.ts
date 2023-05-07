type NormalizedEntry = {
  stylesheets: NodeListOf<HTMLStyleElement>;
  scripts: NodeListOf<HTMLScriptElement>;
};

function getDocResources(container: Document) {
  const links = container.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet][href]:not([href=""])');
  const scripts = container.querySelectorAll<HTMLScriptElement>('script[src]:not([src=""])');

  return {
    scripts,
    stylesheets: links,
  };
}

export function parseHTML(htmlContent: string): NormalizedEntry {
  const domParser = new DOMParser();
  const container = domParser.parseFromString(htmlContent, 'text/html');

  const resources = getDocResources(container);

  return resources;
}
