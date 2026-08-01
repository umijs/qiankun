/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('qiankun', () => ({ loadMicroApp: vi.fn() }));

import React, { StrictMode, act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { loadMicroApp } from 'qiankun';
import { MicroApp } from '../MicroApp';

const loadMicroAppMock = loadMicroApp as ReturnType<typeof vi.fn>;

declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/** What each fake parcel did, in order, so the tests can assert mount/unmount interleaving. */
let events: string[] = [];
let parcels: Array<ReturnType<typeof createParcel>> = [];

function createParcel(appName: string) {
  let resolveUnmount!: () => void;
  const unmountPromise = new Promise<void>((resolve) => {
    resolveUnmount = resolve;
  });

  const parcel = {
    appName,
    mountPromise: Promise.resolve(null),
    unmountPromise,
    loadPromise: Promise.resolve(null),
    bootstrapPromise: Promise.resolve(null),
    getStatus: vi.fn(() => 'MOUNTED'),
    unmount: vi.fn(() => {
      events.push(`unmount:${appName}`);
      resolveUnmount();
      return unmountPromise;
    }),
    update: vi.fn(() => Promise.resolve()),
  };

  return parcel;
}

/** Lets every queued promise hop in the binding's mount/unmount chain run to completion. */
async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

async function render(root: Root, element: React.ReactNode) {
  await act(async () => {
    root.render(element);
  });
}

describe('MicroApp', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    events = [];
    parcels = [];
    loadMicroAppMock.mockImplementation((app: { name: string }) => {
      events.push(`mount:${app.name}`);
      const parcel = createParcel(app.name);
      parcels.push(parcel);
      return parcel;
    });

    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    vi.restoreAllMocks();
  });

  it('renders the container before the loader and error slots', async () => {
    await render(
      root,
      <MicroApp
        name="app"
        entry="//localhost:7100"
        loader={() => <div className="veil" />}
        errorBoundary={() => null}
      />,
    );
    await settle();

    const wrapper = host.querySelector('.qiankun-micro-app-wrapper')!;
    const divs = Array.from(wrapper.children).filter((child) => child.tagName === 'DIV');
    // qiankun keys its per-container caches on the container's XPath, which counts same-tag
    // siblings before it — the container must not move when a slot appears or disappears
    expect(divs[0].classList.contains('qiankun-micro-app-container')).toBe(true);
  });

  it('hands the container it created to qiankun', async () => {
    await render(root, <MicroApp name="app" entry="//localhost:7100" />);
    await settle();

    expect(loadMicroAppMock.mock.calls[0][0].container).toBe(host.querySelector('.qiankun-micro-app-container'));
  });

  it('ends a custom loader once the app is mounted', async () => {
    let finishMount!: () => void;
    loadMicroAppMock.mockImplementation((app: { name: string }) => ({
      ...createParcel(app.name),
      mountPromise: new Promise<null>((resolve) => {
        finishMount = () => resolve(null);
      }),
    }));

    await render(
      root,
      <MicroApp
        name="app"
        entry="//localhost:7100"
        loader={(loading) => (loading ? <div className="veil" /> : null)}
      />,
    );
    expect(host.querySelector('.veil')).not.toBeNull();

    finishMount();
    await settle();

    // no autoSetLoading here on purpose: a custom loader used to spin forever without it
    expect(host.querySelector('.veil')).toBeNull();
  });

  it('leaves exactly one live app behind under StrictMode', async () => {
    await render(
      root,
      <StrictMode>
        <MicroApp name="app" entry="//localhost:7100" />
      </StrictMode>,
    );
    await settle();

    // StrictMode double-invokes the effect; the throwaway instance must be unmounted rather than
    // left mounted with its successor waiting on it forever. Asserting the count keeps this test
    // honest: without the double invoke there would be nothing to regress against.
    expect(parcels).toHaveLength(2);
    const alive = parcels.filter((parcel) => !parcel.unmount.mock.calls.length);
    expect(alive).toHaveLength(1);
    expect(alive[0]).toBe(parcels[parcels.length - 1]);
  });

  it('unmounts the previous app before mounting the next one', async () => {
    await render(root, <MicroApp name="a" entry="//localhost:7100" />);
    await settle();

    await render(root, <MicroApp name="b" entry="//localhost:7101" />);
    await settle();

    expect(events).toEqual(['mount:a', 'unmount:a', 'mount:b']);
  });

  it('serializes rapid app switches', async () => {
    await render(root, <MicroApp name="a" entry="//localhost:7100" />);
    await render(root, <MicroApp name="b" entry="//localhost:7101" />);
    await render(root, <MicroApp name="c" entry="//localhost:7102" />);
    await settle();

    expect(events).toEqual(['mount:a', 'unmount:a', 'mount:b', 'unmount:b', 'mount:c']);
    expect(parcels[parcels.length - 1].appName).toBe('c');
    expect(parcels[parcels.length - 1].unmount).not.toHaveBeenCalled();
  });

  it('unmounts the app when the host unmounts it', async () => {
    await render(root, <MicroApp name="app" entry="//localhost:7100" />);
    await settle();

    await render(root, <div />);
    await settle();

    expect(parcels[0].unmount).toHaveBeenCalledTimes(1);
  });

  it('renders the errorBoundary slot when the app fails to load', async () => {
    const failure = new Error('entry not reachable');
    loadMicroAppMock.mockImplementation((app: { name: string }) => {
      const parcel = createParcel(app.name);
      return { ...parcel, loadPromise: Promise.reject(failure), mountPromise: Promise.reject(failure) };
    });

    await render(
      root,
      <MicroApp
        name="app"
        entry="//localhost:7100"
        loader={(loading) => (loading ? <div className="veil" /> : null)}
        errorBoundary={(error) => <div className="failed">{error.message}</div>}
      />,
    );
    await settle();

    expect(host.querySelector('.failed')?.textContent).toBe('entry not reachable');
    expect(host.querySelector('.veil')).toBeNull();
  });
});
