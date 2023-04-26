/**
 * @author Kuitos
 * @since 2023-03-14
 */
import type { Compartment } from '../core/Compartment';
import transpileScript from './script';

export function transpileAssets(
  node: Node,
  baseURI: string,
  opts: { fetch?: typeof window.fetch; compartment: Compartment },
): Node {
  const { fetch = window.fetch, compartment } = opts;

  const { tagName } = node as HTMLElement;

  switch (tagName) {
    case 'SCRIPT': {
      transpileScript(node as HTMLScriptElement, baseURI, { fetch, compartment });
      break;
    }

    default:
      break;
  }

  return node;
}
