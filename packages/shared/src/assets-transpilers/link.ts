/**
 * @author Kuitos
 * @since 2023-04-26
 */
import { getEntireUrl } from '../utils';
import type { TransformerOpts } from './script';

export default function transpileLink(link: HTMLLinkElement, baseURI: string, opts: TransformerOpts): HTMLLinkElement {
  const { moduleResolver } = opts;

  const hrefAttribute = link.getAttribute('href');
  if (hrefAttribute) {
    const linkHref = getEntireUrl(hrefAttribute, baseURI);

    const matchedAssets = moduleResolver?.(hrefAttribute);
    if (matchedAssets) {
      const { url, version } = matchedAssets;
      link.dataset.href = linkHref;
      link.dataset.version = version;
      link.href = URL.createObjectURL(
        new Blob([`// ${linkHref} has reused the execution result of ${url}`], {
          type: 'application/javascript',
        }),
      );
      return link;
    }

    link.href = getEntireUrl(hrefAttribute, baseURI);
    return link;
  }

  return link;
}
