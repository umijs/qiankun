/**
 * @author Kuitos
 * @since 2019-04-25
 */

import { importEntry } from 'import-html-entry';
import { isFunction } from 'lodash';
import { registerApplication, start as startSpa } from 'single-spa';
import { ActiveRule, RegistrableApp, RenderFunction, StartOpts } from './interfaces';
import { genSandbox } from './sandbox';

import { sleep } from './utils';

export interface Options {
  renderFunction: RenderFunction;
  activeRule: ActiveRule;
}

export function registerMicroApps(apps: RegistrableApp[], options: Options) {

  const { renderFunction, activeRule } = options;

  apps.forEach(app => {

    const { name, entry, props = {} } = app;

    registerApplication(name,

      async () => {

        // 获取入口 html 模板及脚本加载器
        const { template: appContent, execScripts } = await importEntry(entry);
        // 第一次加载设置应用可见区域 dom 结构
        // 确保每次应用加载前容器 dom 结构已经设置完毕
        renderFunction({ appContent, loading: true });

        const { sandbox, mount: mountSandbox, unmount: unmountSandbox } = genSandbox(name);
        // 等待 300 ms，确保菜单切换动画完成
        await sleep(300);
        // 获取 模块/应用 导出的 lifecycle hooks
        const { bootstrap: bootstrapApp, mount, unmount } = await execScripts(sandbox);
        if (!isFunction(bootstrapApp) || !isFunction(mount) || !isFunction(unmount)) {
          throw new Error(`You need to export the functional lifecycles in ${name} entry`);
        }

        return {
          bootstrap: [bootstrapApp],
          mount: [
            mountSandbox,
            // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
            async () => renderFunction({ appContent, loading: false }),
            mount,
          ],
          unmount: [
            unmount,
            unmountSandbox,
          ],
        };
      },

      () => activeRule(app),
      props,
    );
  });
}

export function start(opts: StartOpts) {

  const { prefetch = true, jsSandbox = true } = opts;
  if (prefetch) {
    console.log('start prefetch');
    // prefetchEntry();
  }

  if (jsSandbox) {
    console.log('start js sandbox');
  }

  startSpa();
}
