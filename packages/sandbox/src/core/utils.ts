/**
 * @author Kuitos
 * @since 2023-11-15
 */
import { defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, hasOwnProperty } from '@qiankunjs/shared';
import { isBoundedFunction, isCallable, isConstructable } from '../utils';

const functionBoundedValueMap = new WeakMap<CallableFunction, CallableFunction>();

export function rebindTarget2Fn<T>(target: unknown, fn: T, receiver: unknown): T {
  /*
    仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类，不然微应用中调用时会抛出 Illegal invocation 异常
    目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
    @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
   */
  if (isCallable(fn) && !isBoundedFunction(fn) && !isConstructable(fn as CallableFunction)) {
    const typedValue = fn as CallableFunction;
    const cachedBoundFunction = functionBoundedValueMap.get(typedValue);
    if (cachedBoundFunction) {
      return cachedBoundFunction as T;
    }

    const boundValue = function proxyFunction(...args: unknown[]): unknown {
      return Function.prototype.apply.call(
        typedValue,
        target,
        args.map((arg) => (arg === receiver ? target : arg)),
      );
    };

    // some callable function has custom fields, we need to copy the own props to boundValue. such as moment function.
    getOwnPropertyNames(typedValue).forEach((key) => {
      // boundValue might be a proxy, we need to check the key whether exist in it
      if (!hasOwnProperty(boundValue, key)) {
        defineProperty(boundValue, key, getOwnPropertyDescriptor(typedValue, key)!);
      }
    });

    // copy prototype if bound function not have but target one have
    if (hasOwnProperty(typedValue, 'prototype') && !hasOwnProperty(boundValue, 'prototype')) {
      defineProperty(boundValue, 'prototype', {
        value: typedValue.prototype as unknown,
        enumerable: false,
        writable: true,
      });
    }

    // preserve custom/native toString behavior relied on by common isNative helpers
    if (typeof typedValue.toString === 'function') {
      const valueHasInstanceToString =
        hasOwnProperty(typedValue, 'toString') && !hasOwnProperty(boundValue, 'toString');
      const boundValueHasPrototypeToString = boundValue.toString === Function.prototype.toString;

      if (valueHasInstanceToString || boundValueHasPrototypeToString) {
        const originToStringDescriptor = getOwnPropertyDescriptor(
          valueHasInstanceToString ? fn : Function.prototype,
          'toString',
        );

        Object.defineProperty(
          boundValue,
          'toString',
          Object.assign(
            {},
            originToStringDescriptor,
            originToStringDescriptor?.get ? null : { value: () => typedValue.toString() },
          ),
        );
      }
    }

    functionBoundedValueMap.set(fn, boundValue);
    return boundValue as T;
  }

  return fn;
}

/**
 * transform the array to a truthy object for better performance with in operator check later
 * @param array
 */
export function array2TruthyObject(array: string[]): Record<string, true> {
  return array.reduce(
    (obj, key) => {
      obj[key] = true;
      return obj;
    },
    // Notes that babel will transpile spread operator to Object.assign({}, ...args), which will keep the prototype of Object in merged object,
    // while this result used as Symbol.unscopables, it will make properties in Object.prototype always be escaped from proxy sandbox as unscopables check will look up prototype chain as well,
    // such as hasOwnProperty, toString, valueOf, etc.
    // so we should use Object.create(null) to create a pure object without prototype chain here.
    Object.create(null) as Record<string, true>,
  );
}
