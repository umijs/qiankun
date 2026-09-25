import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearStylesheetCache, getStylesheetCacheStats } from '@qiankunjs/shared';
import { nativeGlobal } from '../../../consts';
import { Compartment } from '../../compartment';
import { defaultIsolationPlugins } from '../../../patchers';
import type { Free, IsolationPlugin, IsolationPluginConfig, Rebuild } from '../../../patchers/types';
import { createSandbox } from '..';

const originalDefaultIsolationPlugins = defaultIsolationPlugins.slice();
const identityNodeTransformer: IsolationPluginConfig['nodeTransformer'] = (node) => node;
const noopRebuild: Rebuild = async () => {};
const noopFree: Free = () => noopRebuild;

let appSequence = 0;
const createdCompartments: Compartment[] = [];

function createContainer(plugins: readonly IsolationPlugin[] = []) {
  const container = document.createElement('div');
  const controller = createSandbox(`plugin-lifecycle-${String(appSequence++)}`, {
    container: () => container,
    fetch: window.fetch,
    nodeTransformer: identityNodeTransformer,
    plugins,
  });
  createdCompartments.push(controller.instance);
  return { container, controller };
}

describe('default isolation plugins', () => {
  it('retains the historical default plugin order', () => {
    expect(defaultIsolationPlugins.map(({ name }) => name)).toEqual([
      'interval',
      'windowListener',
      'historyListener',
      'dynamicAppend',
    ]);
  });
});

describe('isolation plugin lifecycle', () => {
  beforeEach(() => {
    defaultIsolationPlugins.splice(0, defaultIsolationPlugins.length);
  });

  afterEach(() => {
    defaultIsolationPlugins.splice(0, defaultIsolationPlugins.length, ...originalDefaultIsolationPlugins);
    createdCompartments.splice(0).forEach((compartment) => compartment.dispose());
    vi.restoreAllMocks();
  });

  it('runs default plugins before user plugins and finishes bootstrap before exposing the container', async () => {
    const events: string[] = [];
    const plugin = (name: string, exposeBootstrapState = false): IsolationPlugin => ({
      name,
      bootstrap: ({ compartment }) => {
        events.push(`bootstrap:${name}`);
        if (exposeBootstrapState) {
          compartment.defineUnshadowableGlobals({
            bootstrapReady: {
              value: true,
              configurable: true,
              enumerable: true,
              writable: true,
            },
          });
        }
        return noopFree;
      },
      mount: () => {
        events.push(`mount:${name}`);
        return noopFree;
      },
    });
    defaultIsolationPlugins.push(plugin('default-a', true), plugin('default-b'));

    const { container, controller } = createContainer([plugin('user-a'), plugin('user-b')]);

    expect(events).toEqual(['bootstrap:default-a', 'bootstrap:default-b', 'bootstrap:user-a', 'bootstrap:user-b']);
    expect((controller.instance.globalThis as unknown as Record<string, unknown>).bootstrapReady).toBe(true);

    await controller.mount(container);
    expect(events.slice(4)).toEqual(['mount:default-a', 'mount:default-b', 'mount:user-a', 'mount:user-b']);
    await controller.unmount();
  });

  it.each([false, true])('prefers moduleHost.fetch for module sources when configured: %s', async (separate) => {
    const assetFetch = vi.fn(async () => new Response('export {};'));
    const moduleFetch = vi.fn(async () => new Response('export {};'));
    const controller = createSandbox(`module-fetch-${String(appSequence++)}`, {
      fetch: assetFetch,
      compartmentOptions: {
        moduleHost: {
          fetch: separate ? moduleFetch : undefined,
          entryUrl: 'https://module-fetch.test/',
          createModuleUrl: () => 'blob:module-fetch-test',
          revokeModuleUrl: () => {},
        },
      },
      nodeTransformer: (node, options) => {
        expect(options.fetch).toBe(assetFetch);
        return node;
      },
    });
    createdCompartments.push(controller.instance);
    controller.nodeTransformer(document.createElement('script'), { fetch: assetFetch });
    await controller.instance.load('./module.js');

    expect(separate ? moduleFetch : assetFetch).toHaveBeenCalledOnce();
    expect(separate ? assetFetch : moduleFetch).not.toHaveBeenCalled();
    await controller.dispose();
  });

  it('awaits async mount hooks sequentially', async () => {
    const events: string[] = [];
    let resolveFirstMount: (free: Free) => void = () => {
      throw new Error('mount resolver was not initialized');
    };
    const firstMount = new Promise<Free>((resolve) => {
      resolveFirstMount = resolve;
    });
    const { container, controller } = createContainer([
      {
        name: 'async-first',
        mount: () => {
          events.push('mount:async-first');
          return firstMount;
        },
      },
      {
        name: 'sync-second',
        mount: () => {
          events.push('mount:sync-second');
          return noopFree;
        },
      },
    ]);

    const mounting = controller.mount(container);
    await vi.waitFor(() => {
      expect(events).toEqual(['mount:async-first']);
    });

    resolveFirstMount(noopFree);
    await mounting;
    expect(events).toEqual(['mount:async-first', 'mount:sync-second']);
    await controller.unmount();
  });

  it('rejects a second mount until the active mount has been unmounted', async () => {
    const mountingFree = vi.fn(() => noopRebuild);
    const mountHook = vi.fn(() => mountingFree);
    const { container, controller } = createContainer([{ name: 'single-mount', mount: mountHook }]);

    await controller.mount(container);
    await expect(controller.mount(container)).rejects.toMatchObject({
      code: 'sandbox-mount-conflict',
      message: expect.stringContaining('is already mounted'),
    });
    await controller.unmount();

    expect(mountHook).toHaveBeenCalledOnce();
    expect(mountingFree).toHaveBeenCalledOnce();
  });

  it('rejects mounting while an unmount is in flight and allows the next mount afterward', async () => {
    const mountHook = vi.fn(() => noopFree);
    const { container, controller } = createContainer([{ name: 'serialized-transition', mount: mountHook }]);

    await controller.mount(container);
    const unmounting = controller.unmount();
    await expect(controller.mount(container)).rejects.toMatchObject({
      code: 'sandbox-mount-conflict',
      message: expect.stringContaining('is currently unmounting'),
    });
    await unmounting;

    await controller.mount(container);
    await controller.unmount();
    expect(mountHook).toHaveBeenCalledTimes(2);
  });

  it('frees effects in reverse registration order and rebuilds them in registration order', async () => {
    const events: string[] = [];
    const plugin = (name: string): IsolationPlugin => ({
      name,
      bootstrap: () => {
        events.push(`bootstrap:${name}`);
        return () => {
          events.push(`free:bootstrap:${name}`);
          return async () => {
            events.push(`rebuild:bootstrap:${name}`);
          };
        };
      },
      mount: () => {
        events.push(`mount:${name}`);
        return () => {
          events.push(`free:mount:${name}`);
          return async () => {
            events.push(`rebuild:mount:${name}`);
          };
        };
      },
    });
    defaultIsolationPlugins.push(plugin('default'));
    const { container, controller } = createContainer([plugin('user')]);

    await controller.mount(container);
    events.length = 0;
    await controller.unmount();
    expect(events).toEqual(['free:mount:user', 'free:mount:default', 'free:bootstrap:user', 'free:bootstrap:default']);

    events.length = 0;
    await controller.mount(container);
    expect(events).toEqual([
      'rebuild:bootstrap:default',
      'rebuild:bootstrap:user',
      'mount:default',
      'mount:user',
      'rebuild:mount:default',
      'rebuild:mount:user',
    ]);
    await controller.unmount();
  });

  it('keeps captured rebuilds intact when unmount is called repeatedly', async () => {
    const events: string[] = [];
    const { container, controller } = createContainer([
      {
        name: 'tracker',
        bootstrap: () => {
          events.push('bootstrap');
          return () => {
            events.push('free:bootstrap');
            return async () => {
              events.push('rebuild:bootstrap');
            };
          };
        },
        mount: () => {
          events.push('mount');
          return () => {
            events.push('free:mount');
            return async () => {
              events.push('rebuild:mount');
            };
          };
        },
      },
    ]);

    await controller.mount(container);
    await controller.unmount();
    events.length = 0;

    // A second unmount with no live effects must be a no-op and must not wipe
    // the rebuilds captured by the first one.
    await controller.unmount();
    expect(events).toEqual([]);

    await controller.mount(container);
    expect(events).toEqual(['rebuild:bootstrap', 'mount', 'rebuild:mount']);
    await controller.unmount();
  });

  it('keeps rebuilds captured by a failed mount rollback for the next mount', async () => {
    const events: string[] = [];
    let failNextMount = true;
    const { container, controller } = createContainer([
      {
        name: 'flaky',
        bootstrap: () => {
          events.push('bootstrap');
          return () => {
            events.push('free:bootstrap');
            return async () => {
              events.push('rebuild:bootstrap');
            };
          };
        },
        mount: () => {
          if (failNextMount) {
            failNextMount = false;
            throw new Error('mount blew up');
          }
          events.push('mount');
          return noopFree;
        },
      },
    ]);

    await expect(controller.mount(container)).rejects.toThrow('mount blew up');
    expect(events).toEqual(['bootstrap', 'free:bootstrap']);
    events.length = 0;

    // The failed mount already rolled everything back; this unmount must not
    // discard the bootstrap rebuilds that rollback captured.
    await controller.unmount();
    expect(events).toEqual([]);

    await controller.mount(container);
    expect(events).toEqual(['rebuild:bootstrap', 'mount']);
    await controller.unmount();
  });

  it('rolls back completed bootstrap hooks when a later hook throws', () => {
    const events: string[] = [];
    const dispose = vi.spyOn(Compartment.prototype, 'dispose');
    defaultIsolationPlugins.push(
      {
        name: 'first',
        bootstrap: () => {
          events.push('bootstrap:first');
          return () => {
            events.push('free:first');
            throw new Error('cleanup failure');
          };
        },
      },
      {
        name: 'second',
        bootstrap: () => {
          events.push('bootstrap:second');
          return () => {
            events.push('free:second');
            return noopRebuild;
          };
        },
      },
      {
        name: 'failing',
        bootstrap: () => {
          events.push('bootstrap:failing');
          throw new Error('bootstrap failure');
        },
      },
      {
        name: 'unreachable',
        bootstrap: () => {
          events.push('bootstrap:unreachable');
          return noopFree;
        },
      },
    );

    expect(() => createContainer()).toThrowError('bootstrap failure');
    expect(events).toEqual(['bootstrap:first', 'bootstrap:second', 'bootstrap:failing', 'free:second', 'free:first']);
    expect(dispose).toHaveBeenCalledOnce();
  });

  it('rolls back completed mount hooks and deactivates the sandbox when a later hook rejects', async () => {
    const events: string[] = [];
    const { container, controller } = createContainer([
      {
        name: 'first',
        bootstrap: () => {
          events.push('bootstrap:first');
          return () => {
            events.push('free:bootstrap:first');
            return noopRebuild;
          };
        },
        mount: () => {
          events.push('mount:first');
          return () => {
            events.push('free:first');
            throw new Error('cleanup failure');
          };
        },
      },
      {
        name: 'second',
        mount: () => {
          events.push('mount:second');
          return () => {
            events.push('free:second');
            return noopRebuild;
          };
        },
      },
      {
        name: 'failing',
        mount: async () => {
          events.push('mount:failing');
          throw new Error('mount failure');
        },
      },
      {
        name: 'unreachable',
        mount: () => {
          events.push('mount:unreachable');
          return noopFree;
        },
      },
    ]);

    await expect(controller.mount(container)).rejects.toThrowError('mount failure');
    expect(events).toEqual([
      'bootstrap:first',
      'mount:first',
      'mount:second',
      'mount:failing',
      'free:second',
      'free:first',
      'free:bootstrap:first',
    ]);

    const view = controller.instance.globalThis as unknown as Record<string, unknown>;
    view.writeAfterFailure = true;
    expect(view.writeAfterFailure).toBeUndefined();
  });

  it('continues freeing earlier plugins and deactivates the sandbox when a free throws', async () => {
    const events: string[] = [];
    const { container, controller } = createContainer([
      {
        name: 'first',
        mount: () => () => {
          events.push('free:first');
          throw new Error('free failure');
        },
      },
      {
        name: 'second',
        mount: () => () => {
          events.push('free:second');
          return async () => {
            events.push('rebuild:second');
          };
        },
      },
    ]);

    await controller.mount(container);
    await expect(controller.unmount()).rejects.toThrowError('free failure');
    expect(events).toEqual(['free:second', 'free:first']);

    const view = controller.instance.globalThis as unknown as Record<string, unknown>;
    view.writeAfterFreeFailure = true;
    expect(view.writeAfterFreeFailure).toBeUndefined();

    events.length = 0;
    await controller.mount(container);
    expect(events).toEqual(['rebuild:second']);
  });

  it('disposes bootstrap effects, the global accessor, and module resources exactly once', async () => {
    const free = vi.fn(() => {
      throw new Error('plugin cleanup failed');
    });
    const createModuleUrl = vi.fn(() => 'blob:controller-dispose');
    const revokeModuleUrl = vi.fn();
    const beforeAccessors = new Set(
      Object.getOwnPropertyNames(nativeGlobal).filter((key) => key.startsWith('__compartment_globalThis__')),
    );
    const container = document.createElement('div');
    const controller = createSandbox(`controller-dispose-${String(appSequence++)}`, {
      container: () => container,
      compartmentOptions: {
        moduleHost: {
          createModuleUrl,
          revokeModuleUrl,
        },
      },
      fetch: window.fetch,
      nodeTransformer: identityNodeTransformer,
      plugins: [
        {
          name: 'resource-probe',
          bootstrap: () => free,
        },
      ],
    });
    createdCompartments.push(controller.instance);
    controller.instance.registerImportMap('{"imports":{}}', document.baseURI);

    const createdAccessors = Object.getOwnPropertyNames(nativeGlobal).filter(
      (key) => key.startsWith('__compartment_globalThis__') && !beforeAccessors.has(key),
    );
    expect(createdAccessors).toHaveLength(1);
    expect(createModuleUrl).toHaveBeenCalledOnce();

    await expect(controller.dispose()).rejects.toThrowError('plugin cleanup failed');
    await controller.dispose();

    expect(free).toHaveBeenCalledOnce();
    expect(revokeModuleUrl).toHaveBeenCalledOnce();
    expect(Reflect.has(nativeGlobal, createdAccessors[0])).toBe(false);
    await expect(controller.mount(container)).rejects.toMatchObject({
      code: 'compartment-disposed',
      message: expect.stringContaining('has been disposed'),
    });
  });

  it('does not free already inactive effects again when disposal follows unmount', async () => {
    const bootstrapFree = vi.fn(() => noopRebuild);
    const mountingFree = vi.fn(() => noopRebuild);
    const { container, controller } = createContainer([
      {
        name: 'single-release',
        bootstrap: () => bootstrapFree,
        mount: () => mountingFree,
      },
    ]);

    await controller.mount(container);
    await controller.unmount();
    await controller.dispose();
    await controller.dispose();

    expect(bootstrapFree).toHaveBeenCalledOnce();
    expect(mountingFree).toHaveBeenCalledOnce();
  });

  it('runs all terminal plugin hooks after frees and retains the first cleanup error', async () => {
    const events: string[] = [];
    const { container, controller } = createContainer([
      {
        name: 'first',
        bootstrap: () => () => {
          events.push('free');
          throw new Error('free failed');
        },
        dispose: ({ compartment }) => {
          expect(compartment.globalThis.document).toBe(document);
          events.push('dispose:first');
          throw new Error('dispose failed');
        },
      },
      { name: 'second', dispose: () => events.push('dispose:second') },
    ]);
    const view = controller.instance.globalThis;
    const transformer = controller.nodeTransformer;

    await expect(controller.dispose()).rejects.toThrowError('free failed');
    await controller.dispose();
    await controller.unmount();

    expect(events).toEqual(['free', 'dispose:second', 'dispose:first']);
    expect(() => view.document).toThrow(TypeError);
    expect(() => transformer(document.createElement('div'), {})).toThrowError(
      expect.objectContaining({ code: 'compartment-disposed' }),
    );
    await expect(controller.mount(container)).rejects.toMatchObject({
      code: 'compartment-disposed',
      message: expect.stringContaining('has been disposed'),
    });
  });

  it('keeps terminal hooks for disposal and never invokes them during warm unmounts', async () => {
    const dispose = vi.fn();
    const { container, controller } = createContainer([{ name: 'terminal', dispose }]);
    const { mount, unmount, dispose: disposeController } = controller;
    await mount(container);
    await unmount();
    await mount(container);
    expect(dispose).not.toHaveBeenCalled();

    await disposeController();
    await disposeController();
    expect(dispose).toHaveBeenCalledOnce();
  });

  it('runs terminal hooks after a partial bootstrap failure without replacing the original error', () => {
    const dispose = vi.fn(() => {
      throw new Error('terminal failure');
    });
    expect(() =>
      createContainer([
        { name: 'initialized', dispose },
        {
          name: 'broken',
          bootstrap: () => {
            throw new Error('bootstrap failed');
          },
        },
      ]),
    ).toThrowError('bootstrap failed');
    expect(dispose).toHaveBeenCalledOnce();
  });

  it('waits for an in-flight mount to roll back its effects before disposal completes', async () => {
    let resolveMount: (free: Free) => void = () => {
      throw new Error('mount resolver was not initialized');
    };
    const pendingMount = new Promise<Free>((resolve) => {
      resolveMount = resolve;
    });
    const mountingFree = vi.fn(() => noopRebuild);
    const laterMount = vi.fn(() => noopFree);
    const { container, controller } = createContainer([
      {
        name: 'pending',
        mount: () => pendingMount,
      },
      {
        name: 'unreachable-after-dispose',
        mount: laterMount,
      },
    ]);

    const mounting = controller.mount(container);
    const mountRejection = expect(mounting).rejects.toMatchObject({
      code: 'compartment-disposed',
      message: expect.stringContaining('has been disposed'),
    });
    let disposalCompleted = false;
    const disposing = controller.dispose().then(() => {
      disposalCompleted = true;
    });

    await Promise.resolve();
    expect(disposalCompleted).toBe(false);

    resolveMount(mountingFree);
    await mountRejection;
    await disposing;

    expect(mountingFree).toHaveBeenCalledOnce();
    expect(laterMount).not.toHaveBeenCalled();
    await expect(controller.mount(container)).rejects.toMatchObject({
      code: 'compartment-disposed',
      message: expect.stringContaining('has been disposed'),
    });
  });
});

// Unlike the lifecycle suite above, these run with the real built-in plugin preset installed.
describe('terminal disposal with built-in plugins', () => {
  afterEach(() => {
    clearStylesheetCache();
    vi.restoreAllMocks();
  });

  it('keeps the built-in document view usable until every user dispose hook has run', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let cleanupRan = false;
    const controller = createSandbox(`terminal-document-${String(appSequence++)}`, {
      container,
      plugins: [
        {
          name: 'terminal-dom-cache',
          dispose: ({ compartment }) => {
            compartment.globalThis.document.body.querySelector('[data-plugin-owned]')?.remove();
            cleanupRan = true;
          },
        },
      ],
    });
    await controller.mount(container);
    const sandboxDocument = controller.instance.globalThis.document;
    const owned = sandboxDocument.createElement('span');
    owned.dataset.pluginOwned = 'true';
    sandboxDocument.body.appendChild(owned);
    expect(owned.isConnected).toBe(true);

    await expect(controller.dispose()).resolves.toBeUndefined();

    expect(cleanupRan).toBe(true);
    expect(owned.isConnected).toBe(false);
    expect(() => controller.instance.globalThis.document).toThrow(TypeError);
    container.remove();
  });

  it('runs user dispose hooks before built-in ones after a bootstrap failure', () => {
    const container = document.createElement('div');
    let documentUsable = false;
    expect(() =>
      createSandbox(`terminal-bootstrap-${String(appSequence++)}`, {
        container,
        plugins: [
          {
            name: 'document-reader',
            dispose: ({ compartment }) => {
              compartment.globalThis.document.createElement('span');
              documentUsable = true;
            },
          },
          {
            name: 'broken',
            bootstrap: () => {
              throw new Error('bootstrap failed');
            },
          },
        ],
      }),
    ).toThrowError('bootstrap failed');
    expect(documentUsable).toBe(true);
  });

  it('releases transpiled stylesheet ownership when the DOM preset controller is disposed', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:controller-style');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const controller = createSandbox(`controller-style-${String(appSequence++)}`, {
      container: document.createElement('div'),
      fetch: async () => new Response('.probe { color: red; }'),
      styleIsolation: true,
    });
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://controller.test/style.css';
    controller.nodeTransformer(link, {});
    await vi.waitFor(() => expect(link.getAttribute('href')).toBe('blob:controller-style'));
    expect(getStylesheetCacheStats().size).toBe(1);

    await controller.dispose();

    expect(getStylesheetCacheStats().size).toBe(0);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:controller-style');
  });

  it('releases transpiled classic script ownership when the JS-only preset controller is disposed', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:js-only-script');
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const controller = createSandbox(`js-only-assets-${String(appSequence++)}`, {
      fetch: async () => new Response('window.jsOnlyAsset = true;'),
    });
    const script = document.createElement('script');
    script.src = 'https://controller.test/entry.js';
    controller.nodeTransformer(script, {});
    await vi.waitFor(() => expect(script.src).toBe('blob:js-only-script'));

    await controller.dispose();

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:js-only-script');
    expect(script.hasAttribute('src')).toBe(false);
  });
});
