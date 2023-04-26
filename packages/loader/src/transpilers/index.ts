/**
 * @author Kuitos
 * @since 2023-03-14
 */
import transpileLink from './link';
import type { TransformerOpts } from './script';
import transpileScript from './script';

export function transpileAssets(node: Node, baseURI: string, opts: TransformerOpts): Node {
  const { tagName } = node as HTMLElement;

  switch (tagName) {
    case 'SCRIPT': {
      transpileScript(node as HTMLScriptElement, baseURI, opts);
      break;
    }

    case 'LINK': {
      transpileLink(node as HTMLLinkElement, baseURI);
      break;
    }

    default:
      break;
  }

  return node;
}
