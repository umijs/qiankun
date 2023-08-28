/**
 * @author Kuitos
 * @since 2023-04-26
 */
import type { MatchResult } from '../module-resolver';
import { getEntireUrl } from '../utils';
import { preTranspile as preTranspileScript } from './script';
import type { AssetsTranspilerOpts, BaseTranspilerOpts } from './types';

type PreTranspileResult = { mode: 'cache'; result: { src: string } & MatchResult } | { mode: 'none'; result?: never };
const preTranspile = (
  link: Partial<Pick<HTMLLinkElement, 'href'>>,
  baseURI: string,
  opts: BaseTranspilerOpts,
): PreTranspileResult => {
  const { sandbox, moduleResolver } = opts;
  const { href } = link;

  if (sandbox) {
    if (href) {
      const linkHref = getEntireUrl(href, baseURI);

      const matchedAssets = moduleResolver?.(linkHref);
      if (matchedAssets) {
        return {
          mode: 'cache',
          result: { src: linkHref, ...matchedAssets },
        };
      }
    }
  }

  return {
    mode: 'none',
  };
};

/**
 * While the assets are transpiling in sandbox, it means they will be evaluated with manual fetching,
 * thus we need to set the attribute `as` to fetch instead of script or style to avoid preload cache missing.
 * see https://stackoverflow.com/questions/52635660/can-link-rel-preload-be-made-to-work-with-fetch/63814972#63814972
 */
const postProcessPreloadLink = (link: HTMLLinkElement, baseURI: string, opts: AssetsTranspilerOpts): void => {
  const { as, href } = link;

  const revokeAfterLoaded = (objectURL: string, link: HTMLLinkElement) => {
    const revoke = () => URL.revokeObjectURL(objectURL);
    link.addEventListener('load', revoke, { once: true });
    link.addEventListener('error', revoke, { once: true });
  };

  switch (as) {
    case 'script': {
      const { mode, result } = preTranspileScript({ src: href }, baseURI, opts);

      if (mode === 'remote') {
        link.as = 'fetch';
      }

      if (mode === 'cache') {
        const { url } = result;
        const objectURL = URL.createObjectURL(
          new Blob([`// ${href} is reusing the execution result of ${url}`], {
            type: 'text/javascript',
          }),
        );
        link.href = objectURL;
        revokeAfterLoaded(objectURL, link);
      }

      break;
    }

    case 'style': {
      const { mode, result } = preTranspile({ href }, baseURI, opts);

      if (mode === 'cache') {
        const { url } = result;
        const objectURL = URL.createObjectURL(
          new Blob([`// ${href} is reusing the execution result of ${url}`], {
            type: 'text/css',
          }),
        );
        link.href = objectURL;
        revokeAfterLoaded(objectURL, link);
      }

      break;
    }

    default:
      break;
  }
};

export default function transpileLink(
  link: HTMLLinkElement,
  baseURI: string,
  opts: AssetsTranspilerOpts,
): HTMLLinkElement {
  const hrefAttribute = link.getAttribute('href');
  const { mode, result } = preTranspile(
    {
      href: hrefAttribute || undefined,
    },
    baseURI,
    opts,
  );

  switch (mode) {
    case 'cache': {
      const { src, version, url } = result;
      link.dataset.href = src;
      link.dataset.version = version;
      link.href = URL.createObjectURL(
        new Blob([`// ${src} is reusing the execution result of ${url}`], {
          type: 'text/css',
        }),
      );

      return link;
    }

    case 'none':
    default: {
      if (hrefAttribute) {
        link.href = getEntireUrl(hrefAttribute, baseURI);

        if (link.rel === 'preload') {
          postProcessPreloadLink(link, baseURI, opts);
        }

        return link;
      }

      return link;
    }
  }
}
