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

  it('skips the teardown container wipe after a fallback release', async () => {
    const container = document.createElement('div');
    mockSettledLoadEntry();
    const getBrokenConfig = await loadApp(createApp('app-a', container));
    const brokenConfig = getBrokenConfig(container);
    mocks.mount.mockRejectedValueOnce(new Error('sandbox mount failed'));
    await expect(runHooks(brokenConfig.mount)).rejects.toThrow('sandbox mount failed');

    // a successor occupies the container after the fallback release
    mockSettledLoadEntry();
    const getSuccessorConfig = await loadApp(createApp('app-b', container));
    const successorConfig = getSuccessorConfig(container);
    await runHooks(successorConfig.mount);
    const successorDOM = document.createElement('p');
    container.appendChild(successorDOM);

    // single-spa still runs the broken parcel's unmount chain — its clearContainer step
    // must not destroy the successor's live DOM
    await runHooks(brokenConfig.unmount);
    expect(container.contains(successorDOM)).toBe(true);

    // the successor's own teardown still holds and clears normally
    await runHooks(successorConfig.unmount);
    expect(container.contains(successorDOM)).toBe(false);
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

  it('releases the load hold when sandbox creation fails after the acquire', async () => {
    const container = document.createElement('div');
    mocks.createSandbox.mockImplementationOnce(() => {
      throw new Error('plugin bootstrap failed');
    });
    await expect(loadApp(createApp('app-a', container))).rejects.toThrow('plugin bootstrap failed');

    // the failure happened before any release wiring existed — the catch fallback must have freed ①
    mockSettledLoadEntry();
    await loadApp(createApp('app-b', container));
  });

  it('adopts its own still-open load hold at mount instead of queueing behind itself', async () => {
    const container = document.createElement('div');

    // app-a's entry stream never settles — a hung chunked response
    let settleStream: (() => void) | undefined;
    mocks.loadEntry.mockImplementationOnce((_entry: unknown, _container: HTMLElement, opts: LoaderOpts) => {
      settleStream = opts.onDOMStreamSettled;
      return Promise.resolve(validLifecycles);
    });
    const getParcelConfig = await loadApp(createApp('app-a', container));
    const parcelConfig = getParcelConfig(container);

    // pre-adoption this deadlocked: the mount's acquire queued behind the app's own load hold
    await runHooks(parcelConfig.mount);

    // the adopted hold ② keeps successors out …
    mockSettledLoadEntry();
    const contendedLoad = loadApp(createApp('app-b', container));
    await flushMicrotasks();
    expect(mocks.loadEntry).toHaveBeenCalledTimes(1);

    // … even once the stream settles (the latch must not release a hold the mount now owns)
    settleStream!();
    await flushMicrotasks();
    expect(mocks.loadEntry).toHaveBeenCalledTimes(1);

    await runHooks(parcelConfig.unmount);
    await contendedLoad;
    expect(mocks.loadEntry).toHaveBeenCalledTimes(2);
  });

  it('replays the entry when another app initialized the container between load and mount', async () => {
    const container = document.createElement('div');
    mockSettledLoadEntry();
    const getParcelConfig = await loadApp(createApp('app-a', container));

    // app-b claims the container in the gap between app-a's load settle and its mount
    mockSettledLoadEntry();
    await loadApp(createApp('app-b', container));

    // app-a's first mount must not trust the foreign claim: it replays its entry inside hold ②
    mockSettledLoadEntry();
    await runHooks(getParcelConfig(container).mount);
    expect(mocks.loadEntry).toHaveBeenCalledTimes(3);
    const replayEntry = mocks.loadEntry.mock.calls[2][0] as { url: string; res: Response };
    expect(replayEntry.url).toBe('https://app-a.test/index.html');
  });

  it('releases the mount hold when the update lifecycle rejects', async () => {
    const container = document.createElement('div');
    mockSettledLoadEntry({
      ...validLifecycles,
      update: async () => {
        throw new Error('update failed');
      },
    });
    const getParcelConfig = await loadApp(createApp('app-a', container));
    const parcelConfig = getParcelConfig(container);
    await runHooks(parcelConfig.mount);

    // single-spa marks the parcel SKIP_BECAUSE_BROKEN after this and refuses to unmount it
    await expect((parcelConfig.update as ParcelHook)({})).rejects.toThrow('update failed');

    mockSettledLoadEntry();
    await loadApp(createApp('app-b', container));
  });

  it('tears the sandbox down in the failure fallback before letting the container go', async () => {
    const container = document.createElement('div');
    mockSettledLoadEntry();
    const getParcelConfig = await loadApp(createApp('app-a', container));

    mocks.mount.mockRejectedValueOnce(new Error('sandbox mount failed'));
    await expect(runHooks(getParcelConfig(container).mount)).rejects.toThrow('sandbox mount failed');

    // the broken chain never reaches its own unmountSandbox step — the fallback must run it, or
    // the container enters the successor's tenure with the dead app's patches still installed
    expect(mocks.unmount).toHaveBeenCalledTimes(1);
  });

  it('keeps the loader indicator inside the guarded chain so its failure cannot starve the container', async () => {
    const container = document.createElement('div');
    const loader = vi.fn((loading: boolean) => {
      if (!loading) throw new Error('indicator exploded');
    });
    mockSettledLoadEntry();
    const getParcelConfig = await loadApp({ ...createApp('app-a', container), loader });

    await expect(runHooks(getParcelConfig(container).mount)).rejects.toThrow('indicator exploded');
    expect(loader).toHaveBeenNthCalledWith(1, true);

    // pre-guard this leaked the mount hold forever
    mockSettledLoadEntry();
    await loadApp(createApp('app-b', container));
  });
});
