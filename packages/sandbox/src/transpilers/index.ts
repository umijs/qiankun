/**
 * @author Kuitos
 * @since 2023-03-14
 */
import transpileScript from './script';

const assetsTranspiler = (node: Node, baseURI: string, opts?: { fetch: typeof window.fetch }): Node => {
  const { fetch = window.fetch } = opts || {};

  const { tagName } = node as HTMLElement;

  switch (tagName) {
    case 'SCRIPT': {
      transpileScript(node as HTMLScriptElement, baseURI, { fetch });
      break;
    }

    default:
      break;
  }

  return node;
};

export { assetsTranspiler };
