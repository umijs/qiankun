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

type Options = {
  beforeLoadHooks?: Array<(app: RegistrableApp) => Promise<any>>; // function before app load
  beforeMountHooks?: Array<(app: RegistrableApp) => Promise<any>>; // function before app mount
  afterUnloadHooks?: Array<(app: RegistrableApp) => Promise<any>>; // function after app unmount
};

let microApps: RegistrableApp[] = [];

export function registerMicroApps(apps: RegistrableApp[], options: Options = {}) {

  const { beforeLoadHooks = [], afterUnloadHooks = [], beforeMountHooks = [] } = options;
  microApps = [...microApps, ...apps];

  apps.forEach(app => {

    const { name, entry, render, activeRule, props = {} } = app;

    registerApplication(name,

      async () => {

        // 获取入口 html 模板及脚本加载器
        const { template: appContent, execScripts } = await importEntry(entry);
        // 第一次加载设置应用可见区域 dom 结构
        // 确保每次应用加载前容器 dom 结构已经设置完毕
        render({ appContent, loading: true });

        let jsSandbox = window;
        let mountSandbox = () => Promise.resolve();
        let unmountSandbox = () => Promise.resolve();
        if (useJsSandbox) {
          const sandbox = genSandbox(name);
          jsSandbox = sandbox.sandbox;
          mountSandbox = sandbox.mount;
          unmountSandbox = sandbox.unmount;
        }

        if (beforeLoadHooks.length) {
          await Promise.all(beforeLoadHooks.map(hook => hook(app)));
        }

        // 获取 模块/应用 导出的 lifecycle hooks
        const { bootstrap: bootstrapApp, mount, unmount } = await execScripts(jsSandbox);

        if (!isFunction(bootstrapApp) || !isFunction(mount) || !isFunction(unmount)) {
          throw new Error(`You need to export the functional lifecycles in ${name} entry`);
        }

        return {
          bootstrap: [
            bootstrapApp,
          ],
          mount: [
            async () => {
              if (beforeMountHooks.length) {
                await Promise.all(beforeMountHooks.map(hook => hook(app)));
              }
            },
            mountSandbox,
            // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
            async () => render({ appContent, loading: false }),
            mount,
          ],
          unmount: [
            unmount,
            unmountSandbox,
            async () => {
              if (afterUnloadHooks.length) {
                await Promise.all(afterUnloadHooks.map(hook => hook(app)));
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
