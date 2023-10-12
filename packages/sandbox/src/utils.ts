import { getOwnPropertyDescriptor, hasOwnProperty } from '@qiankunjs/shared';

const fnRegexCheckCacheMap = new WeakMap<CallableFunction, boolean>();

/**
 * 1. has prototype and prototype has defined a series of non-constructor attributes
 * 2. The function name starts with a capital letter
 * 3. class function
 * If one of them is satisfied, it can be regarded as a constructor function
 * @param fn
 */
export function isConstructable(fn: CallableFunction): fn is CallableFunction {
  // prototype methods might be changed while code running, so we need check it every time
  const hasPrototypeMethods =
    (<unknown>fn.prototype)?.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1;

  if (hasPrototypeMethods) return true;

  const cachedValue = fnRegexCheckCacheMap.get(fn);
  if (typeof cachedValue !== 'undefined') {
    return cachedValue;
  }

  let constructable: boolean = hasPrototypeMethods;
  if (!constructable) {
    // fn.toString has a significant performance overhead, if hasPrototypeMethods check not passed, we will check the function string with regex
    const fnString = fn.toString();
    const constructableFunctionRegex = /^function\b\s[A-Z].*/;
    const classRegex = /^class\b/;
    constructable = constructableFunctionRegex.test(fnString) || classRegex.test(fnString);
  }

  fnRegexCheckCacheMap.set(fn, constructable);
  return constructable;
}

const callableFnCacheMap = new WeakMap<CallableFunction, boolean>();

export function isCallable(fn: unknown): fn is CallableFunction {
  if (callableFnCacheMap.has(fn as CallableFunction)) {
    return true;
  }

  /*
   * We can not use typeof to confirm it is function as in some safari version
   * typeof document.all === 'undefined' // true
   * typeof document.all === 'function' // true
   */
  const callable = typeof fn === 'function' && fn instanceof Function;
  if (callable) {
    callableFnCacheMap.set(fn, callable);
  }
  return callable;
}

const frozenPropertyCacheMap = new WeakMap<object, Record<PropertyKey, boolean>>();

export function isPropertyFrozen(target: object, p?: PropertyKey): boolean {
  if (!target || !p) {
    return false;
  }

  const targetPropertiesFromCache = frozenPropertyCacheMap.get(target) || {};

  if (targetPropertiesFromCache[p]) {
    return targetPropertiesFromCache[p];
  }

  const propertyDescriptor = getOwnPropertyDescriptor(target, p);
  const frozen = Boolean(
    propertyDescriptor &&
      propertyDescriptor.configurable === false &&
      (propertyDescriptor.writable === false || (propertyDescriptor.get && !propertyDescriptor.set)),
  );

  targetPropertiesFromCache[p] = frozen;
  frozenPropertyCacheMap.set(target, targetPropertiesFromCache);

  return frozen;
}

const boundedMap = new WeakMap<CallableFunction, boolean>();

export function isBoundedFunction(fn: CallableFunction): fn is CallableFunction {
  const cachedValue = boundedMap.get(fn);
  if (typeof cachedValue !== 'undefined') {
    return cachedValue;
  }
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  const bounded = fn.name.indexOf('bound ') === 0 && !hasOwnProperty(fn, 'prototype');
  boundedMap.set(fn, bounded);
  return bounded;
}
