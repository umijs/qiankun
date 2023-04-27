/**
 * @author Kuitos
 * @since 2023-03-14
 */
import transpileLink from './link';
import type { TransformerOpts } from './script';
import transpileScript from './script';

export function transpileAssets<T extends HTMLScriptElement | HTMLLinkElement>(
  node: T,
  baseURI: string,
  opts: TransformerOpts,
): T {
  const { tagName } = node;

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
