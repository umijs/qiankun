/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { Freer } from '../interfaces';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijack(): Freer[] {

  return [
    hijackTimer(),
    hijackWindowListener(),
    hijackHistoryListener(),
  ];

}
