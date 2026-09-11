/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Deferred } from '@qiankunjs/shared';
import { AppOrParcelStatus, type ParcelConfigObject } from '@qiankunjs/single-spa';
import { type ParcelConfigObjectGetter } from '../../core/loadApp';
import { type MicroApp } from '../../types';

const mocks = vi.hoisted(() => ({ loadApp: vi.fn(), dispose: vi.fn(async () => {}) }));
vi.mock('../../core/loadApp', () => ({ default: mocks.loadApp }));

import { loadMicroApp, unloadMicroApp } from '../loadMicroApp';

const bootstrap = vi.fn(async () => {});
const mount = vi.fn(async () => {});
const unmount = vi.fn(async () => {});
const parcels: MicroApp[] = [];

function load(container: HTMLElement, name = 'same-app') {
  const parcel = loadMicroApp({ name, container, entry: `https://example.test/${name}.html` });
  parcels.push(parcel);
  return parcel;
}

describe('loadMicroApp container identity', () => {
  beforeEach(() => {
    mocks.loadApp.mockImplementation(async (_app, _configuration, _lifeCycles, control) => {
      control.onDispose(mocks.dispose);
      const config: ParcelConfigObject = { bootstrap, mount, unmount };
      return (_container: HTMLElement) => config;
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
    const sibling = document.createElement('div');
    const container = document.createElement('div');
    document.body.append(sibling, container);
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

  it('loads each new tab independently after an earlier sibling is removed', async () => {
    const containers = Array.from({ length: 3 }, () => document.createElement('div'));
    document.body.append(...containers);
    const tabs = containers.map((container) => load(container));
    await Promise.all(tabs.map((tab) => tab.mountPromise));
    await tabs[0].unmount();
    containers[0].remove();

    const newContainer = document.createElement('div');
    document.body.append(newContainer);
    const fourth = load(newContainer);
    await fourth.mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(4);
    expect(bootstrap).toHaveBeenCalledTimes(4);
    expect(tabs[1].getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    expect(tabs[2].getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });

  it('loads a replacement element at the same document position from scratch', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const first = load(container);
    await first.mountPromise;
    await first.unmount();
    const replacement = document.createElement('div');
    container.replaceWith(replacement);

    await load(replacement).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(bootstrap).toHaveBeenCalledTimes(2);
  });

  it('uses element identity for detached containers too', async () => {
    const container = document.createElement('div');
    const first = load(container);
    await first.mountPromise;
    await first.unmount();
    await load(container).mountPromise;
    await load(document.createElement('div')).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(2);
    expect(bootstrap).toHaveBeenCalledTimes(2);
    expect(mount).toHaveBeenCalledTimes(3);
  });

  it('keeps different app names in the same container separate', async () => {
    const container = document.createElement('div');
    const first = load(container, 'app-a');
    await first.mountPromise;
    await first.unmount();
    await load(container, 'app-b').mountPromise;
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

    pending.resolve(() => ({ bootstrap, mount, unmount }));
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
  it('unloads the whole cached generation and evaluates a fresh generation on reload', async () => {
    const container = document.createElement('div');
    const first = load(container);
    await first.mountPromise;
    await first.unload();
    expect(unmount).toHaveBeenCalledTimes(1);
    expect(mocks.dispose).toHaveBeenCalledTimes(1);
    expect(first.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
    await expect(first.mount()).rejects.toThrow('has been unloaded');
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

  it('named unload targets one container and stale handles cannot evict its replacement', async () => {
    const container = document.createElement('div');
    const other = document.createElement('div');
    const first = load(container);
    const independent = load(other);
    await Promise.all([first.mountPromise, independent.mountPromise]);
    await unloadMicroApp('same-app', container);
    expect(independent.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    const replacement = load(container);
    await replacement.mountPromise;
    await first.unload();
    expect(replacement.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    await replacement.unmount();
    await load(container).mountPromise;
    expect(mocks.loadApp).toHaveBeenCalledTimes(3);
    await unloadMicroApp('unknown', container);
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
