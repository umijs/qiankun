/**
 * @author Kuitos
 * @since 2023-04-25
 */
import type { LoaderOpts } from '@qiankunjs/loader';
import { loadEntry } from '@qiankunjs/loader';
import type { Sandbox } from '@qiankunjs/sandbox';
import { createSandboxContainer, nativeGlobal } from '@qiankunjs/sandbox';
import {
  defineProperty,
  hasOwnProperty,
  makeFetchCacheable,
  makeFetchRetryable,
  makeFetchThrowable,
  moduleResolver as defaultModuleResolver,
  transpileAssets,
  warn,
} from '@qiankunjs/shared';
import { concat, isFunction, mergeWith } from 'lodash';
import type { ParcelConfigObject } from 'single-spa';
import getAddOns from '../addons';
import { QiankunError } from '../error';
import type { AppConfiguration, LifeCycleFn, LifeCycles, LoadableApp, MicroAppLifeCycles, ObjectType } from '../types';
import {
  getPureHTMLStringWithoutScripts,
  performanceGetEntriesByName,
  performanceMark,
  performanceMeasure,
  toArray,
} from '../utils';
import { version } from '../version';

export type ParcelConfigObjectGetter = (remountContainer: HTMLElement) => ParcelConfigObject;

export default async function loadApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): Promise<ParcelConfigObjectGetter> {
  const { name: appName, entry, container } = app;
  const defaultNodeTransformer: AppConfiguration['nodeTransformer'] = (node, opts) => {
    const moduleResolver = (url: string) => defaultModuleResolver(url, microAppDOMContainer, document.head);
    return transpileAssets(node, entry, { ...opts, moduleResolver });
  };
  const {
    fetch = window.fetch,
    sandbox = true,
    globalContext = window,
    nodeTransformer = defaultNodeTransformer,
    ...restConfiguration
  } = configuration || {};

  const enhancedFetch = makeFetchCacheable(makeFetchRetryable(makeFetchThrowable(fetch)));

  const markName = `[qiankun] App ${appName} Loading`;
  if (process.env.NODE_ENV === 'development') {
    performanceMark(markName);
  }

  let global = globalContext;
  let mountSandbox: (container: HTMLElement) => Promise<void> = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  let sandboxInstance: Sandbox | undefined;
  const instanceId = genInstanceId(appName);
  let mountTimes = 1;

  let microAppDOMContainer: HTMLElement = container;
  initContainer(microAppDOMContainer, appName, { sandboxCfg: sandbox, mountTimes, instanceId });

  if (sandbox) {
    const sandboxContainer = createSandboxContainer(appName, () => microAppDOMContainer, {
      globalContext,
      extraGlobals: {},
      fetch: enhancedFetch,
      nodeTransformer,
    });

    sandboxInstance = sandboxContainer.instance;
    global = sandboxInstance.globalThis;

    mountSandbox = (domContainer) => sandboxContainer.mount(domContainer);
    unmountSandbox = () => sandboxContainer.unmount();
  }

  if (instanceId > 1) {
    removeWebpackChunkCacheWhenAppHaveMultiInstance(appName);
  }

  const containerOpts: LoaderOpts = {
    fetch: enhancedFetch,
    sandbox: sandboxInstance,
    nodeTransformer,
    ...restConfiguration,
  };
  const lifecyclesPromise = loadEntry<MicroAppLifeCycles>(entry, microAppDOMContainer, containerOpts);

  const assetPublicPath = calcPublicPath(entry);
  const {
    beforeUnmount = [],
    afterUnmount = [],
    afterMount = [],
    beforeMount = [],
    beforeLoad = [],
  } = mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, (v1, v2) =>
    concat((v1 ?? []) as LifeCycleFn<T>, (v2 ?? []) as LifeCycleFn<T>),
  );
  // FIXME Due to the asynchronous execution of loadEntry, the DOM of the sub-app is inserted synchronously through appendChild, and inline scripts are also executed synchronously. Therefore, the beforeLoad may need to rely on transformer configuration to coordinate and ensure the order of asynchronous operations.
  await execHooksChain(toArray(beforeLoad), app, global);

  const lifecycles = await lifecyclesPromise;
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    lifecycles,
    appName,
    global,
    sandboxInstance?.latestSetProp,
  );

  return (mountContainer) => {
    const parcelConfig: ParcelConfigObject = {
      name: appName,

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bootstrap,

      mount: [
        async () => {
          if (process.env.NODE_ENV === 'development') {
            const marks = performanceGetEntriesByName(markName, 'mark');
            // mark length is zero means the app is remounting
            if (marks && !marks.length) {
              performanceMark(markName);
            }
          }
        },
        async () => {
          microAppDOMContainer = mountContainer;

          // while the micro app is remounting, we need to load the entry manually
          if (mountTimes > 1) {
            initContainer(mountContainer, appName, { sandboxCfg: sandbox, mountTimes, instanceId });
            // html scripts should be removed to avoid repeatedly execute
            const htmlString = await getPureHTMLStringWithoutScripts(entry, enhancedFetch);
            await loadEntry(
              { url: entry, res: new Response(htmlString, { status: 200, statusText: 'OK' }) },
              mountContainer,
              containerOpts,
            );
          }
        },
        async () => {
          await mountSandbox(mountContainer);
        },
        // exec the chain after rendering to keep the behavior with beforeLoad
        async () => execHooksChain(toArray(beforeMount), app, global),
        async (props) => mount({ ...props, container: mountContainer }),
        // finish loading after app mounted
        async () => execHooksChain(toArray(afterMount), app, global),
        async () => {
          if (process.env.NODE_ENV === 'development') {
            const measureName = `[qiankun] App ${appName} Loading Consuming`;
            performanceMeasure(measureName, markName);
          }
        },
        async () => {
          mountTimes++;
        },
      ],

      unmount: [
        async () => execHooksChain(toArray(beforeUnmount), app, global),
        async (props) => unmount({ ...props, container: mountContainer }),
        unmountSandbox,
        async () => execHooksChain(toArray(afterUnmount), app, global),
        async () => {
          clearContainer(mountContainer);
        },
      ],
    };

    if (typeof update === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parcelConfig.update = update;
    }

    return parcelConfig;
  };
}

function initContainer(
  container: HTMLElement,
  appName: string,
  opts: { sandboxCfg: AppConfiguration['sandbox']; mountTimes: number; instanceId: number },
): void {
  const { sandboxCfg, mountTimes, instanceId } = opts;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  container.dataset.name = appName;
  container.dataset.version = version;
  container.dataset.sandboxCfg = JSON.stringify(sandboxCfg);

  if (mountTimes > 1) {
    container.dataset.mountTimes = String(mountTimes);
  }
  if (instanceId > 1) {
    container.dataset.instanceId = String(instanceId);
  }
}

function clearContainer(container: HTMLElement): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function execHooksChain<T extends ObjectType>(
  hooks: Array<LifeCycleFn<T>>,
  app: LoadableApp<T>,
  global: WindowProxy = window,
): Promise<unknown> {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app, global)), Promise.resolve());
  }

  return Promise.resolve();
}

function getLifecyclesFromExports(
  scriptExports: MicroAppLifeCycles | undefined,
  appName: string,
  globalContext: WindowProxy,
  globalLatestSetProp?: PropertyKey,
): MicroAppLifeCycles {
  const validateExportLifecycle = (exports: ObjectType | undefined): exports is MicroAppLifeCycles => {
    const { bootstrap, mount, unmount } = exports ?? {};
    return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
  };

  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }

  // fallback to sandbox latest set property if it had
  if (globalLatestSetProp) {
    const lifecycles = (globalContext as unknown as ObjectType)[globalLatestSetProp as never] as MicroAppLifeCycles;
    if (validateExportLifecycle(lifecycles)) {
      return lifecycles;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    warn(`lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`);
  }

  // fallback to globalContext variable who named with ${appName} while module exports not found
  const globalVariableExports = (globalContext as unknown as ObjectType)[appName as never] as MicroAppLifeCycles;

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new QiankunError(
    `You need to export lifecycle functions in ${appName} entry as neither globalLatestSetProp ${String(
      globalLatestSetProp,
    )} nor window['${appName}'] export correctly`,
  );
}

function calcPublicPath(entry: string): string {
  try {
    const { origin, pathname } = new URL(entry, location.href);
    const paths = pathname.split('/');
    paths.pop();
    return `${origin}${paths.join('/')}/`;
  } catch (e) {
    console.warn(e);
    return '';
  }
}

/**
 * To prevent webpack from skipping reload logic and causing the js not to re-execute when a micro app is loaded multiple times on the same viewport,
 * the data-webpack attribute of the script must be removed.
 * see https://github.com/webpack/webpack/blob/1f13ff9fe587e094df59d660b4611b1bd19aed4c/lib/runtime/LoadScriptRuntimeModule.js#L131-L136
 */
function removeWebpackChunkCacheWhenAppHaveMultiInstance(appName: string): void {
  const mountedSameNameApps = document.querySelectorAll(`[data-name^="${appName}"]`);
  if (mountedSameNameApps.length > 1) {
    mountedSameNameApps.forEach((appContainerElement) => {
      appContainerElement.querySelectorAll('script[src]').forEach((script) => {
        script.removeAttribute('data-webpack');
      });
    });
  }
}

const globalAppInstanceStoreKey = '__agii__';
declare global {
  interface Window {
    // app global instance id
    [globalAppInstanceStoreKey]?: Record<string, number>;
  }
}

function genInstanceId(appName: string): number {
  if (!hasOwnProperty(nativeGlobal, globalAppInstanceStoreKey)) {
    defineProperty(nativeGlobal, globalAppInstanceStoreKey, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: {},
    });
  }
  nativeGlobal[globalAppInstanceStoreKey]![appName] = nativeGlobal[globalAppInstanceStoreKey]![appName]
    ? nativeGlobal[globalAppInstanceStoreKey]![appName] + 1
    : 1;
  return nativeGlobal[globalAppInstanceStoreKey]![appName];
}
