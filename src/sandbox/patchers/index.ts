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

export function patchAtMounting(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  proxy: Window,
  singular: boolean,
): Freer[] {
  return [
    patchTimer(),
    patchWindowListener(),
    patchHistoryListener(),
    patchDynamicAppend(appName, elementGetter, proxy, true, singular),
  ];
}

export function patchAtBootstrapping(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  proxy: Window,
  singular: boolean,
): Freer[] {
  return [
    process.env.NODE_ENV === 'development'
      ? patchDynamicAppend(appName, elementGetter, proxy, false, singular)
      : () => () => noop,
  ];
}
