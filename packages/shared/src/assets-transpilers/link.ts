/**
 * @author Kuitos
 * @since 2023-04-26
 */
import { warn } from '@qiankunjs/shared';
import type { MatchResult } from '../module-resolver';
import { getEntireUrl } from '../utils';
import { preTranspile as preTranspileScript } from './script';
import type { AssetsTranspilerOpts, BaseTranspilerOpts } from './types';
import { Mode } from './types';
import { createReusingObjectUrl } from './utils';

type PreTranspileResult =
  | { mode: Mode.REUSED_DEP_IN_SANDBOX | Mode.REUSED_DEP; result: { src: string } & MatchResult }
  | { mode: Mode.NONE; result?: never };
const preTranspileStyleSheetLink = (
  link: Partial<Pick<HTMLLinkElement, 'href' | 'rel'>>,
  baseURI: string,
  opts: BaseTranspilerOpts,
): PreTranspileResult => {
  const { sandbox, moduleResolver } = opts;
  const { href, rel } = link;

  // filter preload links
  if (href && rel === 'stylesheet') {
    const linkHref = getEntireUrl(href, baseURI);

    const matchedAssets = moduleResolver?.(linkHref);
    if (matchedAssets) {
      return {
        mode: sandbox ? Mode.REUSED_DEP_IN_SANDBOX : Mode.REUSED_DEP,
        result: { src: linkHref, ...matchedAssets },
      };
    }
  }

  return {
    mode: Mode.NONE,
  };
};

const postProcessPreloadLink = (link: HTMLLinkElement, baseURI: string, opts: AssetsTranspilerOpts): void => {
  const { as, href } = link;
  switch (as) {
    case 'script': {
      const { mode, result } = preTranspileScript({ src: href }, baseURI, opts);

      switch (mode) {
        /**
         * While the assets are transpiling in sandbox, it means they will be evaluated with manual fetching,
         * thus we need to set the attribute `as` to fetch instead of script or style to avoid preload cache missing.
         * see https://stackoverflow.com/questions/52635660/can-link-rel-preload-be-made-to-work-with-fetch/63814972#63814972
         */
        case Mode.REMOTE_ASSETS_IN_SANDBOX: {
          if (process.env.NODE_ENV === 'development' && !link.hasAttribute('crossorigin')) {
            warn(
              `crossorigin attribute of script ${href} is not specified, that will make preload invalid, see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload#cors-enabled_fetches`,
            );
          }
          link.as = 'fetch';
          break;
        }

        case Mode.REUSED_DEP_IN_SANDBOX:
        case Mode.REUSED_DEP: {
          const { url } = result;
          link.href = createReusingObjectUrl(href, url, 'text/javascript');

          break;
        }
      }

      break;
    }

    case 'style': {
      const { mode, result } = preTranspileStyleSheetLink({ href, rel: 'stylesheet' }, baseURI, opts);

      switch (mode) {
        case Mode.REUSED_DEP_IN_SANDBOX:
        case Mode.REUSED_DEP: {
          const { url } = result;
          link.href = createReusingObjectUrl(href, url, 'text/css');
          break;
        }
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
  const { mode, result } = preTranspileStyleSheetLink(
    {
      href: hrefAttribute || undefined,
      rel: link.rel,
    },
    baseURI,
    opts,
  );

  switch (mode) {
    case Mode.REUSED_DEP_IN_SANDBOX:
    case Mode.REUSED_DEP: {
      const { src, version, url } = result;
      link.dataset.href = src;
      link.dataset.version = version;
      link.href = createReusingObjectUrl(src, url, 'text/css');

      return link;
    }

    case Mode.NONE:
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
