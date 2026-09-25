/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Deferred } from '@qiankunjs/shared';
import { addErrorHandler, AppOrParcelStatus, type ParcelConfigObject, removeErrorHandler } from '@qiankunjs/single-spa';
import { type LoadAppControl, type ParcelConfigObjectGetter } from '../../core/loadApp';
import { type MicroApp } from '../../types';

const mocks = vi.hoisted(() => ({ loadApp: vi.fn(), dispose: vi.fn(async () => {}) }));
vi.mock('../../core/loadApp', () => ({ default: mocks.loadApp }));

import { loadMicroApp, unloadMicroApp } from '../loadMicroApp';

const bootstrap = vi.fn(async () => {});
const mount = vi.fn(async (_props: { container: HTMLElement }) => {});
const unmount = vi.fn(async () => {});
const parcels: MicroApp[] = [];
// Generations are cached by name for the page's lifetime, so every test uses its own app name.
let appName = '';
let appSequence = 0;

/**
 * A loadApp getter; `occupied` models a load hold ① or mount hold ② still held, `loadPhaseOpen` an
 * entry still streaming into its original container.
 */
function getterOf(
  config: (container: HTMLElement) => ParcelConfigObject = mountInto,
  occupied = () => false,
  loadPhaseOpen = () => false,
) {
  const getter = (container: HTMLElement) => config(container);
  return Object.defineProperties(getter, {
    occupiesContainer: { get: occupied },
    loadPhaseOpen: { get: loadPhaseOpen },
  }) as ParcelConfigObjectGetter;
}

function mountInto(container: HTMLElement): ParcelConfigObject {
  return { bootstrap, mount: async () => mount({ container }), unmount };
}

function load(container: HTMLElement, name = appName, entry = `https://example.test/${name}.html`) {
  const parcel = loadMicroApp({ name, container, entry });
  parcels.push(parcel);
  return parcel;
}

function containers(count: number) {
  const elements = Array.from({ length: count }, () => document.createElement('div'));
  document.body.append(...elements);
  return elements;
}

describe('loadMicroApp instance reuse', () => {
  beforeEach(() => {
    appName = `app-${String(++appSequence)}`;
    mocks.loadApp.mockImplementation(async (_app, _configuration, _lifeCycles, control) => {
      control.onDispose(mocks.dispose);
      return getterOf();
    });
  });

  afterEach(async () => {
    for (const parcel of parcels) {
      if (parcel.getStatus() === AppOrParcelStatus.MOUNTED) await parcel.unmount();
    }
    parcels.length = 0;
    document.body.replaceChildren();
    vi.resetAllMocks();
  });

  it('keeps warm remounts on the same element after its document position changes', async () => {
    const [sibling, container] = containers(2);
    const first = load(container);
    await first.mountPromise;
    await first.unmount();
    sibling.remove();

    const second = load(container);
    await second.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);
    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(2);
  });

  it('reuses the idle instance when every mount renders a fresh container element', async () => {
    const rounds = 5;
    for (let round = 0; round < rounds; round++) {
      const [container] = containers(1);
      const app = load(container);
      await app.mountPromise;
      expect(mount).toHaveBeenLastCalledWith({ container });
      await app.unmount();
      container.remove();
    }
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);
    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(rounds);
  });

  it('leaves the former container alone once its idle instance moves to a new element', async () => {
    const [former, next] = containers(2);
    const first = load(former);
    await first.mountPromise;
    await first.unmount();
    const hostContent = document.createElement('p');
    former.append(hostContent);

    const second = load(next);
    await second.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenLastCalledWith({ container: next });
    expect([...former.childNodes]).toEqual([hostContent]);
    expect(first.getStatus()).toBe(AppOrParcelStatus.NOT_MOUNTED);

    // The generation now works on `next`; a load into the former element gets its own copy.
    const third = load(former);
    await third.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });

  it('creates a separate instance for each container mounted at the same time', async () => {
    const [left, right] = containers(2);
    const apps = [load(left), load(right)];
    await Promise.all(apps.map((app) => app.mountPromise));
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(bootstrap).toHaveBeenCalledTimes(2);
    expect(mount.mock.calls).toEqual([[{ container: left }], [{ container: right }]]);
  });

  it('mounts a new tab right away after an earlier sibling is removed (#2368)', async () => {
    const tabContainers = containers(3);
    const tabs = tabContainers.map((container) => load(container));
    await Promise.all(tabs.map((tab) => tab.mountPromise));
    await tabs[0].unmount();
    tabContainers[0].remove();

    // The new element takes over the removed tab's idle instance, never a mounted sibling's.
    const [newContainer] = containers(1);
    const fourth = load(newContainer);
    await fourth.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(3);
    expect(bootstrap).toHaveBeenCalledTimes(3);
    expect(mount).toHaveBeenLastCalledWith({ container: newContainer });
    expect(tabs[1].getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect(tabs[2].getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });

  it('loads from scratch when the entry changes', async () => {
    const [container] = containers(1);
    const first = load(container, appName, 'https://example.test/v1.html');
    await first.mountPromise;
    await first.unmount();

    await load(container, appName, 'https://example.test/v2.html').mountPromise;
    await load(document.createElement('div'), appName, 'https://example.test/v2.html').mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(3);
    expect(bootstrap).toHaveBeenCalledTimes(3);
  });

  it('does not reuse an instance that still occupies a container', async () => {
    let occupied = true;
    mocks.loadApp.mockImplementationOnce(async () => getterOf(mountInto, () => occupied));
    const [former, next, last] = containers(3);
    const first = load(former);
    await first.mountPromise;
    await first.unmount();

    // e.g. a load hold ① whose entry stream is still writing into the former container
    await load(next).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);

    occupied = false;
    await load(last).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(mount).toHaveBeenLastCalledWith({ container: last });
  });

  it('prefers the most recently idle instance', async () => {
    const mounts = [vi.fn(async () => {}), vi.fn(async () => {})];
    for (const spy of mounts) {
      mocks.loadApp.mockImplementationOnce(async () => getterOf(() => ({ bootstrap, mount: spy, unmount })));
    }
    const [left, right, next] = containers(3);
    const apps = [load(left), load(right)];
    await Promise.all(apps.map((app) => app.mountPromise));
    await apps[1].unmount();
    await apps[0].unmount();

    await load(next).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(mounts[0]).toHaveBeenCalledTimes(2);
    expect(mounts[1]).toHaveBeenCalledTimes(1);
  });

  it('queues behind an instance still unmounting from the element it was just swapped out of', async () => {
    const unmounting = new Deferred<void>();
    unmount.mockImplementationOnce(() => unmounting.promise);
    const [former, next] = containers(2);
    const first = load(former);
    await first.mountPromise;

    // What a binding does when it swaps elements: ask the old one to unmount, then load the new.
    const firstUnmount = first.unmount();
    const second = load(next);
    await second.bootstrapPromise;
    await vi.waitFor(() => expect(unmount).toHaveBeenCalledTimes(1));
    expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTING);
    expect(mount).toHaveBeenCalledTimes(1);

    unmounting.resolve();
    await firstUnmount;
    await second.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);
    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(mount.mock.calls).toEqual([[{ container: former }], [{ container: next }]]);
  });

  it('lets only one newcomer queue behind a draining instance', async () => {
    const unmounting = new Deferred<void>();
    unmount.mockImplementationOnce(() => unmounting.promise);
    const [former, next, last] = containers(3);
    const first = load(former);
    await first.mountPromise;

    const firstUnmount = first.unmount();
    const second = load(next);
    // `second` now waits to mount on the same generation, so it is no longer draining.
    const third = load(last);
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);

    unmounting.resolve();
    await firstUnmount;
    await Promise.all([second.mountPromise, third.mountPromise]);
    expect(bootstrap).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['is still mounting', false],
    ['was asked to unmount while still mounting', true],
  ])('does not share an instance that %s', async (_label, requestUnmount) => {
    const mounting = new Deferred<void>();
    mount.mockImplementationOnce(() => mounting.promise);
    const [former, next] = containers(2);
    const first = load(former);
    await first.bootstrapPromise;
    await vi.waitFor(() => expect(mount).toHaveBeenCalledTimes(1));
    const firstUnmount = requestUnmount ? first.unmount() : undefined;

    const second = load(next);
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);

    mounting.resolve();
    await Promise.all([first.mountPromise, second.mountPromise, firstUnmount]);
    expect(bootstrap).toHaveBeenCalledTimes(2);
  });

  it('prefers an idle instance over a draining one', async () => {
    const mounts = [vi.fn(async () => {}), vi.fn(async () => {})];
    for (const spy of mounts) {
      mocks.loadApp.mockImplementationOnce(async () => getterOf(() => ({ bootstrap, mount: spy, unmount })));
    }
    const [left, right, next] = containers(3);
    const apps = [load(left), load(right)];
    await Promise.all(apps.map((app) => app.mountPromise));
    await apps[0].unmount();
    const unmounting = new Deferred<void>();
    unmount.mockImplementationOnce(() => unmounting.promise);
    const drainingUnmount = apps[1].unmount();

    // The idle copy is usable right away, even though the draining one was released more recently.
    await load(next).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(mounts[0]).toHaveBeenCalledTimes(2);
    expect(mounts[1]).toHaveBeenCalledTimes(1);

    unmounting.resolve();
    await drainingUnmount;
  });

  it('does not move an unmounting instance whose entry is still streaming', async () => {
    let streaming = true;
    mocks.loadApp.mockImplementationOnce(async () =>
      getterOf(
        mountInto,
        () => true,
        () => streaming,
      ),
    );
    const unmounting = new Deferred<void>();
    unmount.mockImplementationOnce(() => unmounting.promise);
    const [former, next, last] = containers(3);
    const first = load(former);
    await first.mountPromise;
    const firstUnmount = first.unmount();

    await load(next).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);

    // Once the stream is done, the same unmounting instance may take a newcomer.
    streaming = false;
    const third = load(last);
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    unmounting.resolve();
    await firstUnmount;
    await third.mountPromise;
    expect(mount).toHaveBeenLastCalledWith({ container: last });
  });

  it('still mounts the queued newcomer when the draining predecessor fails to unmount', async () => {
    const unmounting = new Deferred<void>();
    unmount.mockImplementationOnce(() => unmounting.promise);
    const [former, next] = containers(2);
    const first = load(former);
    await first.mountPromise;

    const firstUnmount = first.unmount();
    const second = load(next);
    await second.bootstrapPromise;
    await vi.waitFor(() => expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTING));
    expect(mount).toHaveBeenCalledTimes(1);
    unmounting.reject(new Error('unmount failed'));
    await expect(firstUnmount).rejects.toThrow('unmount failed');
    // The predecessor leaves the queue however its unmount ends, so the newcomer takes its turn.
    await second.mountPromise;
    expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);
    expect(mount.mock.calls).toEqual([[{ container: former }], [{ container: next }]]);
  });

  it('does not share an instance while a retained handle waits to remount on it', async () => {
    const [left, right, last] = containers(3);
    const first = load(left);
    await first.mountPromise;
    await first.unmount();
    const second = load(right);
    await second.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);

    // The retained handle queues behind `second`, so unmounting `second` still leaves a mount.
    const remount = first.mount();
    const secondUnmount = second.unmount();
    const third = load(last);
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);

    await Promise.all([remount, secondUnmount, third.mountPromise]);
    expect(first.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect(third.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });

  it('unloads a newcomer queued behind a draining instance together with it', async () => {
    const unmounting = new Deferred<void>();
    unmount.mockImplementationOnce(() => unmounting.promise);
    const [former, next] = containers(2);
    const first = load(former);
    await first.mountPromise;
    const firstUnmount = first.unmount();
    const second = load(next);
    await second.bootstrapPromise;
    await vi.waitFor(() => expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTING));

    const rejected = expect(second.mountPromise).rejects.toThrow('has been unloaded');
    const unloading = unloadMicroApp(appName);
    unmounting.resolve();
    await firstUnmount;
    await unloading;
    await rejected;
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(1);
    expect(mocks.dispose).toHaveBeenCalledTimes(1);
    expect([...former.childNodes, ...next.childNodes]).toEqual([]);
  });

  it('serializes a retained handle remount with the instance that took over its sandbox', async () => {
    const [left, right] = containers(2);
    const first = load(left);
    await first.mountPromise;
    await first.unmount();
    const second = load(right);
    await second.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);

    const remount = first.mount();
    await new Promise((resolve) => setTimeout(resolve));
    expect(mount).toHaveBeenCalledTimes(2);
    await second.unmount();
    await remount;
    expect(mount).toHaveBeenCalledTimes(3);
    expect(mount).toHaveBeenLastCalledWith({ container: left });
  });

  it('keeps different app names in the same container separate', async () => {
    const container = document.createElement('div');
    const first = load(container, `${appName}-a`);
    await first.mountPromise;
    await first.unmount();
    await load(container, `${appName}-b`).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(bootstrap).toHaveBeenCalledTimes(2);
  });

  it('shares a pending load but waits for the predecessor before mounting the cached parcel', async () => {
    const pending = new Deferred<ParcelConfigObjectGetter>();
    mocks.loadApp.mockReturnValueOnce(pending.promise);
    const container = document.createElement('div');
    const first = load(container);
    const second = load(container);
    expect(mocks.loadApp).toHaveBeenCalledTimes(1);

    pending.resolve(getterOf());
    await first.mountPromise;
    await second.bootstrapPromise;
    await vi.waitFor(() => expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTING));
    expect(mount).toHaveBeenCalledTimes(1);
    await first.unmount();
    await second.mountPromise;
    expect(bootstrap).toHaveBeenCalledTimes(1);
    expect(mount).toHaveBeenCalledTimes(2);
  });

  it('evicts a failed load so the same name and container can retry', async () => {
    mocks.loadApp.mockRejectedValueOnce(new Error('entry fetch failed'));
    const container = document.createElement('div');
    const failed = load(container);
    const results = await Promise.allSettled([failed.loadPromise, failed.bootstrapPromise, failed.mountPromise]);
    expect(results.every((result) => result.status === 'rejected')).toBe(true);

    await load(container).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(bootstrap).toHaveBeenCalledTimes(1);
  });

  it('disposes of an instance whose bootstrap failed instead of mounting it unbootstrapped', async () => {
    bootstrap.mockRejectedValueOnce(new Error('bootstrap failed'));
    const [container, next] = containers(2);
    const failed = load(container);
    const sibling = load(container);
    await expect(failed.mountPromise).rejects.toThrow('bootstrap failed');
    await expect(sibling.mountPromise).rejects.toThrow('bootstrap failed');
    expect(mocks.dispose).toHaveBeenCalledTimes(1);

    await load(next).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(bootstrap).toHaveBeenCalledTimes(2);
    expect(mount).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['attached', true],
    ['detached', false],
  ])('does not queue a later %s load behind a failed first load', async (_label, attached) => {
    mocks.loadApp.mockRejectedValueOnce(new Error('entry fetch failed'));
    const container = document.createElement('div');
    if (attached) document.body.append(container);
    const failed = load(container);
    await Promise.allSettled([failed.loadPromise, failed.bootstrapPromise, failed.mountPromise]);

    const retry = load(container);
    await retry.mountPromise;
    await retry.unmount();

    const third = load(container);
    await third.mountPromise;
    expect(third.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
  });

  it('unloads the whole cached generation and evaluates a fresh generation on reload', async () => {
    const container = document.createElement('div');
    const first = load(container);
    await first.mountPromise;
    await first.unload();
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(mocks.dispose).toHaveBeenCalledTimes(1);
    expect(first.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
    await expect(first.mount()).rejects.toMatchObject({ code: 'app-unloaded' });
    await expect(first.unmount()).resolves.toBeNull();
    await first.unload();
    expect(mocks.dispose).toHaveBeenCalledTimes(1);
    await load(container).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(bootstrap).toHaveBeenCalledTimes(2);
  });

  it('cancels queued siblings without waiting for their mount promises', async () => {
    const container = document.createElement('div');
    const first = load(container);
    await first.mountPromise;
    const queued = load(container);
    await queued.bootstrapPromise;
    await vi.waitFor(() => expect(queued.getStatus()).toBe(AppOrParcelStatus.MOUNTING));
    const rejected = expect(queued.mountPromise).rejects.toThrow('has been unloaded');
    await first.unload();
    await rejected;
    expect(mount).toHaveBeenCalledTimes(1);
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(queued.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
    await expect(queued.mount()).rejects.toThrow('has been unloaded');
  });

  it('unloads a pending initial load and ignores a late configuration getter', async () => {
    const pending = new Deferred<ParcelConfigObjectGetter>();
    mocks.loadApp.mockReturnValueOnce(pending.promise);
    const container = document.createElement('div');
    const first = load(container);
    const rejected = expect(first.mountPromise).rejects.toThrow('has been unloaded');
    await first.unload();
    await rejected;
    const getter = vi.fn(() => ({ bootstrap, mount, unmount }));
    pending.resolve(getter);
    await Promise.resolve();
    expect(getter).not.toHaveBeenCalled();
    await load(container).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
  });

  it('named unload disposes of every instance of the app, mounted or idle', async () => {
    const [left, right, other] = containers(3);
    const mounted = load(left);
    const idle = load(right);
    const unrelated = load(other, `${appName}-other`);
    await Promise.all([mounted, idle, unrelated].map((app) => app.mountPromise));
    await idle.unmount();

    await unloadMicroApp(appName);
    expect(mocks.dispose).toHaveBeenCalledTimes(2);
    expect(mounted.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
    expect(idle.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
    expect(unrelated.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect([...left.childNodes, ...right.childNodes]).toEqual([]);

    await load(right).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(4);
    await unloadMicroApp('unknown');
  });

  it('a handle unloads only its own instance and a stale handle cannot unload the next one', async () => {
    const [left, right] = containers(2);
    const first = load(left);
    const second = load(right);
    await Promise.all([first.mountPromise, second.mountPromise]);
    await first.unload();
    expect(mocks.dispose).toHaveBeenCalledTimes(1);
    expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTED);

    await second.unmount();
    const replacement = load(left);
    await replacement.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    await first.unload();
    expect(replacement.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });

  it('does not report a remount cancelled by unload as an application error', async () => {
    const errors = vi.fn();
    addErrorHandler(errors);
    const remountEntered = new Deferred<void>();
    mocks.loadApp.mockImplementationOnce(async (_app, _configuration, _lifeCycles, control: LoadAppControl) => {
      control.onDispose!(mocks.dispose);
      let mounts = 0;
      return getterOf(() => ({
        bootstrap,
        unmount,
        mount: async () => {
          if (++mounts === 1) return;
          remountEntered.resolve();
          // loadApp rejects its gate, fetch and replay waits with the unload reason
          await new Promise((_resolve, reject) => {
            control.signal!.addEventListener('abort', () => reject(control.signal!.reason as Error));
          });
        },
      }));
    });
    try {
      const app = load(document.createElement('div'));
      await app.mountPromise;
      await app.unmount();
      const remount = app.mount();
      await remountEntered.promise;
      await app.unload();
      await remount;
      await new Promise((resolve) => setTimeout(resolve));
      expect(errors).not.toHaveBeenCalled();
      expect(app.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
      expect(mocks.dispose).toHaveBeenCalledTimes(1);
    } finally {
      removeErrorHandler(errors);
    }
  });

  it('disposes and invalidates even when the application unmount fails', async () => {
    const container = document.createElement('div');
    const first = load(container);
    await first.mountPromise;
    unmount.mockRejectedValueOnce(new Error('unmount failed'));
    await expect(first.unload()).rejects.toThrow('unmount failed');
    expect(mocks.dispose).toHaveBeenCalledTimes(1);
    await expect(first.mount()).rejects.toThrow('has been unloaded');
    await load(container).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
  });
  it('reports a non-Error terminal cleanup failure with its stable code', async () => {
    const container = document.createElement('div');
    const first = load(container);
    await first.mountPromise;
    // single-spa already wraps lifecycle rejections into Errors; terminal disposal (for example a
    // sandbox plugin dispose hook) is where a non-Error value can still surface.
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- Simulate cleanup rejecting with a non-Error value.
    mocks.dispose.mockImplementationOnce(() => Promise.reject('dispose failed'));
    await expect(first.unload()).rejects.toMatchObject({
      code: 'app-teardown-failed',
      message: expect.stringContaining('dispose failed'),
    });
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('drains an entered update before unmount and terminal disposal', async () => {
    const updating = new Deferred<void>();
    const update = vi.fn(() => updating.promise);
    mocks.loadApp.mockImplementationOnce(async (_app, _configuration, _lifeCycles, control) => {
      control.onDispose(mocks.dispose);
      return () => ({ bootstrap, mount, unmount, update });
    });
    const app = load(document.createElement('div'));
    await app.mountPromise;
    const updatePromise = app.update!({});
    await vi.waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    const unloading = app.unload();
    expect(unmount).not.toHaveBeenCalled();
    expect(mocks.dispose).not.toHaveBeenCalled();
    updating.resolve();
    await updatePromise;
    await unloading;
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(mocks.dispose).toHaveBeenCalledTimes(1);
  });
});
