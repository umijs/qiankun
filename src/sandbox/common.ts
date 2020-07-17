/**
 * @author Kuitos
 * @since 2020-04-13
 */

import { isBoundedFunction, isCallable, isConstructable } from '../utils';

const boundValueSymbol = Symbol('bound value');

export function getTargetValue(target: any, value: any): any {
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
    if (value[boundValueSymbol]) {
      return value[boundValueSymbol];
    }

    const boundValue = value.bind(target);
    // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
    Object.keys(value).forEach(key => (boundValue[key] = value[key]));
    Object.defineProperty(value, boundValueSymbol, { enumerable: false, value: boundValue });
    return boundValue;
  }

  return value;
}

const proxyPropertyGetterMap = new Map<WindowProxy, Record<PropertyKey, CallableFunction>>();
const getterInvocationResultMap = new Map<CallableFunction, any>();

export function getProxyPropertyValue(getter: CallableFunction) {
  const getterResult = getterInvocationResultMap.get(getter);
  if (!getterResult) {
    const result = getter();
    getterInvocationResultMap.set(getter, result);
    return result;
  }

  return getterResult;
}

export function getProxyPropertyGetter(proxy: WindowProxy, property: PropertyKey): any {
  const getters = proxyPropertyGetterMap.get(proxy);
  if (getters) {
    return getters![property as string];
  }

  return undefined;
}

export function setProxyPropertyGetter(proxy: WindowProxy, property: PropertyKey, getter: () => any): Function {
  const prevGetters = proxyPropertyGetterMap.get(proxy) || {};
  proxyPropertyGetterMap.set(proxy, { ...prevGetters, [property]: getter });
  return function deleteProxyPropertyGetter() {
    proxyPropertyGetterMap.delete(proxy);
  };
}
