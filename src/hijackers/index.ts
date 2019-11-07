/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { Freer } from '../interfaces';
import hijackDynamicStylesheet from './dynamicStylesheet';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijackAtMounting(appName: string): Freer[] {
  return [hijackTimer(), hijackWindowListener(), hijackHistoryListener(), hijackDynamicStylesheet(appName)];
}

export function hijackAtBootstrapping(appName: string): Freer[] {
  return [process.env.NODE_ENV === 'development' ? hijackDynamicStylesheet(appName, true) : () => () => noop];
}
