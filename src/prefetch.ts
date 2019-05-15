/**
 * @author Kuitos
 * @since 2019-02-26
 */

import importHTML from 'import-html-entry';
import { noop } from 'lodash';

/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entryHTML
 */
export default function prefetch(entryHTML: string) {

  const requestIdleCallback = window.requestIdleCallback || noop;

  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importHTML(entryHTML);
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });

}
