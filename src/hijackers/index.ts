/**
 * @author Kuitos
 * @since 2019-04-11
 */

import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijack() {

  return [
    hijackTimer(),
    hijackWindowListener(),
    hijackHistoryListener(),
  ];

}
