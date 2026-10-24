/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Deferred } from '@qiankunjs/shared';
import { AppOrParcelStatus, type ParcelConfigObject } from '@qiankunjs/single-spa';
import { type ParcelConfigObjectGetter } from '../../core/loadApp';
import { defaultIdleCachePolicy } from '../../core/idleInstanceCache';
import { type MicroApp, type ObjectType } from '../../types';

const mocks = vi.hoisted(() => ({ loadApp: vi.fn() }));
vi.mock('../../core/loadApp', () => ({ default: mocks.loadApp }));
import { loadMicroApp, unloadMicroApp } from '../loadMicroApp';

function loaded(open = false) {
  const settled = new Deferred<void>();
  const state = { open, occupied: false, disposed: false };
  if (!open) settled.resolve();
  const bootstrap = vi.fn(async () => {});
  const mount = vi.fn(async (_container: HTMLElement) => {
    if (state.disposed) throw new Error('mounted a disposed sandbox');
  });
  const unmount = vi.fn(async () => {});
  const update = vi.fn(async (_props: ObjectType) => {});
  const dispose = vi.fn(async () => {
    state.disposed = true;
  });
  const getter = (container: HTMLElement): ParcelConfigObject => ({
    bootstrap,
    mount: async () => mount(container),
    unmount,
    update,
  });
  return {
    state,
    settled,
    bootstrap,
    mount,
    unmount,
    update,
    dispose,
    getter: Object.defineProperties(getter, {
      dispose: { value: dispose },
      loadPhaseSettled: { value: settled.promise },
      loadPhaseOpen: { get: () => state.open },
      occupiesContainer: { get: () => state.occupied },
    }) as ParcelConfigObjectGetter,
  };
}

let sequence = 0;
let name = '';
const handles: MicroApp[] = [];
const copies: Array<ReturnType<typeof loaded>> = [];
function load(appName = name, container = document.createElement('div'), entry = '/entry') {
  const app = loadMicroApp({ name: appName, entry, container });
  handles.push(app);
  return app;
}
async function idle(app: MicroApp) {
  await app.mountPromise;
  await app.unmount();
}
const ttl = defaultIdleCachePolicy.idleTTL;

describe('loadMicroApp idle cache and durable handles', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    name = `cache-${String(++sequence)}`;
    mocks.loadApp.mockImplementation(async () => {
      const copy = loaded();
      copies.push(copy);
      return copy.getter;
    });
  });
  afterEach(async () => {
    for (const app of handles) if (app.getStatus() === AppOrParcelStatus.MOUNTED) await app.unmount();
    await vi.advanceTimersByTimeAsync(ttl);
    handles.length = 0;
    copies.length = 0;
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('evicts the least recently used idle copy globally and retains recently reused copies', async () => {
    const apps = [];
    for (let i = 0; i < defaultIdleCachePolicy.maxIdle; i++) {
      const app = load(`${name}-${String(i)}`);
      apps.push(app);
      await idle(app);
    }
    await apps[0].mount();
    await apps[0].unmount();
    await idle(load(`${name}-overflow`));
    expect(copies[0].dispose).not.toHaveBeenCalled();
    expect(copies[1].dispose).toHaveBeenCalledTimes(1);
    await apps[0].mount();
    expect(copies).toHaveLength(9);
    await apps[1].mount();
    expect(copies).toHaveLength(10);
  });

  it('keeps at most two idle copies per name and entry after a concurrent peak', async () => {
    const apps = [load(), load(), load()];
    await Promise.all(apps.map((app) => app.mountPromise));
    for (const app of apps) await app.unmount();
    await Promise.resolve();
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
    expect(copies[1].dispose).not.toHaveBeenCalled();
    expect(copies[2].dispose).not.toHaveBeenCalled();
  });

  it('uses the global limit across dynamic names and entry versions', async () => {
    for (let i = 0; i < 10; i++) await idle(load(name, document.createElement('div'), `/v${String(i)}`));
    expect(copies.filter((copy) => copy.dispose.mock.calls.length)).toHaveLength(2);
  });

  it('expires without another load and cold-loads when the old handle mounts again', async () => {
    const app = load();
    await idle(app);
    const oldUnmountPromise = app.unmountPromise;
    await vi.advanceTimersByTimeAsync(ttl);
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
    expect(app.getStatus()).toBe(AppOrParcelStatus.NOT_MOUNTED);
    const mounting = app.mount();
    expect(app.unmountPromise).toBe(oldUnmountPromise);
    expect(mounting).not.toBe(app.mountPromise);
    await mounting;
    expect(copies).toHaveLength(2);
    expect(copies[1].bootstrap).toHaveBeenCalledTimes(1);
    expect(app.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });

  it('warm-remounts the same handle repeatedly and renews TTL after every unmount', async () => {
    const app = load();
    await idle(app);
    for (let i = 0; i < 3; i++) {
      await vi.advanceTimersByTimeAsync(ttl - 1);
      await app.mount();
      await vi.advanceTimersByTimeAsync(ttl);
      expect(copies[0].dispose).not.toHaveBeenCalled();
      await app.unmount();
      await app.unmountPromise;
    }
    expect(copies).toHaveLength(1);
    expect(copies[0].bootstrap).toHaveBeenCalledTimes(1);
    expect(copies[0].mount).toHaveBeenCalledTimes(4);
    await vi.advanceTimersByTimeAsync(ttl);
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
  });

  it('checks TTL before same-container lookup even when the timer has been delayed', async () => {
    const container = document.createElement('div');
    await idle(load(name, container));
    vi.setSystemTime(Date.now() + ttl);
    await load(name, container).mountPromise;
    expect(copies).toHaveLength(2);
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
  });

  it('reserves a reused copy before asynchronous mount so expiry cannot reclaim it', async () => {
    const app = load();
    await idle(app);
    await vi.advanceTimersByTimeAsync(ttl - 1);
    const mounting = new Deferred<void>();
    copies[0].mount.mockImplementationOnce(() => mounting.promise);
    const remounting = app.mount();
    await vi.advanceTimersByTimeAsync(ttl * 2);
    expect(copies[0].dispose).not.toHaveBeenCalled();
    mounting.resolve();
    await remounting;
    expect(copies).toHaveLength(1);
  });

  it('never revives an evicted copy while its asynchronous disposal is pending', async () => {
    const app = load();
    await idle(app);
    const disposing = new Deferred<void>();
    copies[0].dispose.mockImplementationOnce(async () => {
      copies[0].state.disposed = true;
      await disposing.promise;
    });
    await vi.advanceTimersByTimeAsync(ttl);
    await app.mount();
    expect(copies).toHaveLength(2);
    expect(copies[1].mount).toHaveBeenCalledTimes(1);
    disposing.resolve();
    await Promise.resolve();
    expect(app.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
  });

  it('does not reclaim an unmounting or queued generation and serializes an old handle remount', async () => {
    const first = load();
    await idle(first);
    const second = load();
    await second.mountPromise;
    const unmounting = new Deferred<void>();
    copies[0].unmount.mockImplementationOnce(() => unmounting.promise);
    const teardown = second.unmount();
    const remounting = first.mount();
    await vi.advanceTimersByTimeAsync(ttl * 2);
    expect(copies).toHaveLength(1);
    expect(copies[0].dispose).not.toHaveBeenCalled();
    expect(first.getStatus()).toBe(AppOrParcelStatus.MOUNTING);
    unmounting.resolve();
    await teardown;
    await remounting;
    expect(copies[0].mount).toHaveBeenCalledTimes(3);
  });

  it('starts TTL only after the entry stream and container occupancy have ended', async () => {
    const copy = loaded(true);
    copies.push(copy);
    mocks.loadApp.mockResolvedValueOnce(copy.getter);
    const app = load();
    await idle(app);
    await vi.advanceTimersByTimeAsync(ttl * 2);
    expect(copy.dispose).not.toHaveBeenCalled();
    copy.state.open = false;
    copy.settled.resolve();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(ttl - 1);
    expect(copy.dispose).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(copy.dispose).toHaveBeenCalledTimes(1);
  });

  it('reports a disposal failure without restoring the failed copy to the pool', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const app = load();
    await idle(app);
    const error = new Error('dispose failed');
    copies[0].dispose.mockRejectedValueOnce(error);
    await vi.advanceTimersByTimeAsync(ttl);
    expect(warning).toHaveBeenCalledWith(expect.stringContaining('failed to dispose'), error);
    await app.mount();
    expect(copies).toHaveLength(2);
    warning.mockRestore();
  });

  it('keeps updated props when a handle cold-loads after eviction', async () => {
    const app = load();
    await app.mountPromise;
    await app.update!({ route: 'latest' });
    await app.unmount();
    await vi.advanceTimersByTimeAsync(ttl);
    await app.mount();
    expect(mocks.loadApp).toHaveBeenLastCalledWith(
      expect.objectContaining({ props: { route: 'latest' } }),
      undefined,
      undefined,
      expect.objectContaining({ signal: expect.any(AbortSignal), onDispose: expect.any(Function) }),
    );
  });

  it('rejects a repeated unmount after the queued teardown without retiring a healthy sandbox', async () => {
    const app = load();
    await app.mountPromise;
    const finished = new Deferred<void>();
    copies[0].unmount.mockImplementationOnce(() => finished.promise);
    const first = app.unmount();
    const second = expect(app.unmount()).rejects.toMatchObject({ code: 'app-not-mounted' });
    finished.resolve();
    await first;
    await second;
    await app.mount();
    expect(copies).toHaveLength(1);
    expect(copies[0].bootstrap).toHaveBeenCalledTimes(1);
  });

  it('retires a sandbox after update fails instead of keeping a broken cache entry', async () => {
    const app = load();
    await app.mountPromise;
    copies[0].update.mockRejectedValueOnce(new Error('update failed'));
    await expect(app.update!({})).rejects.toThrow('update failed');
    await Promise.resolve();
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
    await load().mountPromise;
    expect(copies).toHaveLength(2);
  });

  it('keeps explicit unload terminal after a reclaimed handle cold-loads again', async () => {
    const app = load();
    await idle(app);
    await vi.advanceTimersByTimeAsync(ttl);
    await app.mount();
    await app.unload();
    expect(copies.map((copy) => copy.dispose.mock.calls.length)).toEqual([1, 1]);
    expect(app.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
    await expect(app.mount()).rejects.toMatchObject({ code: 'app-unloaded' });
    await expect(app.unmount()).rejects.toMatchObject({ code: 'app-unloaded' });
  });

  it('explicitly unloads an idle copy before expiry without disposing it twice', async () => {
    const app = load();
    await idle(app);
    await unloadMicroApp(name);
    await vi.advanceTimersByTimeAsync(ttl);
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
    await expect(app.mount()).rejects.toMatchObject({ code: 'app-unloaded' });
    await load().mountPromise;
    expect(copies).toHaveLength(2);
  });

  it('can permanently invalidate a handle whose cached copy was already reclaimed', async () => {
    const app = load();
    await idle(app);
    await vi.advanceTimersByTimeAsync(ttl);
    await app.unload();
    await expect(app.mount()).rejects.toMatchObject({ code: 'app-unloaded' });
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
    expect(copies).toHaveLength(1);
  });

  it('removes a generation from lookup before disposal invokes another load', async () => {
    const app = load();
    await idle(app);
    copies[0].dispose.mockImplementationOnce(async () => {
      await load().mountPromise;
    });
    await vi.advanceTimersByTimeAsync(ttl);
    expect(copies).toHaveLength(2);
    expect(copies[1].mount).toHaveBeenCalledTimes(1);
    expect(copies[0].dispose).toHaveBeenCalledTimes(1);
  });
});
