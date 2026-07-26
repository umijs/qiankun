/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoaderOpts } from '@qiankunjs/loader';

const mocks = vi.hoisted(() => ({
  createSandbox: vi.fn(),
  dispose: vi.fn(async () => {}),
  loadEntry: vi.fn(),
  mount: vi.fn(async () => {}),
  unmount: vi.fn(async () => {}),
}));

vi.mock('@qiankunjs/loader', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  loadEntry: mocks.loadEntry,
}));

vi.mock('@qiankunjs/sandbox', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createSandbox: mocks.createSandbox,
}));

import type { MicroAppLifeCycles, ObjectType } from '../../types';
import loadApp from '../loadApp';

const lifecycle = async (): Promise<void> => {};
const validLifecycles: MicroAppLifeCycles = {
  bootstrap: lifecycle,
  mount: lifecycle,
  unmount: lifecycle,
};

const flushMicrotasks = () => new Promise((resolve) => setTimeout(resolve));

type ParcelHook = (props: ObjectType) => Promise<unknown>;
const runHooks = async (hooks: unknown): Promise<void> => {
  for (const hook of hooks as ParcelHook[]) {
    await hook({});
  }
};

/** loadEntry stub whose DOM stream settles synchronously — the common non-contended shape. */
const mockSettledLoadEntry = (lifecycles: MicroAppLifeCycles = validLifecycles) => {
  mocks.loadEntry.mockImplementationOnce((_entry: unknown, _container: HTMLElement, opts: LoaderOpts) => {
    opts.onDOMStreamSettled?.();
    return Promise.resolve(lifecycles);
  });
};

function createApp(name: string, container: HTMLElement) {
  return { name, entry: `https://${name}.test/index.html`, container };
}

describe('loadApp container gate', () => {
  beforeEach(() => {
    // keep the entry pre-warm fetch off the real network — its DNS failures would otherwise
    // settle after the happy-dom window teardown and show up as noise
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html></html>', { status: 200 })),
    );
    mocks.createSandbox.mockReturnValue({
      dispose: mocks.dispose,
      instance: {
        globalThis: window,
        latestSetProp: undefined,
      },
      nodeTransformer: (node: Node) => node,
      mount: mocks.mount,
      unmount: mocks.unmount,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('holds the load critical section until both the entry promise and its dom stream settle', async () => {
    const container = document.createElement('div');

    // app-a: entry promise resolves while the stream keeps writing tail nodes
    let settleStream: (() => void) | undefined;
    mocks.loadEntry.mockImplementationOnce((_entry: unknown, _container: HTMLElement, opts: LoaderOpts) => {
      settleStream = opts.onDOMStreamSettled;
      return Promise.resolve(validLifecycles);
    });
    await loadApp(createApp('app-a', container));

    // app-b must not reach its own loadEntry while app-a's stream is still open
    mockSettledLoadEntry();
    const secondLoad = loadApp(createApp('app-b', container));
    await flushMicrotasks();
    expect(mocks.loadEntry).toHaveBeenCalledTimes(1);

    settleStream!();
    await secondLoad;
    expect(mocks.loadEntry).toHaveBeenCalledTimes(2);
  });

  it('releases the load hold when the entry stream never starts', async () => {
    const container = document.createElement('div');

    // the real loadEntry notifies onDOMStreamSettled before rejecting on fetch/empty-body failures
    mocks.loadEntry.mockImplementationOnce((_entry: unknown, _container: HTMLElement, opts: LoaderOpts) => {
      opts.onDOMStreamSettled?.();
      return Promise.reject(new Error('entry fetch failed'));
    });
    await expect(loadApp(createApp('app-a', container))).rejects.toThrow('entry fetch failed');

    // the follow-up app must not starve
    mockSettledLoadEntry();
    await loadApp(createApp('app-b', container));
  });

  it('holds the container from mount until the unmount chain clears it', async () => {
    const container = document.createElement('div');
    mockSettledLoadEntry();
    const getParcelConfig = await loadApp(createApp('app-a', container));
    const parcelConfig = getParcelConfig(container);
    await runHooks(parcelConfig.mount);

    mockSettledLoadEntry();
    const contendedLoad = loadApp(createApp('app-b', container));
    await flushMicrotasks();
    // app-b's load critical section (its loadEntry included) waits for app-a's unmount
    expect(mocks.loadEntry).toHaveBeenCalledTimes(1);

    await runHooks(parcelConfig.unmount);
    await contendedLoad;
    expect(mocks.loadEntry).toHaveBeenCalledTimes(2);
  });

  it('releases the mount hold when a mount hook rejects', async () => {
    const container = document.createElement('div');
    mockSettledLoadEntry();
    const getParcelConfig = await loadApp(createApp('app-a', container));
    const parcelConfig = getParcelConfig(container);

    // single-spa marks the app SKIP_BECAUSE_BROKEN after this and never runs its unmount chain
    mocks.mount.mockRejectedValueOnce(new Error('sandbox mount failed'));
    await expect(runHooks(parcelConfig.mount)).rejects.toThrow('sandbox mount failed');

    mockSettledLoadEntry();
    await loadApp(createApp('app-b', container));
  });

  it('releases the mount hold when an unmount hook rejects before clearContainer', async () => {
    const container = document.createElement('div');
    mockSettledLoadEntry({
      ...validLifecycles,
      unmount: async () => {
        throw new Error('app unmount failed');
      },
    });
    const getParcelConfig = await loadApp(createApp('app-a', container));
    const parcelConfig = getParcelConfig(container);
    await runHooks(parcelConfig.mount);

    // the chain stops before its clearContainer step — the fallback must still release
    await expect(runHooks(parcelConfig.unmount)).rejects.toThrow('app unmount failed');

    mockSettledLoadEntry();
    await loadApp(createApp('app-b', container));
  });
});
