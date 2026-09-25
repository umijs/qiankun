import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type CompartmentLoaderFacade } from '@qiankunjs/sandbox';
import { clearStylesheetCache, Deferred, disposeCompartmentAssets, transpileAssets } from '@qiankunjs/shared';
import { loadEntry, type LoaderOpts } from '../index';

// happy-dom does not implement the incremental document.write parser used by writable-dom.
// Exercise the real fetch/stream pipeline against its public sink contract, including a close
// that stays pending behind a blocking script and a load handler that would resume DOM writes.
vi.mock('../writable-dom', () => ({
  default: (target: HTMLElement, _previousSibling: Node | null, transform: <N extends Node>(node: N) => N) => {
    const pending: Node[] = [];
    let blockedScript: HTMLScriptElement | undefined;
    let completeClose: (() => void) | undefined;
    const walk = () => {
      while (pending.length && !blockedScript) {
        const node = pending.shift()!;
        if (node instanceof HTMLScriptElement && node.src && !node.defer && !node.hasAttribute('async')) {
          blockedScript = node;
          node.onload = node.onerror = () => {
            blockedScript = undefined;
            if (node.parentNode) walk();
          };
        }
        target.appendChild(transform(node));
      }
      if (!blockedScript) completeClose?.();
    };
    return {
      write(html: string) {
        const template = document.createElement('template');
        template.innerHTML = html;
        pending.push(...template.content.childNodes);
        walk();
      },
      close() {
        return new Promise<void>((resolve) => {
          completeClose = resolve;
          if (!blockedScript) walk();
        });
      },
      abort() {
        blockedScript?.remove();
      },
    };
  },
}));

const entry = 'https://micro.example/index.html';

function createContainer(): HTMLElement {
  const container = document.createElement('section');
  document.body.appendChild(container);
  return container;
}

function createCompartment(): CompartmentLoaderFacade {
  return {
    globalThis: window,
    latestSetProp: undefined,
    transformClassicScript: (source) => source,
    import: vi.fn().mockResolvedValue({}),
    load: vi.fn().mockResolvedValue(undefined),
    importDocumentModules: vi.fn().mockResolvedValue(undefined),
    registerDocumentModule: vi.fn(),
    registerImportMap: vi.fn(),
    dispose: vi.fn(),
  };
}

afterEach(() => {
  document.body.replaceChildren();
});

describe('loadEntry cancellation', () => {
  it('rejects an already-aborted load without fetching or writing', async () => {
    const controller = new AbortController();
    const reason = new Error('unloaded before fetch');
    controller.abort(reason);
    const fetch = vi.fn<typeof window.fetch>();
    const settled = vi.fn();
    const container = createContainer();

    await expect(
      loadEntry(entry, container, { fetch, signal: controller.signal, onDOMStreamSettled: settled }),
    ).rejects.toBe(reason);

    expect(fetch).not.toHaveBeenCalled();
    expect(settled).toHaveBeenCalledOnce();
    expect(container.innerHTML).toBe('');
  });

  it('rejects a hanging fetch promptly and cancels its eventual response body', async () => {
    const controller = new AbortController();
    const reason = new Error('fetch timed out');
    const fetching = new Deferred<Response>();
    const fetch = vi.fn<typeof window.fetch>(() => fetching.promise);
    const settled = vi.fn();
    const loading = loadEntry(entry, createContainer(), {
      fetch,
      signal: controller.signal,
      onDOMStreamSettled: settled,
    });
    const rejected = expect(loading).rejects.toBe(reason);
    expect(fetch).toHaveBeenCalledWith(entry, { signal: controller.signal });

    controller.abort(reason);
    await rejected;
    expect(settled).toHaveBeenCalledOnce();

    const cancel = vi.fn();
    fetching.resolve(new Response(new ReadableStream({ cancel })));
    await vi.waitFor(() => expect(cancel).toHaveBeenCalledWith(reason));
    expect(settled).toHaveBeenCalledOnce();
  });

  it('cancels an open body and never appends chunks queued during abort', async () => {
    const controller = new AbortController();
    const reason = new Error('stream timed out');
    const cancel = vi.fn();
    let streamController!: ReadableStreamDefaultController<Uint8Array>;
    const response = new Response(
      new ReadableStream<Uint8Array>({
        start(stream) {
          streamController = stream;
          stream.enqueue(new TextEncoder().encode('<main id="partial">partial</main>'));
        },
        cancel,
      }),
    );
    const container = createContainer();
    const settled = vi.fn();
    const loading = loadEntry({ url: entry, res: response }, container, {
      fetch: vi.fn<typeof window.fetch>(),
      signal: controller.signal,
      onDOMStreamSettled: settled,
    });
    const rejected = expect(loading).rejects.toBe(reason);
    await vi.waitFor(() => expect(container.querySelector('#partial')).not.toBeNull());
    expect(settled).not.toHaveBeenCalled();
    controller.signal.addEventListener('abort', () => {
      streamController.enqueue(new TextEncoder().encode('<aside id="late">late</aside>'));
    });

    controller.abort(reason);
    await rejected;
    await vi.waitFor(() => expect(cancel).toHaveBeenCalledWith(reason));
    expect(container.querySelector('#late')).toBeNull();
    expect(settled).toHaveBeenCalledOnce();
  });

  it('unblocks a pending close and disarms late events from a blocking script', async () => {
    const controller = new AbortController();
    const reason = new Error('blocked script timed out');
    const container = createContainer();
    const settled = vi.fn();
    let blockedScript: HTMLScriptElement | undefined;
    const loading = loadEntry(
      { url: entry, res: new Response('<script src="entry.js" entry></script><main id="late">late</main>') },
      container,
      {
        fetch: vi.fn<typeof window.fetch>(),
        signal: controller.signal,
        onDOMStreamSettled: settled,
        nodeTransformer(node) {
          if (node.nodeName === 'SCRIPT') {
            const script = node as unknown as HTMLScriptElement;
            script.dataset.src = script.src;
            script.removeAttribute('src');
            blockedScript = script;
          }
          return node;
        },
      },
    );
    const rejected = expect(loading).rejects.toBe(reason);
    await vi.waitFor(() => expect(blockedScript?.isConnected).toBe(true));
    expect(settled).not.toHaveBeenCalled();

    controller.abort(reason);
    await rejected;
    expect(settled).toHaveBeenCalledOnce();
    expect(blockedScript?.isConnected).toBe(false);
    blockedScript?.dispatchEvent(new Event('load'));
    blockedScript?.dispatchEvent(new Event('error'));
    await Promise.resolve();
    expect(container.querySelector('#late')).toBeNull();
    expect(settled).toHaveBeenCalledOnce();
  });

  it('rejects pending post-stream module evaluation without disposing the caller-owned compartment', async () => {
    const controller = new AbortController();
    const reason = new Error('module timed out');
    const compartment = createCompartment();
    const namespace = new Deferred<Record<string, unknown> | undefined>();
    vi.mocked(compartment.importDocumentModules).mockReturnValue(namespace.promise);
    const settled = vi.fn();
    const loading = loadEntry({ url: entry, res: new Response('<main>ready</main>') }, createContainer(), {
      fetch: vi.fn<typeof window.fetch>(),
      signal: controller.signal,
      compartment,
      onDOMStreamSettled: settled,
    });
    const rejected = expect(loading).rejects.toBe(reason);
    await vi.waitFor(() => expect(compartment.importDocumentModules).toHaveBeenCalledOnce());
    expect(settled).not.toHaveBeenCalled();

    controller.abort(reason);
    await rejected;
    namespace.resolve({ late: true });
    await Promise.resolve();
    expect(settled).toHaveBeenCalledOnce();
    expect(compartment.dispose).not.toHaveBeenCalled();
  });

  it('keeps cancellation active after the entry resolves while its HTML body remains open', async () => {
    const controller = new AbortController();
    const cancel = vi.fn();
    const settled = vi.fn();
    const response = new Response(
      new ReadableStream<Uint8Array>({
        start(stream) {
          stream.enqueue(new TextEncoder().encode('<script src="entry.js" entry></script>'));
        },
        cancel,
      }),
    );
    let entryScript: HTMLScriptElement | undefined;
    const loading = loadEntry({ url: entry, res: response }, createContainer(), {
      fetch: vi.fn<typeof window.fetch>(),
      signal: controller.signal,
      onDOMStreamSettled: settled,
      nodeTransformer(node) {
        if (node.nodeName === 'SCRIPT') {
          entryScript = node as unknown as HTMLScriptElement;
          entryScript.dataset.src = entryScript.src;
          entryScript.removeAttribute('src');
        }
        return node;
      },
    });
    await vi.waitFor(() => expect(entryScript?.isConnected).toBe(true));
    entryScript?.dispatchEvent(new Event('load'));
    await expect(loading).resolves.toEqual({});
    expect(settled).not.toHaveBeenCalled();

    const reason = new Error('unloaded after mount');
    controller.abort(reason);
    await vi.waitFor(() => expect(cancel).toHaveBeenCalledWith(reason));
    expect(settled).toHaveBeenCalledOnce();
    expect(entryScript?.isConnected).toBe(false);
  });

  it('leaves controller and compartment disposal to the owner on fetch cancellation', async () => {
    const controller = new AbortController();
    const reason = new Error('app cancelled');
    const compartment = createCompartment();
    vi.mocked(compartment.dispose).mockImplementation(() => {
      throw new Error('dispose failed');
    });
    const settled = vi.fn();
    const loading = loadEntry(entry, createContainer(), {
      fetch: () => new Promise<Response>(() => undefined),
      signal: controller.signal,
      compartment,
      onDOMStreamSettled: settled,
    });
    const rejected = expect(loading).rejects.toBe(reason);

    expect(() => controller.abort(reason)).not.toThrow();
    await rejected;
    expect(settled).toHaveBeenCalledOnce();
    expect(compartment.dispose).not.toHaveBeenCalled();
  });
});

describe('loadEntry cancellation with an async entry script', () => {
  const asyncEntryHTML = '<script src="late.js" entry async></script><main id="tail">tail</main>';

  function loadAsyncEntry(signal: AbortSignal, onDOMStreamSettled: () => void) {
    let entryScript: HTMLScriptElement | undefined;
    const container = createContainer();
    const loading = loadEntry({ url: entry, res: new Response(asyncEntryHTML) }, container, {
      fetch: vi.fn<typeof window.fetch>(),
      signal,
      onDOMStreamSettled,
      nodeTransformer(node) {
        if (node.nodeName === 'SCRIPT') {
          entryScript = node as unknown as HTMLScriptElement;
          entryScript.dataset.src = entryScript.src;
          entryScript.removeAttribute('src');
        }
        return node;
      },
    });
    return { container, loading, getEntryScript: () => entryScript };
  }

  it('rejects the pending entry when aborted after the DOM stream settled', async () => {
    const controller = new AbortController();
    const settled = vi.fn();
    const { container, loading, getEntryScript } = loadAsyncEntry(controller.signal, settled);
    const outcome = vi.fn();
    loading.then(outcome, outcome);
    await vi.waitFor(() => expect(settled).toHaveBeenCalledOnce());
    expect(container.querySelector('#tail')).not.toBeNull();
    expect(outcome).not.toHaveBeenCalled();

    const reason = new Error('unloaded before the async entry executed');
    controller.abort(reason);
    await vi.waitFor(() => expect(outcome).toHaveBeenCalledExactlyOnceWith(reason));
    await expect(loading).rejects.toBe(reason);
    const entryScript = getEntryScript();
    expect(entryScript?.isConnected).toBe(false);
    expect(entryScript?.onload).toBeNull();
    entryScript?.dispatchEvent(new Event('load'));
    await Promise.resolve();
    expect(outcome).toHaveBeenCalledOnce();
    expect(settled).toHaveBeenCalledOnce();
  });

  it('keeps the abort listener until the async entry settles, then removes it', async () => {
    const controller = new AbortController();
    const addListener = vi.spyOn(controller.signal, 'addEventListener');
    const removeListener = vi.spyOn(controller.signal, 'removeEventListener');
    const settled = vi.fn();
    const { loading, getEntryScript } = loadAsyncEntry(controller.signal, settled);
    // the loader registers its listener synchronously, before any stream pipe adds its own
    const listener = addListener.mock.calls.find(([type]) => type === 'abort')?.[1];
    expect(listener).toBeDefined();
    const removedLoaderListener = () => removeListener.mock.calls.some(([, removed]) => removed === listener);
    await vi.waitFor(() => expect(settled).toHaveBeenCalledOnce());
    expect(removedLoaderListener()).toBe(false);

    getEntryScript()?.dispatchEvent(new Event('load'));
    await expect(loading).resolves.toEqual({});
    await vi.waitFor(() => expect(removedLoaderListener()).toBe(true));
    expect(settled).toHaveBeenCalledOnce();
  });
});

describe('loadEntry asset ownership without a compartment', () => {
  const dependency = 'https://cdn.example/dep.css';
  const moduleResolver = (url: string) =>
    url.endsWith('dep.css') ? { name: 'dep', version: '1.0.0', url: dependency } : undefined;
  const nodeTransformer: LoaderOpts['nodeTransformer'] = (node, opts) =>
    transpileAssets(node, entry, { ...opts, moduleResolver });
  // a reused-dependency style preload becomes an owner-scoped blob link; the stylesheet link and the
  // script still pass the owner liveness check (the async script never blocks the walk, and loadable
  // urls are parked after transpiling so the test DOM never fetches or preloads them)
  const assetsHTML =
    '<link rel="preload" as="style" href="dep.css"><link rel="stylesheet" href="app.css"><script src="app.js" async></script>';
  const parkAssets: LoaderOpts['nodeTransformer'] = (node, opts) => {
    const transformed = nodeTransformer(node, opts);
    const element = transformed as unknown as HTMLElement;
    const urlAttribute = element.nodeName === 'SCRIPT' ? 'src' : element.nodeName === 'LINK' && 'href';
    if (urlAttribute) {
      element.dataset.parked = element.getAttribute(urlAttribute)!;
      element.removeAttribute(urlAttribute);
    }
    return transformed;
  };

  let blobSequence = 0;
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:asset-${String(++blobSequence)}`);
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    clearStylesheetCache();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not poison a shared fetch function when a load is cancelled', async () => {
    const sharedFetch = vi.fn<typeof window.fetch>(() => new Promise<Response>(() => undefined));

    // cancelled before streaming
    const preAborted = new AbortController();
    preAborted.abort(new Error('cancelled before streaming'));
    await expect(
      loadEntry(entry, createContainer(), {
        fetch: sharedFetch,
        signal: preAborted.signal,
        nodeTransformer: parkAssets,
      }),
    ).rejects.toThrow('cancelled before streaming');

    // cancelled mid-stream after its own assets were created
    const midStream = new AbortController();
    const reason = new Error('cancelled mid-stream');
    const cancelledContainer = createContainer();
    const cancelled = loadEntry(
      {
        url: entry,
        res: new Response(
          new ReadableStream<Uint8Array>({
            start(stream) {
              stream.enqueue(new TextEncoder().encode(assetsHTML));
            },
          }),
        ),
      },
      cancelledContainer,
      { fetch: sharedFetch, signal: midStream.signal, nodeTransformer: parkAssets },
    );
    const rejected = expect(cancelled).rejects.toBe(reason);
    await vi.waitFor(() => expect(cancelledContainer.querySelector('link[as="style"]')).not.toBeNull());
    const cancelledBlob = cancelledContainer.querySelector<HTMLLinkElement>('link[as="style"]')!.dataset.parked;
    midStream.abort(reason);
    await rejected;
    expect(URL.revokeObjectURL).toHaveBeenCalledExactlyOnceWith(cancelledBlob);

    // a later load reusing the same fetch function and no signal is unaffected
    const container = createContainer();
    await expect(
      loadEntry({ url: entry, res: new Response(assetsHTML) }, container, {
        fetch: sharedFetch,
        nodeTransformer: parkAssets,
      }),
    ).resolves.toEqual({});
    const liveLink = container.querySelector<HTMLLinkElement>('link[as="style"]');
    expect(liveLink?.dataset.parked).toMatch(/^blob:/);
    expect(container.querySelector('link[rel="stylesheet"]')?.dataset.parked).toBe('https://micro.example/app.css');
    expect(container.querySelector('script')?.dataset.parked).toBe('https://micro.example/app.js');
    expect(URL.revokeObjectURL).toHaveBeenCalledOnce();
  });

  it("releases every load's assets when the caller disposes its fetch owner", async () => {
    const appFetch = vi.fn<typeof window.fetch>();
    const containers = [createContainer(), createContainer()];
    for (const container of containers) {
      await loadEntry({ url: entry, res: new Response(assetsHTML) }, container, {
        fetch: appFetch,
        nodeTransformer: parkAssets,
      });
    }
    const blobs = containers.map(
      (container) => container.querySelector<HTMLLinkElement>('link[as="style"]')!.dataset.parked,
    );
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    disposeCompartmentAssets(appFetch);
    for (const blob of blobs) expect(URL.revokeObjectURL).toHaveBeenCalledWith(blob);
    for (const container of containers) expect(container.querySelector('link')).toBeNull();
    // the terminal release is permanent for later loads keyed by the same owner
    await expect(
      loadEntry({ url: entry, res: new Response(assetsHTML) }, createContainer(), {
        fetch: appFetch,
        nodeTransformer: parkAssets,
      }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });
});
