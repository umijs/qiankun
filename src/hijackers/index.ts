/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { Freer } from '../interfaces';
import hijackDynamicStylesheet from './dynamicStylesheet';
import hijackDynamicScript from './dynamicScript';
import hijackHistoryListener from './historyListener';
import hijackPublicPath from './publicPath';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijackAtMounting(appName: string, proxy: Window): Freer[] {
  return [
    hijackTimer(),
    hijackWindowListener(),
    hijackHistoryListener(),
    hijackDynamicStylesheet(appName),
    hijackDynamicScript(proxy),
  ];
}

export function hijackAtBootstrapping(appName: string, publicPath: string): Freer[] {
  return [
    process.env.NODE_ENV === 'development' ? hijackDynamicStylesheet(appName, true) : () => () => noop,
    hijackPublicPath(publicPath),
  ];
}
