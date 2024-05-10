import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { SandBoxType } from '../../interfaces';
import * as css from './css';
import { patchLooseSandbox, patchStrictSandbox } from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import patchWindowListener from './windowListener';
export function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox$sa;
  var basePatchers = [function () {
    return patchInterval(sandbox.proxy);
  }, function () {
    return patchWindowListener(sandbox.proxy);
  }, function () {
    return patchHistoryListener();
  }];
  var patchersInSandbox = _defineProperty(_defineProperty(_defineProperty({}, SandBoxType.LegacyProxy, [].concat(basePatchers, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter);
  }])), SandBoxType.Proxy, [].concat(basePatchers, [function () {
    return patchStrictSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter, speedySandBox);
  }])), SandBoxType.Snapshot, [].concat(basePatchers, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox, true, scopedCSS, excludeAssetFilter);
  }]));
  return (_patchersInSandbox$sa = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa === void 0 ? void 0 : _patchersInSandbox$sa.map(function (patch) {
    return patch();
  });
}
export function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox$sa2;
  var patchersInSandbox = _defineProperty(_defineProperty(_defineProperty({}, SandBoxType.LegacyProxy, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter);
  }]), SandBoxType.Proxy, [function () {
    return patchStrictSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter, speedySandBox);
  }]), SandBoxType.Snapshot, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox, false, scopedCSS, excludeAssetFilter);
  }]);
  return (_patchersInSandbox$sa2 = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa2 === void 0 ? void 0 : _patchersInSandbox$sa2.map(function (patch) {
    return patch();
  });
}
export { css };