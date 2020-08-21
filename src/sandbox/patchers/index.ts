/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { Freer, SandBox, SandBoxType } from '../../interfaces';
import patchDynamicAppend from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import patchWindowListener from './windowListener';

import * as css from './css';

export function patchAtMounting(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  sandbox: SandBox,
  singular: boolean,
  scopedCSS: boolean,
  excludeAssetFilter?: Function,
): Freer[] {
  const basePatchers = [
    () => patchInterval(sandbox.proxy),
    () => patchWindowListener(sandbox.proxy),
    () => patchHistoryListener(),
    () => patchDynamicAppend(appName, elementGetter, sandbox.proxy, true, singular, scopedCSS, excludeAssetFilter),
  ];

  const patchersInSandbox = {
    [SandBoxType.LegacyProxy]: [...basePatchers],
    [SandBoxType.Proxy]: [...basePatchers],
    [SandBoxType.Snapshot]: basePatchers,
  };

  return patchersInSandbox[sandbox.type]?.map(patch => patch());
}

export function patchAtBootstrapping(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  sandbox: SandBox,
  singular: boolean,
  scopedCSS: boolean,
  excludeAssetFilter?: Function,
): Freer[] {
  const basePatchers = [
    () => patchDynamicAppend(appName, elementGetter, sandbox.proxy, false, singular, scopedCSS, excludeAssetFilter),
  ];

  const patchersInSandbox = {
    [SandBoxType.LegacyProxy]: basePatchers,
    [SandBoxType.Proxy]: basePatchers,
    [SandBoxType.Snapshot]: basePatchers,
  };

  return patchersInSandbox[sandbox.type]?.map(patch => patch());
}

export { css };
