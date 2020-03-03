/**
 * @author Kuitos
 * @since 2019-02-26
 */

import { Entry, importEntry, ImportEntryOpts } from 'import-html-entry';
import { flow, identity } from 'lodash';
import { getMountedApps } from 'single-spa';
import { RegistrableApp } from './interfaces';
import { getDefaultTplWrapper } from './utils';

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
 * @param appName
 * @param entry
 * @param opts
 */
function prefetch(appName: string, entry: Entry, opts?: ImportEntryOpts): void {
  if (isMobile || isSlowNetwork) {
    // Don't prefetch if an mobile device or in a slow network.
    return;
  }

  requestIdleCallback(async () => {
    const { getTemplate = identity, ...settings } = opts || {};
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, {
      getTemplate: flow(getTemplate, getDefaultTplWrapper(appName)),
      ...settings,
    });
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}

export function prefetchAfterFirstMounted(apps: RegistrableApp[], opts?: ImportEntryOpts): void {
  window.addEventListener(
    'single-spa:first-mount',
    () => {
      const mountedApps = getMountedApps();
      const notMountedApps = apps.filter(app => mountedApps.indexOf(app.name) === -1);

      if (process.env.NODE_ENV === 'development') {
        console.log(`prefetch starting after ${mountedApps} mounted...`, notMountedApps);
      }

      notMountedApps.forEach(({ name, entry }) => prefetch(name, entry, opts));
    },
    { once: true },
  );
}

export function prefetchAll(apps: RegistrableApp[], opts?: ImportEntryOpts): void {
  window.addEventListener(
    'single-spa:no-app-change',
    () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('prefetch starting for all assets...', apps);
      }
      apps.forEach(({ name, entry }) => prefetch(name, entry, opts));
    },
    { once: true },
  );
}
