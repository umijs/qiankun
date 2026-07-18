/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { nativeDocument, nativeGlobal, qiankunHeadTagName } from '../../consts';
import { getDefaultIsolationPlugins } from '../../patchers';
import type { Free, IsolationPlugin, IsolationPluginContext, Rebuild } from '../../patchers/types';
import {
  QiankunError,
  transpileAssets,
  type ImportHook,
  type Modules,
  type NodeTransformer,
  type ResolveHook,
  type StyleIsolationOpts,
} from '@qiankunjs/shared';
import type { CompartmentGlobals, CompartmentOptions } from '../compartment';
import { StandardSandbox } from './StandardSandbox';
import {
  containsLoaderStreamedNode,
  createStyleIsolationOpts,
  ensureSandboxContainerHead,
  prepareSandboxContainerName,
} from './container';
import type { Sandbox } from './types';

export type { Sandbox };
export { StandardSandbox } from './StandardSandbox';
export { prepareSandboxContainer, type SandboxContainerPreparation } from './container';

export interface CreateSandboxOptions {
  /** Providing a container enables DOM containment and dynamic asset interception. */
  container?: HTMLElement | (() => HTMLElement);
  /** The host context that incubates this sandbox (see the ShadowRealm proposal's "incubator realm"). */
  incubatorContext?: WindowProxy;
  globals?: CompartmentGlobals;
  modules?: Modules;
  resolveHook?: ResolveHook;
  importHook?: ImportHook;
  loadHook?: ImportHook;
  plugins?: readonly IsolationPlugin[];
  /**
   * Enable runtime CSS isolation via @scope wrapping: all sandboxed styles are scoped to the
   * container. Dynamically injected styles ride on the sandbox's DOM interception, which is
   * why style isolation requires a configured container.
   */
  styleIsolation?: boolean;
  fetch?: typeof window.fetch;
  nodeTransformer?: NodeTransformer;
  /**
   * Lower-level Compartment host configuration. Promoted top-level options take
   * precedence when the same field is supplied in both places.
   */
  compartmentOptions?: Omit<CompartmentOptions, 'globals' | 'incubatorContext' | 'name'>;
}

export interface SandboxController {
  instance: Sandbox;
  /** The fully configured transformer shared by loaders and dynamic DOM interception. */
  nodeTransformer: NodeTransformer;
  styleIsolation?: StyleIsolationOpts;
  mount(container?: HTMLElement): Promise<void>;
  unmount(): Promise<void>;
  dispose(): Promise<void>;
}

interface CapturedError {
  value: unknown;
}

function normalizeModuleHook(importHook?: ImportHook, loadHook?: ImportHook): ImportHook | undefined {
  if (importHook && loadHook && importHook !== loadHook) {
    throw new QiankunError('importHook and loadHook must reference the same hook when both are provided');
  }
  return importHook ?? loadHook;
}

function releaseSideEffects(frees: readonly Free[]): {
  rebuilds: Rebuild[];
  error?: CapturedError;
} {
  const rebuilds: Rebuild[] = [];
  let firstError: CapturedError | undefined;

  frees.forEach((free) => {
    try {
      rebuilds.push(free());
    } catch (error) {
      firstError ??= { value: error };
    }
  });

  return { rebuilds, error: firstError };
}

async function rebuildSideEffects(
  rebuilds: Rebuild[],
  container: HTMLElement | undefined,
  afterEach?: () => void,
): Promise<void> {
  while (rebuilds.length) {
    await rebuilds[0](container);
    rebuilds.shift();
    afterEach?.();
  }
}

/** Create a lifecycle controller around the standard browser sandbox preset. */
export function createSandbox(appName: string, opts: CreateSandboxOptions = {}): SandboxController {
  const {
    compartmentOptions = {},
    container: containerOption,
    fetch: configuredFetch,
    globals = {},
    importHook: topLevelImportHook,
    incubatorContext = nativeGlobal,
    loadHook: topLevelLoadHook,
    modules = compartmentOptions.modules,
    nodeTransformer: configuredNodeTransformer,
    plugins = [],
    resolveHook = compartmentOptions.resolveHook,
    styleIsolation: styleIsolationEnabled = false,
  } = opts;
  const hasContainer = containerOption !== undefined;
  if (styleIsolationEnabled && !hasContainer) {
    throw new QiankunError(`Sandbox ${appName} requires a container when style isolation is enabled`);
  }

  const hasTopLevelModuleHook = topLevelImportHook !== undefined || topLevelLoadHook !== undefined;
  const moduleHook = normalizeModuleHook(
    hasTopLevelModuleHook ? topLevelImportHook : compartmentOptions.importHook,
    hasTopLevelModuleHook ? topLevelLoadHook : compartmentOptions.loadHook,
  );
  const fetch = configuredFetch ?? compartmentOptions.moduleHost?.fetch ?? nativeGlobal.fetch.bind(nativeGlobal);
  const styleIsolation = styleIsolationEnabled ? createStyleIsolationOpts(appName) : undefined;
  const containerNameCleanups = new Map<HTMLElement, () => void>();
  const containerHeadCleanups = new Map<HTMLElement, Array<() => void>>();
  let mountedContainer: HTMLElement | undefined;
  const getConfiguredContainer = (): HTMLElement | undefined => {
    if (mountedContainer) return mountedContainer;
    if (typeof containerOption === 'function') return containerOption();
    return containerOption;
  };
  const prepareContainerName = (container: HTMLElement): void => {
    if (!containerNameCleanups.has(container)) {
      containerNameCleanups.set(container, prepareSandboxContainerName(container, appName));
    } else {
      container.dataset.name = appName;
    }
  };
  const prepareContainerForMount = (container: HTMLElement): void => {
    prepareContainerName(container);
    if (!container.querySelector(qiankunHeadTagName) && !containsLoaderStreamedNode(container)) {
      const { cleanup } = ensureSandboxContainerHead(container);
      const cleanups = containerHeadCleanups.get(container) ?? [];
      cleanups.push(cleanup);
      containerHeadCleanups.set(container, cleanups);
    }
  };
  const cleanupPreparedContainers = (): void => {
    containerHeadCleanups.forEach((cleanups) => {
      cleanups
        .slice()
        .reverse()
        .forEach((cleanup) => cleanup());
    });
    containerHeadCleanups.clear();
    containerNameCleanups.forEach((cleanup) => cleanup());
    containerNameCleanups.clear();
  };

  const initialContainer = getConfiguredContainer();
  if (initialContainer) prepareContainerName(initialContainer);

  const standardSandboxOptions = {
    ...compartmentOptions,
    importHook: moduleHook,
    loadHook: moduleHook,
    modules,
    resolveHook,
    moduleHost: {
      ...compartmentOptions.moduleHost,
      fetch,
    },
  };

  let sandbox: Sandbox;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (window.Proxy) {
    sandbox = new StandardSandbox(appName, globals, incubatorContext, standardSandboxOptions);
  } else {
    // TODO snapshot sandbox
    sandbox = new StandardSandbox(appName, globals, incubatorContext, standardSandboxOptions);
  }

  const classicScriptTransformer = (source: string, sourceURL?: string) =>
    sandbox.transformClassicScript(source, sourceURL);
  const baseNodeTransformer: NodeTransformer =
    configuredNodeTransformer ??
    ((node, transformerOpts) => transpileAssets(node, nativeDocument.baseURI, transformerOpts));
  const nodeTransformer: NodeTransformer = (node, transformerOpts) => {
    // The JS-only preset owns no container contract, even when a mount received one.
    const container = hasContainer ? getConfiguredContainer() : undefined;
    if (container) prepareContainerName(container);
    return baseNodeTransformer(node, {
      ...transformerOpts,
      classicScriptTransformer,
      compartment: sandbox,
      fetch,
      styleIsolation,
    });
  };
  const pluginContext: IsolationPluginContext = {
    compartment: sandbox,
    appName,
    getContainer: getConfiguredContainer,
    config: {
      fetch,
      nodeTransformer,
      styleIsolation,
    },
  };
  const isolationPlugins = [...getDefaultIsolationPlugins(sandbox.type, hasContainer), ...plugins];

  // Bootstrap plugins are installed before loadEntry starts evaluating application scripts.
  const bootstrappingFrees: Free[] = [];
  try {
    isolationPlugins.forEach((plugin) => {
      if (plugin.bootstrap) {
        bootstrappingFrees.push(plugin.bootstrap(pluginContext));
      }
    });
  } catch (error) {
    releaseSideEffects(bootstrappingFrees);
    sandbox.inactive();
    sandbox.dispose();
    cleanupPreparedContainers();
    throw error;
  }

  // mounting frees are one-off and should be re-init at every mounting time
  let mountingFrees: Free[] = [];
  let bootstrappingRebuilds: Rebuild[] = [];
  let mountingRebuilds: Rebuild[] = [];
  let bootstrappingEffectsActive = bootstrappingFrees.length > 0;
  let mountingEffectsActive = false;
  let mounted = false;
  let disposed = false;
  let mountingPromise: Promise<void> | undefined;
  let unmountingPromise: Promise<void> | undefined;
  let disposePromise: Promise<void> | undefined;

  const disposedError = () => new TypeError(`Sandbox container for ${appName} has been disposed`);
  const assertNotDisposed = () => {
    if (disposed) throw disposedError();
  };

  const dispose = async (): Promise<void> => {
    if (disposePromise) return disposePromise;
    if (disposed) return;
    disposed = true;

    const pendingMount = mountingPromise;
    const pendingUnmount = unmountingPromise;
    const pendingDispose = (async () => {
      // A mount hook can install effects before its promise yields the matching Free.
      // Wait for that operation to observe `disposed`, roll back its local frees, and
      // only then perform the terminal owner cleanup.
      try {
        await pendingMount;
      } catch {
        // The mount caller retains its own failure; disposal still has to finish.
      }
      try {
        await pendingUnmount;
      } catch {
        // The unmount caller retains its own failure; disposal still has to finish.
      }

      const bootstrappingRelease = bootstrappingEffectsActive
        ? releaseSideEffects(bootstrappingFrees)
        : { rebuilds: [], error: undefined };
      const mountingRelease = mountingEffectsActive
        ? releaseSideEffects(mountingFrees)
        : { rebuilds: [], error: undefined };

      bootstrappingEffectsActive = false;
      mountingEffectsActive = false;
      bootstrappingRebuilds = [];
      mountingRebuilds = [];
      bootstrappingFrees.length = 0;
      mountingFrees = [];

      sandbox.inactive();
      sandbox.dispose();
      cleanupPreparedContainers();
      mountedContainer = undefined;
      mounted = false;

      const firstError = bootstrappingRelease.error ?? mountingRelease.error;
      if (firstError) {
        throw firstError.value;
      }
    })();
    disposePromise = pendingDispose;

    try {
      await pendingDispose;
    } finally {
      disposePromise = undefined;
    }
  };

  const mount = async (container: HTMLElement | undefined): Promise<void> => {
    assertNotDisposed();
    if (hasContainer && container) prepareContainerForMount(container);
    /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

    /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
    sandbox.active();
    const installedMountingFrees: Free[] = [];

    try {
      // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state
      if (bootstrappingRebuilds.length > 0) {
        bootstrappingEffectsActive = true;
        await rebuildSideEffects(bootstrappingRebuilds, container, assertNotDisposed);
      }

      /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
      // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用
      for (const plugin of isolationPlugins) {
        if (plugin.mount) {
          // The hook may have installed effects before resolving. Record its Free
          // before checking the terminal flag so the catch path can always undo them.
          installedMountingFrees.push(await plugin.mount(pluginContext));
          assertNotDisposed();
        }
      }

      /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------*/
      // 存在 rebuilds 则表明有些副作用需要重建
      await rebuildSideEffects(mountingRebuilds, container, assertNotDisposed);
      assertNotDisposed();
      mountingFrees = installedMountingFrees;
      mountingEffectsActive = mountingFrees.length > 0;
    } catch (error) {
      // When a rebuild in the middle of the list throws, the release below still frees
      // ALL bootstrap frees, including those whose effects were not rebuilt yet. This
      // relies on the Free contract: a Free must be safe to call (as a no-op) while its
      // effect is not currently installed, deriving what to undo from live state.
      const bootstrappingRelease = bootstrappingEffectsActive
        ? releaseSideEffects(bootstrappingFrees)
        : { rebuilds: [], error: undefined };
      const mountingRelease = releaseSideEffects(installedMountingFrees);
      bootstrappingRebuilds = bootstrappingRelease.rebuilds;
      mountingRebuilds = mountingRelease.rebuilds;
      mountingFrees = [];
      bootstrappingEffectsActive = false;
      mountingEffectsActive = false;
      sandbox.inactive();
      throw error;
    }
  };

  const unmount = async (): Promise<void> => {
    if (disposed) return;

    try {
      await mountingPromise;
    } catch {
      // A failed mount already rolled back every effect it managed to install.
    }
    // `dispose()` can flip this flag while the mount promise above is pending.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (disposed) return;

    // record the rebuilds of window side effects (event listeners or timers)
    // note that the frees of mounting phase are one-off as it will be re-init at next mounting
    // Only overwrite the captured rebuilds when this call actually released live effects.
    // With inactive effects (a repeated unmount, or an unmount after a failed mount that
    // already rolled back), the rebuilds captured earlier must survive for the next mount.
    const bootstrappingRelease = bootstrappingEffectsActive ? releaseSideEffects(bootstrappingFrees) : undefined;
    const mountingRelease = mountingEffectsActive ? releaseSideEffects(mountingFrees) : undefined;

    if (bootstrappingRelease) {
      bootstrappingRebuilds = bootstrappingRelease.rebuilds;
      bootstrappingEffectsActive = false;
    }
    if (mountingRelease) {
      mountingRebuilds = mountingRelease.rebuilds;
      mountingFrees = [];
      mountingEffectsActive = false;
    }

    sandbox.inactive();
    mountedContainer = undefined;
    mounted = false;

    const firstError = bootstrappingRelease?.error ?? mountingRelease?.error;
    if (firstError) {
      throw firstError.value;
    }
  };

  return {
    instance: sandbox,
    nodeTransformer,
    styleIsolation,

    /** Permanently release plugin side effects and the underlying Compartment. */
    dispose,

    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount(container?: HTMLElement) {
      if (disposed) {
        return Promise.reject(disposedError());
      }
      if (mountingPromise) {
        return Promise.reject(new TypeError(`Sandbox container for ${appName} is already mounting`));
      }
      if (unmountingPromise) {
        return Promise.reject(new TypeError(`Sandbox container for ${appName} is currently unmounting`));
      }
      if (mounted) {
        return Promise.reject(new TypeError(`Sandbox container for ${appName} is already mounted`));
      }

      mountedContainer = container ?? getConfiguredContainer();
      const trackedMount = mount(mountedContainer)
        .then(() => {
          mounted = true;
        })
        .catch((error: unknown) => {
          mountedContainer = undefined;
          mounted = false;
          throw error;
        })
        .finally(() => {
          if (mountingPromise === trackedMount) mountingPromise = undefined;
        });
      mountingPromise = trackedMount;
      return trackedMount;
    },

    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    unmount() {
      if (unmountingPromise) return unmountingPromise;

      const trackedUnmount = unmount().finally(() => {
        if (unmountingPromise === trackedUnmount) unmountingPromise = undefined;
      });
      unmountingPromise = trackedUnmount;
      return trackedUnmount;
    },
  };
}
