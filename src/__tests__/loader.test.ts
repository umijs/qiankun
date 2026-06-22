import { importEntry } from 'import-html-entry';
import { loadApp } from '../loader';

jest.mock('import-html-entry', () => ({
  importEntry: jest.fn(),
}));

const lifecycles = {
  bootstrap: jest.fn(),
  mount: jest.fn(),
  unmount: jest.fn(),
};

const mockImportEntry = importEntry as jest.MockedFunction<typeof importEntry>;

beforeEach(() => {
  document.body.innerHTML = '<div id="container"></div>';
  delete (window as any).app;
  delete (window as any).asyncApp;
  delete (window as any).microtaskApp;
  delete (window as any).sandboxAsyncApp;
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('should expose document.currentScript while executing initial entry scripts', async () => {
  const scriptUrl = 'http://localhost:7100/umi.js';

  mockImportEntry.mockResolvedValue({
    template: '<div></div>',
    assetPublicPath: 'http://localhost:7100/',
    getExternalScripts: () => Promise.resolve([]),
    getExternalStyleSheets: () => Promise.resolve([]),
    execScripts: (_global: Window, _strictGlobal: boolean, opts: any) => {
      opts.beforeExec('window.__entry_loaded__ = true;', scriptUrl);

      expect(document.currentScript).toBeInstanceOf(HTMLScriptElement);
      expect((document.currentScript as HTMLScriptElement).src).toBe(scriptUrl);

      opts.afterExec('window.__entry_loaded__ = true;', scriptUrl);
      expect(document.currentScript).toBeNull();

      return Promise.resolve(lifecycles);
    },
  } as any);

  await loadApp(
    {
      name: 'app',
      entry: 'http://localhost:7100/',
      container: '#container',
    },
    {
      sandbox: false,
    } as any,
  );
});

test('should cleanup document.currentScript when initial entry execution fails', async () => {
  const scriptUrl = 'http://localhost:7100/umi.js';

  mockImportEntry.mockResolvedValue({
    template: '<div></div>',
    assetPublicPath: 'http://localhost:7100/',
    getExternalScripts: () => Promise.resolve([]),
    getExternalStyleSheets: () => Promise.resolve([]),
    execScripts: (_global: Window, _strictGlobal: boolean, opts: any) => {
      opts.beforeExec('throw new Error("boom");', scriptUrl);
      expect((document.currentScript as HTMLScriptElement).src).toBe(scriptUrl);

      opts.error();
      expect(document.currentScript).toBeNull();

      return Promise.resolve(lifecycles);
    },
  } as any);

  await loadApp(
    {
      name: 'app',
      entry: 'http://localhost:7100/',
      container: '#container',
    },
    {
      sandbox: false,
    },
  );
});

test('should read lifecycle globals exposed in entry microtask', async () => {
  mockImportEntry.mockResolvedValue({
    template: '<div></div>',
    assetPublicPath: 'http://localhost:7100/',
    getExternalScripts: () => Promise.resolve([]),
    getExternalStyleSheets: () => Promise.resolve([]),
    execScripts: () => {
      Promise.resolve().then(() => {
        (window as any).microtaskApp = lifecycles;
      });

      return Promise.resolve({});
    },
  } as any);

  await expect(
    loadApp(
      {
        name: 'microtaskApp',
        entry: 'http://localhost:7100/',
        container: '#container',
      },
      {
        sandbox: false,
      },
    ),
  ).resolves.toEqual(expect.any(Function));
});
