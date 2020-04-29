/**
 * @author Kuitos
 * @since 2019-05-15
 */

import { isFunction, snakeCase } from 'lodash';

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
    (fn.prototype && Object.getOwnPropertyNames(fn.prototype).filter(k => k !== 'constructor').length) ||
    constructableFunctionRegex.test(fn.toString()) ||
    classRegex.test(fn.toString())
  );
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
