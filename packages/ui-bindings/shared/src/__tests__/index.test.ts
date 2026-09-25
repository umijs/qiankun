/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('qiankun', () => ({ loadMicroApp: vi.fn() }));

import { loadMicroApp } from 'qiankun';
import type { LifeCycles } from 'qiankun';
import { mountMicroApp, omitSharedProps, unmountMicroApp, updateMicroApp, type MicroAppType } from '../index';

const loadMicroAppMock = loadMicroApp as ReturnType<typeof vi.fn>;

type Deferred = { promise: Promise<void>; resolve: () => void };

function defer(): Deferred {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

/** A stand-in for the single-spa parcel `loadMicroApp` returns, with mount/unmount under test control. */
function createParcel({ status = 'MOUNTED' }: { status?: string } = {}) {
  const mount = defer();
  const unmount = defer();
  const parcel = {
    mountPromise: mount.promise,
    unmountPromise: unmount.promise,
    loadPromise: Promise.resolve(),
    bootstrapPromise: Promise.resolve(),
    getStatus: vi.fn(() => status),
    unmount: vi.fn(() => {
      unmount.resolve();
      return unmount.promise;
    }),
    update: vi.fn(() => Promise.resolve()),
  };

  return { parcel: parcel as unknown as MicroAppType, resolveMount: mount.resolve };
}

function container() {
  return document.createElement('div');
}

describe('omitSharedProps', () => {
  it('keeps only what the micro app should see', () => {
    const kept = omitSharedProps({
      name: 'app',
      entry: '//localhost:7100',
      settings: { sandbox: true },
      lifeCycles: {},
      autoSetLoading: true,
      autoCaptureError: true,
      wrapperClassName: 'wrapper',
      className: 'container',
      // not part of SharedProps: the render slots, Vue's appProps channel, and real micro app props
      ...({ loader: () => null, errorBoundary: () => null, appProps: { a: 1 }, theme: 'dark' } as object),
    });

    expect(kept).toEqual({ theme: 'dark' });
  });
});

describe('mountMicroApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hands lifeCycles to qiankun untouched', async () => {
    const { parcel, resolveMount } = createParcel();
    loadMicroAppMock.mockReturnValue(parcel);
    const afterMount = vi.fn(() => Promise.resolve());
    const lifeCycles: LifeCycles<Record<string, unknown>> = { afterMount };

    await mountMicroApp({ container: container(), componentProps: { name: 'app', entry: 'e', lifeCycles } });
    resolveMount();

    expect(loadMicroAppMock.mock.calls[0][2]).toEqual({ afterMount });
    // the previous implementation produced [undefined, afterMount], which qiankun then called
    expect(loadMicroAppMock.mock.calls[0][2].afterMount).toBe(afterMount);
  });

  it('passes settings through as the app configuration', async () => {
    const { parcel } = createParcel();
    loadMicroAppMock.mockReturnValue(parcel);
    const settings = { sandbox: { styleIsolation: true } };

    await mountMicroApp({ container: container(), componentProps: { name: 'app', entry: 'e', settings } });

    expect(loadMicroAppMock.mock.calls[0][1]).toEqual(settings);
  });

  it('forwards only the micro app props', async () => {
    const { parcel } = createParcel();
    loadMicroAppMock.mockReturnValue(parcel);

    await mountMicroApp({
      container: container(),
      componentProps: { name: 'app', entry: 'e', className: 'c', ...({ theme: 'dark' } as object) },
    });

    expect(loadMicroAppMock.mock.calls[0][0].props).toEqual({ theme: 'dark' });
  });

  it('ends the loading state on mount even without autoSetLoading', async () => {
    const { parcel, resolveMount } = createParcel();
    loadMicroAppMock.mockReturnValue(parcel);
    const setLoading = vi.fn();

    await mountMicroApp({ container: container(), componentProps: { name: 'app', entry: 'e' }, setLoading });
    expect(setLoading).toHaveBeenLastCalledWith(true);

    resolveMount();
    await parcel.mountPromise;
    await Promise.resolve();

    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it('waits for a previous app that is still unmounting', async () => {
    const { parcel: prev } = createParcel();
    prev._unmounting = true;
    const { parcel: next } = createParcel();
    loadMicroAppMock.mockReturnValue(next);

    let mounted = false;
    const mounting = mountMicroApp({
      prevMicroApp: prev,
      container: container(),
      componentProps: { name: 'app', entry: 'e' },
    }).then(() => {
      mounted = true;
    });

    await Promise.resolve();
    expect(mounted).toBe(false);
    expect(loadMicroAppMock).not.toHaveBeenCalled();

    prev.unmount();
    await mounting;
    expect(loadMicroAppMock).toHaveBeenCalledTimes(1);
  });

  it('reports a failed mount and ends loading', async () => {
    const { parcel } = createParcel();
    const failure = new Error('boom');
    loadMicroAppMock.mockReturnValue({ ...parcel, mountPromise: Promise.reject(failure) });
    const setError = vi.fn();
    const setLoading = vi.fn();

    await mountMicroApp({ container: container(), componentProps: { name: 'app', entry: 'e' }, setError, setLoading });
    await Promise.resolve();
    await Promise.resolve();

    expect(setError).toHaveBeenLastCalledWith(failure);
    expect(setLoading).toHaveBeenLastCalledWith(false);
  });

  it.each([
    ['load', ['loadPromise', 'bootstrapPromise', 'mountPromise']],
    ['bootstrap', ['bootstrapPromise', 'mountPromise']],
    ['mount', ['mountPromise']],
  ] as const)('reports a failed %s once, however many of the handle promises reject', async (_stage, rejected) => {
    const { parcel } = createParcel();
    const failure = new Error('boom');
    // A failure rejects the promise of its own stage and every later one, all with the same error.
    const failing = Object.fromEntries(rejected.map((key) => [key, Promise.reject(failure)]));
    loadMicroAppMock.mockReturnValue({ ...parcel, ...failing });
    const setError = vi.fn();

    await mountMicroApp({ container: container(), componentProps: { name: 'app', entry: 'e' }, setError });
    await new Promise((resolve) => setTimeout(resolve));

    expect(setError.mock.calls.filter(([error]) => error !== undefined)).toEqual([[failure]]);
  });
});

describe('updateMicroApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates on the first prop change instead of swallowing it', async () => {
    const { parcel, resolveMount } = createParcel();
    resolveMount();
    await parcel.mountPromise;

    updateMicroApp({ name: 'app', microApp: parcel, microAppProps: { theme: 'dark' } });
    await parcel._updatingPromise;

    expect(parcel.update).toHaveBeenCalledTimes(1);
    expect(parcel.update).toHaveBeenCalledWith(expect.objectContaining({ theme: 'dark' }));
  });

  it('serializes consecutive updates', async () => {
    const { parcel, resolveMount } = createParcel();
    resolveMount();
    await parcel.mountPromise;

    updateMicroApp({ name: 'app', microApp: parcel, microAppProps: { step: 1 } });
    updateMicroApp({ name: 'app', microApp: parcel, microAppProps: { step: 2 } });
    await parcel._updatingPromise;

    expect((parcel.update as ReturnType<typeof vi.fn>).mock.calls.map(([props]) => props.step)).toEqual([1, 2]);
  });

  it('does not update an app that is unmounting', async () => {
    const { parcel, resolveMount } = createParcel();
    resolveMount();
    await parcel.mountPromise;
    parcel._unmounting = true;

    updateMicroApp({ name: 'app', microApp: parcel, microAppProps: { theme: 'dark' } });
    await parcel._updatingPromise;

    expect(parcel.update).not.toHaveBeenCalled();
  });
});

describe('unmountMicroApp', () => {
  /** An app handle whose mount settled with `mountFailure` (if any) and whose unmount does `unmount`. */
  function appWith(status: string, mountFailure: Error | undefined, unmount: () => Promise<null>) {
    const mountPromise = mountFailure ? Promise.reject(mountFailure) : Promise.resolve(null);
    void mountPromise.catch(() => undefined);
    return { mountPromise, getStatus: () => status, unmount: vi.fn(unmount) } as unknown as MicroAppType & {
      unmount: ReturnType<typeof vi.fn>;
    };
  }

  function notMounted(cause?: unknown) {
    return Object.assign(new Error('App app is not mounted'), { code: 'app-not-mounted' }, cause ? { cause } : {});
  }

  it('asks an app to unmount while its mount is still under way', async () => {
    const app = appWith('MOUNTING', undefined, () => Promise.resolve(null));
    const unmounting = unmountMicroApp(app);
    expect(app.unmount).toHaveBeenCalledTimes(1);
    expect(app._unmounting).toBe(true);
    await unmounting;
  });

  it.each(['LOAD_ERROR', 'SKIP_BECAUSE_BROKEN', 'NOT_LOADED'])('leaves an app in %s alone', async (status) => {
    const app = appWith(status, new Error('mount failed'), () => Promise.resolve(null));
    await unmountMicroApp(app);
    expect(app.unmount).not.toHaveBeenCalled();
  });

  it('treats the mount failure it already reported as handled', async () => {
    const failure = new Error('mount failed');
    const app = appWith('MOUNTING', failure, () => Promise.reject(notMounted(failure)));
    await expect(unmountMicroApp(app)).resolves.toBeUndefined();
  });

  it.each([
    ['an unmount failure', () => new Error('unmount failed')],
    ['nothing mounted without a cause', () => notMounted()],
    ['nothing mounted because of another failure', () => notMounted(new Error('other'))],
  ])('passes on %s', async (_label, makeError) => {
    const error = makeError();
    const app = appWith('MOUNTED', undefined, () => Promise.reject(error));
    await expect(unmountMicroApp(app)).rejects.toBe(error);
  });
});
