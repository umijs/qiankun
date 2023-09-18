/**
 * @author Kuitos
 * @since 2023-04-25
 */
import type { ImportOpts } from '@qiankunjs/loader';
import { loadEntry } from '@qiankunjs/loader';
import type { Sandbox } from '@qiankunjs/sandbox';
import { createSandboxContainer } from '@qiankunjs/sandbox';
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

export type ParcelConfigObjectGetter = (remountContainer: HTMLElement) => ParcelConfigObject;

export default async function loadApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
) {
  const { name: appName, entry, container } = app;
  const { fetch = window.fetch, sandbox, globalContext = window } = configuration || {};

  const markName = `[qiankun] App ${appName} Loading`;
  if (process.env.NODE_ENV === 'development') {
    performanceMark(markName);
  }

  let global = globalContext;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  let sandboxInstance: Sandbox | undefined;

  let microAppContainer: HTMLElement = container;
  clearContainer(microAppContainer);

  if (sandbox) {
    const sandboxContainer = createSandboxContainer(appName, () => microAppContainer, {
      globalContext,
      extraGlobals: {},
    });

    sandboxInstance = sandboxContainer.instance;
    global = sandboxInstance.globalThis;

    mountSandbox = () => sandboxContainer.mount();
    unmountSandbox = () => sandboxContainer.unmount();
  }

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

  await execHooksChain(toArray(beforeLoad), app, global);

  const containerOpts: ImportOpts = { fetch, sandbox: sandboxInstance };

  const lifecycles = await loadEntry<MicroAppLifeCycles>(entry, microAppContainer, containerOpts);

  if (!lifecycles) throw new QiankunError(`${appName} entry ${entry} load failed as it not export lifecycles`);

  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    lifecycles,
    appName,
    global,
    sandboxInstance?.latestSetProp,
  );

  const parcelConfigGetter: ParcelConfigObjectGetter = (remountContainer) => {
    microAppContainer = remountContainer;

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
          // if micro app container has no children that means now is remounting, we need to rerender the app manually
          if (microAppContainer.firstChild === null) {
            const htmlString = await getPureHTMLStringWithoutScripts(entry, fetch);
            await loadEntry(htmlString, microAppContainer, containerOpts);
          }
        },
        mountSandbox,
        // exec the chain after rendering to keep the behavior with beforeLoad
        async () => execHooksChain(toArray(beforeMount), app, global),
        async (props) => mount({ ...props, container: microAppContainer }),
        // finish loading after app mounted
        async () => execHooksChain(toArray(afterMount), app, global),
        async () => {
          if (process.env.NODE_ENV === 'development') {
            const measureName = `[qiankun] App ${appName} Loading Consuming`;
            performanceMeasure(measureName, markName);
          }
        },
      ],

      unmount: [
        async () => execHooksChain(toArray(beforeUnmount), app, global),
        async (props) => unmount({ ...props, container: microAppContainer }),
        unmountSandbox,
        async () => execHooksChain(toArray(afterUnmount), app, global),
        async () => {
          clearContainer(microAppContainer);
          // for gc
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          microAppContainer = null;
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

  return parcelConfigGetter;
}

function clearContainer(container: HTMLElement) {
  if (!container) {
    throw new QiankunError('container is not existed');
  }

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
