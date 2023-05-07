/**
 * @author Kuitos
 * @since 2023-04-26
 */
import { getEntireUrl } from '../utils';

export default function transpileLink(link: HTMLLinkElement, baseURI: string): HTMLLinkElement {
  const hrefAttribute = link.getAttribute('href');
  if (hrefAttribute) {
    link.href = getEntireUrl(hrefAttribute, baseURI);
  }
  return link;
}
