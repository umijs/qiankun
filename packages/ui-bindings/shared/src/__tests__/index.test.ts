/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('qiankun', () => ({ loadMicroApp: vi.fn() }));

import { loadMicroApp } from 'qiankun';
import type { LifeCycles } from 'qiankun';
import { mountMicroApp, omitSharedProps, updateMicroApp, type MicroAppType } from '../index';

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
