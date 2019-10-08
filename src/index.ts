/* eslint-disable @typescript-eslint/array-type */

/**
 * @author Kuitos
 * @since 2019-04-25
 */

import { importEntry } from 'import-html-entry';
import { isFunction } from 'lodash';
import { registerApplication, start as startSpa } from 'single-spa';
import { RegistrableApp, StartOpts } from './interfaces';
import { prefetchAfterFirstMounted } from './prefetch';
import { genSandbox } from './sandbox';

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

type Lifecycle<T extends object> = (app: RegistrableApp<T>) => Promise<any>;

export type LifeCycles<T extends object> = {
  beforeLoad?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app load
  beforeMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app mount
  afterMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app mount
  beforeUnmount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app unmount
  afterUnmount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app unmount
};

let microApps: RegistrableApp[] = [];

function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain<T extends object>(
  hooks: Array<Lifecycle<T>>,
  app: RegistrableApp<T>,
): Promise<any> {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app)), Promise.resolve());
  }

  return Promise.resolve();
}

async function validateSingularMode<T extends object>(
  validate: StartOpts['singular'],
  app: RegistrableApp<T>,
): Promise<boolean> {
  return typeof validate === 'function' ? validate(app) : !!validate;
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

export function registerMicroApps<T extends object = {}>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles: LifeCycles<T> = {},
) {
  const {
    beforeUnmount = [],
    afterUnmount = [],
    afterMount = [],
    beforeMount = [],
    beforeLoad = [],
  } = lifeCycles;
  microApps = [...microApps, ...apps];

  let prevAppUnmountedDeferred: Deferred<void>;

  apps.forEach(app => {
    const { name, entry, render, activeRule, props = {} } = app;

    registerApplication(
      name,

      async ({ name: appName }) => {
        // 获取入口 html 模板及脚本加载器
        const { template: appContent, execScripts } = await importEntry(entry);
        // as single-spa load and bootstrap new app parallel with other apps unmounting
        // (see https://github.com/CanopyTax/single-spa/blob/master/src/navigation/reroute.js#L74)
        // we need wait to load the app until all apps are finishing unmount in singular mode
        if (await validateSingularMode(singularMode, app)) {
          await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
        }
        // 第一次加载设置应用可见区域 dom 结构
        // 确保每次应用加载前容器 dom 结构已经设置完毕
        render({ appContent, loading: true });

        let jsSandbox: Window = window;
        let mountSandbox = () => Promise.resolve();
        let unmountSandbox = () => Promise.resolve();
        if (useJsSandbox) {
          const sandbox = genSandbox(appName);
          jsSandbox = sandbox.sandbox;
          mountSandbox = sandbox.mount;
          unmountSandbox = sandbox.unmount;
        }

        await execHooksChain(toArray(beforeLoad), app);

        // 获取 模块/应用 导出的 lifecycle hooks
        const { bootstrap: bootstrapApp, mount, unmount } = await execScripts(jsSandbox);

        if (!isFunction(bootstrapApp) || !isFunction(mount) || !isFunction(unmount)) {
          throw new Error(`You need to export the functional lifecycles in ${appName} entry`);
        }

        return {
          bootstrap: [bootstrapApp],
          mount: [
            async () => (await validateSingularMode(singularMode, app) ? prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise : undefined),
            async () => execHooksChain(toArray(beforeMount), app),
            // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
            async () => render({ appContent, loading: true }),
            mountSandbox,
            mount,
            // 应用 mount 完成后结束 loading
            async () => render({ appContent, loading: false }),
            async () => execHooksChain(toArray(afterMount), app),
            // initialize the unmount defer after app mounted and resolve the defer after it unmounted
            async () => (await validateSingularMode(singularMode, app) ? (prevAppUnmountedDeferred = new Deferred<void>()) : undefined),
          ],
          unmount: [
            async () => execHooksChain(toArray(beforeUnmount), app),
            unmount,
            unmountSandbox,
            async () => execHooksChain(toArray(afterUnmount), app),
            async () => (await validateSingularMode(singularMode, app) ? prevAppUnmountedDeferred && prevAppUnmountedDeferred.resolve() : undefined),
          ],
        };
      },

      activeRule,
      props,
    );
  });
}

export * from './effects';

let useJsSandbox = false;
/*
 * with singular mode, any app will wait to load until other apps are unmouting
 * it is useful for the scenario that only one sub app shown at one time
 */
let singularMode: StartOpts['singular'] = false;

export function start(opts: StartOpts = {}) {
  // eslint-disable-next-line no-underscore-dangle
  window.__POWERED_BY_QIANKUN__ = true;

  const { prefetch = true, jsSandbox = true, singular = true } = opts;

  if (prefetch) {
    prefetchAfterFirstMounted(microApps);
  }

  if (jsSandbox) {
    useJsSandbox = jsSandbox;
  }

  if (singular) {
    singularMode = singular;
  }

  startSpa();
}
