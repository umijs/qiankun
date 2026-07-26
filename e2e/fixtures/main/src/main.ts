import type { AppConfiguration, MicroApp } from 'qiankun';
import { loadMicroApp, precompileModuleSource } from 'qiankun';
import { SUB_APP_ENTRIES } from '../../../ports';
import { createLocalStoragePrefixPlugin } from './localStoragePrefixPlugin';

// A global the sub apps read through the sandbox, to assert main-realm values stay visible inside it
(window as unknown as Record<string, unknown>).__MAIN_GLOBAL__ = 'value-from-main';

const instances = new Map<string, MicroApp>();
const hookMetrics = new Map<string, { hookCalls: number; moduleFetches: number }>();

const precompiledEntryUrl = new URL('/entry.js', SUB_APP_ENTRIES['sub-esm']).href;
const precompiledDependencyUrl = new URL('/precompiled-dependency.js', precompiledEntryUrl).href;
const precompiledResolveHook = (specifier: string, referrer: string): string => new URL(specifier, referrer).href;
const precompiledEntrySource = `
import { message } from './precompiled-dependency.js';
export async function bootstrap() {}
export async function mount() {
  window.__PRECOMPILED_HOOK_POLLUTION__ = 'sandbox-only';
  const root = document.querySelector('#esm-root');
  if (!root) throw new Error('missing sandboxed esm root');
  root.innerHTML = '<p data-testid="precompiled-hook">' + message + ':source-path:' + String(window.__MAIN_GLOBAL__) + ':' + String(document.body.dataset.name) + '</p>';
}
export async function unmount() {
  const root = document.querySelector('#esm-root');
  if (root) root.innerHTML = '';
}
`;
const precompiledEntryArtifact = precompileModuleSource({
  source: precompiledEntrySource,
  url: precompiledEntryUrl,
  globalsBaseSet: ['document', 'window'],
  resolveHook: precompiledResolveHook,
});
// The test-only linked marker proves the engine consumes `code` directly. If
// it rewrites the retained original source in the hook path, the DOM says source-path.
precompiledEntryArtifact.code = precompiledEntryArtifact.code.replace('source-path', 'linked-path');
const precompiledDependencyArtifact = precompileModuleSource({
  source: `export const message = 'static dependency';`,
  url: precompiledDependencyUrl,
  globalsBaseSet: ['document', 'window'],
  resolveHook: precompiledResolveHook,
});
const precompiledArtifacts = new Map([
  [precompiledEntryUrl, Object.freeze(precompiledEntryArtifact)],
  [precompiledDependencyUrl, Object.freeze(precompiledDependencyArtifact)],
]);

function resolveContainer(containerKey: string): HTMLElement {
  let container = document.getElementById(`container-${containerKey}`);
  if (!container) {
    container = document.createElement('div');
    container.id = `container-${containerKey}`;
    document.getElementById('containers')!.appendChild(container);
  }
  return container;
}

// Imperative test API driven by playwright via page.evaluate
const testAPI = {
  /**
   * Load a sub app into a dedicated container. `key` allows multiple instances of the same app;
   * `containerKey` targets another key's container to drive cross-app shared-container scenarios.
   * Resolves with the single-spa status once mounted (or rejects with the load/mount error).
   */
  async load(
    name: keyof typeof SUB_APP_ENTRIES,
    configuration?: AppConfiguration,
    key: string = name,
    props?: Record<string, unknown>,
    containerKey: string = key,
  ): Promise<string> {
    const container = resolveContainer(containerKey);
    const app = loadMicroApp({ name, entry: SUB_APP_ENTRIES[name], container, props }, configuration);
    instances.set(key, app);
    await app.mountPromise;
    return app.getStatus();
  },

  /**
   * Like load, but returns right after kicking the app off — the caller observes the mount
   * through status()/settle(). This is the "caller forgot to await/unmount" shape the
   * container occupancy gate serializes.
   */
  loadDetached(
    name: keyof typeof SUB_APP_ENTRIES,
    key: string = name,
    containerKey: string = key,
    props?: Record<string, unknown>,
  ): string {
    const container = resolveContainer(containerKey);
    const app = loadMicroApp({ name, entry: SUB_APP_ENTRIES[name], container, props });
    instances.set(key, app);
    // surface failures through settle()/status() instead of an unhandled rejection
    void app.mountPromise.catch(() => undefined);
    return app.getStatus();
  },

  /** Await the app's mount settling either way; resolves with the status it settled in. */
  async settle(key: string): Promise<string> {
    const app = instances.get(key);
    if (!app) throw new Error(`no app instance for key ${key}`);
    await app.mountPromise.catch(() => undefined);
    return app.getStatus();
  },

  async loadWithStoragePlugin(prefix: string, key: string, value: string): Promise<string> {
    return this.load(
      'sub-classic',
      {
        sandbox: {
          globals: { __E2E_STORAGE_PROBE__: value },
          plugins: [createLocalStoragePrefixPlugin(prefix)],
        },
      },
      key,
    );
  },

  async loadWithPrecompiledHook(key: string): Promise<string> {
    const metrics = { hookCalls: 0, moduleFetches: 0 };
    hookMetrics.set(key, metrics);

    const nativeFetch = window.fetch.bind(window);
    const configuration: AppConfiguration = {
      fetch: (input, init) => {
        if (precompiledArtifacts.has(String(input))) metrics.moduleFetches += 1;
        return nativeFetch(input, init);
      },
      sandbox: {
        resolveHook: precompiledResolveHook,
        importHook: (fullSpecifier) => {
          metrics.hookCalls += 1;
          const source = precompiledArtifacts.get(fullSpecifier);
          if (!source) return Promise.reject(new TypeError(`missing precompiled artifact ${fullSpecifier}`));
          return Promise.resolve({ source });
        },
      },
    };

    return this.load('sub-esm', configuration, key);
  },

  hookMetrics(key: string): { hookCalls: number; moduleFetches: number } | undefined {
    return hookMetrics.get(key);
  },

  async unmount(key: string): Promise<string> {
    const app = instances.get(key);
    if (!app) throw new Error(`no app instance for key ${key}`);
    await app.unmount();
    return app.getStatus();
  },

  /**
   * Drop and recreate the container element (same id, same position), the way frameworks do
   * on a keyed re-render — e.g. the examples main app remounts a fresh container on retry.
   */
  resetContainer(key: string): void {
    const container = document.getElementById(`container-${key}`);
    if (container) {
      const fresh = document.createElement('div');
      fresh.id = container.id;
      container.replaceWith(fresh);
    }
    instances.delete(key);
  },

  status(key: string): string | undefined {
    return instances.get(key)?.getStatus();
  },
};

declare global {
  interface Window {
    __E2E__: typeof testAPI;
  }
}

window.__E2E__ = testAPI;
