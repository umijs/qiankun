/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { Freer, SandBox, SandBoxType } from '../../interfaces';
import { patchNonProxySandbox, patchProxySandbox } from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import patchWindowListener from './windowListener';

import * as css from './css';

export function patchAtMounting(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  sandbox: SandBox,
  scopedCSS: boolean,
  excludeAssetFilter?: Function,
): Freer[] {
  const basePatchers = [
    () => patchInterval(sandbox.proxy),
    () => patchWindowListener(sandbox.proxy),
    () => patchHistoryListener(),
  ];

  const patchersInSandbox = {
    [SandBoxType.LegacyProxy]: [
      ...basePatchers,
      () => patchNonProxySandbox(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter),
    ],
    [SandBoxType.Proxy]: [
      ...basePatchers,
      () => patchProxySandbox(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter),
    ],
    [SandBoxType.Snapshot]: [
      ...basePatchers,
      () => patchNonProxySandbox(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter),
    ],
  };

  return patchersInSandbox[sandbox.type]?.map(patch => patch());
}

export function patchAtBootstrapping(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  sandbox: SandBox,
  scopedCSS: boolean,
  excludeAssetFilter?: Function,
): Freer[] {
  const patchersInSandbox = {
    [SandBoxType.LegacyProxy]: [
      () => patchNonProxySandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter),
    ],
    [SandBoxType.Proxy]: [
      () => patchProxySandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter),
    ],
    [SandBoxType.Snapshot]: [
      () => patchNonProxySandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter),
    ],
  };

  return patchersInSandbox[sandbox.type]?.map(patch => patch());
}

export { css };
