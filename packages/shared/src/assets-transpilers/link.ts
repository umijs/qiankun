/**
 * @author Kuitos
 * @since 2023-04-26
 */
import type { MatchResult } from '../module-resolver';
import { warn } from '../reporter';
import { resolveUrl } from '../utils';
import { preTranspile as preTranspileScript } from './script';
import { transpileStyleText } from './style';
import type { AssetsTranspilerOpts, BaseTranspilerOpts } from './types';
import { Mode } from './types';
import { createReusingObjectUrl } from './utils';

// Stylesheet cache: URL -> { raw: string, transpiled: Map<cacheKey, string> }
type StylesheetCacheEntry = {
  raw: string;
  transpiled: Map<string, string>;
};
const stylesheetCache = new Map<string, StylesheetCacheEntry>();

// Pending fetch promises to avoid duplicate fetches for concurrent requests
const pendingFetches = new Map<string, Promise<string>>();

function getTranspiledStyleCacheKey(appName: string, scopeRoot: string): string {
  return `${appName}:${scopeRoot}`;
}

/**
 * Clear the stylesheet cache. Useful for testing or when you need to force re-fetch.
 */
export function clearStylesheetCache(): void {
  stylesheetCache.clear();
  pendingFetches.clear();
}

/**
 * Get cache statistics for monitoring and debugging.
 */
export function getStylesheetCacheStats(): {
  size: number;
  entries: Array<{ url: string; rawSize: number; transpiledCount: number }>;
} {
  const entries = Array.from(stylesheetCache.entries()).map(([url, entry]) => ({
    url,
    rawSize: entry.raw.length,
    transpiledCount: entry.transpiled.size,
  }));
  return { size: stylesheetCache.size, entries };
}

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
    const linkHref = resolveUrl(href, baseURI);

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
): HTMLLinkElement | HTMLStyleElement {
  const hrefAttribute = link.getAttribute('href');

  if (opts.styleIsolation && hrefAttribute && link.rel === 'stylesheet') {
    const resolvedHref = resolveUrl(hrefAttribute, baseURI);
    const styleElement = document.createElement('style');
    styleElement.dataset.href = resolvedHref;

    // Preserve meaningful attributes from the original <link>
    const media = link.getAttribute('media');
    if (media) styleElement.setAttribute('media', media);
    if (link.disabled) styleElement.disabled = true;
    const nonce = link.getAttribute('nonce');
    if (nonce) styleElement.setAttribute('nonce', nonce);
    const title = link.getAttribute('title');
    if (title) styleElement.setAttribute('title', title);

    const { appName, scopeRoot } = opts.styleIsolation;
    const cacheKey = getTranspiledStyleCacheKey(appName, scopeRoot);

    // Check cache first
    const cached = stylesheetCache.get(resolvedHref);
    if (cached) {
      const transpiledFromCache = cached.transpiled.get(cacheKey);
      if (transpiledFromCache) {
        styleElement.textContent = transpiledFromCache;
        return styleElement;
      }
      // Raw CSS cached but not transpiled for this app yet
      void (async () => {
        const result = transpileStyleText(cached.raw, {
          appName,
          scopeRoot,
          fetch: opts.fetch,
          baseURL: resolvedHref,
        });
        const transpiled = typeof result === 'string' ? result : await result;
        cached.transpiled.set(cacheKey, transpiled);
        styleElement.textContent = transpiled;
      })();
      return styleElement;
    }

    // Check if there's already a pending fetch for this URL
    let fetchPromise = pendingFetches.get(resolvedHref);
    if (!fetchPromise) {
      // Create new fetch promise
      fetchPromise = opts
        .fetch(resolvedHref)
        .then((res) => res.text())
        .then((cssText) => {
          // Cache the raw CSS
          const entry: StylesheetCacheEntry = {
            raw: cssText,
            transpiled: new Map(),
          };
          stylesheetCache.set(resolvedHref, entry);
          return cssText;
        })
        .catch((error) => {
          warn(
            `Failed to fetch stylesheet "${resolvedHref}" for style isolation. The stylesheet is dropped to preserve isolation.`,
          );
          throw error;
        })
        .finally(() => {
          // Clean up pending fetch
          pendingFetches.delete(resolvedHref);
        });

      pendingFetches.set(resolvedHref, fetchPromise);
    }

    // Use the shared fetch promise
    void fetchPromise
      .then(async (cssText) => {
        const result = transpileStyleText(cssText, { appName, scopeRoot, fetch: opts.fetch, baseURL: resolvedHref });
        const transpiled = typeof result === 'string' ? result : await result;

        // Update cache with transpiled version
        const entry = stylesheetCache.get(resolvedHref);
        if (entry) {
          entry.transpiled.set(cacheKey, transpiled);
        }

        styleElement.textContent = transpiled;
      })
      .catch(() => {
        // Error already logged in fetchPromise
      });

    return styleElement;
  }

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
        link.href = resolveUrl(hrefAttribute, baseURI);

        if (link.rel === 'preload') {
          postProcessPreloadLink(link, baseURI, opts);
        }

        return link;
      }

      return link;
    }
  }
}
