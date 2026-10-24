/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type LoaderOpts } from '@qiankunjs/loader';
import { Deferred } from '@qiankunjs/shared';
import { AppOrParcelStatus } from '@qiankunjs/single-spa';
import { type LifeCycles, type LoadableApp, type MicroApp, type ObjectType } from '../../types';

const mocks = vi.hoisted(() => ({ createSandbox: vi.fn(), loadEntry: vi.fn() }));
vi.mock('@qiankunjs/loader', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  loadEntry: mocks.loadEntry,
}));
vi.mock('@qiankunjs/sandbox', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createSandbox: mocks.createSandbox,
}));

import { loadMicroApp } from '../loadMicroApp';

const bootstrap = vi.fn(async () => {});
const mount = vi.fn(async () => {});
const unmount = vi.fn(async () => {});
const parcels: MicroApp[] = [];
let sequence = 0;

describe('loadMicroApp lifecycle hook context', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<main></main>', { status: 200 })),
    );
    mocks.createSandbox.mockReturnValue({
      instance: { globalThis: window },
      nodeTransformer: (node: Node) => node,
      mount: async () => {},
      unmount: async () => {},
      dispose: async () => {},
    });
    mocks.loadEntry.mockImplementation((_entry: unknown, _container: HTMLElement, opts: LoaderOpts) => {
      opts.onDOMStreamSettled?.();
      return Promise.resolve({ bootstrap, mount, unmount });
    });
  });

  afterEach(async () => {
    for (const parcel of parcels) {
      if (parcel.getStatus() === AppOrParcelStatus.MOUNTED) await parcel.unmount();
    }
    parcels.length = 0;
    document.body.replaceChildren();
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it.each([
    { scenario: 'an idle instance moves to a new container', swap: true, draining: false, props: { route: 'second' } },
    {
      scenario: 'a draining instance moves to a new container',
      swap: true,
      draining: true,
      props: { route: 'second' },
    },
    { scenario: 'the same container receives new props', swap: false, draining: false, props: { route: 'second' } },
    { scenario: 'the new invocation omits props', swap: true, draining: false, props: undefined },
  ])('uses per-invocation hook context when $scenario', async ({ swap, draining, props }) => {
    const former = document.createElement('div');
    const next = swap ? document.createElement('div') : former;
    document.body.append(former);
    if (swap) document.body.append(next);
    const firstApp: LoadableApp<ObjectType> = {
      name: `hook-context-${String(++sequence)}`,
      entry: 'https://hook-context.test/index.html',
      container: former,
      props: { route: 'first' },
    };
    const secondApp = { ...firstApp, container: next, props };
    const unmountStarted = new Deferred<void>();
    const finishUnmount = new Deferred<void>();
    const events: Array<{ hook: string; container: HTMLElement; props: ObjectType | undefined }> = [];
    const record = (hook: string, app: LoadableApp<ObjectType>) => {
      events.push({ hook, container: app.container, props: app.props });
    };
    const hooks = {
      beforeLoad: vi.fn(async () => {}),
      beforeMount: vi.fn(async (app: LoadableApp<ObjectType>) => record('beforeMount', app)),
      afterMount: vi.fn(async (app: LoadableApp<ObjectType>) => record('afterMount', app)),
      beforeUnmount: vi.fn(async (app: LoadableApp<ObjectType>) => {
        record('beforeUnmount', app);
        if (draining && app.props === firstApp.props) {
          unmountStarted.resolve();
          await finishUnmount.promise;
        }
      }),
      afterUnmount: vi.fn(async (app: LoadableApp<ObjectType>) => record('afterUnmount', app)),
    } satisfies LifeCycles<ObjectType>;
    const first = loadMicroApp(firstApp, undefined, hooks);
    parcels.push(first);
    await first.mountPromise;
    const unmounting = first.unmount();
    if (draining) await unmountStarted.promise;
    else await unmounting;

    // Exercise the real loadMicroApp -> cached loadApp getter -> lifecycle chains.
    const second = loadMicroApp(secondApp, undefined, hooks);
    parcels.push(second);
    if (draining) {
      // The successor's config exists before the predecessor's afterUnmount hook runs.
      await vi.waitFor(() => expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTING));
      expect(hooks.beforeMount).toHaveBeenCalledTimes(1);
      finishUnmount.resolve();
    }
    await unmounting;
    await second.mountPromise;
    await second.unmount();

    const hookOrder = ['beforeMount', 'afterMount', 'beforeUnmount', 'afterUnmount'];
    expect(events).toEqual([
      ...hookOrder.map((hook) => ({ hook, container: former, props: firstApp.props })),
      ...hookOrder.map((hook) => ({ hook, container: next, props })),
    ]);
    for (const [index, event] of events.entries()) {
      const app = index < hookOrder.length ? firstApp : secondApp;
      expect(event.container).toBe(app.container);
      expect(event.props).toBe(app.props);
    }
    expect(hooks.beforeLoad).toHaveBeenCalledExactlyOnceWith(firstApp, window);
    expect(hooks.beforeMount.mock.calls[1][0].props).toBe(props);
    expect(firstApp.container).toBe(former);
    expect(firstApp.props).toEqual({ route: 'first' });
    expect(mocks.createSandbox).toHaveBeenCalledTimes(1);
    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(2);
    expect(unmount).toHaveBeenCalledTimes(2);
  });
});
