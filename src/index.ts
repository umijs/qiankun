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

type Lifecycle<T extends object> = (app: RegistrableApp<T>) => Promise<any>;

type LifeCycles<T extends object> = {
  beforeLoad?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app load
  beforeMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function before app mount
  afterMount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app mount
  afterUnmount?: Lifecycle<T> | Array<Lifecycle<T>>; // function after app unmount
};

let microApps: RegistrableApp[] = [];

function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

export function registerMicroApps<T extends object = {}>(apps: Array<RegistrableApp<T>>, lifeCycles: LifeCycles<T> = {}) {

  const beforeLoad = toArray(lifeCycles.beforeLoad || []);
  const beforeMount = toArray(lifeCycles.beforeMount || []);
  const afterMount = toArray(lifeCycles.afterMount || []);
  const afterUnmount = toArray(lifeCycles.afterUnmount || []);
  microApps = [...microApps, ...apps];

  apps.forEach(app => {

    const { name, entry, render, activeRule, props = {} } = app;

    registerApplication(name,

      async ({ name: appName }) => {

        // 获取入口 html 模板及脚本加载器
        const { template: appContent, execScripts } = await importEntry(entry);
        // 第一次加载设置应用可见区域 dom 结构
        // 确保每次应用加载前容器 dom 结构已经设置完毕
        render({ appContent, loading: true });

        let jsSandbox = window;
        let mountSandbox = () => Promise.resolve();
        let unmountSandbox = () => Promise.resolve();
        if (useJsSandbox) {
          const sandbox = genSandbox(appName);
          jsSandbox = sandbox.sandbox;
          mountSandbox = sandbox.mount;
          unmountSandbox = sandbox.unmount;
        }

        if (beforeLoad.length) {
          await Promise.all(beforeLoad.map(hook => hook(app)));
        }

        // 获取 模块/应用 导出的 lifecycle hooks
        const { bootstrap: bootstrapApp, mount, unmount } = await execScripts(jsSandbox);

        if (!isFunction(bootstrapApp) || !isFunction(mount) || !isFunction(unmount)) {
          throw new Error(`You need to export the functional lifecycles in ${appName} entry`);
        }

        return {
          bootstrap: [
            bootstrapApp,
          ],
          mount: [
            async () => {
              if (beforeMount.length) {
                await Promise.all(beforeMount.map(hook => hook(app)));
              }
            },
            mountSandbox,
            // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
            async () => render({ appContent, loading: false }),
            mount,
            async () => {
              if (afterMount.length) {
                await Promise.all(afterMount.map(hook => hook(app)));
              }
            },
          ],
          unmount: [
            unmount,
            unmountSandbox,
            async () => {
              if (afterUnmount.length) {
                await Promise.all(afterUnmount.map(hook => hook(app)));
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

export * from './effects';

let useJsSandbox = true;

export function start(opts: StartOpts = {}) {

  const { prefetch = true, jsSandbox = true } = opts;

  if (prefetch) {
    prefetchAfterFirstMounted(microApps);
  }

  if (jsSandbox) {
    useJsSandbox = jsSandbox;
  }

  startSpa();
}
