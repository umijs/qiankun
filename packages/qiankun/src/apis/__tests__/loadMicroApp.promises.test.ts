/** @vitest-environment happy-dom */
import { setImmediate } from 'node:timers/promises';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Deferred } from '@qiankunjs/shared';
import { AppOrParcelStatus } from '@qiankunjs/single-spa';
import { type ParcelConfigObjectGetter } from '../../core/loadApp';
import { defaultIdleCachePolicy } from '../../core/idleInstanceCache';
import { type MicroApp } from '../../types';

const mocks = vi.hoisted(() => ({ loadApp: vi.fn(), parcels: [] as MicroApp[] }));
vi.mock('../../core/loadApp', () => ({ default: mocks.loadApp }));
vi.mock('@qiankunjs/single-spa', async (importOriginal) => {
  const original = await importOriginal<typeof import('@qiankunjs/single-spa')>();
  return {
    ...original,
    mountRootParcel: (...args: Parameters<typeof original.mountRootParcel>) => {
      const parcel = original.mountRootParcel(...args);
      mocks.parcels.push(parcel);
      return parcel;
    },
  };
});
import { loadMicroApp } from '../loadMicroApp';

const mount = vi.fn(async () => {});
const unmount = vi.fn(async () => {});
const bootstrap = vi.fn(async () => {});
const update = vi.fn(async () => {});
const handles: MicroApp[] = [];
let sequence = 0;
function load() {
  const app = loadMicroApp({
    name: `promises-${String(++sequence)}`,
    entry: '/entry',
    container: document.createElement('div'),
  });
  handles.push(app);
  return app;
}
const snapshot = (app: MicroApp) => ({
  load: app.loadPromise,
  bootstrap: app.bootstrapPromise,
  mount: app.mountPromise,
  unmount: app.unmountPromise,
});

describe('loadMicroApp Parcel promise compatibility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const getter = () => ({ bootstrap, mount, unmount, update });
    mocks.loadApp.mockResolvedValue(
      Object.defineProperties(getter, {
        dispose: { value: async () => {} },
        loadPhaseSettled: { value: Promise.resolve() },
        loadPhaseOpen: { get: () => false },
        occupiesContainer: { get: () => false },
      }) as ParcelConfigObjectGetter,
    );
  });
  afterEach(async () => {
    for (const app of handles) if (app.getStatus() === AppOrParcelStatus.MOUNTED) await app.unmount();
    await vi.advanceTimersByTimeAsync(defaultIdleCachePolicy.idleTTL);
    handles.length = 0;
    mocks.parcels.length = 0;
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it.each([false, true])('preserves first-cycle promise identity on a remount (expired: %s)', async (expired) => {
    const app = load();
    const first = snapshot(app);
    await app.mountPromise;
    await app.unmount();
    expect(await Promise.all(Object.values(first))).toEqual([null, null, null, null]);
    if (expired) await vi.advanceTimersByTimeAsync(defaultIdleCachePolicy.idleTTL);
    const started = new Deferred<void>(),
      finish = new Deferred<void>();
    mount.mockImplementationOnce(async () => {
      started.resolve();
      await finish.promise;
    });
    const remounting = app.mount();
    await started.promise;
    const samePromises = Object.values(snapshot(app)).every(
      (promise, index) => promise === Object.values(first)[index],
    );
    finish.resolve();
    expect(await remounting).toBeNull();
    expect(samePromises).toBe(true);
    expect(bootstrap).toHaveBeenCalledTimes(expired ? 2 : 1);
  });

  it.each(['source', 'bootstrap', 'mount'])(
    'keeps the first unmount promise pending on a %s failure, like a Parcel',
    async (phase) => {
      const error = new Error(`${phase} failed`);
      if (phase === 'source') mocks.loadApp.mockRejectedValueOnce(error);
      if (phase === 'bootstrap') bootstrap.mockRejectedValueOnce(error);
      if (phase === 'mount') mount.mockRejectedValueOnce(error);
      const app = load();
      let finished = false;
      void app.unmountPromise.then(
        () => {
          finished = true;
        },
        () => {
          finished = true;
        },
      );
      await Promise.allSettled([app.loadPromise, app.bootstrapPromise, app.mountPromise]);
      await Promise.resolve();
      await Promise.resolve();
      expect(finished).toBe(false);
    },
  );

  it('observes the hidden native unmount rejection when the public rejection was handled', async () => {
    const app = load();
    await app.mountPromise;
    const raw = mocks.parcels[0];
    const unhandled: unknown[] = [];
    const listener = (reason: unknown, promise: Promise<unknown>) => {
      if (promise === raw.unmountPromise) unhandled.push(reason);
    };
    process.on('unhandledRejection', listener);
    try {
      const error = new Error('unmount failed');
      unmount.mockRejectedValueOnce(error);
      expect(await Promise.allSettled([app.unmount(), app.unmountPromise])).toEqual([
        { status: 'rejected', reason: error },
        { status: 'rejected', reason: error },
      ]);
      await setImmediate();
      expect(unhandled).toEqual([]);
    } finally {
      process.off('unhandledRejection', listener);
    }
  });

  it('observes hidden load and bootstrap rejections when a cold remount fails', async () => {
    const app = load();
    await app.mountPromise;
    await app.unmount();
    await vi.advanceTimersByTimeAsync(defaultIdleCachePolicy.idleTTL);
    mocks.loadApp.mockRejectedValueOnce(new Error('cold source failed'));
    const hidden: Promise<unknown>[] = [],
      unhandled: unknown[] = [];
    const listener = (reason: unknown, promise: Promise<unknown>) => {
      if (hidden.includes(promise)) unhandled.push(reason);
    };
    process.on('unhandledRejection', listener);
    try {
      const remounting = app.mount();
      const raw = mocks.parcels[mocks.parcels.length - 1];
      hidden.push(raw.loadPromise, raw.bootstrapPromise, raw.unmountPromise);
      await expect(remounting).rejects.toThrow('cold source failed');
      await setImmediate();
      expect(unhandled).toEqual([]);
    } finally {
      process.off('unhandledRejection', listener);
    }
  });

  it('retains update capability while idle without letting an invalid update retire the cache', async () => {
    const app = load();
    await app.mountPromise;
    const originalUpdate = app.update;
    await app.unmount();
    expect(app.update).toBe(originalUpdate);
    await expect(originalUpdate!({})).rejects.toThrow();
    await app.mount();
    expect(bootstrap).toHaveBeenCalledTimes(1);
  });

  it('allows remounting directly from the first unmount promise callback', async () => {
    const app = load();
    await app.mountPromise;
    const remounting = app.unmountPromise.then(() => app.mount());
    await app.unmount();
    expect(await remounting).toBeNull();
    expect(app.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect(bootstrap).toHaveBeenCalledTimes(1);
  });

  it('rejects a duplicate remount without replacing or retiring the pending cycle', async () => {
    const app = load();
    await app.mountPromise;
    await app.unmount();
    const started = new Deferred<void>(),
      finish = new Deferred<void>();
    mount.mockImplementationOnce(async () => {
      started.resolve();
      await finish.promise;
    });
    const remounting = app.mount();
    const duplicate = app.mount();
    const rejected = expect(duplicate).rejects.toMatchObject({ code: 'app-already-mounted' });
    await started.promise;
    finish.resolve();
    expect(await remounting).toBeNull();
    await rejected;
    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(2);
  });
});
