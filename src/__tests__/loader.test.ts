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
  jest.clearAllMocks();
});

test('should expose document.currentScript while executing initial entry scripts', async () => {
  const beforeExec = jest.fn();
  const afterExec = jest.fn();
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
      expect(beforeExec).toHaveBeenCalledWith('window.__entry_loaded__ = true;', scriptUrl);

      opts.afterExec('window.__entry_loaded__ = true;', scriptUrl);
      expect(document.currentScript).toBeNull();
      expect(afterExec).toHaveBeenCalledWith('window.__entry_loaded__ = true;', scriptUrl);

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
      beforeExec,
      afterExec,
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
