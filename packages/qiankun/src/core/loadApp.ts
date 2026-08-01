/**
 * @author Kuitos
 * @since 2023-04-25
 */
import type { LoaderOpts } from '@qiankunjs/loader';
import { loadEntry } from '@qiankunjs/loader';
import type { Sandbox, SandboxController } from '@qiankunjs/sandbox';
import { createSandbox, nativeGlobal } from '@qiankunjs/sandbox';
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
import type { ParcelConfigObject } from '@qiankunjs/single-spa';
import getAddOns from '../addons';
import { QiankunError } from '../error';
import type {
  AppConfiguration,
  LifeCycleFn,
  LifeCycles,
  LoadableApp,
  MicroAppLifeCycles,
  ObjectType,
  SandboxConfiguration,
} from '../types';
import {
  getPureHTMLStringWithoutScripts,
  performanceGetEntriesByName,
  performanceMark,
  performanceMeasure,
  toArray,
} from '../utils';

declare const __QIANKUN_VERSION__: string;

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
    nodeTransformer = defaultNodeTransformer,
    ...restConfiguration
  } = configuration || {};

  const sandboxEnabled = sandbox !== false;
  const sandboxConfiguration: SandboxConfiguration = typeof sandbox === 'object' ? sandbox : {};
  const {
    globals = {},
    incubatorContext = window,
    plugins = [],
    styleIsolation: styleIsolationEnabled,
    ...compartmentHooks
  } = sandboxConfiguration;

  const enhancedFetch = makeFetchCacheable(makeFetchRetryable(makeFetchThrowable(fetch)));

  const markName = `[qiankun] App ${appName} Loading`;
  if (process.env.NODE_ENV === 'development') {
    performanceMark(markName);
  }

  let global = incubatorContext;
  let mountSandbox: (container: HTMLElement) => Promise<void> = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  let sandboxInstance: Sandbox | undefined;
  let sandboxController: SandboxController | undefined;
  let resolvedNodeTransformer = nodeTransformer;
  const instanceId = genInstanceId(appName);
  let mountTimes = 1;

  let microAppDOMContainer: HTMLElement = container;
  initContainer(microAppDOMContainer, { sandboxCfg: sandbox, mountTimes, instanceId });
  if (!sandboxEnabled) microAppDOMContainer.dataset.name = appName;

  if (sandboxEnabled) {
    sandboxController = createSandbox(appName, {
      container: () => microAppDOMContainer,
      compartmentOptions: {
        moduleHost: {
          entryUrl: entry,
          instanceId,
          materializeRedirect: (url) => defaultModuleResolver(url, microAppDOMContainer, document.head)?.url,
          isLifecycleNamespace: (namespace) =>
            isLifecycleObject(namespace) || isLifecycleObject(namespace.default as ObjectType),
        },
      },
      globals,
      incubatorContext,
      fetch: enhancedFetch,
      nodeTransformer,
      plugins,
      styleIsolation: styleIsolationEnabled,
      ...compartmentHooks,
    });

    sandboxInstance = sandboxController.instance;
    resolvedNodeTransformer = sandboxController.nodeTransformer;
    global = sandboxInstance.globalThis;

    mountSandbox = (domContainer) => sandboxController!.mount(domContainer);
    unmountSandbox = () => sandboxController!.unmount();
  }

  if (instanceId > 1) {
    removeWebpackChunkCacheWhenAppHaveMultiInstance(appName);
  }

  const containerOpts: LoaderOpts = {
    compartment: sandboxInstance,
    fetch: enhancedFetch,
    nodeTransformer: resolvedNodeTransformer,
    ...restConfiguration,
  };
  const lifecycleSetup = await (async () => {
    let lifecyclesPromise: Promise<MicroAppLifeCycles | undefined> | undefined;
    try {
      lifecyclesPromise = loadEntry<MicroAppLifeCycles>(entry, microAppDOMContainer, containerOpts);

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
      return {
        afterMount,
        afterUnmount,
        beforeMount,
        beforeUnmount,
        ...getLifecyclesFromExports(lifecycles, appName, global, sandboxInstance?.latestSetProp),
      };
    } catch (error) {
      // beforeLoad may fail while the concurrently started entry pipeline is still pending.
      // Observe its eventual rejection, then permanently abort the sandbox without masking
      // the load/lifecycle error that caused this path.
      void lifecyclesPromise?.catch(() => undefined);
      try {
        await sandboxController?.dispose();
      } catch {
        // The original load error is the actionable failure and must retain precedence.
      }
      throw error;
    }
  })();
  const { bootstrap, mount, unmount, update, beforeUnmount, afterUnmount, afterMount, beforeMount } = lifecycleSetup;

  return (mountContainer) => {
    const parcelConfig: ParcelConfigObject = {
      name: appName,

      // MicroAppLifeCycles types every lifecycle with `container` props, but single-spa only
      // passes it to the mount/unmount wrappers below (via closure); bootstrap runs before any
      // container exists, so its narrower props type is asserted away here
      bootstrap: bootstrap as ParcelConfigObject['bootstrap'],

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

          // The entry html must be reloaded manually while remounting. mountTimes alone can not tell:
          // a failed first mount leaves mountTimes at 1, yet the retry (usually on a freshly keyed
          // container, or after unmount cleared it) starts from an uninitialized container — tracked
          // explicitly rather than inferred from the DOM, since markup noise (whitespace text nodes,
          // framework placeholder comments) would fool an emptiness check
          if (mountTimes > 1 || !initializedContainers.has(mountContainer)) {
            initContainer(mountContainer, { sandboxCfg: sandbox, mountTimes, instanceId });
            if (!sandboxEnabled) mountContainer.dataset.name = appName;
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
        async (props) => {
          await mount({ ...props, container: mountContainer });
        },
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
        async (props) => {
          await unmount({ ...props, container: mountContainer });
        },
        unmountSandbox,
        async () => execHooksChain(toArray(afterUnmount), app, global),
        async () => {
          clearContainer(mountContainer);
        },
      ],

      // Registered-application unload = the app is fully torn down (not just deactivated), the
      // right time to release the Compartment module mechanism and blob URLs. Root parcels ignore
      // this extra lifecycle and keep the same module namespaces across their remount cache.
      unload: [
        async () => {
          await sandboxController?.dispose();
        },
      ],
    };

    if (typeof update === 'function') {
      // same props-type mismatch as bootstrap above: update receives parcel customProps at runtime
      parcelConfig.update = update as ParcelConfigObject['update'];
    }

    return parcelConfig;
  };
}

/**
 * Containers that hold (or are being filled with) their app's entry content. Membership is the
 * remount-reload signal: initContainer adds, clearContainer removes, so a failed-mount retry on a
 * cleared or freshly keyed container reliably reloads the entry html.
 */
const initializedContainers = new WeakSet<HTMLElement>();

function initContainer(
  container: HTMLElement,
  opts: { sandboxCfg: AppConfiguration['sandbox']; mountTimes: number; instanceId: number },
): void {
  const { sandboxCfg, mountTimes, instanceId } = opts;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  initializedContainers.add(container);

  container.dataset.version = __QIANKUN_VERSION__;
  // The sandbox configuration object may carry functions and large globals — store a
  // debug-friendly summary instead of serializing it verbatim.
  container.dataset.sandboxCfg = JSON.stringify(
    typeof sandboxCfg === 'object' ? { enabled: true, styleIsolation: Boolean(sandboxCfg.styleIsolation) } : sandboxCfg,
  );

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
  initializedContainers.delete(container);
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

function isLifecycleObject(exports: ObjectType | undefined): exports is MicroAppLifeCycles {
  const { bootstrap, mount, unmount } = exports ?? {};
  return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
}

function getLifecyclesFromExports(
  scriptExports: MicroAppLifeCycles | undefined,
  appName: string,
  globalContext: WindowProxy,
  globalLatestSetProp?: PropertyKey,
): MicroAppLifeCycles {
  const validateExportLifecycle = isLifecycleObject;

  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }

  // ESM entry that exports its lifecycles as a default object: `export default { bootstrap, mount, unmount }`
  // (a supported single-spa convention the classic latestSetProp path never had to handle)
  const defaultExport = (scriptExports as ObjectType | undefined)?.default as MicroAppLifeCycles | undefined;
  if (validateExportLifecycle(defaultExport)) {
    return defaultExport;
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
