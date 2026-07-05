import type { AppConfiguration, MicroApp } from 'qiankun';
import { loadMicroApp } from 'qiankun';
import { SUB_APP_ENTRIES } from '../../../ports';

// A global the sub apps read through the sandbox, to assert main-realm values stay visible inside it
(window as Record<string, unknown>).__MAIN_GLOBAL__ = 'value-from-main';

const instances = new Map<string, MicroApp>();

// Imperative test API driven by playwright via page.evaluate
const testAPI = {
  /**
   * Load a sub app into a dedicated container. `key` allows multiple instances of the same app.
   * Resolves with the single-spa status once mounted (or rejects with the load/mount error).
   */
  async load(
    name: keyof typeof SUB_APP_ENTRIES,
    configuration?: AppConfiguration,
    key = name,
    props?: Record<string, unknown>,
  ): Promise<string> {
    let container = document.getElementById(`container-${key}`);
    if (!container) {
      container = document.createElement('div');
      container.id = `container-${key}`;
      document.getElementById('containers')!.appendChild(container);
    }

    const app = loadMicroApp({ name, entry: SUB_APP_ENTRIES[name], container, props }, configuration);
    instances.set(key, app);
    await app.mountPromise;
    return app.getStatus();
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
