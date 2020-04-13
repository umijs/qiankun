/**
 * @author Kuitos
 * @since 2020-3-31
 */
import { uniq } from 'lodash';
import { SandBox } from '../interfaces';
import { getTargetValue } from './common';

// zone.js will overwrite Object.defineProperty
const rawObjectDefineProperty = Object.defineProperty;

function createFakeWindow(global: Window): Window {
  const fakeWindow = {} as Window;

  /*
   copy the non-configurable property of global to fakeWindow
   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
   > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
   */
  Object.getOwnPropertyNames(global)
    .filter(p => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      return !descriptor?.configurable;
    })
    .forEach(p => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      if (descriptor) {
        /*
         make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
         > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
         */
        if (p === 'top' || p === 'self' || p === 'window') {
          descriptor.configurable = true;
          descriptor.writable = true;
        }

        // just for test
        if (process.env.NODE_ENV === 'test' && p === 'mockTop') {
          descriptor.configurable = true;
          descriptor.writable = true;
        }
        // freeze the descriptor to avoid being modified by zone.js
        // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71
        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor!));
      }
    });

  return fakeWindow;
}

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
    const { sandboxRunning, updateValueMap } = this;

    const proxyPropertyGetterMap = new Map<PropertyKey, PropertyDescriptor['get']>();

    // https://github.com/umijs/qiankun/pull/192
    const rawWindow = window;
    const fakeWindow = createFakeWindow(rawWindow);

    const proxy = new Proxy(fakeWindow, {
      set(_: Window, p: PropertyKey, value: any): boolean {
        if (sandboxRunning) {
          updateValueMap.set(p, value);

          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
        }

        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true;
      },

      get(_: Window, p: PropertyKey): any {
        // just for test
        if (process.env.NODE_ENV === 'test' && p === 'mockTop') {
          return proxy;
        }

        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'top' || p === 'window' || p === 'self') {
          return proxy;
        }

        // proxy.hasOwnProperty would invoke getter firstly, then its value represented as rawWindow.hasOwnProperty
        if (p === 'hasOwnProperty') {
          return (key: PropertyKey) => updateValueMap.has(key) || rawWindow.hasOwnProperty(key);
        }

        // call proxy getter interceptors
        if (proxyPropertyGetterMap.has(p)) {
          return proxyPropertyGetterMap.get(p)!();
        }

        // Take priority from the updateValueMap, or fallback to window
        const value = updateValueMap.get(p) || (rawWindow as any)[p];
        return getTargetValue(rawWindow, value);
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(_: Window, p: string | number | symbol): boolean {
        return updateValueMap.has(p) || p in rawWindow;
      },

      getOwnPropertyDescriptor(target: Window, p: string | number | symbol): PropertyDescriptor | undefined {
        if (updateValueMap.has(p)) {
          // if the property is existed on raw window, use it original descriptor
          const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
          if (descriptor) {
            return descriptor;
          }

          return { configurable: true, enumerable: true, writable: true, value: updateValueMap.get(p) };
        }

        /*
         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
         */
        if (target.hasOwnProperty(p)) {
          return Object.getOwnPropertyDescriptor(target, p);
        }

        if (rawWindow.hasOwnProperty(p)) {
          return Object.getOwnPropertyDescriptor(rawWindow, p);
        }

        return undefined;
      },

      // trap to support iterator with sandbox
      ownKeys(): PropertyKey[] {
        return uniq([...Reflect.ownKeys(rawWindow), ...updateValueMap.keys()]);
      },

      deleteProperty(_: Window, p: string | number | symbol): boolean {
        if (updateValueMap.has(p)) {
          updateValueMap.delete(p);

          return true;
        }

        return true;
      },
    });

    Object.defineProperty(proxy, 'setProxyPropertyGetter', {
      value: (property: PropertyKey, getter: () => any) => {
        proxyPropertyGetterMap.set(property, getter);
      },
      enumerable: false,
      configurable: true,
    });

    this.proxy = proxy;
  }
}
