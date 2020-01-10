/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { hijackAtBootstrapping, hijackAtMounting } from './hijackers';
import { Freer, Rebuilder } from './interfaces';
import { isConstructable } from './utils';

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
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 * @param assetPublicPath
 */
export function genSandbox(appName: string, assetPublicPath: string) {
  // 沙箱期间新增的全局变量
  const addedPropsMapInSandbox = new Map<PropertyKey, any>();
  // 沙箱期间更新的全局变量
  const modifiedPropsOriginalValueMapInSandbox = new Map<PropertyKey, any>();
  // 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot
  const currentUpdatedPropsValueMap = new Map<PropertyKey, any>();

  // mounting freers are one-off and should be re-init at every mounting time
  let mountingFreers: Freer[] = [];

  let sideEffectsRebuilders: Rebuilder[] = [];

  let sandboxRunning = true;

  const boundValueSymbol = Symbol('bound value');

  const rawWindow = window;
  // fake proxy target with a empty object
  // see the invariants section of Proxy https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
  const fakeWindow = Object.create(null) as Window;

  const sandbox: WindowProxy = new Proxy(fakeWindow, {
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
        console.warn(`Try to set window.${p.toString()} while js sandbox destroyed or not active in ${appName}!`);
      }

      // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
      return true;
    },

    get(_: Window, p: PropertyKey): any {
      // avoid who using window.window or window.self to escape the sandbox environment to touch the really window
      // or use window.top to check if an iframe context
      // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
      if (p === 'top' || p === 'window' || p === 'self') {
        return sandbox;
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

  // some side effect could be be invoked while bootstrapping, such as dynamic stylesheet injection with style-loader, especially during the development phase
  const bootstrappingFreers = hijackAtBootstrapping(appName, assetPublicPath, sandbox);

  return {
    sandbox,

    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    async mount() {
      const sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
      const sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length);

      // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state
      if (sideEffectsRebuildersAtBootstrapping.length) {
        sideEffectsRebuildersAtBootstrapping.forEach(rebuild => rebuild());
      }

      /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

      /* ------------------------------------------ 1. 启动/恢复 快照 ------------------------------------------ */
      // 沙箱未启动说明为唤醒流程，此时需从之前的修改记录中恢复上下文
      if (!sandboxRunning) {
        currentUpdatedPropsValueMap.forEach((v, p) => setWindowProp(p, v));
      }

      /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
      // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用
      mountingFreers = hijackAtMounting(appName, sandbox);

      /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
      // 存在 rebuilder 则表明有些副作用需要重建
      if (sideEffectsRebuildersAtMounting.length) {
        sideEffectsRebuildersAtMounting.forEach(rebuild => rebuild());
      }

      // clean up rebuilders
      sideEffectsRebuilders = [];

      sandboxRunning = true;
    },

    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    async unmount() {
      if (process.env.NODE_ENV === 'development') {
        console.info(`${appName} modified global properties will be restore`, [
          ...addedPropsMapInSandbox.keys(),
          ...modifiedPropsOriginalValueMapInSandbox.keys(),
        ]);
      }

      // record the rebuilders of window side effects (event listeners or timers)
      // note that the frees of mounting phase are one-off as it will be re-init at next mounting
      sideEffectsRebuilders = [...bootstrappingFreers, ...mountingFreers].map(free => free());

      // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
      // restore global props to initial snapshot
      modifiedPropsOriginalValueMapInSandbox.forEach((v, p) => setWindowProp(p, v));
      addedPropsMapInSandbox.forEach((_, p) => setWindowProp(p, undefined, true));

      sandboxRunning = false;
    },
  };
}
