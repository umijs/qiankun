/**
 * @author Kuitos
 * @since 2019-02-26
 */

import { Entry, importEntry } from 'import-html-entry';
import { noop } from 'lodash';

/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 */
export default function prefetch(entry: Entry) {

  const requestIdleCallback = window.requestIdleCallback || noop;

  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry);
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });

}
