/**
 * @author Kuitos
 * @since 2019-05-15
 */

import { isFunction, snakeCase } from 'lodash';
import { FrameworkConfiguration } from './interfaces';

export function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isConstructable(fn: () => void | FunctionConstructor) {
  const constructableFunctionRegex = /^function\b\s[A-Z].*/;
  const classRegex = /^class\b/;

  // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数
  return (
    (fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1) ||
    constructableFunctionRegex.test(fn.toString()) ||
    classRegex.test(fn.toString())
  );
}

/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */
const naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
export const isCallable = naughtySafari
  ? (fn: any) => typeof fn === 'function' && typeof fn !== 'undefined'
  : (fn: any) => typeof fn === 'function';

export function isBoundedFunction(fn: CallableFunction) {
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  return fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
}

/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
export function uniq(array: PropertyKey[]) {
  return array.filter(function filter(this: string[], element) {
    return element in this ? false : ((this as any)[element] = true);
  }, {});
}

export function getDefaultTplWrapper(id: string) {
  return (tpl: string) => `<div id="${getWrapperId(id)}">${tpl}</div>`;
}

export function getWrapperId(id: string) {
  return `__qiankun_microapp_wrapper_for_${snakeCase(id)}__`;
}

/** 校验子应用导出的 生命周期 对象是否正确 */
export function validateExportLifecycle(exports: any) {
  const { bootstrap, mount, unmount } = exports ?? {};
  return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
}

class Deferred<T> {
  promise: Promise<T>;

  resolve!: (value?: T | PromiseLike<T>) => void;

  reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export { Deferred };

const supportsUserTiming =
  typeof performance !== 'undefined' &&
  typeof performance.mark === 'function' &&
  typeof performance.clearMarks === 'function' &&
  typeof performance.measure === 'function' &&
  typeof performance.clearMeasures === 'function';

export function performanceMark(markName: string) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}

export function performanceMeasure(measureName: string, markName: string) {
  if (supportsUserTiming) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}

export function isEnableScopedCSS(opt: FrameworkConfiguration) {
  if (typeof opt.sandbox !== 'object') {
    return false;
  }

  if (opt.sandbox.strictStyleIsolation) {
    return false;
  }

  return !!opt.sandbox.experimentalStyleIsolation;
}
