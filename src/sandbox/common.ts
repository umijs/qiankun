/**
 * @author Kuitos
 * @since 2020-04-13
 */

import { isBoundedFunction, isCallable, isConstructable } from '../utils';

let currentRunningSandboxProxy: WindowProxy | null;
export function getCurrentRunningSandboxProxy() {
  return currentRunningSandboxProxy;
}

export function setCurrentRunningSandboxProxy(proxy: WindowProxy | null) {
  currentRunningSandboxProxy = proxy;
}

const functionBoundedValueMap = new WeakMap<Function, Function>();
export function getTargetValue(target: any, value: any): any {
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    const cachedBoundValue = functionBoundedValueMap.get(value);
    if (cachedBoundValue) {
      return cachedBoundValue;
    }

    const boundValue = value.bind(target);
    // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
    // use for..in rather than Object.keys.forEach for performance reason
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in value) {
      boundValue[key] = value[key];
    }

    // copy prototype, for performance reason, we use in operator to check rather than hasOwnProperty
    if ('prototype' in value) boundValue.prototype = value.prototype;
    functionBoundedValueMap.set(value, boundValue);
    return boundValue;
  }

  return value;
}

const getterInvocationResultMap = new WeakMap<CallableFunction, any>();

export function getProxyPropertyValue(getter: CallableFunction) {
  const getterResult = getterInvocationResultMap.get(getter);
  if (!getterResult) {
    const result = getter();
    getterInvocationResultMap.set(getter, result);
    return result;
  }

  return getterResult;
}
