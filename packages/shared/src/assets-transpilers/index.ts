/**
 * @author Kuitos
 * @since 2023-03-14
 */
import transpileLink from './link';
import transpileScript from './script';
import type { AssetsTranspilerOpts } from './types';

export function transpileAssets<T extends Node>(node: T, baseURI: string, opts: AssetsTranspilerOpts): T {
  const htmlElement = node as unknown as HTMLElement;
  const { tagName } = htmlElement;

  switch (tagName) {
    case 'SCRIPT': {
      return transpileScript(htmlElement as HTMLScriptElement, baseURI, opts) as unknown as T;
    }

    case 'LINK': {
      return transpileLink(htmlElement as HTMLLinkElement, baseURI, opts) as unknown as T;
    }

    default:
      break;
  }

  // TODO need to deal with the text scenario of script
  // const { nodeType } = node;
  // switch (nodeType) {
  //   case Node.TEXT_NODE: {
  //     if (node.parentNode?.nodeName === 'script') {
  //       break;
  //     }
  //     }
  //
  //   }
  // }
  return node;
}

export type * from './types';

export { isValidJavaScriptType } from './utils';
