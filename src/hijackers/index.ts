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

export function hijackAtMounting(): Freer[] {
  return [hijackTimer(), hijackWindowListener(), hijackHistoryListener(), hijackDynamicStylesheet()];
}

export function hijackAtBootstrapping(): Freer[] {
  return [process.env.NODE_ENV === 'development' ? hijackDynamicStylesheet(true) : () => () => noop];
}
