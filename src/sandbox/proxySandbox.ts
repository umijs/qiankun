/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2020-3-31
 */
import { uniq } from 'lodash';
import { SandBox } from '../interfaces';
import { getProxyPropertyGetter, getTargetValue } from './common';
import { clearSystemJsProps, interceptSystemJsProps } from './noise/systemjs';

// zone.js will overwrite Object.defineProperty
const rawObjectDefineProperty = Object.defineProperty;

type FakeWindow = Window & Record<PropertyKey, any>;
function createFakeWindow(global: Window): Window {
  const fakeWindow = {} as FakeWindow;

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
        if (
          p === 'top' ||
          p === 'self' ||
          p === 'window' ||
          (process.env.NODE_ENV === 'test' && (p === 'mockTop' || p === 'mockSafariTop'))
        ) {
          descriptor.configurable = true;
          /*
           The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
           Example:
            Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
            Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
           */
          if (!Object.prototype.hasOwnProperty.call(descriptor, 'get')) {
            descriptor.writable = true;
          }
        }

        // freeze the descriptor to avoid being modified by zone.js
        // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71
        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor!));
      }
    });

  return fakeWindow;
}

let activeSandboxCount = 0;

/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox implements SandBox {
  /** window 值变更记录 */
  private updatedValueSet = new Set<PropertyKey>();

  name: string;

  proxy: WindowProxy;

  sandboxRunning = true;

  active() {
    this.sandboxRunning = true;
    activeSandboxCount++;
  }

  inactive() {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.updatedValueSet.keys(),
      ]);
    }

    clearSystemJsProps(this.proxy, --activeSandboxCount === 0);

    this.sandboxRunning = false;
  }

  constructor(name: string) {
    this.name = name;
    const { sandboxRunning, updatedValueSet } = this;

    // https://github.com/umijs/qiankun/pull/192
    const rawWindow = window;
    const fakeWindow = createFakeWindow(rawWindow);

    const proxy = new Proxy(fakeWindow, {
      set(target: FakeWindow, p: PropertyKey, value: any): boolean {
        if (sandboxRunning) {
          // @ts-ignore
          target[p] = value;
          updatedValueSet.add(p);

          interceptSystemJsProps(p, value);

          return true;
        }

        if (process.env.NODE_ENV === 'development') {
          console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
        }

        // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
        return true;
      },

      get(target: FakeWindow, p: PropertyKey): any {
        // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
        // or use window.top to check if an iframe context
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (
          p === 'top' ||
          p === 'window' ||
          p === 'self' ||
          (process.env.NODE_ENV === 'test' && (p === 'mockTop' || p === 'mockSafariTop'))
        ) {
          return proxy;
        }

        // never rewrite eval
        if (p === 'eval') {
          // eslint-disable-next-line no-eval
          return eval;
        }

        // proxy.hasOwnProperty would invoke getter firstly, then its value represented as rawWindow.hasOwnProperty
        if (p === 'hasOwnProperty') {
          return (key: PropertyKey) => target.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
        }

        // call proxy getter interceptors
        const proxyPropertyGetter = getProxyPropertyGetter(proxy, p);
        if (proxyPropertyGetter) {
          return proxyPropertyGetter();
        }

        const value = (target as any)[p] || (rawWindow as any)[p];
        return getTargetValue(rawWindow, value);
      },

      // trap in operator
      // see https://github.com/styled-components/styled-components/blob/master/packages/styled-components/src/constants.js#L12
      has(target: FakeWindow, p: string | number | symbol): boolean {
        return p in target || p in rawWindow;
      },

      getOwnPropertyDescriptor(target: FakeWindow, p: string | number | symbol): PropertyDescriptor | undefined {
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
      ownKeys(target: FakeWindow): PropertyKey[] {
        return uniq([...Reflect.ownKeys(rawWindow), ...Reflect.ownKeys(target)]);
      },

      deleteProperty(target: FakeWindow, p: string | number | symbol): boolean {
        if (target.hasOwnProperty(p)) {
          // @ts-ignore
          delete target[p];
          updatedValueSet.delete(p);

          return true;
        }

        return true;
      },
    });

    this.proxy = proxy;
  }
}
