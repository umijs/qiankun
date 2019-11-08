/**
 * @author Kuitos
 * @since 2019-02-26
 */

import { Entry, importEntry } from 'import-html-entry';
import { noop } from 'lodash';
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
}

/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 * @param fetch
 */
export function prefetch(entry: Entry, fetch?: Fetch) {
  const requestIdleCallback = window.requestIdleCallback || noop;

  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, { fetch });
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}

export function prefetchAfterFirstMounted(apps: RegistrableApp[], fetch?: Fetch) {
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

export function prefetchAll(apps: RegistrableApp[], fetch?: Fetch) {
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
