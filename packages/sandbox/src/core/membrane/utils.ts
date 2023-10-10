import { defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, hasOwnProperty } from '@qiankunjs/shared';
import { isBoundedFunction, isCallable, isConstructable } from '../../utils';

const functionBoundedValueMap = new WeakMap<CallableFunction, CallableFunction>();

export function getTargetValue<T>(target: unknown, value: T): T {
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类，不然微应用中调用时会抛出 Illegal invocation 异常
    目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value as CallableFunction)) {
    const typedValue = value as CallableFunction;
    const cachedBoundFunction = functionBoundedValueMap.get(typedValue);
    if (cachedBoundFunction) {
      return cachedBoundFunction as T;
    }

    const boundValue = Function.prototype.bind.call(typedValue, target) as CallableFunction;

    // some callable function has custom fields, we need to copy the own props to boundValue. such as moment function.
    getOwnPropertyNames(typedValue).forEach((key) => {
      // boundValue might be a proxy, we need to check the key whether exist in it
      if (!hasOwnProperty(boundValue, key)) {
        defineProperty(boundValue, key, getOwnPropertyDescriptor(typedValue, key)!);
      }
    });

    // copy prototype if bound function not have but target one have
    // as prototype is non-enumerable mostly, we need to copy it from target function manually
    if (hasOwnProperty(typedValue, 'prototype') && !hasOwnProperty(boundValue, 'prototype')) {
      // we should not use assignment operator to set boundValue prototype like `boundValue.prototype = typedValue.prototype`
      // as the assignment will also look up prototype chain while it hasn't own prototype property,
      // when the lookup succeed, the assignment will throw an TypeError like `Cannot assign to read only property 'prototype' of function` if its descriptor configured with writable false or just have a getter accessor
      // see https://github.com/umijs/qiankun/issues/1121
      defineProperty(boundValue, 'prototype', {
        value: typedValue.prototype as unknown,
        enumerable: false,
        writable: true,
      });
    }

    // Some util, like `function isNative() {  return typeof Ctor === 'function' && /native code/.test(Ctor.toString()) }` relies on the original `toString()` result
    // but bound functions will always return "function() {[native code]}" for `toString`, which is misleading
    if (typeof typedValue.toString === 'function') {
      const valueHasInstanceToString =
        hasOwnProperty(typedValue, 'toString') && !hasOwnProperty(boundValue, 'toString');
      const boundValueHasPrototypeToString = boundValue.toString === Function.prototype.toString;

      if (valueHasInstanceToString || boundValueHasPrototypeToString) {
        const originToStringDescriptor = getOwnPropertyDescriptor(
          valueHasInstanceToString ? value : Function.prototype,
          'toString',
        );

        Object.defineProperty(boundValue, 'toString', {
          ...originToStringDescriptor,
          ...(originToStringDescriptor?.get ? null : { value: () => typedValue.toString() }),
        });
      }
    }

    functionBoundedValueMap.set(value, boundValue);
    return boundValue as T;
  }

  return value;
}
