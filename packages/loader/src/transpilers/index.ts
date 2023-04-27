/**
 * @author Kuitos
 * @since 2023-03-14
 */
import transpileLink from './link';
import type { TransformerOpts } from './script';
import transpileScript from './script';

export function transpileAssets<T extends Node>(node: T, baseURI: string, opts: TransformerOpts): T {
  const { tagName } = node as any as HTMLElement;

  switch (tagName) {
    case 'SCRIPT': {
      transpileScript(node as any as HTMLScriptElement, baseURI, opts);
      break;
    }

    case 'LINK': {
      transpileLink(node as any as HTMLLinkElement, baseURI);
      break;
    }

    default:
      break;
  }

  return node;
}
