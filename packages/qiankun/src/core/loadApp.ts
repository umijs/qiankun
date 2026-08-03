/**
 * @author Kuitos
 * @since 2023-04-25
 */
import type { LoaderOpts } from '@qiankunjs/loader';
import { loadEntry } from '@qiankunjs/loader';
import type { Sandbox, SandboxController } from '@qiankunjs/sandbox';
import { createSandbox, markNodeForNativePassthrough, nativeGlobal } from '@qiankunjs/sandbox';
import {
  Deferred,
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
import { acquireContainer, isContainerHeld, type ContainerHold } from './containerOccupancy';

declare const __QIANKUN_VERSION__: string;

export type ParcelConfigObjectGetter = (remountContainer: HTMLElement) => ParcelConfigObject;

export default async function loadApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): Promise<ParcelConfigObjectGetter> {
  const { name: appName, entry, container, loader } = app;
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
  // Streamed nodes are finished pipeline output either way. With the sandbox enabled its
  // controller transformer stamps them for native passthrough; without one loadApp stamps here,
  // so a residual patched mount point — a broken predecessor's leftover instance-method patches
  // after a failed unmount — cannot hijack them into the dead app's dynamic pipeline (see
  // sandbox/src/core/nativePassthrough.ts).
  let resolvedNodeTransformer: AppConfiguration['nodeTransformer'] = (node, transformerOpts) => {
    const transformedNode = nodeTransformer(node, transformerOpts);
    markNodeForNativePassthrough(transformedNode);
    return transformedNode;
  };
  const instanceId = genInstanceId(appName);
  let mountTimes = 1;

  let microAppDOMContainer: HTMLElement = container;

  // Pre-warm the entry request only when the gate is about to make us wait: makeFetchCacheable
  // dedupes it with loadEntry's own fetch, so the network time overlaps the predecessor's
  // teardown. Uncontended loads skip it — their loadEntry fetches immediately anyway, and a
  // spare request would only double the retry work on failing entries and buffer an unread
  // body. Failures are swallowed here — loadEntry's own fetch surfaces them on the proper path.
  if (isContainerHeld(microAppDOMContainer)) {
    void enhancedFetch(entry).catch(() => undefined);
  }

  // ① load-phase streaming critical section: acquired before the container wipe below, released
  // once both the entry lifecycles promise and the DOM stream have settled (see the gate RFC).
  const loadHold = await acquireContainer(microAppDOMContainer, appName);
  // Flips when the mount hook adopts the still-open load hold as its mount hold ② (see the
  // mount chain below) — from then on the hold is the mount's to release, not the settle latch's.
  let loadHoldAdoptedByMount = false;
  const containerInitToken: ContainerInitToken = Symbol(appName);

  try {
    initContainer(microAppDOMContainer, {
      sandboxCfg: sandbox,
      mountTimes,
      instanceId,
      initToken: containerInitToken,
    });
    if (!sandboxEnabled) microAppDOMContainer.dataset.name = appName;

    if (sandboxEnabled) {
      sandboxController = createSandbox(appName, {
        container: () => microAppDOMContainer,
        // the streaming loader materializes the container structure from the entry HTML (including
        // its <qiankun-head>) — the entry decides whether a head exists, the sandbox provisions none
        provisionContainerHead: false,
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
  } catch (error) {
    // Anything thrown between the acquire above and the release wiring below (a sandbox plugin
    // bootstrap error rethrown by createSandbox, the multi-instance chunk-cache sweep) would
    // otherwise leak the hold forever and starve every later acquirer of this container.
    try {
      await sandboxController?.dispose();
    } catch {
      // The original failure is the actionable one and must retain precedence.
    }
    loadHold.release();
    throw error;
  }

  const containerOpts: LoaderOpts = {
    compartment: sandboxInstance,
    fetch: enhancedFetch,
    nodeTransformer: resolvedNodeTransformer,
    ...restConfiguration,
  };
  /*
   * The load hold must not survive until unmount: single-spa re-checks shouldBeActive after load,
   * so a rapid A→B→A navigation leaves B loaded-but-never-mounted — holding on would starve the
   * container forever. Releasing on load settle alone is not enough either: the entry promise can
   * settle at the entry script's onload while the stream is still writing tail nodes, and a wipe
   * granted in that window would interleave with them. Both signals settle unconditionally, so
   * releasing at their conjunction keeps the gate deadlock-free.
   */
  let entryLifecyclesSettled = false;
  let domStreamSettled = false;
  const releaseLoadHoldWhenSettled = () => {
    // an adopted hold lives on as the mount hold ② and is no longer the latch's to release
    if (entryLifecyclesSettled && domStreamSettled && !loadHoldAdoptedByMount) loadHold.release();
  };
  const markEntryLifecyclesSettled = () => {
    entryLifecyclesSettled = true;
    releaseLoadHoldWhenSettled();
  };

  const lifecycleSetup = await (async () => {
    let lifecyclesPromise: Promise<MicroAppLifeCycles | undefined> | undefined;
    try {
      lifecyclesPromise = loadEntry<MicroAppLifeCycles>(entry, microAppDOMContainer, {
        ...containerOpts,
        onDOMStreamSettled: () => {
          domStreamSettled = true;
          releaseLoadHoldWhenSettled();
        },
      });
      void lifecyclesPromise.then(markEntryLifecyclesSettled, markEntryLifecyclesSettled);

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
    // ② mount→unmount occupancy period. Regular release is the clearContainer step at the end of
    // the unmount chain, but single-spa marks an app SKIP_BECAUSE_BROKEN after a mount OR unmount
    // failure and never runs the rest of its chains — without the failure fallback below, the
    // container would starve every later acquirer. The hold is dropped exactly once: once it is
    // gone, the container may already belong to a later app, so teardown must not touch it —
    // single-spa still runs the unmount chain of a parcel whose mount failed, and its
    // clearContainer would otherwise wipe the successor's DOM.
    //
    // A gap the fallback cannot cover: single-spa lifecycle timeouts with dieOnTimeout reject the
    // chain externally while every hook still resolves, so no guard fires and the hold stays with
    // the abandoned app — equivalent to an app that is never unmounted (the dev waiting diagnosis
    // surfaces it). See the gate RFC's known limitations.
    let mountHold: ContainerHold | undefined;
    const dropMountHold = (): void => {
      if (!mountHold?.held) return;
      // Our claim on the container ends with the hold: evict it (unless a successor already
      // re-initialized the container) so a retry after this failure replays the entry instead of
      // mounting onto stale leftover DOM.
      if (initializedContainers.get(mountContainer) === containerInitToken) {
        initializedContainers.delete(mountContainer);
      }
      mountHold.release();
    };
    const guardHooksWithMountHoldRelease = <F extends (...args: never[]) => Promise<unknown>>(hooks: F[]): F[] =>
      hooks.map(
        (hook) =>
          (async (...args: Parameters<F>) => {
            try {
              return await hook(...args);
            } catch (error) {
              // Tear the sandbox down while still holding ② — a broken chain never reaches its
              // own unmountSandbox step, and the container must not enter a successor's tenure
              // with the dead app's instance-method patches and mount-point tag still on it.
              try {
                await unmountSandbox();
              } catch {
                // The hook failure keeps precedence; the teardown is best-effort.
              }
              dropMountHold();
              throw error;
            }
          }) as F,
      );

    const parcelConfig: ParcelConfigObject = {
      name: appName,

      // MicroAppLifeCycles types every lifecycle with `container` props, but single-spa only
      // passes it to the mount/unmount wrappers below (via closure); bootstrap runs before any
      // container exists, so its narrower props type is asserted away here
      bootstrap: bootstrap as ParcelConfigObject['bootstrap'],

      mount: [
        // The indicator spans the whole chain — the gate wait included — and sits inside the
        // guard wrapping below, so a throwing user indicator releases the hold like any other
        // failing hook instead of leaking it.
        async () => loader?.(true),
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
          // An app whose own load hold ① is still open — its entry stream is still writing,
          // possibly forever (a hung chunked response) — must not queue behind itself: adopt ①
          // as the mount hold ② instead. Pre-gate such an app simply mounted while its stream
          // kept writing; the adoption keeps that shape without weakening cross-app exclusion.
          if (loadHold.held && mountContainer === container) {
            loadHoldAdoptedByMount = true;
            mountHold = loadHold;
          } else {
            // acquired before the remount reload below — that reload is a DOM write and must sit
            // inside the critical section, or a loadMicroApp cross-app remount would still race
            mountHold = await acquireContainer(mountContainer, appName);
          }
        },
        async () => {
          microAppDOMContainer = mountContainer;

          // The entry html must be reloaded manually while remounting. mountTimes alone can not tell:
          // a failed first mount leaves mountTimes at 1, yet the retry (usually on a freshly keyed
          // container, or after unmount cleared it) starts from an uninitialized container — tracked
          // explicitly rather than inferred from the DOM, since markup noise (whitespace text nodes,
          // framework placeholder comments) would fool an emptiness check. The claim must be OUR
          // OWN: a foreign token means another app initialized the container since (a gated
          // interleaving between load settle and this mount), and mounting onto its DOM instead of
          // replaying would crash on a missing root — the replay below runs inside hold ②, so it
          // cannot race whoever wrote the container before.
          if (mountTimes > 1 || initializedContainers.get(mountContainer) !== containerInitToken) {
            initContainer(mountContainer, {
              sandboxCfg: sandbox,
              mountTimes,
              instanceId,
              initToken: containerInitToken,
            });
            if (!sandboxEnabled) mountContainer.dataset.name = appName;
            // html scripts should be removed to avoid repeatedly execute
            const htmlString = await getPureHTMLStringWithoutScripts(entry, enhancedFetch);
            const replayDOMStreamSettled = new Deferred<void>();
            await loadEntry(
              { url: entry, res: new Response(htmlString, { status: 200, statusText: 'OK' }) },
              mountContainer,
              {
                ...containerOpts,
                onDOMStreamSettled: () => replayDOMStreamSettled.resolve(),
              },
            );
            // With every script stripped, the entry promise only settles at full pipe — but that
            // is an invariant of the stripping, not of loadEntry's contract. The explicit await
            // keeps the chain from proceeding to mountSandbox over a half-replayed DOM if the
            // stripping ever changes shape.
            await replayDOMStreamSettled.promise;
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
        async () => loader?.(false),
      ],

      unmount: [
        async () => execHooksChain(toArray(beforeUnmount), app, global),
        async (props) => {
          await unmount({ ...props, container: mountContainer });
        },
        unmountSandbox,
        async () => execHooksChain(toArray(afterUnmount), app, global),
        async () => {
          // only while still holding ②: after a fallback release the container may belong to a
          // later app already, and clearing it here would destroy that app's live DOM
          if (mountHold?.held) {
            clearContainer(mountContainer);
            dropMountHold();
          }
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

    // Both chains stop at their first rejection, so every hook gets the failure fallback — done
    // after construction to keep the literals' contextual typing intact.
    parcelConfig.mount = guardHooksWithMountHoldRelease(toArray(parcelConfig.mount));
    parcelConfig.unmount = guardHooksWithMountHoldRelease(toArray(parcelConfig.unmount));

    if (typeof update === 'function') {
      // Guarded like the chains above: single-spa marks a parcel whose update rejects
      // SKIP_BECAUSE_BROKEN and refuses to unmount it, so nothing downstream would release ②.
      // Same props-type mismatch as bootstrap above: update receives parcel customProps at runtime.
      parcelConfig.update = guardHooksWithMountHoldRelease(toArray(update))[0] as ParcelConfigObject['update'];
    }

    return parcelConfig;
  };
}

/** One loadApp invocation's identity as a container claimant. */
type ContainerInitToken = symbol;

/**
 * Ownership claims over containers that hold (or are being filled with) an app's entry content,
 * keyed by the claiming loadApp invocation's token. The claim is the remount-reload signal: a
 * mount may skip the entry replay only while its own claim is live — a foreign token means
 * another app initialized the container since, a missing one that the container was cleared or
 * the claim evicted by a failure fallback; both must replay.
 */
const initializedContainers = new WeakMap<HTMLElement, ContainerInitToken>();

function initContainer(
  container: HTMLElement,
  opts: {
    sandboxCfg: AppConfiguration['sandbox'];
    mountTimes: number;
    instanceId: number;
    initToken: ContainerInitToken;
  },
): void {
  const { sandboxCfg, mountTimes, instanceId, initToken } = opts;
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  initializedContainers.set(container, initToken);

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
