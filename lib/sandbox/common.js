"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearCurrentRunningApp = clearCurrentRunningApp;
exports.getCurrentRunningApp = getCurrentRunningApp;
exports.rebindTarget2Fn = rebindTarget2Fn;
exports.setCurrentRunningApp = setCurrentRunningApp;
var _utils = require("../utils");
/**
 * @author Kuitos
 * @since 2020-04-13
 */

var currentRunningApp = null;
/**
 * get the app that running tasks at current tick
 */
function getCurrentRunningApp() {
  return currentRunningApp;
}
function setCurrentRunningApp(appInstance) {
  // Set currentRunningApp and it's proxySandbox to global window, as its only use case is for document.createElement from now on, which hijacked by a global way
  currentRunningApp = appInstance;
}
function clearCurrentRunningApp() {
  currentRunningApp = null;
}
var functionBoundedValueMap = new WeakMap();
function rebindTarget2Fn(target, fn) {
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类，不然微应用中调用时会抛出 Illegal invocation 异常
    目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if ((0, _utils.isCallable)(fn) && !(0, _utils.isBoundedFunction)(fn) && !(0, _utils.isConstructable)(fn)) {
    var cachedBoundFunction = functionBoundedValueMap.get(fn);
    if (cachedBoundFunction) {
      return cachedBoundFunction;
    }
    var boundValue = Function.prototype.bind.call(fn, target);
    // some callable function has custom fields, we need to copy the own props to boundValue. such as moment function.
    Object.getOwnPropertyNames(fn).forEach(function (key) {
      // boundValue might be a proxy, we need to check the key whether exist in it
      if (!boundValue.hasOwnProperty(key)) {
        Object.defineProperty(boundValue, key, Object.getOwnPropertyDescriptor(fn, key));
      }
    });
    // copy prototype if bound function not have but target one have
    // as prototype is non-enumerable mostly, we need to copy it from target function manually
    if (fn.hasOwnProperty('prototype') && !boundValue.hasOwnProperty('prototype')) {
      // we should not use assignment operator to set boundValue prototype like `boundValue.prototype = fn.prototype`
      // as the assignment will also look up prototype chain while it hasn't own prototype property,
      // when the lookup succeed, the assignment will throw an TypeError like `Cannot assign to read only property 'prototype' of function` if its descriptor configured with writable false or just have a getter accessor
      // see https://github.com/umijs/qiankun/issues/1121
      Object.defineProperty(boundValue, 'prototype', {
        value: fn.prototype,
        enumerable: false,
        writable: true
      });
    }
    // Some util, like `function isNative() {  return typeof Ctor === 'function' && /native code/.test(Ctor.toString()) }` relies on the original `toString()` result
    // but bound functions will always return "function() {[native code]}" for `toString`, which is misleading
    if (typeof fn.toString === 'function') {
      var valueHasInstanceToString = fn.hasOwnProperty('toString') && !boundValue.hasOwnProperty('toString');
      var boundValueHasPrototypeToString = boundValue.toString === Function.prototype.toString;
      if (valueHasInstanceToString || boundValueHasPrototypeToString) {
        var originToStringDescriptor = Object.getOwnPropertyDescriptor(valueHasInstanceToString ? fn : Function.prototype, 'toString');
        Object.defineProperty(boundValue, 'toString', Object.assign({}, originToStringDescriptor, (originToStringDescriptor === null || originToStringDescriptor === void 0 ? void 0 : originToStringDescriptor.get) ? null : {
          value: function value() {
            return fn.toString();
          }
        }));
      }
    }
    functionBoundedValueMap.set(fn, boundValue);
    return boundValue;
  }
  return fn;
}