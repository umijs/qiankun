import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nativeGlobal } from '../../../consts';
import { Compartment } from '../../compartment';
import { defaultIsolationPlugins } from '../../../patchers';
import type { Free, IsolationPlugin, IsolationPluginConfig, Rebuild } from '../../../patchers/types';
import { createSandboxContainer } from '..';
import { SandboxType } from '../types';

const standardDefaultPlugins = defaultIsolationPlugins[SandboxType.Standard];
const originalStandardDefaultPlugins = standardDefaultPlugins.slice();
const identityNodeTransformer: IsolationPluginConfig['nodeTransformer'] = (node) => node;
const noopRebuild: Rebuild = async () => {};
const noopFree: Free = () => noopRebuild;

let appSequence = 0;
const createdCompartments: Compartment[] = [];

function createContainer(plugins: readonly IsolationPlugin[] = []) {
  const container = document.createElement('div');
  const controller = createSandboxContainer(`plugin-lifecycle-${String(appSequence++)}`, () => container, {
    fetch: window.fetch,
    nodeTransformer: identityNodeTransformer,
    plugins,
  });
  createdCompartments.push(controller.instance);
  return { container, controller };
}

describe('default isolation plugins', () => {
  it('retains the historical Standard preset order', () => {
    expect(standardDefaultPlugins.map(({ name }) => name)).toEqual([
      'interval',
      'windowListener',
      'historyListener',
      'dynamicAppend',
    ]);
  });
});

describe('isolation plugin lifecycle', () => {
  beforeEach(() => {
    standardDefaultPlugins.splice(0, standardDefaultPlugins.length);
  });

  afterEach(() => {
    standardDefaultPlugins.splice(0, standardDefaultPlugins.length, ...originalStandardDefaultPlugins);
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
    standardDefaultPlugins.push(plugin('default-a', true), plugin('default-b'));

    const { container, controller } = createContainer([plugin('user-a'), plugin('user-b')]);

    expect(events).toEqual(['bootstrap:default-a', 'bootstrap:default-b', 'bootstrap:user-a', 'bootstrap:user-b']);
    expect((controller.instance.globalThis as unknown as Record<string, unknown>).bootstrapReady).toBe(true);

    await controller.mount(container);
    expect(events.slice(4)).toEqual(['mount:default-a', 'mount:default-b', 'mount:user-a', 'mount:user-b']);
    await controller.unmount();
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

  it('frees and rebuilds bootstrap and mount effects in registration order', async () => {
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
    standardDefaultPlugins.push(plugin('default'));
    const { container, controller } = createContainer([plugin('user')]);

    await controller.mount(container);
    events.length = 0;
    await controller.unmount();
    expect(events).toEqual(['free:bootstrap:default', 'free:bootstrap:user', 'free:mount:default', 'free:mount:user']);

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
    standardDefaultPlugins.push(
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
    expect(events).toEqual(['bootstrap:first', 'bootstrap:second', 'bootstrap:failing', 'free:first', 'free:second']);
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
      'free:bootstrap:first',
      'free:first',
      'free:second',
    ]);

    const view = controller.instance.globalThis as unknown as Record<string, unknown>;
    view.writeAfterFailure = true;
    expect(view.writeAfterFailure).toBeUndefined();
  });

  it('continues freeing later plugins and deactivates the sandbox when a free throws', async () => {
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
    expect(events).toEqual(['free:first', 'free:second']);

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
    const controller = createSandboxContainer(`controller-dispose-${String(appSequence++)}`, () => container, {
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
    await expect(controller.mount(container)).rejects.toThrowError('has been disposed');
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
    const mountRejection = expect(mounting).rejects.toThrowError('has been disposed');
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
    await expect(controller.mount(container)).rejects.toThrowError('has been disposed');
  });
});
