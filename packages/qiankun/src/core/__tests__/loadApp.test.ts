/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoaderOpts } from '@qiankunjs/loader';
import { isNativePassthroughNode, nativeGlobal } from '@qiankunjs/sandbox';
import { createSandbox as createRealSandbox } from '../../../../sandbox/src/core/sandbox';

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

import type { MicroAppLifeCycles } from '../../types';
import loadApp from '../loadApp';

const lifecycle = async (): Promise<void> => {};
const validLifecycles: MicroAppLifeCycles = {
  bootstrap: lifecycle,
  mount: lifecycle,
  unmount: lifecycle,
};

describe('loadApp sandbox cleanup', () => {
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

  it('preserves an entry loading error while aborting its sandbox', async () => {
    const loadError = new Error('entry loading failed');
    mocks.loadEntry.mockRejectedValue(loadError);
    mocks.dispose.mockRejectedValueOnce(new Error('cleanup failed'));

    await expect(loadApp(createApp())).rejects.toBe(loadError);
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('releases plugin, global accessor, and module resources after entry loading fails', async () => {
    const loadError = new Error('entry loading failed after resources were installed');
    const free = vi.fn(() => async () => {});
    const createModuleUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:load-failure-cleanup');
    const revokeModuleUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const listAccessors = () =>
      Object.getOwnPropertyNames(nativeGlobal).filter((key) => key.startsWith('__compartment_globalThis__'));
    const accessorsBeforeLoad = listAccessors();

    mocks.createSandbox.mockImplementationOnce(createRealSandbox);
    mocks.loadEntry.mockImplementationOnce((_entry: unknown, _container: HTMLElement, opts: LoaderOpts) => {
      opts.compartment?.registerImportMap('{"imports":{}}', document.baseURI);
      return Promise.reject(loadError);
    });

    await expect(
      loadApp(createApp(), {
        sandbox: {
          plugins: [
            {
              name: 'load-failure-resource-probe',
              bootstrap: () => free,
            },
          ],
        },
      }),
    ).rejects.toBe(loadError);

    expect(free).toHaveBeenCalledOnce();
    expect(createModuleUrl).toHaveBeenCalledOnce();
    expect(revokeModuleUrl).toHaveBeenCalledOnce();
    expect(listAccessors()).toEqual(accessorsBeforeLoad);
  });

  it('preserves a beforeLoad error while aborting its sandbox', async () => {
    const beforeLoadError = new Error('beforeLoad failed');
    mocks.loadEntry.mockResolvedValue(validLifecycles);

    await expect(
      loadApp(createApp(), undefined, {
        beforeLoad: async () => {
          throw beforeLoadError;
        },
      }),
    ).rejects.toBe(beforeLoadError);
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('aborts its sandbox when entry exports fail lifecycle validation', async () => {
    mocks.loadEntry.mockResolvedValue({});

    await expect(loadApp(createApp())).rejects.toThrowError('You need to export lifecycle functions');
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('routes registered-application unload through the sandbox controller cleanup', async () => {
    mocks.loadEntry.mockResolvedValue(validLifecycles);
    const container = document.createElement('div');
    const getParcelConfig = await loadApp(createApp(container));
    const parcelConfig = getParcelConfig(container);
    await parcelConfig.unload[0]();

    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('uses the public sandbox controller and shares its configured transformer with the loader', async () => {
    const controllerNodeTransformer = vi.fn(<T extends Node>(node: T) => node);
    const configuredNodeTransformer = vi.fn(<T extends Node>(node: T) => node);
    const resolveHook = (specifier: string) => specifier;
    const importHook = async () => ({ namespace: { ready: true } });
    const modules = { preset: { namespace: { preset: true } } };
    const container = document.createElement('div');
    mocks.createSandbox.mockReturnValueOnce({
      dispose: mocks.dispose,
      instance: {
        globalThis: window,
        latestSetProp: undefined,
      },
      mount: mocks.mount,
      nodeTransformer: controllerNodeTransformer,
      unmount: mocks.unmount,
    });
    mocks.loadEntry.mockResolvedValue(validLifecycles);

    await loadApp(createApp(container), {
      nodeTransformer: configuredNodeTransformer,
      sandbox: {
        globals: { tenant: 'acme' },
        importHook,
        modules,
        resolveHook,
        styleIsolation: true,
      },
    });

    expect(mocks.createSandbox).toHaveBeenCalledWith(
      'sandbox-cleanup-test',
      expect.objectContaining({
        globals: { tenant: 'acme' },
        importHook,
        modules,
        nodeTransformer: configuredNodeTransformer,
        resolveHook,
        styleIsolation: true,
      }),
    );
    const createOptions = mocks.createSandbox.mock.calls[0][1];
    expect(createOptions.container()).toBe(container);
    expect(createOptions.compartmentOptions.moduleHost).toEqual(
      expect.objectContaining({
        entryUrl: 'https://sandbox-cleanup.test/index.html',
        instanceId: expect.any(Number),
        isLifecycleNamespace: expect.any(Function),
        materializeRedirect: expect.any(Function),
      }),
    );
    expect(mocks.loadEntry).toHaveBeenCalledWith(
      'https://sandbox-cleanup.test/index.html',
      container,
      expect.objectContaining({ nodeTransformer: controllerNodeTransformer }),
    );
  });

  it('reuses a 270-module graph across disposed instances without evicting entry or stylesheet responses', async () => {
    const baseUrl = 'https://module-cache.test/';
    const entry = `${baseUrl}index.html`;
    const stylesheet = `${baseUrl}style.css`;
    const moduleUrls = Array.from({ length: 270 }, (_, i) => `${baseUrl}${i}.js`);
    const graph = moduleUrls
      .slice(1)
      .map((url) => `import '${url}';`)
      .join('\n');
    const fetch = vi.fn(
      async (input: RequestInfo | URL) =>
        new Response(String(input) === moduleUrls[0] ? graph : 'export {};', { status: 200 }),
    );
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:module-cache-test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    mocks.createSandbox.mockImplementation(createRealSandbox);
    mocks.loadEntry.mockImplementation(async (_entry: string, _container: HTMLElement, opts: LoaderOpts) => {
      if (!opts.fetch || !opts.compartment) throw new Error('missing loader inputs');
      await Promise.all([opts.fetch(entry), opts.fetch(stylesheet)]);
      await opts.compartment.load(moduleUrls[0]);
      return validLifecycles;
    });

    for (let instance = 0; instance < 2; instance++) {
      const container = document.createElement('div');
      const getParcelConfig = await loadApp({ ...createApp(container), entry }, { fetch });
      await getParcelConfig(container).unload[0]();
    }

    // The second instance still links its own graph, but performs no new downloads.
    expect(fetch).toHaveBeenCalledTimes(272);
    for (const url of [entry, stylesheet, ...moduleUrls]) {
      expect(fetch.mock.calls.filter(([input]) => String(input) === url)).toHaveLength(1);
    }
  });

  it('marks sandbox-less streamed nodes for native passthrough', async () => {
    let streamedNodeTransformer: LoaderOpts['nodeTransformer'];
    mocks.loadEntry.mockImplementationOnce((_entry: unknown, _container: HTMLElement, opts: LoaderOpts) => {
      streamedNodeTransformer = opts.nodeTransformer;
      opts.onDOMStreamSettled?.();
      return Promise.resolve(validLifecycles);
    });

    await loadApp(createApp(), { sandbox: false });

    // a residual patched mount point (a broken predecessor's) must let these nodes through
    // untouched — pre-internalization the loader stamped every streamed clone unconditionally
    const streamedStyle = document.createElement('style');
    const transformedStyle = streamedNodeTransformer!(streamedStyle, { fetch: window.fetch });
    expect(isNativePassthroughNode(transformedStyle)).toBe(true);
  });
});

function createApp(container = document.createElement('div')) {
  return {
    name: 'sandbox-cleanup-test',
    entry: 'https://sandbox-cleanup.test/index.html',
    container,
  };
}
