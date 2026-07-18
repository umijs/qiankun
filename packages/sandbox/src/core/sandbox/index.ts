/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { getDefaultIsolationPlugins } from '../../patchers';
import type { SandboxConfig } from '../../patchers/dynamicAppend/types';
import type { Free, IsolationPlugin, IsolationPluginContext, Rebuild } from '../../patchers/types';
import type { CompartmentGlobals, CompartmentOptions } from '../compartment';
import { StandardSandbox } from './StandardSandbox';
import type { Sandbox } from './types';

export type { Sandbox };

interface CapturedError {
  value: unknown;
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

async function rebuildSideEffects(rebuilds: Rebuild[], container: HTMLElement, afterEach?: () => void): Promise<void> {
  while (rebuilds.length) {
    await rebuilds[0](container);
    rebuilds.shift();
    afterEach?.();
  }
}

/**
 * @param appName
 * @param getContainer
 * @param opts
 */
export function createSandboxContainer(
  appName: string,
  getContainer: () => HTMLElement,
  opts: {
    /** The host context that incubates this sandbox (see the ShadowRealm proposal's "incubator realm"). */
    incubatorContext?: WindowProxy;
    globals?: CompartmentGlobals;
    plugins?: readonly IsolationPlugin[];
    compartmentOptions?: Omit<CompartmentOptions, 'globals' | 'incubatorContext' | 'name'>;
  } & Pick<SandboxConfig, 'fetch' | 'nodeTransformer' | 'styleIsolation'>,
) {
  const { compartmentOptions, incubatorContext, globals = {}, plugins = [], ...sandboxCfg } = opts;
  let sandbox: Sandbox;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (window.Proxy) {
    sandbox = new StandardSandbox(appName, globals, incubatorContext, compartmentOptions);
  } else {
    // TODO snapshot sandbox
    sandbox = new StandardSandbox(appName, globals, incubatorContext, compartmentOptions);
  }

  const classicScriptTransformer = (source: string, sourceURL?: string) =>
    sandbox.transformClassicScript(source, sourceURL);
  const pluginNodeTransformer: SandboxConfig['nodeTransformer'] = (node, transformerOpts) =>
    sandboxCfg.nodeTransformer(node, {
      ...transformerOpts,
      classicScriptTransformer,
      compartment: sandbox,
    });
  const pluginContext: IsolationPluginContext = {
    compartment: sandbox,
    appName,
    getContainer,
    config: {
      ...sandboxCfg,
      nodeTransformer: pluginNodeTransformer,
    },
  };
  const isolationPlugins = [...getDefaultIsolationPlugins(sandbox.type), ...plugins];

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
    throw error;
  }

  // mounting frees are one-off and should be re-init at every mounting time
  let mountingFrees: Free[] = [];
  let bootstrappingRebuilds: Rebuild[] = [];
  let mountingRebuilds: Rebuild[] = [];
  let bootstrappingEffectsActive = bootstrappingFrees.length > 0;
  let mountingEffectsActive = false;
  let disposed = false;
  let mountingPromise: Promise<void> | undefined;
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
    const pendingDispose = (async () => {
      // A mount hook can install effects before its promise yields the matching Free.
      // Wait for that operation to observe `disposed`, roll back its local frees, and
      // only then perform the terminal owner cleanup.
      try {
        await pendingMount;
      } catch {
        // The mount caller retains its own failure; disposal still has to finish.
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

  const mount = async (container: HTMLElement): Promise<void> => {
    assertNotDisposed();
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

  return {
    instance: sandbox,

    /** Permanently release plugin side effects and the underlying Compartment. */
    dispose,

    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount(container: HTMLElement) {
      if (mountingPromise) {
        return Promise.reject(new TypeError(`Sandbox container for ${appName} is already mounting`));
      }

      const trackedMount = mount(container).finally(() => {
        if (mountingPromise === trackedMount) mountingPromise = undefined;
      });
      mountingPromise = trackedMount;
      return trackedMount;
    },

    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    async unmount() {
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

      const firstError = bootstrappingRelease?.error ?? mountingRelease?.error;
      if (firstError) {
        throw firstError.value;
      }
    },
  };
}
