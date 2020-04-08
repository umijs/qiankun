/**
 * @author Kuitos
 * @since 2020-04-01
 */

import { importEntry } from 'import-html-entry';
import { concat, mergeWith } from 'lodash';
import { LifeCycles, ParcelConfigObject } from 'single-spa';
import getAddOns from './addons';
import { FrameworkConfiguration, FrameworkLifeCycles, HTMLContentRender, LifeCycleFn, LoadableApp } from './interfaces';
import { genSandbox } from './sandbox';
import { Deferred, getDefaultTplWrapper, getWrapperId, validateExportLifecycle } from './utils';
import { Store } from './store';

function assertElementExist(element: Element | null | undefined, id?: string, msg?: string) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }

    throw new Error(`[qiankun] container element with ${id} is not existed!`);
  }
}

function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain<T extends object>(hooks: Array<LifeCycleFn<T>>, app: LoadableApp<T>): Promise<any> {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app)), Promise.resolve());
  }

  return Promise.resolve();
}

async function validateSingularMode<T extends object>(
  validate: FrameworkConfiguration['singular'],
  app: LoadableApp<T>,
): Promise<boolean> {
  return typeof validate === 'function' ? validate(app) : !!validate;
}

function createElement(appContent: string, cssIsolation: boolean): HTMLElement {
  const containerElement = document.createElement('div');
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div
  const appElement = containerElement.firstChild as HTMLElement;
  if (cssIsolation) {
    const { innerHTML } = appElement;
    appElement.innerHTML = '';
    const shadow = appElement.attachShadow({ mode: 'open' });
    shadow.innerHTML = innerHTML;
  }

  return appElement;
}

/** generate app wrapper dom getter */
function getAppWrapperGetter(
  appInstanceId: string,
  useLegacyRender: boolean,
  cssIsolation: boolean,
  elementGetter: () => HTMLElement | null,
) {
  return () => {
    if (useLegacyRender) {
      if (cssIsolation) throw new Error('[qiankun]: cssIsolation must not be used with legacyRender');

      const appWrapper = document.getElementById(getWrapperId(appInstanceId));
      assertElementExist(appWrapper, appInstanceId);
      return appWrapper!;
    }

    const element = elementGetter();
    assertElementExist(element, appInstanceId);

    if (cssIsolation) {
      return element!.shadowRoot!;
    }

    return element!;
  };
}

const rawAppendChild = HTMLElement.prototype.appendChild;
const rawRemoveChild = HTMLElement.prototype.removeChild;
type ElementRender = (props: { element: HTMLElement | null; loading: boolean }) => any;

/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appContent
 * @param container
 * @param legacyRender
 */
function getRender(appContent: string, container?: string | HTMLElement, legacyRender?: HTMLContentRender) {
  const render: ElementRender = ({ element, loading }) => {
    if (legacyRender) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[qiankun] Custom rendering function is deprecated, you can use the container element setting instead!',
        );
      }

      return legacyRender({ loading, appContent: element ? appContent : '' });
    }

    const containerElement = typeof container === 'string' ? document.querySelector(container) : container;
    assertElementExist(
      containerElement,
      '',
      `[qiankun] target container with ${container} not existed while rendering!`,
    );

    if (!containerElement!.contains(element)) {
      // clear the container
      while (containerElement!.firstChild) {
        rawRemoveChild.call(containerElement, containerElement!.firstChild);
      }

      // append the element to container if it exist
      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

const appExportPromiseCaches: Record<string, Promise<LifeCycles>> = {};
const appInstanceCounts: Record<string, number> = {};
let prevAppUnmountedDeferred: Deferred<void>;

export async function loadApp<T extends object>(
  app: LoadableApp<T>,
  configuration: FrameworkConfiguration = {},
  store: Store,
  lifeCycles?: FrameworkLifeCycles<T>,
): Promise<ParcelConfigObject> {
  const { entry, name: appName, render: legacyRender, container } = app;
  const { singular = true, jsSandbox = true, cssIsolation = false, ...importEntryOpts } = configuration;

  // get the entry html content and script executor
  const { template, execScripts, assetPublicPath } = await importEntry(entry, importEntryOpts);

  // as single-spa load and bootstrap new app parallel with other apps unmounting
  // (see https://github.com/CanopyTax/single-spa/blob/master/src/navigation/reroute.js#L74)
  // we need wait to load the app until all apps are finishing unmount in singular mode
  if (await validateSingularMode(singular, app)) {
    await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
  }

  const appInstanceId = `${appName}_${
    appInstanceCounts.hasOwnProperty(appName) ? (appInstanceCounts[appName] ?? 0) + 1 : 0
  }`;

  const appContent = getDefaultTplWrapper(appInstanceId)(template);
  let element: HTMLElement | null = createElement(appContent, cssIsolation);

  const render = getRender(appContent, container, legacyRender);

  // 第一次加载设置应用可见区域 dom 结构
  // 确保每次应用加载前容器 dom 结构已经设置完毕
  render({ element, loading: true });

  const containerGetter = getAppWrapperGetter(appInstanceId, !!legacyRender, cssIsolation, () => element);

  let global: Window = window;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  if (jsSandbox) {
    const sandbox = genSandbox(appName, containerGetter, Boolean(singular));
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

  // cache the execScripts returned promise
  if (!appExportPromiseCaches[appName]) {
    appExportPromiseCaches[appName] = execScripts(global, !singular);
  }

  // get the lifecycle hooks from module exports
  const scriptExports: any = await appExportPromiseCaches[appName];
  let bootstrap;
  let mount: any;
  let unmount: any;

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
      delete appExportPromiseCaches[appName];
      throw new Error(`[qiankun] You need to export lifecycle functions in ${appName} entry`);
    }
  }

  return {
    name: appInstanceId,
    bootstrap: [bootstrap],
    mount: [
      async () => {
        if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
          return prevAppUnmountedDeferred.promise;
        }

        return undefined;
      },
      // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
      async () => {
        // element would be destroyed after unmounted, we need to recreate it if it not exist
        element = element || createElement(appContent, cssIsolation);
        render({ element, loading: true });
      },
      // exec the chain after rendering to keep the behavior with beforeLoad
      async () => execHooksChain(toArray(beforeMount), app),
      mountSandbox,
      async props => mount({ ...props, container: containerGetter(), store: store.getMethods(appInstanceId) }),
      // 应用 mount 完成后结束 loading
      async () => render({ element, loading: false }),
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
      async props => unmount({ ...props, container: containerGetter() }),
      unmountSandbox,
      async () => execHooksChain(toArray(afterUnmount), app),
      async () => {
        render({ element: null, loading: false });
        store.unmout(appInstanceId);
        // for gc
        element = null;
      },
      async () => {
        if ((await validateSingularMode(singular, app)) && prevAppUnmountedDeferred) {
          prevAppUnmountedDeferred.resolve();
        }
      },
    ],
  };
}
