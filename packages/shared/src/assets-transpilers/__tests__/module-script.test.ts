import { describe, expect, it, vi } from 'vitest';
import type { CompartmentModuleFacade } from '../../esm-sandbox';
import transpileLink from '../link';
import transpileScript from '../script';

const baseUrl = 'https://app.host/';

const createCompartmentMock = () => ({
  dispose: vi.fn(),
  import: vi.fn(),
  importDocumentModules: vi.fn(),
  load: vi.fn(),
  registerDocumentModule: vi.fn(),
  registerImportMap: vi.fn(),
});

const classicScriptTransformer = (source: string) => source;

const transpile = (script: HTMLScriptElement, compartment: ReturnType<typeof createCompartmentMock>) =>
  transpileScript(script, baseUrl, {
    classicScriptTransformer,
    compartment: compartment as unknown as CompartmentModuleFacade,
    fetch: window.fetch,
  });

describe('module script routing', () => {
  it('neutralizes external module scripts and hands them to the engine', () => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'module';
    script.setAttribute('src', './main.js');
    script.setAttribute('entry', '');

    const transformed = transpile(script, compartment);

    expect(transformed.hasAttribute('src')).toBe(false);
    expect(transformed.dataset.src).toBe('https://app.host/main.js');
    expect(transformed.dataset.esm).toBe('true');
    expect(compartment.registerDocumentModule).toHaveBeenCalledWith({
      url: 'https://app.host/main.js',
      baseUrl,
      isEntry: true,
      credentials: undefined,
    });
  });

  it('marks non-entry module scripts accordingly', () => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'module';
    script.setAttribute('src', '/src/other.js');

    transpile(script, compartment);

    expect(compartment.registerDocumentModule).toHaveBeenCalledWith({
      url: 'https://app.host/src/other.js',
      baseUrl,
      isEntry: false,
      credentials: undefined,
    });
  });

  it('consumes inline module code and leaves an inert comment behind', () => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'module';
    const code = `import '/@react-refresh';\nwindow.__preamble__ = true;`;
    script.textContent = code;

    const transformed = transpile(script, compartment);

    expect(compartment.registerDocumentModule).toHaveBeenCalledWith({ code, baseUrl, credentials: undefined });
    expect(transformed.textContent).toContain('qiankun: inline module consumed');
    expect(transformed.dataset.consumed).toBe('true');
  });

  it.each([
    ['use-credentials', 'include'],
    ['anonymous', 'same-origin'],
  ] as const)('binds crossorigin=%s credentials to the registered document module', (crossOrigin, credentials) => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'module';
    script.crossOrigin = crossOrigin;
    script.src = './main.js';

    transpile(script, compartment);

    expect(compartment.registerDocumentModule).toHaveBeenCalledWith(expect.objectContaining({ credentials }));
  });

  it('leaves empty inline module hosts untouched on the first walk pass', () => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'module';

    transpile(script, compartment);

    expect(compartment.registerDocumentModule).not.toHaveBeenCalled();
  });

  it('leaves native module scripts untouched when no compartment is present', () => {
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = 'console.log(1)';

    const transformed = transpileScript(script, baseUrl, { fetch: window.fetch });
    expect(transformed.dataset.consumed).toBeUndefined();
    expect(transformed.textContent).toBe('console.log(1)');
  });
});

describe('importmap script interception', () => {
  it('parses the sub app import map and neutralizes the script type', () => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'importmap';
    const mapText = JSON.stringify({ imports: { vue: 'https://cdn.host/vue.js' } });
    script.textContent = mapText;

    const transformed = transpile(script, compartment);

    expect(compartment.registerImportMap).toHaveBeenCalledWith(mapText, baseUrl);
    expect(transformed.type).toBe('qiankun-importmap');
    expect(transformed.textContent).toContain('importmap consumed');
  });

  it('neutralizes the empty importmap host on the first walk pass without registering', () => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'importmap';

    const transformed = transpile(script, compartment);

    expect(compartment.registerImportMap).not.toHaveBeenCalled();
    expect(transformed.type).toBe('qiankun-importmap');
  });

  it('is idempotent across writable-dom re-visits (no double parse of the consumed comment)', () => {
    const compartment = createCompartmentMock();
    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify({ imports: { vue: 'https://cdn.host/vue.js' } });

    // first (registering) pass, then a re-visit where the element already carries the consumed comment
    transpile(script, compartment);
    transpile(script, compartment);

    // registered exactly once; the leftover comment is never re-parsed
    expect(compartment.registerImportMap).toHaveBeenCalledTimes(1);
  });
});

describe('modulepreload rewriting', () => {
  it('rewrites modulepreload links to as=fetch preloads when the compartment is active', () => {
    const compartment = createCompartmentMock();
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.setAttribute('href', '/src/main.js');

    const transformed = transpileLink(link, baseUrl, {
      compartment: compartment as unknown as CompartmentModuleFacade,
      fetch: window.fetch,
    }) as HTMLLinkElement;

    expect(transformed.rel).toBe('preload');
    expect(transformed.as).toBe('fetch');
    expect(transformed.getAttribute('href')).toBe('https://app.host/src/main.js');
    // matches the pipeline fetch() defaults (cors + same-origin)
    expect(transformed.crossOrigin).toBe('anonymous');
  });

  it('preserves use-credentials on rewritten modulepreload links', () => {
    const compartment = createCompartmentMock();
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.crossOrigin = 'use-credentials';
    link.setAttribute('href', './chunk.js');

    const transformed = transpileLink(link, baseUrl, {
      compartment: compartment as unknown as CompartmentModuleFacade,
      fetch: window.fetch,
    }) as HTMLLinkElement;

    expect(transformed.rel).toBe('preload');
    expect(transformed.as).toBe('fetch');
    expect(transformed.getAttribute('href')).toBe('https://app.host/chunk.js');
    expect(transformed.crossOrigin).toBe('use-credentials');
  });

  it('keeps modulepreload links untouched without a compartment', () => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.setAttribute('href', '/src/main.js');

    const transformed = transpileLink(link, baseUrl, { fetch: window.fetch });
    expect(transformed.getAttribute('href')).toBeTruthy();
  });
});
