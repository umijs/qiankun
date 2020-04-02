/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { Freer } from '../../interfaces';
import patchDynamicAppend from './dynamicHeadAppend';
import patchHistoryListener from './historyListener';
import patchTimer from './timer';
import patchWindowListener from './windowListener';

export function patchAtMounting(appName: string, element: HTMLElement | ShadowRoot, proxy: Window): Freer[] {
  return [patchTimer(), patchWindowListener(), patchHistoryListener(), patchDynamicAppend(appName, element, proxy)];
}

export function patchAtBootstrapping(appName: string, element: HTMLElement | ShadowRoot, proxy: Window): Freer[] {
  return [
    process.env.NODE_ENV === 'development' ? patchDynamicAppend(appName, element, proxy, false) : () => () => noop,
  ];
}
