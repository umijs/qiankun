/**
 * @author Kuitos
 * @since 2019-04-25
 */

import { importEntry } from 'import-html-entry';
import { isFunction } from 'lodash';
import { registerApplication, start as startSpa } from 'single-spa';
import { RegistrableApp, StartOpts } from './interfaces';
import { genSandbox } from './sandbox';

import { sleep } from './utils';

interface Options {
  beforeLoadHooks?: Array<(app: RegistrableApp) => Promise<void>>; // function before app load
  afterUnloadHooks?: Array<(app: RegistrableApp) => Promise<void>>; // function after app unmount
}

export function registerMicroApps(apps: RegistrableApp[], options: Options = {}) {

  const { beforeLoadHooks = [], afterUnloadHooks = [] } = options;

  apps.forEach(app => {

    const { name, entry, render, activeRule, props = {} } = app;

    registerApplication(name,

      async () => {

        // 获取入口 html 模板及脚本加载器
        const { template: appContent, execScripts } = await importEntry(entry);
        // 第一次加载设置应用可见区域 dom 结构
        // 确保每次应用加载前容器 dom 结构已经设置完毕
        render({ appContent, loading: true });

        if (beforeLoadHooks.length) {
          await Promise.all(beforeLoadHooks.map(hook => hook(app)));
        }

        let jsSandbox = window;
        let mountSandbox = () => Promise.resolve();
        let unmountSandbox = () => Promise.resolve();
        if (useJsSandbox) {
          const { sandbox, mount, unmount } = genSandbox(name);
          jsSandbox = sandbox;
          mountSandbox = mount;
          unmountSandbox = unmount;
        }

        // 等待 300 ms，确保菜单切换动画完成
        await sleep(300);

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

let useJsSandbox = true;

export function start(opts: StartOpts = {}) {

  const { prefetch = true, jsSandbox = true } = opts;
  if (prefetch) {
    console.log('start prefetch');
    // prefetchEntry();
  }

  if (jsSandbox) {
    useJsSandbox = jsSandbox;
  }

  startSpa();
}
