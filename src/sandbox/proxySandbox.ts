/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { uniq } from 'lodash';
import { SandBox } from '../interfaces';
import { isConstructable } from '../utils';

/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox implements SandBox {
  /** window 值变更的记录快照 */
  private updateValueMap = new Map<PropertyKey, any>();

  name: string;

  proxy: WindowProxy;

  sandboxRunning = true;

  active() {
    this.sandboxRunning = true;
  }

  inactive() {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.updateValueMap.keys(),
      ]);
    }

    this.sandboxRunning = false;
  }

  constructor(name: string) {
    this.name = name;
    const { proxy, sandboxRunning, updateValueMap } = this;

    const boundValueSymbol = Symbol('bound value');
    // https://github.com/umijs/qiankun/pull/192
    const rawWindow = window;
    const fakeWindow = Object.create(null) as Window;

    this.proxy = new Proxy(fakeWindow, {
      set(_: Window, p: PropertyKey, value: any): boolean {
        if (sandboxRunning) {
          updateValueMap.set(p, value);
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn(`[qiankun] Set window.${p.toString()} while jsSandbox destroyed or inactive in ${name}!`);
        }

        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true;
      },

      get(_: Window, p: PropertyKey): any {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'window' || p === 'self') {
          return proxy;
        }

        // Take priority from the updateValueMap, or fallback to window
        const value = updateValueMap.get(p) || (rawWindow as any)[p];
        /*
        仅绑定 !isConstructable && isCallable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
        @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
         */
        if (typeof value === 'function' && !isConstructable(value)) {
          if (value[boundValueSymbol]) {
            return value[boundValueSymbol];
          }

          const boundValue = value.bind(rawWindow);
          // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
          Object.keys(value).forEach(key => (boundValue[key] = value[key]));
          Object.defineProperty(value, boundValueSymbol, { enumerable: false, value: boundValue });
          return boundValue;
        }

        return value;
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(_: Window, p: string | number | symbol): boolean {
        return updateValueMap.has(p) || p in rawWindow;
      },

      // trap for getOwnPropertyDescriptor and hasOwnProperty
      getOwnPropertyDescriptor(_: Window, p: string | number | symbol): PropertyDescriptor | undefined {
        // 这里包含了对 hasOwnProperty 的 trap
        // https://stackoverflow.com/questions/40451694/use-es6-proxy-to-trap-object-hasownproperty
        if (updateValueMap.has(p)) {
          return { configurable: true, enumerable: true, value: updateValueMap.get(p) };
        }

        if ((rawWindow as any)[p]) {
          return Object.getOwnPropertyDescriptor(rawWindow, p);
        }

        return undefined;
      },

      ownKeys(): PropertyKey[] {
        return uniq([...Reflect.ownKeys(rawWindow), ...updateValueMap.keys()]);
      },

      deleteProperty(_: Window, p: string | number | symbol): boolean {
        if (updateValueMap.has(p)) {
          updateValueMap.delete(p);

          return true;
        }

        // 我想没人会删 window 上自有的属性吧？

        return false;
      },
    });
  }
}
