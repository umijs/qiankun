import { afterEach, describe, expect, it, vi } from 'vitest';
import { type CompartmentLoaderFacade } from '@qiankunjs/sandbox';
import { Deferred } from '@qiankunjs/shared';
import { loadEntry } from '../index';

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
        if (node instanceof HTMLScriptElement && node.src && !node.defer) {
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
