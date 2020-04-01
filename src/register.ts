import { importEntry, ImportEntryOpts } from 'import-html-entry';
import { concat, flow, identity, mergeWith } from 'lodash';
import { registerApplication, start as startSingleSpa } from 'single-spa';
import getAddOns from './addons';
import { RegistrableApp, StartOpts } from './interfaces';
import { prefetchApps } from './prefetch';
import { genSandbox } from './sandbox';
import { getDefaultTplWrapper, validateExportLifecycle } from './utils';

type Lifecycle<T extends object> = (app: RegistrableApp<T>) => Promise<any>;

export type LifeCycles<T extends object> = {
  beforeLoad?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app load
  beforeMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app mount
  afterMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app mount
  beforeUnmount?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app unmount
  afterUnmount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app unmount
};

let microApps: RegistrableApp[] = [];

function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain<T extends object>(hooks: Array<Lifecycle<T>>, app: RegistrableApp<T>): Promise<any> {
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

/*
 * with singular mode, any app will wait to load until other apps are unmouting
 * it is useful for the scenario that only one sub app shown at one time
 */
let singular: StartOpts['singular'] = false;
let useJsSandbox = false;
const frameworkStartedDefer = new Deferred<void>();

let importLoaderConfiguration: ImportEntryOpts = {};
export function getImportLoaderConfiguration() {
  return importLoaderConfiguration;
}

export function registerMicroApps<T extends object = {}>(apps: Array<RegistrableApp<T>>, lifeCycles?: LifeCycles<T>) {
  // Each app only needs to be registered once
  const unregisteredApps = apps.filter(app => !microApps.some(registeredApp => registeredApp.name === app.name));

  microApps = [...microApps, ...unregisteredApps];

  let prevAppUnmountedDeferred: Deferred<void>;

  unregisteredApps.forEach(app => {
    const { name, entry, render, activeRule, props = {} } = app;

    registerApplication(
      name,

      async ({ name: appName }) => {
        await frameworkStartedDefer.promise;

        const { getTemplate = identity, ...settings } = importLoaderConfiguration || {};
        // get the entry html content and script executor
        const { template: appContent, execScripts, assetPublicPath } = await importEntry(entry, {
          // compose the config getTemplate function with default wrapper
          getTemplate: flow(getTemplate, getDefaultTplWrapper(appName)),
          ...settings,
        });

        // as single-spa load and bootstrap new app parallel with other apps unmounting
        // (see https://github.com/CanopyTax/single-spa/blob/master/src/navigation/reroute.js#L74)
        // we need wait to load the app until all apps are finishing unmount in singular mode
        if (await validateSingularMode(singular, app)) {
          await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
        }
        // 第一次加载设置应用可见区域 dom 结构
        // 确保每次应用加载前容器 dom 结构已经设置完毕
        render({ appContent, loading: true });

        let global: Window = window;
        let mountSandbox = () => Promise.resolve();
        let unmountSandbox = () => Promise.resolve();
        if (useJsSandbox) {
          const sandbox = genSandbox(appName, !!singular);
          // 用沙箱的代理对象作为接下来使用的全局对象
          global = sandbox.sandbox;
          mountSandbox = sandbox.mount;
          unmountSandbox = sandbox.unmount;
        }

        const {
          beforeUnmount = [],
          afterUnmount = [],
          afterMount = [],
          beforeMount = [],
          beforeLoad = [],
        } = mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, (v1, v2) => concat(v1 ?? [], v2 ?? []));

        await execHooksChain(toArray(beforeLoad), app);

        // get the lifecycle hooks from module exports
        const scriptExports: any = await execScripts(global, !singular);
        let bootstrap;
        let mount;
        let unmount;

        if (validateExportLifecycle(scriptExports)) {
          // eslint-disable-next-line prefer-destructuring
          bootstrap = scriptExports.bootstrap;
          // eslint-disable-next-line prefer-destructuring
          mount = scriptExports.mount;
          // eslint-disable-next-line prefer-destructuring
          unmount = scriptExports.unmount;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[qiankun] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`,
            );
          }

          // fallback to global variable who named with ${appName} while module exports not found
          const globalVariableExports = (global as any)[appName];

          if (validateExportLifecycle(globalVariableExports)) {
            // eslint-disable-next-line prefer-destructuring
            bootstrap = globalVariableExports.bootstrap;
            // eslint-disable-next-line prefer-destructuring
            mount = globalVariableExports.mount;
            // eslint-disable-next-line prefer-destructuring
            unmount = globalVariableExports.unmount;
          } else {
            throw new Error(`[qiankun] You need to export lifecycle functions in ${appName} entry`);
          }
        }

        return {
          bootstrap: [bootstrap],
          mount: [
            async () => {
              if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
                return prevAppUnmountedDeferred.promise;
              }

              return undefined;
            },
            // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
            async () => render({ appContent, loading: true }),
            // exec the chain after rendering to keep the behavior with beforeLoad
            async () => execHooksChain(toArray(beforeMount), app),
            mountSandbox,
            mount,
            // 应用 mount 完成后结束 loading
            async () => render({ appContent, loading: false }),
            async () => execHooksChain(toArray(afterMount), app),
            // initialize the unmount defer after app mounted and resolve the defer after it unmounted
            async () => {
              if (await validateSingularMode(singular, app)) {
                prevAppUnmountedDeferred = new Deferred<void>();
              }
            },
          ],
          unmount: [
            async () => execHooksChain(toArray(beforeUnmount), app),
            unmount,
            unmountSandbox,
            async () => execHooksChain(toArray(afterUnmount), app),
            // remove the app content after unmount
            async () => render({ appContent: '', loading: false }),
            async () => {
              if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
                prevAppUnmountedDeferred.resolve();
              }
            },
          ],
        };
      },

      activeRule,
      props,
    );
  });
}

export function start(opts: StartOpts = {}) {
  window.__POWERED_BY_QIANKUN__ = true;

  const { prefetch = true, jsSandbox = true, singular: singularMode = true, ...importEntryOpts } = opts;
  importLoaderConfiguration = importEntryOpts;

  if (prefetch) {
    prefetchApps(microApps, prefetch, importLoaderConfiguration);
  }

  if (singularMode) {
    singular = singularMode;
  }

  if (jsSandbox) {
    if (!window.Proxy) {
      console.warn('[qiankun] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
      // 快照沙箱不支持非 singular 模式
      if (!singularMode) {
        console.error('[qiankun] singular is forced to be true when jsSandbox enable but proxySandbox unavailable');
        singular = true;
      }
    }

    useJsSandbox = jsSandbox;
  }

  startSingleSpa();

  frameworkStartedDefer.resolve();
}
