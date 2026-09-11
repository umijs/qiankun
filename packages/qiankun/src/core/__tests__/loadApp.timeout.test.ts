/**
 * @vitest-environment happy-dom
 */
import { type LoaderOpts } from '@qiankunjs/loader';
import * as shared from '@qiankunjs/shared';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoadAppTimeoutError, QiankunError } from '../../error';
import { type AppConfiguration, type LifeCycles, type MicroAppLifeCycles, type ObjectType } from '../../types';
import { acquireContainer, isContainerHeld } from '../containerOccupancy';
import loadApp, { type LoadAppControl } from '../loadApp';

const mocks = vi.hoisted(() => ({
  createSandbox: vi.fn(),
  dispose: vi.fn<() => Promise<void>>(),
  loadEntry: vi.fn<(entry: string, container: HTMLElement, opts: LoaderOpts) => Promise<MicroAppLifeCycles>>(),
}));

vi.mock('@qiankunjs/loader', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  loadEntry: mocks.loadEntry,
}));

vi.mock('@qiankunjs/sandbox', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  createSandbox: mocks.createSandbox,
}));

const lifecycle = async (): Promise<void> => {};
const validLifecycles: MicroAppLifeCycles = {
  bootstrap: lifecycle,
  mount: lifecycle,
  unmount: lifecycle,
};
const disposers: Array<() => Promise<void>> = [];
const finalizers: Array<() => void> = [];
let appId = 0;

function createApp(container = document.createElement('div')) {
  const name = `timeout-test-${++appId}`;
  return { name, entry: `https://load-timeout.test/${name}.html`, container };
}

function beginLoad(
  app: ReturnType<typeof createApp>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<ObjectType>,
  control: LoadAppControl = {},
) {
  const loading = loadApp(app, configuration, lifeCycles, {
    ...control,
    onDispose: (dispose) => {
      disposers.push(dispose);
      control.onDispose?.(dispose);
    },
  });
  // Observe pending failures immediately, including those triggered by fake-clock advancement.
  void loading.catch(() => undefined);
  return loading;
}

function deferred() {
  let resolve = () => {};
  const promise = new Promise<void>((complete) => {
    resolve = complete;
  });
  finalizers.push(resolve);
  return { promise, resolve };
}

describe('loadApp timeout', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'] });
    vi.resetAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<html></html>', { status: 200 })),
    );
    mocks.dispose.mockResolvedValue(undefined);
    mocks.createSandbox.mockReturnValue({
      dispose: mocks.dispose,
      instance: { globalThis: window, latestSetProp: undefined },
      nodeTransformer: (node: Node) => node,
      mount: lifecycle,
      unmount: lifecycle,
    });
    mocks.loadEntry.mockImplementation(async (_entry, _container, opts) => {
      opts.onDOMStreamSettled?.();
      return validLifecycles;
    });
  });

  afterEach(async () => {
    finalizers.splice(0).forEach((complete) => complete());
    await Promise.allSettled(disposers.splice(0).map((dispose) => dispose()));
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([undefined, 0])('preserves early lifecycle readiness with timeout %s', async (timeout) => {
    let loaderSignal: AbortSignal | undefined;
    mocks.loadEntry.mockImplementationOnce(async (_entry, _container, opts) => {
      loaderSignal = opts.signal;
      // The HTML tail remains open after the entry exports become available.
      return validLifecycles;
    });
    const app = createApp();
    const getConfig = await beginLoad(app, timeout === undefined ? undefined : { timeout });

    expect(getConfig(app.container).name).toBe(app.name);
    expect(isContainerHeld(app.container)).toBe(true);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(loaderSignal?.aborted).toBe(false);
    expect(mocks.dispose).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects invalid timeout %s before starting work',
    async (timeout) => {
      const app = createApp();
      await expect(beginLoad(app, { timeout })).rejects.toBeInstanceOf(QiankunError);

      expect(mocks.createSandbox).not.toHaveBeenCalled();
      expect(mocks.loadEntry).not.toHaveBeenCalled();
      expect(window.fetch).not.toHaveBeenCalled();
      expect(isContainerHeld(app.container)).toBe(false);
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it('aborts a slow enhancedFetch request and reports the app and actual elapsed time', async () => {
    let networkSignal: AbortSignal | undefined;
    let loaderSignal: AbortSignal | undefined;
    const fetch = vi.fn<typeof window.fetch>(async (_input, init) => {
      networkSignal = init?.signal ?? undefined;
      networkSignal?.throwIfAborted();
      return new Promise<Response>((_resolve, reject) => {
        networkSignal?.addEventListener('abort', () => reject(new Error('network aborted')), { once: true });
      });
    });
    mocks.loadEntry.mockImplementationOnce(async (entry, container, opts) => {
      container.innerHTML = '<p>partial entry</p>';
      loaderSignal = opts.signal;
      await opts.fetch!(entry, { signal: opts.signal });
      opts.onDOMStreamSettled?.();
      return validLifecycles;
    });
    const app = createApp();
    const loading = beginLoad(app, { timeout: 100, fetch });
    const outcome = loading.catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(0);
    expect(fetch).toHaveBeenCalled();
    expect(networkSignal?.aborted).toBe(false);

    await vi.advanceTimersByTimeAsync(100);
    const error = await outcome;
    expect(error).toBeInstanceOf(LoadAppTimeoutError);
    expect(error).toBeInstanceOf(QiankunError);
    expect(error).toMatchObject({ appName: app.name, timeout: 100, elapsed: 100 });
    expect(loaderSignal?.reason).toBe(error);
    expect(networkSignal?.aborted).toBe(true);
    expect(mocks.dispose).toHaveBeenCalledOnce();
    expect(app.container.childNodes).toHaveLength(0);
    expect(isContainerHeld(app.container)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('waits for sandbox cleanup before clearing partial DOM and granting the next app its container', async () => {
    const cleanup = deferred();
    const entry = deferred();
    const container = document.createElement('div');
    const first = createApp(container);
    const second = createApp(container);
    mocks.dispose.mockReturnValueOnce(cleanup.promise);
    mocks.loadEntry.mockImplementationOnce(async (_entry, target, opts) => {
      target.innerHTML = '<p>first partial entry</p>';
      opts.signal?.addEventListener('abort', () => opts.onDOMStreamSettled?.(), { once: true });
      await entry.promise;
      return validLifecycles;
    });
    const firstLoading = beginLoad(first, { timeout: 100 });
    const firstOutcome = firstLoading.catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(0);
    const secondLoading = beginLoad(second, { timeout: 100 });
    mocks.loadEntry.mockImplementationOnce(async (_entry, target, opts) => {
      expect(target.childNodes).toHaveLength(0);
      target.innerHTML = '<p>second entry</p>';
      opts.onDOMStreamSettled?.();
      return validLifecycles;
    });

    await vi.advanceTimersByTimeAsync(100);
    expect(mocks.dispose).toHaveBeenCalledOnce();
    expect(mocks.loadEntry).toHaveBeenCalledOnce();
    expect(container.textContent).toBe('first partial entry');
    expect(isContainerHeld(container)).toBe(true);

    cleanup.resolve();
    await expect(firstOutcome).resolves.toBeInstanceOf(LoadAppTimeoutError);
    await expect(secondLoading).resolves.toBeTypeOf('function');
    expect(mocks.loadEntry).toHaveBeenCalledTimes(2);
    expect(container.textContent).toBe('second entry');
    expect(isContainerHeld(container)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keeps the deadline active until the complete HTML stream settles', async () => {
    let loaderSignal: AbortSignal | undefined;
    mocks.loadEntry.mockImplementationOnce(async (_entry, _container, opts) => {
      loaderSignal = opts.signal;
      return validLifecycles;
    });
    const app = createApp();
    const ready = vi.fn();
    const loading = beginLoad(app, { timeout: 100 });
    void loading.then(ready, () => undefined);

    await vi.advanceTimersByTimeAsync(99);
    expect(ready).not.toHaveBeenCalled();
    expect(loaderSignal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await expect(loading).rejects.toBeInstanceOf(LoadAppTimeoutError);
    expect(loaderSignal?.aborted).toBe(true);
    expect(ready).not.toHaveBeenCalled();
    expect(isContainerHeld(app.container)).toBe(false);
  });

  it('includes asynchronous beforeLoad hooks in the deadline after the stream is complete', async () => {
    const hook = deferred();
    const beforeLoad = vi.fn(() => hook.promise);
    const laterHook = vi.fn(async () => {});
    const app = createApp();
    const loading = beginLoad(app, { timeout: 100 }, { beforeLoad: [beforeLoad, laterHook] });

    await vi.advanceTimersByTimeAsync(99);
    expect(beforeLoad).toHaveBeenCalledOnce();
    expect(mocks.dispose).not.toHaveBeenCalled();
    expect(isContainerHeld(app.container)).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    await expect(loading).rejects.toBeInstanceOf(LoadAppTimeoutError);
    expect(mocks.dispose).toHaveBeenCalledOnce();
    expect(isContainerHeld(app.container)).toBe(false);
    hook.resolve();
    await vi.advanceTimersByTimeAsync(0);
    expect(laterHook).not.toHaveBeenCalled();
  });

  it('excludes container queue time from the deadline and reported elapsed time', async () => {
    const app = createApp();
    const hold = await acquireContainer(app.container, 'predecessor');
    finalizers.push(() => hold.release());
    mocks.loadEntry.mockImplementationOnce(async () => validLifecycles);
    const loading = beginLoad(app, { timeout: 100 });

    await vi.advanceTimersByTimeAsync(500);
    expect(mocks.loadEntry).not.toHaveBeenCalled();
    expect(mocks.createSandbox).not.toHaveBeenCalled();
    expect(mocks.dispose).not.toHaveBeenCalled();
    hold.release();
    await vi.advanceTimersByTimeAsync(0);
    expect(mocks.loadEntry).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(99);
    expect(mocks.dispose).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);

    await expect(loading).rejects.toMatchObject({ appName: app.name, timeout: 100, elapsed: 100 });
    expect(isContainerHeld(app.container)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the timer once both the lifecycles and stream are ready', async () => {
    let loaderSignal: AbortSignal | undefined;
    let finishStream = () => {};
    mocks.loadEntry.mockImplementationOnce(async (_entry, _container, opts) => {
      loaderSignal = opts.signal;
      finishStream = () => opts.onDOMStreamSettled?.();
      return validLifecycles;
    });
    const ready = vi.fn();
    const loading = beginLoad(createApp(), { timeout: 100 });
    void loading.then(ready, () => undefined);
    await vi.advanceTimersByTimeAsync(50);
    expect(ready).not.toHaveBeenCalled();

    finishStream();
    await expect(loading).resolves.toBeTypeOf('function');
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(100);
    expect(loaderSignal?.aborted).toBe(false);
    expect(mocks.dispose).not.toHaveBeenCalled();
  });

  it('honors a timeout larger than the native timer delay limit without expiring early', async () => {
    const maximumTimerDelay = 2 ** 31 - 1;
    const timeout = maximumTimerDelay + 500;
    mocks.loadEntry.mockImplementationOnce(async () => validLifecycles);
    const app = createApp();
    const loading = beginLoad(app, { timeout });

    await vi.advanceTimersByTimeAsync(maximumTimerDelay);
    expect(mocks.dispose).not.toHaveBeenCalled();
    expect(isContainerHeld(app.container)).toBe(true);
    await vi.advanceTimersByTimeAsync(499);
    expect(mocks.dispose).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);

    await expect(loading).rejects.toMatchObject({ appName: app.name, timeout, elapsed: timeout });
    expect(isContainerHeld(app.container)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('detects work that exceeds the deadline before the timer task has a chance to execute', async () => {
    const app = createApp();
    const startedAt = performance.now();
    const beforeLoad = async () => {
      vi.spyOn(performance, 'now').mockReturnValue(startedAt + 101);
    };

    await expect(beginLoad(app, { timeout: 100 }, { beforeLoad })).rejects.toMatchObject({
      appName: app.name,
      timeout: 100,
      elapsed: 101,
    });
    expect(mocks.dispose).toHaveBeenCalledOnce();
    expect(isContainerHeld(app.container)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(['assets', 'DOM'])(
    'releases the gate when %s cleanup throws, preserving the timeout error',
    async (stage) => {
      const app = createApp();
      mocks.loadEntry.mockImplementationOnce(async (_entry, container) => {
        container.innerHTML = '<p>partial entry</p>';
        return validLifecycles;
      });
      const loading = beginLoad(app, { timeout: 100 });
      await vi.advanceTimersByTimeAsync(0);
      const failCleanup = () => {
        throw new Error(`${stage} cleanup failed`);
      };
      if (stage === 'assets') vi.spyOn(shared, 'disposeCompartmentAssets').mockImplementationOnce(failCleanup);
      else vi.spyOn(app.container, 'removeChild').mockImplementationOnce(failCleanup);

      await vi.advanceTimersByTimeAsync(100);
      await expect(loading).rejects.toBeInstanceOf(LoadAppTimeoutError);
      expect(isContainerHeld(app.container)).toBe(false);
      expect(vi.getTimerCount()).toBe(0);

      await expect(beginLoad(createApp(app.container), { timeout: 100 })).resolves.toBeTypeOf('function');
      expect(app.container.childNodes).toHaveLength(0);
      expect(mocks.loadEntry).toHaveBeenCalledTimes(2);
    },
  );

  it('preserves a loader error and clears its deadline even when cleanup also fails', async () => {
    const entryError = new Error('entry failed');
    mocks.loadEntry.mockRejectedValueOnce(entryError);
    mocks.dispose.mockRejectedValueOnce(new Error('cleanup failed'));
    const app = createApp();

    await expect(beginLoad(app, { timeout: 100 })).rejects.toBe(entryError);
    expect(mocks.dispose).toHaveBeenCalledOnce();
    expect(isContainerHeld(app.container)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(100);
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('preserves an earlier caller cancellation and removes the pending timeout', async () => {
    const controller = new AbortController();
    const cancellation = new Error('caller unloaded the app');
    mocks.loadEntry.mockImplementationOnce(async () => validLifecycles);
    const app = createApp();
    const loading = beginLoad(app, { timeout: 100 }, undefined, { signal: controller.signal });
    await vi.advanceTimersByTimeAsync(50);

    controller.abort(cancellation);
    await expect(loading).rejects.toBe(cancellation);
    expect(mocks.dispose).toHaveBeenCalledOnce();
    expect(isContainerHeld(app.container)).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    await vi.advanceTimersByTimeAsync(100);
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });
});
