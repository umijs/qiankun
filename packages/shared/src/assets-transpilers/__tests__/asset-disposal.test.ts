import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type CompartmentModuleFacade } from '../../esm-sandbox';
import { Deferred } from '../../utils';
import transpileLink, { clearStylesheetCache, getStylesheetCacheStats } from '../link';
import transpileScript, { disposeCompartmentAssets } from '../script';

const baseURI = 'https://micro.example/';
const styleIsolation = { appName: 'app', scopeRoot: '[data-name="app"]' };

function createCompartment(): CompartmentModuleFacade {
  return {
    import: vi.fn().mockResolvedValue({}),
    load: vi.fn().mockResolvedValue(undefined),
    importDocumentModules: vi.fn().mockResolvedValue(undefined),
    registerDocumentModule: vi.fn(),
    registerImportMap: vi.fn(),
    dispose: vi.fn(),
  };
}

function createScript(): HTMLScriptElement {
  const script = document.createElement('script');
  script.src = `${baseURI}entry.js`;
  return script;
}

function createLink(): HTMLLinkElement {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${baseURI}shared.css`;
  return link;
}

beforeEach(() => {
  let sequence = 0;
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:asset-${String(++sequence)}`);
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
  clearStylesheetCache();
});

afterEach(() => {
  clearStylesheetCache();
  vi.restoreAllMocks();
});

describe('classic asset disposal', () => {
  it('cancels a pending script request without an error event or late blob creation', async () => {
    const compartment = createCompartment();
    const pending = new Deferred<Response>();
    const fetch = vi.fn<typeof window.fetch>(() => pending.promise);
    const script = createScript();
    const onError = vi.fn();
    script.addEventListener('error', onError);
    const transform = vi.fn((code: string) => code);
    transpileScript(script, baseURI, { compartment, fetch, classicScriptTransformer: transform });
    const signal = fetch.mock.calls[0][1]?.signal;

    disposeCompartmentAssets(compartment);
    expect(signal?.aborted).toBe(true);
    const text = vi.fn().mockResolvedValue('window.late = true;');
    pending.resolve({ text } as unknown as Response);
    await vi.waitFor(() => expect(text).toHaveBeenCalledOnce());
    expect(transform).not.toHaveBeenCalled();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('cancels a fetched defer script while it is waiting behind its predecessor', async () => {
    const compartment = createCompartment();
    const previous = new Deferred<void>();
    const current = new Deferred<void>();
    const transform = vi.fn((code: string) => code);
    const script = createScript();
    script.defer = true;
    transpileScript(script, baseURI, {
      compartment,
      fetch: vi.fn().mockResolvedValue(new Response('window.late = true;')),
      classicScriptTransformer: transform,
      prevScriptTranspiledDeferred: previous,
      scriptTranspiledDeferred: current,
    });
    await vi.waitFor(() => expect(transform).toHaveBeenCalledOnce());
    const rejected = expect(current.promise).rejects.toMatchObject({ name: 'AbortError' });

    disposeCompartmentAssets(compartment);
    await rejected;
    previous.resolve();
    await previous.promise;
    await Promise.resolve();
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(script.hasAttribute('src')).toBe(false);
  });

  it('releases an unexecuted script blob and its before-execute listener exactly once', async () => {
    const compartment = createCompartment();
    const script = createScript();
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');
    transpileScript(script, baseURI, {
      compartment,
      fetch: vi.fn().mockResolvedValue(new Response('window.app = {};')),
      classicScriptTransformer: (code) => code,
    });
    await vi.waitFor(() => expect(script.src).toMatch(/^blob:/));
    const blobUrl = script.src;
    const listener = addListener.mock.calls.find(([type]) => type === 'q:bse')?.[1];

    disposeCompartmentAssets(compartment);
    disposeCompartmentAssets(compartment);
    expect(URL.revokeObjectURL).toHaveBeenCalledExactlyOnceWith(blobUrl);
    expect(removeListener).toHaveBeenCalledWith('q:bse', listener);
    window.dispatchEvent(new CustomEvent('q:bse', { detail: { s: script } }));
    expect(script.dataset.consumed).toBeUndefined();
    expect(script.hasAttribute('src')).toBe(false);
  });

  it('reports a real script failure through its error event without a detached rejection', async () => {
    const script = createScript();
    const onError = vi.fn();
    script.addEventListener('error', onError);
    transpileScript(script, baseURI, {
      compartment: createCompartment(),
      fetch: vi.fn().mockRejectedValue(new Error('network failed')),
      classicScriptTransformer: (code) => code,
    });
    await vi.waitFor(() => expect(onError).toHaveBeenCalledOnce());
    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });
});

describe('stylesheet ownership', () => {
  it('retains shared stylesheet blobs until their last owner is disposed, then refetches', async () => {
    const first = createCompartment();
    const second = createCompartment();
    const fetch = vi.fn().mockResolvedValue(new Response('.app { color: red; }'));
    const firstLink = createLink();
    const secondLink = createLink();
    transpileLink(firstLink, baseURI, { compartment: first, fetch, styleIsolation });
    await vi.waitFor(() => expect(firstLink.href).toMatch(/^blob:/));
    transpileLink(secondLink, baseURI, { compartment: second, fetch, styleIsolation });
    const sharedUrl = secondLink.href;
    expect(firstLink.href).toBe(sharedUrl);

    disposeCompartmentAssets(first);
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    expect(secondLink.href).toBe(sharedUrl);
    expect(getStylesheetCacheStats().size).toBe(1);

    disposeCompartmentAssets(second);
    expect(URL.revokeObjectURL).toHaveBeenCalledExactlyOnceWith(sharedUrl);
    expect(getStylesheetCacheStats().size).toBe(0);
    const freshFetch = vi.fn().mockResolvedValue(new Response('.app { color: blue; }'));
    const freshLink = createLink();
    transpileLink(freshLink, baseURI, { compartment: createCompartment(), fetch: freshFetch, styleIsolation });
    await vi.waitFor(() => expect(freshLink.href).toMatch(/^blob:/));
    expect(freshFetch).toHaveBeenCalledOnce();
    expect(freshLink.href).not.toBe(sharedUrl);
  });

  it('cancels only one owner during concurrent stylesheet requests', async () => {
    const first = createCompartment();
    const second = createCompartment();
    const firstResponse = new Deferred<Response>();
    const secondResponse = new Deferred<Response>();
    const firstFetch = vi.fn<typeof window.fetch>(() => firstResponse.promise);
    const secondFetch = vi.fn<typeof window.fetch>(() => secondResponse.promise);
    const firstLink = createLink();
    const secondLink = createLink();
    const onError = vi.fn();
    firstLink.addEventListener('error', onError);
    transpileLink(firstLink, baseURI, { compartment: first, fetch: firstFetch, styleIsolation });
    transpileLink(secondLink, baseURI, { compartment: second, fetch: secondFetch, styleIsolation });

    disposeCompartmentAssets(first);
    expect(firstFetch.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(secondFetch.mock.calls[0][1]?.signal?.aborted).toBe(false);
    firstResponse.resolve(new Response('.late { color: red; }'));
    secondResponse.resolve(new Response('.live { color: blue; }'));
    await vi.waitFor(() => expect(secondLink.href).toMatch(/^blob:/));
    expect(firstLink.hasAttribute('href')).toBe(false);
    expect(onError).not.toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    disposeCompartmentAssets(second);
    expect(getStylesheetCacheStats().size).toBe(0);
  });

  it('does not create a blob when an asynchronous CSS import finishes after disposal', async () => {
    const compartment = createCompartment();
    const imported = new Deferred<Response>();
    const fetch = vi.fn<typeof window.fetch>(async (input) => {
      if (String(input).endsWith('shared.css')) return new Response('@import "./late.css"; .app { color: red; }');
      return imported.promise;
    });
    const link = createLink();
    transpileLink(link, baseURI, { compartment, fetch, styleIsolation });
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    disposeCompartmentAssets(compartment);
    const text = vi.fn().mockResolvedValue('.late { color: blue; }');
    imported.resolve({ text } as unknown as Response);
    await vi.waitFor(() => expect(text).toHaveBeenCalledOnce());
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(link.hasAttribute('href')).toBe(false);
    expect(getStylesheetCacheStats().size).toBe(0);
  });
});
