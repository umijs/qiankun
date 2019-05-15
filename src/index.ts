/**
 * @author Kuitos
 * @since 2019-04-25
 */

import importHTML from 'import-html-entry';
import { isFunction } from 'lodash';
import { registerApplication, start as startSpa } from 'single-spa';
import prefetch from './prefetch';
import { genSandbox } from './sandbox';

import { sleep } from './utils';

export type RenderFunction = (props?: { appContent: string, loading: boolean }) => any;
export type ActiveRule = (app: RegistrableApp) => boolean;
export type RegistrableApp = {
  appName: string; // 应用名(ID)，也可当做应用的产品码来用
  entryHTML: string;  // 应用入口 HTML
  routerPrefix: string; // 应用路由前缀
  props?: object;
};

interface Options {
  renderFunction: RenderFunction;
  activeRule: ActiveRule;
}

export function registerMicroApps(apps: RegistrableApp[], options: Options) {

  const { renderFunction, activeRule } = options;

  apps.forEach(app => {

    const { appName, entryHTML, props = {} } = app;

    // TODO 优化：将 prefetch 移到第一个应用 mount 之后
    prefetch(entryHTML);

    registerApplication(appName,

      async () => {

        // 获取入口 html 模板及脚本加载器
        const { template: appContent, execScripts } = await importHTML(entryHTML);
        // 第一次加载设置应用可见区域 dom 结构
        // 确保每次应用加载前容器 dom 结构已经设置完毕
        renderFunction({ appContent, loading: true });

        const { sandbox, mount: mountSandbox, unmount: unmountSandbox } = genSandbox(appName);
        // 等待 300 ms，确保菜单切换动画完成
        await sleep(300);
        // 获取 模块/应用 导出的 lifecycle hooks
        const { bootstrap: exportedBootstrap, mount, unmount } = await execScripts(sandbox);
        if (!isFunction(exportedBootstrap) || !isFunction(mount) || !isFunction(unmount)) {
          throw new Error(`You need to export the functional lifecycles in ${appName} entry`);
        }

        return {
          bootstrap: [exportedBootstrap],
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

export function start() {
  startSpa();
}
