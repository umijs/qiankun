/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';
import { Freer, ExecScriptsOpts } from '../interfaces';
import hijackDynamicAppend from './dynamicHeadAppend';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijackAtMounting(appName: string, proxy: Window, execScriptsOpts: ExecScriptsOpts): Freer[] {
  return [
    hijackTimer(),
    hijackWindowListener(),
    hijackHistoryListener(),
    hijackDynamicAppend(appName, proxy, true, execScriptsOpts),
  ];
}

export function hijackAtBootstrapping(appName: string, proxy: Window, execScriptsOpts: ExecScriptsOpts): Freer[] {
  return [
    process.env.NODE_ENV === 'development'
      ? hijackDynamicAppend(appName, proxy, false, execScriptsOpts)
      : () => () => noop,
  ];
}
