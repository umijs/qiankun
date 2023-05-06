/**
 * @author Kuitos
 * @since 2023-04-25
 */
import { loadEntry } from '@qiankunjs/loader';
import type { Sandbox } from '@qiankunjs/sandbox';
import { createSandboxContainer } from '@qiankunjs/sandbox';
import { transpileAssets } from '@qiankunjs/shared';
import { concat, isFunction, mergeWith } from 'lodash';
import type { ParcelConfigObject } from 'single-spa';
import getAddOns from './addons';
import { QiankunError } from './error';
import type { AppConfiguration, LifeCycleFn, LifeCycles, LoadableApp, ObjectType } from './types';
import { performanceGetEntriesByName, performanceMark, performanceMeasure, toArray } from './utils';

export type ParcelConfigObjectGetter = (remountContainer?: string | HTMLElement) => ParcelConfigObject;

export default async function <T extends ObjectType>(
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

  if (sandbox) {
    const sandboxContainer = createSandboxContainer(appName, () => container, { globalContext, extraGlobals: {} });

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
  } = mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, (v1, v2) => concat(v1 ?? [], v2 ?? []));

  await execHooksChain(toArray(beforeLoad), app, global);

  await loadEntry(entry, container, {
    nodeTransformer: sandbox
      ? <K extends Node>(node: K) => transpileAssets<K>(node, entry, { fetch, sandbox: sandboxInstance })
      : undefined,
  });

  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    {},
    appName,
    global,
    sandboxInstance?.latestSetProp,
  );

  const parcelConfigGetter: ParcelConfigObjectGetter = (mountContainer = container) => {
    const parcelConfig: ParcelConfigObject = {
      name: appName,

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
      ],

      unmount: [
        async () => execHooksChain(toArray(beforeUnmount), app, global),
        async (props) => unmount({ ...props, container: mountContainer }),
        unmountSandbox,
        async () => execHooksChain(toArray(afterUnmount), app, global),
      ],
    };

    if (typeof update === 'function') {
      parcelConfig.update = update;
    }

    return parcelConfig;
  };

  return parcelConfigGetter;
}

function execHooksChain<T extends ObjectType>(
  hooks: Array<LifeCycleFn<T>>,
  app: LoadableApp<T>,
  global: WindowProxy = window,
): Promise<any> {
  if (hooks.length) {
    return hooks.reduce((chain, hook) => chain.then(() => hook(app, global)), Promise.resolve());
  }

  return Promise.resolve();
}

function getLifecyclesFromExports(
  scriptExports: LifeCycles<any>,
  appName: string,
  globalContext: WindowProxy,
  globalLatestSetProp?: PropertyKey,
) {
  const validateExportLifecycle = (exports: any) => {
    const { bootstrap, mount, unmount } = exports ?? {};
    return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
  };

  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }

  // fallback to sandbox latest set property if it had
  if (globalLatestSetProp) {
    const lifecycles = (<any>globalContext)[globalLatestSetProp];
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
  const globalVariableExports = (globalContext as any)[appName];

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
