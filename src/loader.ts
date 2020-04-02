/**
 * @author Kuitos
 * @since 2020-04-01
 */

import { importEntry } from 'import-html-entry';
import { concat, flow, identity, mergeWith } from 'lodash';
import getAddOns from './addons';
import { frameworkStartedDefer } from './apis';
import { Configuration, Lifecycle, LifeCycles, LoadableApp } from './interfaces';
import { genSandbox } from './sandbox';
import { Deferred, getDefaultTplWrapper, validateExportLifecycle } from './utils';

function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain<T extends object>(hooks: Array<Lifecycle<T>>, app: LoadableApp<T>): Promise<any> {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app)), Promise.resolve());
  }

  return Promise.resolve();
}

async function validateSingularMode<T extends object>(
  validate: Configuration['singular'],
  app: LoadableApp<T>,
): Promise<boolean> {
  return typeof validate === 'function' ? validate(app) : !!validate;
}

let prevAppUnmountedDeferred: Deferred<void>;

export async function loadApp<T extends object>(
  app: LoadableApp<T>,
  configuration: Configuration,
  lifeCycles?: LifeCycles<T>,
) {
  await frameworkStartedDefer.promise;

  const { entry, render, name: appName } = app;
  const { singular, jsSandbox: useJsSandbox, getTemplate = identity, ...importEntryOpts } = configuration || {};
  // get the entry html content and script executor
  const { template: appContent, execScripts, assetPublicPath } = await importEntry(entry, {
    // compose the config getTemplate function with default wrapper
    getTemplate: flow(getTemplate, getDefaultTplWrapper(appName)),
    ...importEntryOpts,
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

  const { beforeUnmount = [], afterUnmount = [], afterMount = [], beforeMount = [], beforeLoad = [] } = mergeWith(
    {},
    getAddOns(global, assetPublicPath),
    lifeCycles,
    (v1, v2) => concat(v1 ?? [], v2 ?? []),
  );

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
      async () => {
        // remove the app content after unmount, only works with singular mode
        if (singular) render({ appContent: '', loading: false });
      },
      async () => {
        if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
          prevAppUnmountedDeferred.resolve();
        }
      },
    ],
  };
}
