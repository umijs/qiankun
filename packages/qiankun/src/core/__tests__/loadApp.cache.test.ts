/** @vitest-environment happy-dom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type LoaderOpts } from '@qiankunjs/loader';
import { Deferred } from '@qiankunjs/shared';
import { nativeGlobal } from '@qiankunjs/sandbox';
import { AppOrParcelStatus } from '@qiankunjs/single-spa';
import { type MicroApp } from '../../types';

const mocks = vi.hoisted(() => ({ loadEntry: vi.fn(), beforeDispose: vi.fn(async () => {}) }));
vi.mock('@qiankunjs/loader', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  loadEntry: mocks.loadEntry,
}));
vi.mock('@qiankunjs/sandbox', async (importOriginal) => {
  const original = await importOriginal<typeof import('@qiankunjs/sandbox')>();
  return {
    ...original,
    createSandbox: (...args: Parameters<typeof original.createSandbox>) => {
      const controller = original.createSandbox(...args);
      return {
        ...controller,
        dispose: async () => {
          await mocks.beforeDispose();
          await controller.dispose();
        },
      };
    },
  };
});
import { loadMicroApp } from '../../apis/loadMicroApp';
import { defaultIdleCachePolicy } from '../idleInstanceCache';

const bootstrap = vi.fn(async (_context: unknown) => {});
const mount = vi.fn(async (_props: { container: HTMLElement }) => {});
const unmount = vi.fn(async () => {});
const handles: MicroApp[] = [];
const liveBridges = () =>
  Object.getOwnPropertyNames(nativeGlobal).filter((key) => key.startsWith('__compartment_globalThis__'));
let sequence = 0;

describe('loadMicroApp real sandbox reclamation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<qiankun-head></qiankun-head><main></main>', { status: 200 })),
    );
    mocks.loadEntry.mockImplementation((_entry: unknown, container: HTMLElement, opts: LoaderOpts) => {
      container.innerHTML = '<qiankun-head></qiankun-head><main></main>';
      opts.onDOMStreamSettled?.();
      return Promise.resolve({ bootstrap, mount, unmount });
    });
  });
  afterEach(async () => {
    for (const app of handles) if (app.getStatus() === AppOrParcelStatus.MOUNTED) await app.unmount();
    await vi.advanceTimersByTimeAsync(defaultIdleCachePolicy.idleTTL);
    handles.length = 0;
    document.body.replaceChildren();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it('releases the host global bridge on expiry and cold-loads a previously unmounted handle', async () => {
    const baseline = liveBridges();
    const container = document.createElement('div');
    document.body.append(container);
    const descriptor = {
      name: `real-cache-${String(++sequence)}`,
      entry: 'https://real-cache.test/',
      container,
      props: { accountId: '42', container, entry: 'prop-entry' },
    };
    const app = loadMicroApp(descriptor);
    handles.push(app);
    await app.mountPromise;
    expect(liveBridges()).toHaveLength(baseline.length + 1);
    await app.unmount();
    expect(liveBridges()).toHaveLength(baseline.length + 1);
    await vi.advanceTimersByTimeAsync(defaultIdleCachePolicy.idleTTL);
    expect(liveBridges()).toEqual(baseline);
    await app.mount();
    expect(liveBridges()).toHaveLength(baseline.length + 1);
    expect(bootstrap).toHaveBeenCalledTimes(2);
    for (const [context] of bootstrap.mock.calls) {
      expect(context).toEqual({ name: descriptor.name, entry: descriptor.entry });
      expect(Object.isFrozen(context)).toBe(true);
    }
    expect(bootstrap.mock.calls[1][0]).not.toBe(bootstrap.mock.calls[0][0]);
    expect(mount).toHaveBeenLastCalledWith(expect.objectContaining({ container }));
  });

  it('does not clear a successor app DOM when an old idle sandbox is disposed', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const first = loadMicroApp({
      name: `retired-${String(++sequence)}`,
      entry: 'https://real-cache.test/old',
      container,
    });
    handles.push(first);
    await first.mountPromise;
    await first.unmount();
    const second = loadMicroApp({
      name: `successor-${String(sequence)}`,
      entry: 'https://real-cache.test/new',
      container,
    });
    handles.push(second);
    await second.mountPromise;
    const marker = document.createElement('p');
    marker.textContent = 'successor stays visible';
    container.append(marker);
    await vi.advanceTimersByTimeAsync(defaultIdleCachePolicy.idleTTL);
    expect(container.contains(marker)).toBe(true);
    expect(second.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
    await second.unmount();
    await first.mount();
    expect(container.querySelector('main')).not.toBeNull();
    expect(first.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });

  it('preserves the new same-name sandbox when old disposal finishes after a cold remount', async () => {
    const baseline = liveBridges();
    const container = document.createElement('div');
    document.body.append(container);
    const app = loadMicroApp({
      name: `dispose-race-${String(++sequence)}`,
      entry: 'https://real-cache.test/',
      container,
    });
    handles.push(app);
    await app.mountPromise;
    await app.unmount();
    const finishDisposal = new Deferred<void>();
    mocks.beforeDispose.mockImplementationOnce(() => finishDisposal.promise);
    await vi.advanceTimersByTimeAsync(defaultIdleCachePolicy.idleTTL);
    await app.mount();
    expect(liveBridges()).toHaveLength(baseline.length + 2);
    const marker = document.createElement('p');
    container.append(marker);
    const name = container.dataset.name;
    finishDisposal.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(liveBridges()).toHaveLength(baseline.length + 1);
    expect(container.contains(marker)).toBe(true);
    expect(container.dataset.name).toBe(name);
    expect(app.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
  });
});
