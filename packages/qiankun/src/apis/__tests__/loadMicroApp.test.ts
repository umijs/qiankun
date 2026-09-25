/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Deferred } from '@qiankunjs/shared';
import { AppOrParcelStatus, type ParcelConfigObject } from '@qiankunjs/single-spa';
import { type ParcelConfigObjectGetter } from '../../core/loadApp';
import { type MicroApp } from '../../types';

const mocks = vi.hoisted(() => ({ loadApp: vi.fn() }));
vi.mock('../../core/loadApp', () => ({ default: mocks.loadApp }));

import { loadMicroApp } from '../loadMicroApp';

const bootstrap = vi.fn(async () => {});
const mount = vi.fn(async (_props: { container: HTMLElement }) => {});
const unmount = vi.fn(async () => {});
const parcels: MicroApp[] = [];
// Generations are cached by name for the page's lifetime, so every test uses its own app name.
let appName = '';
let appSequence = 0;

/** A loadApp getter; `occupied` models a load hold ① or mount hold ② still held. */
function getterOf(config: (container: HTMLElement) => ParcelConfigObject = mountInto, occupied = () => false) {
  const getter = (container: HTMLElement) => config(container);
  return Object.defineProperty(getter, 'occupiesContainer', { get: occupied }) as ParcelConfigObjectGetter;
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
    mocks.loadApp.mockImplementation(async () => getterOf());
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

  it('evicts an instance whose bootstrap failed instead of mounting it unbootstrapped', async () => {
    bootstrap.mockRejectedValueOnce(new Error('bootstrap failed'));
    const [container, next] = containers(2);
    const failed = load(container);
    await expect(failed.mountPromise).rejects.toThrow('bootstrap failed');

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
});
