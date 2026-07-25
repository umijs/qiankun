/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('qiankun', () => ({ loadMicroApp: vi.fn() }));

import { createApp, h, nextTick, ref, type App } from 'vue';
import { loadMicroApp } from 'qiankun';
import { MicroApp } from '../MicroApp';

const loadMicroAppMock = loadMicroApp as ReturnType<typeof vi.fn>;

/** What each fake parcel did, in order, so the tests can assert mount/unmount interleaving. */
let events: string[] = [];
let parcels: Array<ReturnType<typeof createParcel>> = [];

function createParcel(appName: string) {
  let resolveUnmount!: () => void;
  const unmountPromise = new Promise<void>((resolve) => {
    resolveUnmount = resolve;
  });

  return {
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
}

/** Lets every queued promise hop in the binding's mount/unmount chain run to completion. */
async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
}

describe('MicroApp', () => {
  let host: HTMLDivElement;
  let app: App | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    events = [];
    parcels = [];
    loadMicroAppMock.mockImplementation((loadable: { name: string }) => {
      events.push(`mount:${loadable.name}`);
      const parcel = createParcel(loadable.name);
      parcels.push(parcel);
      return parcel;
    });

    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    app?.unmount();
    app = undefined;
    host.remove();
    vi.restoreAllMocks();
  });

  it('renders the container before the loader and error slots', async () => {
    app = createApp({
      render: () =>
        h(MicroApp, { name: 'app', entry: '//localhost:7100' }, { loader: () => h('div', { class: 'veil' }) }),
    });
    app.mount(host);
    await settle();

    const wrapper = host.querySelector('.qiankun-micro-app-wrapper')!;
    const divs = Array.from(wrapper.children).filter((child) => child.tagName === 'DIV');
    // qiankun keys its per-container caches on the container's XPath, which counts same-tag
    // siblings before it — the container must not move when a slot appears or disappears
    expect(divs[0].classList.contains('qiankun-micro-app-container')).toBe(true);
  });

  it('gives the loader slot an object so `#loader="{ loading }"` works', async () => {
    const seen: unknown[] = [];
    app = createApp({
      render: () =>
        h(
          MicroApp,
          { name: 'app', entry: '//localhost:7100' },
          {
            loader: (slotProps: { loading: boolean }) => {
              seen.push(slotProps.loading);
              return h('div', { class: 'veil' });
            },
          },
        ),
    });
    app.mount(host);
    await settle();

    expect(seen).toContain(true);
    expect(seen[seen.length - 1]).toBe(false);
  });

  it('accepts the documented kebab-case errorBoundary slot', async () => {
    const failure = new Error('entry not reachable');
    loadMicroAppMock.mockImplementation((loadable: { name: string }) => ({
      ...createParcel(loadable.name),
      loadPromise: Promise.reject(failure),
      mountPromise: Promise.reject(failure),
    }));

    app = createApp({
      render: () =>
        h(
          MicroApp,
          { name: 'app', entry: '//localhost:7100' },
          {
            // Vue does not normalize slot names the way it normalizes props, and this is the
            // spelling the docs have always shown
            'error-boundary': (slotProps: { error: Error }) => h('div', { class: 'failed' }, slotProps.error.message),
          },
        ),
    });
    app.mount(host);
    await settle();

    expect(host.querySelector('.failed')?.textContent).toBe('entry not reachable');
  });

  it('unmounts the previous app before mounting the next one', async () => {
    const name = ref('a');
    app = createApp({ render: () => h(MicroApp, { name: name.value, entry: '//localhost:7100' }) });
    app.mount(host);
    await settle();

    name.value = 'b';
    await settle();

    expect(events).toEqual(['mount:a', 'unmount:a', 'mount:b']);
  });

  it('serializes rapid app switches', async () => {
    const name = ref('a');
    app = createApp({ render: () => h(MicroApp, { name: name.value, entry: '//localhost:7100' }) });
    app.mount(host);

    name.value = 'b';
    await nextTick();
    name.value = 'c';
    await settle();

    expect(events).toEqual(['mount:a', 'unmount:a', 'mount:b', 'unmount:b', 'mount:c']);
    expect(parcels[parcels.length - 1].appName).toBe('c');
    expect(parcels[parcels.length - 1].unmount).not.toHaveBeenCalled();
  });

  it('unmounts the app when the host unmounts it', async () => {
    app = createApp({ render: () => h(MicroApp, { name: 'app', entry: '//localhost:7100' }) });
    app.mount(host);
    await settle();

    app.unmount();
    app = undefined;
    await settle();

    expect(parcels[0].unmount).toHaveBeenCalledTimes(1);
  });

  it('still mounts the next app after one whose mount failed', async () => {
    const failure = new Error('entry not reachable');
    loadMicroAppMock.mockImplementationOnce((loadable: { name: string }) => {
      events.push(`mount:${loadable.name}`);
      return {
        ...createParcel(loadable.name),
        loadPromise: Promise.reject(failure),
        mountPromise: Promise.reject(failure),
      };
    });

    const name = ref('broken');
    app = createApp({
      render: () => h(MicroApp, { name: name.value, entry: '//localhost:7100', autoCaptureError: true }),
    });
    app.mount(host);
    await settle();

    name.value = 'healthy';
    await settle();

    // unmounting a failed app rejects; the chain must carry on rather than swallow this mount
    expect(events).toContain('mount:healthy');
  });

  it('forwards the contents of appProps, not the wrapper itself', async () => {
    app = createApp({
      render: () => h(MicroApp, { name: 'app', entry: '//localhost:7100', appProps: { theme: 'dark' } }),
    });
    app.mount(host);
    await settle();

    expect(loadMicroAppMock.mock.calls[0][0].props).toEqual({ theme: 'dark' });
  });
});
