/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { ExecScriptsOpts, Freer } from '../interfaces';
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
  return [hijackDynamicAppend(appName, proxy, false, execScriptsOpts)];
}
