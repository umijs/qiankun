"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runAfterFirstMounted = runAfterFirstMounted;
exports.runDefaultMountEffects = runDefaultMountEffects;
exports.setDefaultMountApp = setDefaultMountApp;
var _singleSpa = require("single-spa");
/**
 * @author Kuitos
 * @since 2019-02-19
 */

var firstMountLogLabel = '[qiankun] first app mounted';
if (process.env.NODE_ENV === 'development') {
  console.time(firstMountLogLabel);
}
function setDefaultMountApp(defaultAppLink) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:no-app-change', function listener() {
    var mountedApps = (0, _singleSpa.getMountedApps)();
    if (!mountedApps.length) {
      (0, _singleSpa.navigateToUrl)(defaultAppLink);
    }
    window.removeEventListener('single-spa:no-app-change', listener);
  });
}
function runDefaultMountEffects(defaultAppLink) {
  console.warn('[qiankun] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead');
  setDefaultMountApp(defaultAppLink);
}
function runAfterFirstMounted(effect) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:first-mount', function listener() {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(firstMountLogLabel);
    }
    effect();
    window.removeEventListener('single-spa:first-mount', listener);
  });
}