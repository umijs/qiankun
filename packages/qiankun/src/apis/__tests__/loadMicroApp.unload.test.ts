/**
 * @vitest-environment happy-dom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Deferred } from '@qiankunjs/shared';
import type { LoaderOpts } from '@qiankunjs/loader';
import { addErrorHandler, AppOrParcelStatus, removeErrorHandler } from '@qiankunjs/single-spa';
import type { MicroApp, MicroAppLifeCycles } from '../../types';

const mocks = vi.hoisted(() => ({ loadEntry: vi.fn() }));
vi.mock('@qiankunjs/loader', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  loadEntry: mocks.loadEntry,
}));

import { loadMicroApp } from '../loadMicroApp';

const noop = async () => {};
const handles: MicroApp[] = [];

afterEach(async () => {
  for (const handle of handles.splice(0)) await handle.unload().catch(() => undefined);
  vi.unstubAllGlobals();
  vi.resetAllMocks();
  document.body.replaceChildren();
});

/** Real loadApp and sandbox; only the entry loader is replaced by a synchronous DOM writer. */
function setup(lifecycles: Record<string, MicroAppLifeCycles>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('<html><head></head><body></body></html>')),
  );
  mocks.loadEntry.mockImplementation(
    async (entry: string | { url: string }, container: HTMLElement, opts: LoaderOpts) => {
      const name = new URL(typeof entry === 'string' ? entry : entry.url).hostname.split('.')[0];
      container.innerHTML = `<qiankun-head><style>.${name} {}</style></qiankun-head><main>${name}:dom</main>`;
      opts.onDOMStreamSettled?.();
      return lifecycles[name];
    },
  );
  const container = document.createElement('div');
  document.body.append(container);
  const load = (name: string, props: Record<string, unknown> = {}) => {
    const handle = loadMicroApp({ name, container, entry: `https://${name}.test/index.html`, props });
    handles.push(handle);
    return handle;
  };
  return { container, load };
}

describe('unload drains lifecycles that still own the container', () => {
  it('waits for an entered bootstrap before releasing the container to a successor', async () => {
    const entered = new Deferred<void>();
    const resume = new Deferred<void>();
    const log: string[] = [];
    const { container, load } = setup({
      a: {
        bootstrap: async () => {
          entered.resolve();
          await resume.promise;
          log.push('a:bootstrap:end');
        },
        mount: noop,
        unmount: noop,
      },
      b: { bootstrap: noop, mount: noop, unmount: noop },
    });
    const a = load('a');
    await entered.promise;
    const unloading = a.unload().then(() => log.push('a:unload'));
    // Give an unload that ignores the entered bootstrap every chance to settle first.
    for (let i = 0; i < 5; i++) await new Promise((resolve) => setTimeout(resolve));
    expect(log).toEqual([]);
    resume.resolve();
    await unloading;
    expect(log).toEqual(['a:bootstrap:end', 'a:unload']);

    await load('b').mountPromise;
    expect(container.querySelector('main')?.textContent).toBe('b:dom');
  });

  it('waits for a same-tick public unmount instead of issuing a second one', async () => {
    const entered = new Deferred<void>();
    const resume = new Deferred<void>();
    const log: string[] = [];
    const { container, load } = setup({
      a: {
        bootstrap: noop,
        mount: noop,
        unmount: async (props) => {
          entered.resolve();
          await resume.promise;
          props.container.replaceChildren();
          log.push('a:unmount:end');
        },
      },
      b: { bootstrap: noop, mount: async () => void log.push('b:mount'), unmount: noop },
    });
    const a = load('a');
    await a.mountPromise;
    const unmounting = a.unmount();
    const unloading = a.unload().then(() => log.push('a:unload'));
    await entered.promise;
    const b = load('b');
    resume.resolve();
    await expect(unmounting).resolves.toBeNull();
    await unloading;
    await b.mountPromise;
    expect(log).toEqual(['a:unmount:end', 'a:unload', 'b:mount']);
    expect(container.querySelector('main')?.textContent).toBe('b:dom');
  });

  it.each(['mountSandbox', 'beforeMount', 'appMount'] as const)(
    'clears the streamed entry when unload cancels a mount paused in %s',
    async (stage) => {
      const entered = new Deferred<void>();
      const resume = new Deferred<void>();
      const pause = async () => {
        entered.resolve();
        await resume.promise;
      };
      const { container } = setup({});
      mocks.loadEntry.mockImplementation(async (_entry: unknown, target: HTMLElement, opts: LoaderOpts) => {
        target.innerHTML = '<qiankun-head><style>.entry {}</style></qiankun-head><main>streamed entry</main>';
        opts.onDOMStreamSettled?.();
        return { bootstrap: noop, mount: stage === 'appMount' ? pause : noop, unmount: noop };
      });
      const app = loadMicroApp(
        { name: `residue-${stage}`, container, entry: `https://residue-${stage}.test/` },
        {
          sandbox: {
            plugins:
              stage === 'mountSandbox'
                ? [
                    {
                      name: 'slow-plugin',
                      mount: async () => {
                        await pause();
                        return () => noop;
                      },
                    },
                  ]
                : [],
          },
        },
        stage === 'beforeMount' ? { beforeMount: pause } : undefined,
      );
      handles.push(app);
      await entered.promise;
      const unloading = app.unload();
      resume.resolve();
      await unloading;
      expect(app.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
      expect(container.innerHTML).toBe('');
    },
  );

  it('keeps the container until the compensating unmount of a cancelled mount finishes', async () => {
    const mountEntered = new Deferred<void>();
    const resumeMount = new Deferred<void>();
    const unmountEntered = new Deferred<void>();
    const resumeUnmount = new Deferred<void>();
    const log: string[] = [];
    const { container, load } = setup({
      a: {
        bootstrap: noop,
        mount: async () => {
          mountEntered.resolve();
          await resumeMount.promise;
        },
        unmount: async (props) => {
          unmountEntered.resolve();
          await resumeUnmount.promise;
          props.container.replaceChildren();
          log.push('a:unmount:end');
        },
      },
      b: { bootstrap: noop, mount: async () => void log.push('b:mount'), unmount: noop },
    });
    const a = load('a');
    await mountEntered.promise;
    const unloading = a.unload();
    const b = load('b');
    resumeMount.resolve();
    await unmountEntered.promise;
    resumeUnmount.resolve();
    await unloading;
    await b.mountPromise;
    expect(log).toEqual(['a:unmount:end', 'b:mount']);
    expect(container.querySelector('main')?.textContent).toBe('b:dom');
  });
});

describe('unload cancelling a remount', () => {
  it('does not report a remount cancelled at the container gate as an application error', async () => {
    const errors = vi.fn();
    addErrorHandler(errors);
    try {
      const lifecycles: MicroAppLifeCycles = { bootstrap: noop, mount: noop, unmount: noop };
      const { container, load } = setup({ a: lifecycles, b: lifecycles });
      const a = load('a');
      await a.mountPromise;
      await a.unmount();
      const b = load('b');
      await b.mountPromise;
      const raw = a._parcel;
      // b holds the container, so the remount waits at the gate inside loadApp's mount chain.
      const remount = a.mount();
      await vi.waitFor(() => expect(raw.status).toBe(AppOrParcelStatus.MOUNTING));
      await a.unload();
      // The caller learns the remount did not happen; single-spa's error handlers do not.
      await expect(remount).rejects.toMatchObject({ code: 'app-unloaded' });
      await new Promise((resolve) => setTimeout(resolve));
      expect(errors).not.toHaveBeenCalled();
      expect(a.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
      expect(b.getStatus()).toBe(AppOrParcelStatus.MOUNTED);
      expect(container.querySelector('main')?.textContent).toBe('b:dom');
    } finally {
      removeErrorHandler(errors);
    }
  });
});

describe('unload with retained handles of one generation', () => {
  it.each([false, true])(
    'unmounts a retired handle remount instead of leaving its parcel mounted (queued: %s)',
    async (waitUntilQueued) => {
      const lifecycles: MicroAppLifeCycles = { bootstrap: noop, mount: noop, unmount: noop };
      const { load } = setup({ 'same-app': lifecycles });
      const a = load('same-app', { id: 'a' });
      await a.mountPromise;
      await a.unmount();
      const b = load('same-app', { id: 'b' });
      await b.mountPromise;
      const raw = a._parcel;
      const remount = a.mount();
      if (waitUntilQueued) await vi.waitFor(() => expect(raw.status).toBe(AppOrParcelStatus.MOUNTING));
      await b.unload();
      await expect(remount).rejects.toMatchObject({ code: 'app-unloaded' });
      expect(raw.status).toBe(AppOrParcelStatus.NOT_MOUNTED);
      expect(a.getStatus()).toBe(AppOrParcelStatus.NOT_LOADED);
    },
  );

  it('rejects a repeated mount request and keeps later same-generation mounts FIFO', async () => {
    const log: string[] = [];
    const idOf = (props: object) => String((props as { id?: string }).id);
    const lifecycles: MicroAppLifeCycles = {
      bootstrap: noop,
      mount: async (props) => void log.push(`mount:${idOf(props)}`),
      unmount: async (props) => void log.push(`unmount:${idOf(props)}`),
    };
    const { load } = setup({ 'same-app': lifecycles });
    const a = load('same-app', { id: 'a' });
    await a.mountPromise;
    await a.unmount();
    const [first, repeated] = await Promise.allSettled([a.mount(), a.mount()]);
    expect(first.status).toBe('fulfilled');
    expect(repeated).toMatchObject({ status: 'rejected', reason: { code: 'app-already-mounted' } });
    await a.unmount();

    log.length = 0;
    const b = load('same-app', { id: 'b' });
    const remount = a.mount();
    await b.mountPromise;
    expect(log).toEqual(['mount:b']);
    await b.unmount();
    await remount;
    expect(log).toEqual(['mount:b', 'unmount:b', 'mount:a']);
  });
});
