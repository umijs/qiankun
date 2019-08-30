/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { noop } from 'lodash';
import { Freer, HijackersOpts } from '../interfaces';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijack(hijackersOpts: HijackersOpts): Freer[] {
  const { timer } = hijackersOpts;
  return [
    (timer && hijackTimer()) || (() => () => noop),
    hijackWindowListener(),
    hijackHistoryListener(),
  ];

}
