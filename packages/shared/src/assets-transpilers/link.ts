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

// The @scope-wrapped CSS and the blob url carrying it, per (appName, scopeRoot) cache key
type TranspiledStylesheet = {
  css: string;
  blobUrl: string;
};

// Stylesheet cache: URL -> { raw: string, transpiled: Map<cacheKey, TranspiledStylesheet> }
type StylesheetCacheEntry = {
  raw: string;
  transpiled: Map<string, TranspiledStylesheet>;
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
  stylesheetCache.forEach((entry) => {
    entry.transpiled.forEach(({ blobUrl }) => URL.revokeObjectURL(blobUrl));
  });
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

        default: {
          // Under style isolation the stylesheet is consumed by the transpiler's fetch() rather
          // than a native <link> load — rewrite to `as=fetch` so the warm-up request stays
          // matchable by the fetch cache, same rationale as the script/modulepreload rewrites
          if (opts.styleIsolation) {
            link.as = 'fetch';
            if (link.crossOrigin !== 'use-credentials') {
              link.crossOrigin = 'anonymous';
            }
          }
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

  /*
   * While the ESM sandbox takes over module loading, the module-map side of modulepreload can never
   * be consumed — the rewritten graph only imports blob URLs, so a browser preload of the original
   * URL would compile a module nobody imports. Align with the classic script path
   * (postProcessPreloadLink): rewrite to `rel="preload" as="fetch"` so the browser still issues the
   * warm-up request at walk-ahead time, and the rewrite pipeline's fetch() picks the response up
   * from the preload cache regardless of HTTP cacheability (RFC §10.1).
   */
  if (opts.esmEngine && link.rel === 'modulepreload') {
    if (hrefAttribute) {
      link.href = resolveUrl(hrefAttribute, baseURI);
      link.rel = 'preload';
      link.as = 'fetch';
      // modulepreload always requests with cors mode, while a bare as=fetch preload would be no-cors
      // and never match the pipeline fetch(). Map the modulepreload credentials semantics onto the
      // preload request: missing/anonymous → cors + same-origin (the fetch() defaults, see
      // engine.fetchModuleSource), use-credentials → cors + include.
      if (link.crossOrigin !== 'use-credentials') {
        link.crossOrigin = 'anonymous';
      }
    }
    return link;
  }

  /*
   * Style isolation keeps the <link> element and swaps only its href for a blob url carrying the
   * @scope-wrapped CSS — never the node itself. Preserving node identity is what keeps every native
   * link semantic intact for free: media/disabled/title/document.styleSheets stay live, the
   * streaming walk's "stylesheets block later scripts" bookkeeping sees a regular pending link
   * (load fires when the blob href lands), and app-attached onload/onerror handlers on dynamically
   * injected links (webpack's chunk CSS loading et al.) keep working.
   */
  if (opts.styleIsolation && hrefAttribute && link.rel === 'stylesheet') {
    const resolvedHref = resolveUrl(hrefAttribute, baseURI);
    // Strip href before the element hits the document so the browser never loads the unscoped
    // stylesheet; the original URL stays discoverable under data-href
    link.removeAttribute('href');
    link.dataset.href = resolvedHref;

    const { appName, scopeRoot } = opts.styleIsolation;
    const cacheKey = getTranspiledStyleCacheKey(appName, scopeRoot);

    const applyTranspiled = ({ blobUrl }: TranspiledStylesheet) => {
      link.setAttribute('href', blobUrl);
    };
    // no blob href is ever set on failure, thus the link would never emit a load/error event by
    // itself — dispatch the error manually so the blocked streaming walk and any app-attached
    // onerror handlers can settle
    const failLink = () => {
      link.dispatchEvent(new Event('error'));
    };
    const transpileAndCache = async (cssText: string): Promise<TranspiledStylesheet> => {
      const entry = stylesheetCache.get(resolvedHref);
      // a concurrent transpile for the same (url, app) pair may have landed first — reuse its blob
      const existing = entry?.transpiled.get(cacheKey);
      if (existing) return existing;

      const result = transpileStyleText(cssText, { appName, scopeRoot, fetch: opts.fetch, baseURL: resolvedHref });
      const css = typeof result === 'string' ? result : await result;
      const transpiled: TranspiledStylesheet = {
        css,
        blobUrl: URL.createObjectURL(new Blob([css], { type: 'text/css' })),
      };
      entry?.transpiled.set(cacheKey, transpiled);
      return transpiled;
    };

    // Check cache first
    const cached = stylesheetCache.get(resolvedHref);
    if (cached) {
      const transpiledFromCache = cached.transpiled.get(cacheKey);
      if (transpiledFromCache) {
        applyTranspiled(transpiledFromCache);
        return link;
      }
      // Raw CSS cached but not transpiled for this app yet
      void transpileAndCache(cached.raw)
        .then(applyTranspiled)
        .catch(() => {
          warn(`Failed to transpile cached stylesheet "${resolvedHref}" for style isolation.`);
          failLink();
        });
      return link;
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
      .then(transpileAndCache)
      .then(applyTranspiled)
      .catch(() => {
        // Fetch error already logged in fetchPromise
        failLink();
      });

    return link;
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
