/**
 * @author Kuitos
 * @since 2023-03-14
 */
import transpileLink from './link';
import type { TransformerOpts } from './script';
import transpileScript from './script';

export function transpileAssets<T extends Node>(node: T, baseURI: string, opts: TransformerOpts): T {
  const htmlElement = (node as unknown) as HTMLElement;
  const { tagName } = htmlElement;

  switch (tagName) {
    case 'SCRIPT': {
      return (transpileScript(htmlElement as HTMLScriptElement, baseURI, opts) as unknown) as T;
    }

    case 'LINK': {
      return (transpileLink(htmlElement as HTMLLinkElement, baseURI, opts) as unknown) as T;
    }

    default:
      return node;
  }
}

export type { TransformerOpts };
