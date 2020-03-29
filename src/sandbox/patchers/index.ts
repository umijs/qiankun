/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { Freer } from '../../interfaces';
import hijackDynamicAppend from './dynamicHeadAppend';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function patchAtMounting(appName: string, proxy: Window): Freer[] {
  return [hijackTimer(), hijackWindowListener(), hijackHistoryListener(), hijackDynamicAppend(appName, proxy, true)];
}

export function patchAtBootstrapping(appName: string, proxy: Window): Freer[] {
  return [process.env.NODE_ENV === 'development' ? hijackDynamicAppend(appName, proxy, false) : () => () => noop];
}
