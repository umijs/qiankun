/**
 * @author Kuitos
 * @since 2019-02-26
 */

import { Entry, importEntry } from 'import-html-entry';
import { getMountedApps } from 'single-spa';
import { Fetch, RegistrableApp } from './interfaces';

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions,
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }

  interface Navigator {
    connection: {
      saveData: Function;
      effectiveType: string;
    };
  }
}

// RIC and shim for browsers setTimeout() without it
const requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(cb: Function) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

// https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isSlowNetwork = navigator.connection
  ? navigator.connection.saveData || /(2|3)g/.test(navigator.connection.effectiveType)
  : false;

/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param fetch
 */
export function prefetch(entry: Entry, fetch?: Fetch): void {
  if (isMobile || isSlowNetwork) {
    // Don't prefetch if an mobile device or in a slow network.
    return;
  }

  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, { fetch });
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}

export function prefetchAfterFirstMounted(apps: RegistrableApp[], fetch?: Fetch): void {
  window.addEventListener(
    'single-spa:first-mount',
    () => {
      const mountedApps = getMountedApps();
      const notMountedApps = apps.filter(app => mountedApps.indexOf(app.name) === -1);

      if (process.env.NODE_ENV === 'development') {
        console.log(`prefetch starting after ${mountedApps} mounted...`, notMountedApps);
      }

      notMountedApps.forEach(app => prefetch(app.entry, fetch));
    },
    { once: true },
  );
}

export function prefetchAll(apps: RegistrableApp[], fetch?: Fetch): void {
  window.addEventListener(
    'single-spa:no-app-change',
    () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('prefetch starting for all assets...', apps);
      }
      apps.forEach(app => prefetch(app.entry, fetch));
    },
    { once: true },
  );
}
