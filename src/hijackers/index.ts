/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { Freer } from '../interfaces';
import hijackDynamicAppend from './dynamicAppend';
import hijackHistoryListener from './historyListener';
import hijackPublicPath from './publicPath';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijackAtMounting(appName: string, proxy: Window): Freer[] {
  return [hijackTimer(), hijackWindowListener(), hijackHistoryListener(), hijackDynamicAppend(appName, proxy)];
}

export function hijackAtBootstrapping(appName: string, publicPath: string, proxy: Window): Freer[] {
  return [
    process.env.NODE_ENV === 'development' ? hijackDynamicAppend(appName, proxy) : () => () => noop,
    hijackPublicPath(publicPath),
  ];
}
