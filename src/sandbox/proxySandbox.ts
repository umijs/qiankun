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

    this.proxy = new Proxy(window, {
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

      get(target: Window, p: PropertyKey): any {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'window' || p === 'self') {
          return proxy;
        }

        // Take priority from the updateValueMap, or fallback to window
        const value = updateValueMap.get(p) || (target as any)[p];
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
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(target: Window, p: string | number | symbol): boolean {
        return updateValueMap.has(p) || p in target;
      },

      // trap for getOwnPropertyDescriptor and hasOwnProperty
      getOwnPropertyDescriptor(target: Window, p: string | number | symbol): PropertyDescriptor | undefined {
        // 这里包含了对 hasOwnProperty 的 trap
        // https://stackoverflow.com/questions/40451694/use-es6-proxy-to-trap-object-hasownproperty
        if (updateValueMap.has(p)) {
          return { configurable: true, enumerable: true, value: updateValueMap.get(p) };
        }

        if ((target as any)[p]) {
          return Object.getOwnPropertyDescriptor(target, p);
        }

        return undefined;
      },

      ownKeys(target: Window): PropertyKey[] {
        return uniq([...Reflect.ownKeys(target), ...updateValueMap.keys()]);
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
