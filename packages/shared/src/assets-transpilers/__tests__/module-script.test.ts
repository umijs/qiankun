import { describe, expect, it, vi } from 'vitest';
import type { EsmSandboxEngine } from '../../esm-sandbox';
import transpileLink from '../link';
import transpileScript from '../script';

const baseUrl = 'https://app.host/';

const createEngineMock = () => ({
  loadModuleScript: vi.fn(),
  registerAppImportMap: vi.fn(),
  setFetchCredentials: vi.fn(),
});

const sandbox = {
  makeEvaluateFactory: (source: string) => source,
};

const transpile = (script: HTMLScriptElement, engine: ReturnType<typeof createEngineMock>) =>
  transpileScript(script, baseUrl, {
    fetch: window.fetch,
    sandbox,
    esmEngine: engine as unknown as EsmSandboxEngine,
  });

describe('module script routing', () => {
  it('neutralizes external module scripts and hands them to the engine', () => {
    const engine = createEngineMock();
    const script = document.createElement('script');
    script.type = 'module';
    script.setAttribute('src', './main.js');
    script.setAttribute('entry', '');

    const transformed = transpile(script, engine);

    expect(transformed.hasAttribute('src')).toBe(false);
    expect(transformed.dataset.src).toBe('https://app.host/main.js');
    expect(transformed.dataset.esm).toBe('true');
    expect(engine.loadModuleScript).toHaveBeenCalledWith({
      url: 'https://app.host/main.js',
      baseUrl,
      isEntry: true,
    });
  });

  it('marks non-entry module scripts accordingly', () => {
    const engine = createEngineMock();
    const script = document.createElement('script');
    script.type = 'module';
    script.setAttribute('src', '/src/other.js');

    transpile(script, engine);

    expect(engine.loadModuleScript).toHaveBeenCalledWith({
      url: 'https://app.host/src/other.js',
      baseUrl,
      isEntry: false,
    });
  });

  it('consumes inline module code and leaves an inert comment behind', () => {
    const engine = createEngineMock();
    const script = document.createElement('script');
    script.type = 'module';
    const code = `import '/@react-refresh';\nwindow.__preamble__ = true;`;
    script.textContent = code;

    const transformed = transpile(script, engine);

    expect(engine.loadModuleScript).toHaveBeenCalledWith({ code, baseUrl });
    expect(transformed.textContent).toContain('qiankun: inline module consumed');
    expect(transformed.dataset.consumed).toBe('true');
  });

  it('leaves empty inline module hosts untouched on the first walk pass', () => {
    const engine = createEngineMock();
    const script = document.createElement('script');
    script.type = 'module';

    transpile(script, engine);

    expect(engine.loadModuleScript).not.toHaveBeenCalled();
  });

  it('keeps the classic path when no esm engine is present', () => {
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = 'console.log(1)';

    const transformed = transpileScript(script, baseUrl, { fetch: window.fetch, sandbox });
    // classic inline path consumed it through makeEvaluateFactory
    expect(transformed.dataset.consumed).toBe('true');
  });
});

describe('importmap script interception', () => {
  it('parses the sub app import map and neutralizes the script type', () => {
    const engine = createEngineMock();
    const script = document.createElement('script');
    script.type = 'importmap';
    const mapText = JSON.stringify({ imports: { vue: 'https://cdn.host/vue.js' } });
    script.textContent = mapText;

    const transformed = transpile(script, engine);

    expect(engine.registerAppImportMap).toHaveBeenCalledWith(mapText, baseUrl);
    expect(transformed.type).toBe('qiankun-importmap');
    expect(transformed.textContent).toContain('importmap consumed');
  });

  it('neutralizes the empty importmap host on the first walk pass without registering', () => {
    const engine = createEngineMock();
    const script = document.createElement('script');
    script.type = 'importmap';

    const transformed = transpile(script, engine);

    expect(engine.registerAppImportMap).not.toHaveBeenCalled();
    expect(transformed.type).toBe('qiankun-importmap');
  });

  it('is idempotent across writable-dom re-visits (no double parse of the consumed comment)', () => {
    const engine = createEngineMock();
    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify({ imports: { vue: 'https://cdn.host/vue.js' } });

    // first (registering) pass, then a re-visit where the element already carries the consumed comment
    transpile(script, engine);
    transpile(script, engine);

    // registered exactly once; the leftover comment is never re-parsed
    expect(engine.registerAppImportMap).toHaveBeenCalledTimes(1);
  });
});

describe('modulepreload rewriting', () => {
  it('rewrites modulepreload links to as=fetch preloads when the esm engine is active', () => {
    const engine = createEngineMock();
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.setAttribute('href', '/src/main.js');

    const transformed = transpileLink(link, baseUrl, {
      fetch: window.fetch,
      sandbox,
      esmEngine: engine as unknown as EsmSandboxEngine,
    }) as HTMLLinkElement;

    expect(transformed.rel).toBe('preload');
    expect(transformed.as).toBe('fetch');
    expect(transformed.getAttribute('href')).toBe('https://app.host/src/main.js');
    // matches the pipeline fetch() defaults (cors + same-origin)
    expect(transformed.crossOrigin).toBe('anonymous');
  });

  it('preserves use-credentials on rewritten modulepreload links', () => {
    const engine = createEngineMock();
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.crossOrigin = 'use-credentials';
    link.setAttribute('href', './chunk.js');

    const transformed = transpileLink(link, baseUrl, {
      fetch: window.fetch,
      sandbox,
      esmEngine: engine as unknown as EsmSandboxEngine,
    }) as HTMLLinkElement;

    expect(transformed.rel).toBe('preload');
    expect(transformed.as).toBe('fetch');
    expect(transformed.getAttribute('href')).toBe('https://app.host/chunk.js');
    expect(transformed.crossOrigin).toBe('use-credentials');
  });

  it('keeps modulepreload links untouched without the esm engine', () => {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.setAttribute('href', '/src/main.js');

    const transformed = transpileLink(link, baseUrl, { fetch: window.fetch, sandbox });
    expect(transformed.getAttribute('href')).toBeTruthy();
  });
});
