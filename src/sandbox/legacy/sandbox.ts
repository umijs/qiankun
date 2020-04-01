/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { SandBox } from '../../interfaces';
import { isConstructable } from '../../utils';

function isPropConfigurable(target: object, prop: PropertyKey) {
  const descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

function setWindowProp(prop: PropertyKey, value: any, toDelete?: boolean) {
  if (value === undefined && toDelete) {
    delete (window as any)[prop];
  } else if (isPropConfigurable(window, prop) && typeof prop !== 'symbol') {
    Object.defineProperty(window, prop, { writable: true, configurable: true });
    (window as any)[prop] = value;
  }
}

/**
 * 基于 Proxy 实现的沙箱
 * TODO: 为了兼容性 singular 模式下依旧使用该沙箱，等新沙箱稳定之后再切换
 */
export default class SingularProxySandbox implements SandBox {
  /** 沙箱期间新增的全局变量 */
  private addedPropsMapInSandbox = new Map<PropertyKey, any>();

  /** 沙箱期间更新的全局变量 */
  private modifiedPropsOriginalValueMapInSandbox = new Map<PropertyKey, any>();

  /** 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot */
  private currentUpdatedPropsValueMap = new Map<PropertyKey, any>();

  name: string;

  proxy: WindowProxy;

  sandboxRunning = true;

  active() {
    if (!this.sandboxRunning) {
      this.currentUpdatedPropsValueMap.forEach((v, p) => setWindowProp(p, v));
    }

    this.sandboxRunning = true;
  }

  inactive() {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.addedPropsMapInSandbox.keys(),
        ...this.modifiedPropsOriginalValueMapInSandbox.keys(),
      ]);
    }

    // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
    // restore global props to initial snapshot
    this.modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => setWindowProp(p, v));
    this.addedPropsMapInSandbox.forEach((_, p) => setWindowProp(p, undefined, true));

    this.sandboxRunning = false;
  }

  constructor(name: string) {
    this.name = name;
    const {
      sandboxRunning,
      addedPropsMapInSandbox,
      modifiedPropsOriginalValueMapInSandbox,
      currentUpdatedPropsValueMap,
    } = this;

    const boundValueSymbol = Symbol('bound value');
    const rawWindow = window;
    const fakeWindow = Object.create(null) as Window;

    const proxy = new Proxy(fakeWindow, {
      set(_: Window, p: PropertyKey, value: any): boolean {
        if (sandboxRunning) {
          if (!rawWindow.hasOwnProperty(p)) {
            addedPropsMapInSandbox.set(p, value);
          } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
            // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
            const originalValue = (rawWindow as any)[p];
            modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
          }

          currentUpdatedPropsValueMap.set(p, value);
          // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
          // eslint-disable-next-line no-param-reassign
          (rawWindow as any)[p] = value;

          return true;
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

        const value = (rawWindow as any)[p];
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
        return p in rawWindow;
      },
    });

    this.proxy = proxy;
  }
}
