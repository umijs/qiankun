/**
 * @author Kuitos
 * @since 2019-02-26
 */

import { Entry, importEntry } from 'import-html-entry';
import { noop } from 'lodash';
import { getMountedApps } from 'single-spa';
import { RegistrableApp } from './interfaces';

/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 */
export function prefetch(entry: Entry) {

  const requestIdleCallback = window.requestIdleCallback || noop;

  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry);
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });

}

export function prefetchAfterFirstMounted(apps: RegistrableApp[]) {

  window.addEventListener('single-spa:first-mount', () => {

    const mountedApps = getMountedApps();
    const notMountedApps = apps.filter(app => mountedApps.indexOf(app.name) === -1);

    if (process.env.NODE_ENV === 'development') {
      console.log('prefetch starting...', notMountedApps);
    }

    notMountedApps.forEach(app => prefetch(app.entry));
  }, { once: true });

}
