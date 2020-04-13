/**
 * @author Kuitos
 * @since 2020-04-13
 */

import { isConstructable } from '../utils';

const boundValueSymbol = Symbol('bound value');

export function getTargetValue(target: any, value: any): any {
  /*
    仅绑定 !isConstructable && isCallable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if (typeof value === 'function' && !isConstructable(value)) {
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

const proxyGetterMap = new Map<WindowProxy, Record<PropertyKey, any>>();

export function getProxyPropertyGetter(proxy: WindowProxy, property: PropertyKey) {
  const getters = proxyGetterMap.get(proxy) || ({} as Record<string, any>);
  return getters[property as string];
}

export function setProxyPropertyGetter(proxy: WindowProxy, property: PropertyKey, getter: () => any) {
  const prevGetters = proxyGetterMap.get(proxy) || {};
  proxyGetterMap.set(proxy, { ...prevGetters, [property]: getter });
}

export function removeProxyPropertyGetters(proxy: WindowProxy) {
  proxyGetterMap.delete(proxy);
}
