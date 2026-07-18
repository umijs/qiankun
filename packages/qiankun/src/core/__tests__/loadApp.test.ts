/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoaderOpts } from '@qiankunjs/loader';
import { nativeGlobal } from '@qiankunjs/sandbox';
import { createSandboxContainer as createRealSandboxContainer } from '../../../../sandbox/src/core/sandbox';

const mocks = vi.hoisted(() => ({
  createSandboxContainer: vi.fn(),
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
  createSandboxContainer: mocks.createSandboxContainer,
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
    mocks.createSandboxContainer.mockReturnValue({
      dispose: mocks.dispose,
      instance: {
        globalThis: window,
        latestSetProp: undefined,
      },
      mount: mocks.mount,
      unmount: mocks.unmount,
    });
  });

  afterEach(() => {
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

    mocks.createSandboxContainer.mockImplementationOnce(createRealSandboxContainer);
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
});

function createApp(container = document.createElement('div')) {
  return {
    name: 'sandbox-cleanup-test',
    entry: 'https://sandbox-cleanup.test/index.html',
    container,
  };
}
