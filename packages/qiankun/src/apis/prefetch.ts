/**
 * @author Kuitos
 * @since 2019-02-26
 */

import type { AppMetadata } from '../types';

declare global {
  interface NetworkInformation {
    saveData: boolean;
    effectiveType: string;
    type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  }

  interface Navigator {
    connection?: NetworkInformation;
  }
}

// RIC and shim for browsers without requestIdleCallback
const requestIdleCallback: typeof window.requestIdleCallback =
  typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback.bind(window)
    : function requestIdleCallback(cb: IdleRequestCallback) {
        const start = Date.now();
        return setTimeout(() => {
          cb({
            didTimeout: false,
            timeRemaining() {
              return Math.max(0, 50 - (Date.now() - start));
            },
          });
        }, 1) as unknown as number;
      };

const isSlowNetwork = navigator.connection
  ? navigator.connection.saveData ||
    (navigator.connection.type !== 'wifi' &&
      navigator.connection.type !== 'ethernet' &&
      /([23])g/.test(navigator.connection.effectiveType))
  : false;

/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param fetch
 */
async function prefetch(entry: string, fetch: typeof window.fetch = window.fetch): Promise<void> {
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

  requestIdleCallback(() => {
    void (async () => {
      try {
        // Fetch the HTML entry to warm up the cache
        const response = await fetch(entry);
        const html = await response.text();

        // Parse HTML to find external resources
        const domParser = new DOMParser();
        const doc = domParser.parseFromString(html, 'text/html');

        // Prefetch external scripts
        const scripts = doc.querySelectorAll('script[src]');
        scripts.forEach((script) => {
          const src = script.getAttribute('src');
          if (src) {
            const absoluteSrc = new URL(src, entry).href;
            requestIdleCallback(() => {
              void fetch(absoluteSrc).catch(() => {
                // Ignore prefetch errors
              });
            });
          }
        });

        // Prefetch external stylesheets
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (href) {
            const absoluteHref = new URL(href, entry).href;
            requestIdleCallback(() => {
              void fetch(absoluteHref).catch(() => {
                // Ignore prefetch errors
              });
            });
          }
        });
      } catch (e) {
        // Ignore prefetch errors
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('[qiankun] prefetch error:', e);
        }
      }
    })();
  });
}

export type PrefetchStrategy =
  | boolean
  | 'all'
  | string[]
  | ((apps: AppMetadata[]) => { criticalAppNames: string[]; minorAppsName: string[] });

/**
 * Prefetch micro apps immediately
 * @deprecated This API is deprecated in qiankun 3.0. Micro apps are streamed with automatic preload now.
 * @param apps - Apps to prefetch
 * @param fetch - Custom fetch function
 */
export function prefetchApps(apps: AppMetadata[], fetch: typeof window.fetch = window.fetch): void {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn('[qiankun] prefetchApps is deprecated in 3.0; streaming loader performs automatic preload.');
    // eslint-disable-next-line no-console
    console.log('[qiankun] prefetch starting for apps...', apps);
  }

  apps.forEach(({ entry }) => {
    void prefetch(entry, fetch);
  });
}
