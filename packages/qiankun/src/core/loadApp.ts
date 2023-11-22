/**
 * @author Kuitos
 * @since 2023-04-25
 */
import type { LoaderOpts } from '@qiankunjs/loader';
import { loadEntry } from '@qiankunjs/loader';
import type { Sandbox } from '@qiankunjs/sandbox';
import { createSandboxContainer } from '@qiankunjs/sandbox';
import { moduleResolver as defaultModuleResolver, transpileAssets, wrapFetchWithCache } from '@qiankunjs/shared';
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
    const moduleResolver = (url: string) => defaultModuleResolver(url, sandboxMicroAppContainer, document.head);
    return transpileAssets(node, entry, { ...opts, moduleResolver });
  };
  const {
    fetch = window.fetch,
    sandbox = true,
    globalContext = window,
    nodeTransformer = defaultNodeTransformer,
    ...restConfiguration
  } = configuration || {};

  const fetchWithLruCache = wrapFetchWithCache(fetch);

  const markName = `[qiankun] App ${appName} Loading`;
  if (process.env.NODE_ENV === 'development') {
    performanceMark(markName);
  }

  let global = globalContext;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  let sandboxInstance: Sandbox | undefined;

  let sandboxMicroAppContainer: HTMLElement = container;
  initContainer(sandboxMicroAppContainer, appName, sandbox);

  if (sandbox) {
    const sandboxContainer = createSandboxContainer(appName, () => sandboxMicroAppContainer, {
      globalContext,
      extraGlobals: {},
      fetch: fetchWithLruCache,
      nodeTransformer,
    });

    sandboxInstance = sandboxContainer.instance;
    global = sandboxInstance.globalThis;

    mountSandbox = () => sandboxContainer.mount();
    unmountSandbox = () => sandboxContainer.unmount();
  }

  const containerOpts: LoaderOpts = {
    fetch: fetchWithLruCache,
    sandbox: sandboxInstance,
    nodeTransformer,
    ...restConfiguration,
  };

  const lifecyclesPromise = loadEntry<MicroAppLifeCycles>(entry, sandboxMicroAppContainer, containerOpts);

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
  if (!lifecycles) throw new QiankunError(`${appName} entry ${entry} load failed as it not export lifecycles`);
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    lifecycles,
    appName,
    global,
    sandboxInstance?.latestSetProp,
  );

  let mountTimes = 1;

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
          sandboxMicroAppContainer = mountContainer;

          // while the micro app is remounting, we need to load the entry manually
          if (mountTimes > 1) {
            initContainer(mountContainer, appName, sandbox);
            // html scripts should be removed to avoid repeatedly execute
            const htmlString = await getPureHTMLStringWithoutScripts(entry, fetchWithLruCache);
            await loadEntry(htmlString, mountContainer, containerOpts);
          }
        },
        mountSandbox,
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

function initContainer(container: HTMLElement, appName: string, sandboxCfg: AppConfiguration['sandbox']): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  container.dataset.name = appName;
  container.dataset.version = version;
  container.dataset.sandboxCfg = JSON.stringify(sandboxCfg);
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
  scriptExports: MicroAppLifeCycles,
  appName: string,
  globalContext: WindowProxy,
  globalLatestSetProp?: PropertyKey,
): MicroAppLifeCycles {
  const validateExportLifecycle = (exports: ObjectType | undefined): boolean => {
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
    console.warn(
      `[qiankun] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`,
    );
  }

  // fallback to globalContext variable who named with ${appName} while module exports not found
  const globalVariableExports = (globalContext as unknown as ObjectType)[appName as never] as MicroAppLifeCycles;

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new QiankunError(`You need to export lifecycle functions in ${appName} entry`);
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
