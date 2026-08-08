import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EsmSandboxEngine, type EsmSandboxEngineOpts } from '../engine';
import { resetImportMapRegistry } from '../import-map-registry';
import type { EsmInstance, InstanceHandle } from '../instance-registry';
import { moduleSourceInstanceKeyPlaceholder, precompileModuleSource } from '../precompile';
import type { ImportHook, ModuleDescriptor, ResolveHook } from '../types';

type MockWorld = {
  engine: EsmSandboxEngine;
  fetchMock: ReturnType<typeof vi.fn>;
  importerMock: ReturnType<typeof vi.fn>;
  codeByUrl: Map<string, string>;
  revoked: string[];
  getInstance: () => EsmInstance;
};

// reach an engine's instance through the same random-key/token bridge the runtime module blob uses,
// which is exactly how a real browser resolves it (accessor key and token are both unguessable)
const instanceOf = (handle: InstanceHandle): EsmInstance | undefined =>
  (globalThis as unknown as Record<string, ((token: string) => EsmInstance | undefined) | undefined>)[
    handle.accessorKey
  ]?.(handle.token);

/**
 * The mock importer simulates the browser module pipeline order: parse errors (duplicate lexical
 * declarations between the injected destructuring and module-own declarations) surface before
 * resolution errors, and probe specifiers never resolve.
 */
type EngineOverrides = Partial<
  Pick<EsmSandboxEngineOpts, 'importHook' | 'loadHook' | 'materializeRedirect' | 'modules' | 'resolveHook'>
>;

const createWorld = (
  modules: Partial<Record<string, string>>,
  opts: { appName?: string; engine?: EngineOverrides } = {},
): MockWorld => {
  const codeByUrl = new Map<string, string>();
  const revoked: string[] = [];
  let seq = 0;

  const fetchMock = vi.fn((input: RequestInfo | URL, _init?: RequestInit): Promise<Response> => {
    const url = String(input);
    const source = modules[url];
    if (source === undefined) {
      return Promise.reject(new TypeError(`404 ${url}`));
    }
    return Promise.resolve(new Response(source, { status: 200 }));
  });

  const importerMock = vi.fn((moduleUrl: string): Promise<Record<string, unknown>> => {
    const code = codeByUrl.get(moduleUrl);
    if (code === undefined) {
      return Promise.reject(new TypeError(`Failed to fetch the module ${moduleUrl}`));
    }

    const destructureMatch = /const \{ ([^}]+) \} = __qk_view;/.exec(code);
    if (destructureMatch) {
      const names = destructureMatch[1].split(',').map((name) => name.trim());
      const body = code.replace(destructureMatch[0], '');
      for (const name of names) {
        if (new RegExp(`\\b(?:const|let|var|function|class)\\s+${name}\\b`).test(body)) {
          return Promise.reject(new SyntaxError(`Identifier '${name}' has already been declared`));
        }
      }
    }

    if (code.includes('/__probe__')) {
      return Promise.reject(new TypeError('Failed to resolve module specifier'));
    }

    return Promise.resolve({ moduleUrl, code });
  });

  const engine = new EsmSandboxEngine({
    appName: opts.appName ?? 'app-a',
    instanceId: 1,
    entryUrl: 'https://a.host/',
    fetch: fetchMock as unknown as typeof window.fetch,
    getGlobalsView: () => ({}),
    globalsBaseSet: ['window', 'document', 'console', 'history', 'location'],
    // the mock namespace only carries {code}; treat a module as lifecycle-bearing when its source
    // exports bootstrap/mount/unmount (named or via `export { ... }`)
    isLifecycleNamespace: (ns) => {
      const code = (ns as { code?: string }).code ?? '';
      return ['bootstrap', 'mount', 'unmount'].every((name) =>
        new RegExp(`\\b${name}\\b`).test(
          code
            .split('\n')
            .filter((line) => line.includes('export'))
            .join('\n'),
        ),
      );
    },
    ...opts.engine,
    moduleImporter: importerMock as unknown as (moduleUrl: string) => Promise<Record<string, unknown>>,
    createModuleUrl: (code) => {
      const url = `mock:${++seq}`;
      codeByUrl.set(url, code);
      return url;
    },
    revokeModuleUrl: (url) => {
      revoked.push(url);
    },
  });

  return {
    engine,
    fetchMock,
    importerMock,
    codeByUrl,
    revoked,
    getInstance: () => instanceOf(engine.instanceHandle)!,
  };
};

const readInjectedImports = (): Record<string, string> =>
  Array.from(document.head.querySelectorAll('script[type="importmap"][data-qiankun="esm"]')).reduce(
    (acc, script) => ({ ...acc, ...(JSON.parse(script.textContent) as { imports: Record<string, string> }).imports }),
    {},
  );

beforeEach(() => {
  resetImportMapRegistry();
});

afterEach(() => {
  document.head.querySelectorAll('script[type="importmap"]').forEach((script) => script.remove());
});

describe('EsmSandboxEngine', () => {
  it('transpiles the module graph, injects the import map and resolves the entry namespace', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import { inc } from './dep.js';\nconsole.log(window);\nexport function mount() { return inc(); }`,
      'https://a.host/dep.js': `export const inc = () => 1;`,
    });
    const { engine } = world;

    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    const entryPromise = engine.importDocumentModules();
    expect(engine.importDocumentModules()).toBe(entryPromise);
    const ns = (await entryPromise) as { code: string };

    // both modules fetched in parallel through the provided fetch
    expect(world.fetchMock).toHaveBeenCalledTimes(2);

    // the injected import map covers the runtime module and both graph modules
    const imports = readInjectedImports();
    expect(imports[`${engine.instanceKey}/__runtime__`]).toBeDefined();
    expect(imports[`${engine.instanceKey}/https://a.host/main.js`]).toBeDefined();
    expect(imports[`${engine.instanceKey}/https://a.host/dep.js`]).toBeDefined();

    // the entry module was rewritten against the synthetic specifier space
    expect(ns.code).toContain(`from '${engine.instanceKey}/https://a.host/dep.js'`);
  });

  it('executes every module script in document order and picks the lifecycle-bearing entry', async () => {
    const world = createWorld({
      'https://a.host/first.js': `export const first = true;`,
      'https://a.host/main.js': `export function bootstrap() {}\nexport function mount() {}\nexport function unmount() {}`,
    });
    const { engine } = world;

    engine.registerDocumentModule({ url: 'https://a.host/first.js', baseUrl: 'https://a.host/' });
    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/' });

    const ns = (await engine.importDocumentModules()) as { code: string };
    expect(ns.code).toContain('sourceURL=https://a.host/main.js');
    const executedSourceUrls = world.importerMock.mock.calls.map(([moduleUrl]) => {
      const code = world.codeByUrl.get(String(moduleUrl)) ?? '';
      return /sourceURL=([^\n]+)/.exec(code)?.[1];
    });
    expect(executedSourceUrls).toEqual(['https://a.host/first.js', 'https://a.host/main.js']);
  });

  it('starts loading external document modules as soon as they are registered', async () => {
    const importHook: ImportHook = vi.fn(async () => ({ source: `export const mount = true;` }));
    const world = createWorld({}, { engine: { importHook } });

    world.engine.registerDocumentModule({
      url: 'https://a.host/main.js',
      baseUrl: 'https://a.host/',
      isEntry: true,
    });
    await Promise.resolve();

    expect(importHook).toHaveBeenCalledWith('https://a.host/main.js');
    await expect(world.engine.importDocumentModules()).resolves.toBeDefined();
  });

  it('rejects document module registration after execution has been sealed', async () => {
    const world = createWorld({});

    await world.engine.importDocumentModules();

    expect(() => world.engine.registerDocumentModule({ code: 'export {};', baseUrl: 'https://a.host/' })).toThrowError(
      /registration .* is already sealed/,
    );
  });

  it('recovers from destructuring redeclaration collisions via probe and retry', async () => {
    const world = createWorld({
      'https://a.host/main.js': `const history = { push() {} };\nhistory.push();\nwindow.foo = 1;\nexport const mount = () => history;`,
    });
    const { engine } = world;

    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });

    const ns = (await engine.importDocumentModules()) as { code: string };
    // `history` was excluded after the redeclaration probe, `window` remains sandboxed
    expect(ns.code).toMatch(/const \{ window \} = __qk_view;/);
    expect(ns.code).not.toMatch(/const \{ [^}]*history[^}]*\} = __qk_view;/);
  });

  it('registers a shielded instance exposing view/resolve/dynamicImport', () => {
    const world = createWorld({});
    const instance = world.getInstance();

    expect(instance.view).toEqual({});
    expect(instance.resolve('./x.js', 'https://a.host/sub/')).toBe('https://a.host/sub/x.js');
  });

  it('resolves bare specifiers through the app own import map without injecting it into the document', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import { createApp } from 'vue';\nexport const mount = createApp;`,
      'https://cdn.host/vue.js': `export const createApp = () => {};`,
    });
    const { engine } = world;

    engine.registerImportMap(JSON.stringify({ imports: { vue: 'https://cdn.host/vue.js' } }), 'https://a.host/');
    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });

    const ns = (await engine.importDocumentModules()) as { code: string };
    expect(world.fetchMock.mock.calls.map((call) => String(call[0]))).toContain('https://cdn.host/vue.js');
    expect(ns.code).toContain(`from '${engine.instanceKey}/https://cdn.host/vue.js'`);
    // the bare specifier itself never reaches the document import map
    expect(readInjectedImports()['vue']).toBeUndefined();
  });

  it('rejects the entry when a bare specifier cannot be resolved', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import { x } from 'unresolvable-pkg';\nexport const mount = x;`,
    });
    const { engine } = world;

    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });

    await expect(engine.importDocumentModules()).rejects.toThrowError(/bare specifier 'unresolvable-pkg'/);
  });

  it('runs the dynamic import pipeline with import map entries flushed beforehand', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export const mount = 1;`,
      'https://a.host/lazy.js': `import './lazy-dep.js';\nexport const lazy = true;`,
      'https://a.host/lazy-dep.js': `export const dep = true;`,
    });
    const { engine } = world;

    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    await engine.importDocumentModules();

    const instance = world.getInstance();
    const ns = (await instance.dynamicImport('same-origin', './lazy.js', 'https://a.host/main.js')) as {
      code: string;
    };

    expect(ns.code).toContain('sourceURL=https://a.host/lazy.js');
    const imports = readInjectedImports();
    expect(imports[`${engine.instanceKey}/https://a.host/lazy.js`]).toBeDefined();
    expect(imports[`${engine.instanceKey}/https://a.host/lazy-dep.js`]).toBeDefined();
  });

  it('rejects synthetic specifiers in dynamic imports', async () => {
    const world = createWorld({});
    const instance = world.getInstance();

    await expect(
      instance.dynamicImport('same-origin', '__qk_other_1_1__/__runtime__', 'https://a.host/'),
    ).rejects.toThrowError(/synthetic specifier/);
  });

  it('executes inline module scripts through the pipeline', async () => {
    const world = createWorld({});
    const { engine } = world;

    engine.registerDocumentModule({
      code: `console.log(window);\nexport async function mount() {}`,
      baseUrl: 'https://a.host/',
    });
    const ns = (await engine.importDocumentModules()) as { code: string };
    expect(ns.code).toMatch(/const \{ (console, window|window, console) \} = __qk_view;/);
    expect(ns.code).toContain('sourceURL=https://a.host/');
  });

  it('substitutes /@vite/client with the HMR-disabled stub', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import { createHotContext } from '/@vite/client';\nexport const mount = createHotContext;`,
    });
    const { engine } = world;

    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });

    await engine.importDocumentModules();
    // the vite client is never fetched from the network, its stub feeds the pipeline directly
    expect(world.fetchMock.mock.calls.map((call) => String(call[0]))).not.toContain('https://a.host/@vite/client');
    const imports = readInjectedImports();
    expect(imports[`${engine.instanceKey}/https://a.host/@vite/client`]).toBeDefined();
  });

  it('resolves the entry namespace with undefined when no module script exists', async () => {
    const world = createWorld({});
    await expect(world.engine.importDocumentModules()).resolves.toBeUndefined();
  });

  it('generates unique instance keys even for the same app instance', () => {
    const world1 = createWorld({});
    const world2 = createWorld({});
    expect(world1.engine.instanceKey).not.toBe(world2.engine.instanceKey);
  });

  it('keeps synthetic prefixes collision-safe across independently evaluated engine copies', async () => {
    let moduleUrlSequence = 0;
    const createEngine = (Engine: typeof EsmSandboxEngine) =>
      new Engine({
        appName: 'copy-safe',
        instanceId: 7,
        entryUrl: 'https://copy-safe.test/',
        fetch: vi.fn() as unknown as typeof window.fetch,
        getGlobalsView: () => ({}),
        globalsBaseSet: [],
        moduleImporter: async () => ({}),
        createModuleUrl: () => `mock:copy-safe-${String(++moduleUrlSequence)}`,
        revokeModuleUrl: () => {},
      });

    vi.resetModules();
    const firstCopy = await import('../engine');
    const first = createEngine(firstCopy.EsmSandboxEngine);
    vi.resetModules();
    const secondCopy = await import('../engine');
    const second = createEngine(secondCopy.EsmSandboxEngine);

    expect(first.instanceKey).toMatch(/^__qk_copy-safe_7_[0-9a-f]{16}_[0-9a-f]{16}__$/);
    expect(second.instanceKey).toMatch(/^__qk_copy-safe_7_[0-9a-f]{16}_[0-9a-f]{16}__$/);
    expect(first.instanceKey).not.toBe(second.instanceKey);

    first.dispose();
    second.dispose();
  });

  it('revokes module urls and unregisters the instance on dispose', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export const mount = 1;`,
      'https://a.host/dep.js': `export const dep = 1;`,
    });
    const { engine } = world;

    engine.registerDocumentModule({ code: `import './dep.js';\nexport const mount = 1;`, baseUrl: 'https://a.host/' });
    await engine.importDocumentModules();

    const createdCount = world.codeByUrl.size;
    engine.dispose();
    const revokedCount = world.revoked.length;
    engine.dispose();
    await Promise.resolve();

    expect(instanceOf(engine.instanceHandle)).toBeUndefined();
    // every created blob (runtime + inline module + its dependency) is revoked, none leaked
    expect(world.revoked.length).toBeGreaterThanOrEqual(createdCount);
    expect(world.revoked).toHaveLength(revokedCount);
  });

  it('does not materialize or execute a document module whose import hook settles after dispose', async () => {
    let resolveDescriptor!: (descriptor: ModuleDescriptor) => void;
    const descriptorPromise = new Promise<ModuleDescriptor>((resolve) => {
      resolveDescriptor = resolve;
    });
    const importHook: ImportHook = vi.fn(() => descriptorPromise);
    const world = createWorld({}, { engine: { importHook } });

    world.engine.registerDocumentModule({
      url: 'https://a.host/main.js',
      baseUrl: 'https://a.host/',
      isEntry: true,
    });
    const entryPromise = world.engine.importDocumentModules();
    await vi.waitFor(() => expect(importHook).toHaveBeenCalledOnce());
    const createdBeforeDispose = world.codeByUrl.size;
    const rejection = expect(entryPromise).rejects.toThrowError('has been disposed');
    const descriptorValidation = vi.fn();
    const descriptor = new Proxy<ModuleDescriptor>(
      { source: `export const mount = true;` },
      {
        has(target, property) {
          descriptorValidation();
          return Reflect.has(target, property);
        },
      },
    );

    world.engine.dispose();
    resolveDescriptor(descriptor);

    await rejection;
    expect(descriptorValidation).not.toHaveBeenCalled();
    expect(world.importerMock).not.toHaveBeenCalled();
    expect(world.codeByUrl.size).toBe(createdBeforeDispose);
    expect(world.revoked).toHaveLength(createdBeforeDispose);
    expect(readInjectedImports()).toEqual({});
  });

  it('does not invoke a deferred custom import hook after immediate disposal', async () => {
    const importHook: ImportHook = vi.fn(async () => ({ source: `export const value = true;` }));
    const world = createWorld({}, { engine: { importHook } });

    const importPromise = world.engine.import('./main.js');
    world.engine.dispose();

    await expect(importPromise).rejects.toThrowError('has been disposed');
    expect(importHook).not.toHaveBeenCalled();
    expect(world.importerMock).not.toHaveBeenCalled();
  });

  it('does not rebuild a probe or create another module url when the probe rejects after dispose', async () => {
    let rejectProbe!: (reason: unknown) => void;
    const probePromise = new Promise<Record<string, unknown>>((_resolve, reject) => {
      rejectProbe = reject;
    });
    const world = createWorld({
      'https://a.host/main.js': `const history = {};\nwindow.history = history;\nexport { history };`,
    });
    world.importerMock.mockImplementation(() => probePromise);

    world.engine.registerDocumentModule({
      url: 'https://a.host/main.js',
      baseUrl: 'https://a.host/',
      isEntry: true,
    });
    const entryPromise = world.engine.importDocumentModules();
    await vi.waitFor(() => expect(world.importerMock).toHaveBeenCalledOnce());
    const createdBeforeDispose = world.codeByUrl.size;
    const rejection = expect(entryPromise).rejects.toThrowError('has been disposed');

    world.engine.dispose();
    const revokedAtDispose = world.revoked.length;
    rejectProbe(new SyntaxError("Identifier 'history' has already been declared"));

    await rejection;
    expect(world.codeByUrl.size).toBe(createdBeforeDispose);
    expect(world.revoked).toHaveLength(revokedAtDispose);
    expect(readInjectedImports()).toEqual({});
  });

  it('rejects a document entry when its module importer settles after dispose', async () => {
    let resolveImport!: (namespace: Record<string, unknown>) => void;
    const importPromise = new Promise<Record<string, unknown>>((resolve) => {
      resolveImport = resolve;
    });
    const world = createWorld({
      'https://a.host/main.js': `export const mount = true;`,
    });
    world.importerMock.mockImplementation(() => importPromise);

    world.engine.registerDocumentModule({
      url: 'https://a.host/main.js',
      baseUrl: 'https://a.host/',
      isEntry: true,
    });
    const entryPromise = world.engine.importDocumentModules();
    await vi.waitFor(() => expect(world.importerMock).toHaveBeenCalledOnce());
    const rejection = expect(entryPromise).rejects.toThrowError('has been disposed');

    world.engine.dispose();
    resolveImport({ mount: true });

    await rejection;
  });

  it.each(['public import', 'runtime dynamic import'] as const)(
    'rejects a %s when its module importer settles after dispose',
    async (operation) => {
      let resolveImport!: (namespace: Record<string, unknown>) => void;
      const importPromise = new Promise<Record<string, unknown>>((resolve) => {
        resolveImport = resolve;
      });
      const world = createWorld({
        'https://a.host/main.js': `export const value = true;`,
      });
      world.importerMock.mockImplementation(() => importPromise);
      const instance = world.getInstance();

      const pendingImport =
        operation === 'public import'
          ? world.engine.import('./main.js')
          : instance.dynamicImport('same-origin', './main.js', 'https://a.host/entry.js');
      await vi.waitFor(() => expect(world.importerMock).toHaveBeenCalledOnce());
      const rejection = expect(pendingImport).rejects.toThrowError('has been disposed');

      world.engine.dispose();
      resolveImport({ value: true });

      await rejection;
    },
  );

  it('uses a random accessor key and unguessable token (not the guessable instanceKey)', () => {
    const world = createWorld({});
    const { accessorKey, token } = world.engine.instanceHandle;
    // the accessor is not reachable under a fixed/guessable name, and the token is not the instanceKey
    expect(accessorKey).toMatch(/^__qk_i_[0-9a-f]+$/);
    expect(token).not.toBe(world.engine.instanceKey);
    expect((globalThis as Record<string, unknown>).__qk_instance).toBeUndefined();
  });

  it('picks the entry by lifecycle namespace when no entry attribute is marked', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export function bootstrap() {}\nexport function mount() {}\nexport function unmount() {}`,
      'https://a.host/analytics.js': `export const track = () => {};`,
    });
    const { engine } = world;

    // the lifecycle module is registered FIRST, a non-lifecycle module LAST, neither marked entry
    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/' });
    engine.registerDocumentModule({ url: 'https://a.host/analytics.js', baseUrl: 'https://a.host/' });

    const ns = (await engine.importDocumentModules()) as { code: string };
    // main.js (with lifecycles) is chosen over the trailing analytics module
    expect(ns.code).toContain('sourceURL=https://a.host/main.js');
  });

  it('resolves to a non-lifecycle namespace so loadApp can fall back to latestSetProp', async () => {
    const world = createWorld({
      'https://a.host/analytics.js': `export const track = () => {};`,
    });
    const { engine } = world;

    // a classic app that only incidentally includes a non-lifecycle module script: the engine returns
    // the module namespace (no lifecycles), and loadApp's getLifecyclesFromExports then falls back to
    // latestSetProp/window[appName] — crucially, the module executing does NOT reject the whole app
    engine.registerDocumentModule({ url: 'https://a.host/analytics.js', baseUrl: 'https://a.host/' });

    const ns = (await engine.importDocumentModules()) as { code: string };
    expect(ns.code).toContain('sourceURL=https://a.host/analytics.js');
  });

  it('does not reject the entry when a non-entry module fails and no entry is marked', async () => {
    const world = createWorld({
      'https://a.host/broken.js': `import 'unresolvable-pkg';\nexport const x = 1;`,
      'https://a.host/main.js': `export function bootstrap() {}\nexport function mount() {}\nexport function unmount() {}`,
    });
    const { engine } = world;
    vi.spyOn(console, 'error').mockImplementation(() => {});

    engine.registerDocumentModule({ url: 'https://a.host/broken.js', baseUrl: 'https://a.host/' });
    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/' });

    // the broken module is logged, not fatal; the lifecycle module still becomes the entry
    const ns = (await engine.importDocumentModules()) as { code: string };
    expect(ns.code).toContain('sourceURL=https://a.host/main.js');
  });

  it('passes typed static imports through to their original URL without fetching them as JS', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import data from './data.json' with { type: 'json' };\nexport const mount = () => data;`,
    });
    const { engine } = world;
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    engine.registerDocumentModule({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    await engine.importDocumentModules();

    // the json module is never fetched/rewritten; its synthetic specifier maps straight to the original URL
    expect(world.fetchMock.mock.calls.map((call) => String(call[0]))).not.toContain('https://a.host/data.json');
    const imports = readInjectedImports();
    expect(imports[`${engine.instanceKey}/https://a.host/data.json`]).toBe('https://a.host/data.json');
  });

  it('binds credentials to concurrently registered document graphs without sticky engine state', async () => {
    const world = createWorld({
      'https://a.host/include.js': `import './shared.js';\nexport const include = true;`,
      'https://a.host/default.js': `import './shared.js';\nexport const defaultMode = true;`,
      'https://a.host/anonymous.js': `import './shared.js';\nexport const anonymous = true;`,
      'https://a.host/shared.js': `export const shared = true;`,
    });
    const { engine } = world;

    // Register all three before any graph has completed. `same-origin` and an
    // absent value share the default context; include has its own graph/cache.
    engine.registerDocumentModule({
      url: 'https://a.host/include.js',
      baseUrl: 'https://a.host/',
      credentials: 'include',
    });
    engine.registerDocumentModule({ url: 'https://a.host/default.js', baseUrl: 'https://a.host/' });
    engine.registerDocumentModule({
      url: 'https://a.host/anonymous.js',
      baseUrl: 'https://a.host/',
      credentials: 'same-origin',
    });
    await engine.importDocumentModules();

    expect(world.fetchMock).toHaveBeenCalledWith('https://a.host/include.js', { credentials: 'include' });
    expect(world.fetchMock).toHaveBeenCalledWith('https://a.host/default.js', undefined);
    expect(world.fetchMock).toHaveBeenCalledWith('https://a.host/anonymous.js', undefined);

    const sharedCalls = world.fetchMock.mock.calls.filter(([input]) => String(input) === 'https://a.host/shared.js');
    expect(sharedCalls).toHaveLength(2);
    expect(sharedCalls.map(([, init]) => init?.credentials)).toEqual(expect.arrayContaining([undefined, 'include']));

    const sharedMappings = Object.keys(readInjectedImports()).filter((specifier) =>
      specifier.endsWith('/https://a.host/shared.js'),
    );
    expect(sharedMappings).toHaveLength(2);
  });

  it('keeps public imports on default credentials after an include document graph', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export const main = true;`,
    });

    world.engine.registerDocumentModule({
      url: 'https://a.host/main.js',
      baseUrl: 'https://a.host/',
      credentials: 'include',
    });
    await world.engine.importDocumentModules();
    await world.engine.import('./main.js');

    expect(world.fetchMock.mock.calls).toEqual([
      ['https://a.host/main.js', { credentials: 'include' }],
      ['https://a.host/main.js', undefined],
    ]);
  });

  it('keeps use-credentials on ordinary dynamic-import lazy graphs through the runtime bridge', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export const load = () => import('./lazy.js');`,
      'https://a.host/lazy.js': `import './lazy-dep.js';\nexport const lazy = true;`,
      'https://a.host/lazy-dep.js': `export const dependency = true;`,
    });

    world.engine.registerDocumentModule({
      url: 'https://a.host/main.js',
      baseUrl: 'https://a.host/',
      credentials: 'include',
      isEntry: true,
    });
    await world.engine.importDocumentModules();

    const imports = readInjectedImports();
    const runtimeSpecifier = Object.keys(imports).find(
      (specifier) => specifier.includes('credentials_include__') && specifier.endsWith('/__runtime__'),
    );
    expect(runtimeSpecifier).toBeDefined();
    const runtimeSource = world.codeByUrl.get(imports[runtimeSpecifier!]);
    expect(runtimeSource).toContain('instance.dynamicImport("include", specifier, ...args)');

    await world.getInstance().dynamicImport('include', './lazy.js', 'https://a.host/main.js');

    expect(world.fetchMock).toHaveBeenCalledWith('https://a.host/lazy.js', { credentials: 'include' });
    expect(world.fetchMock).toHaveBeenCalledWith('https://a.host/lazy-dep.js', { credentials: 'include' });
    expect(world.fetchMock).not.toHaveBeenCalledWith('https://a.host/lazy.js', undefined);
  });

  it('calls resolveHook before importHook with canonical referrers and memoizes descriptors', async () => {
    const events: string[] = [];
    const sources: Record<string, string> = {
      'https://a.host/main.js': `import './dep.js';\nexport const main = true;`,
      'https://a.host/dep.js': `export const dep = true;`,
    };
    const resolveHook: ResolveHook = vi.fn((specifier, referrer) => {
      events.push(`resolve:${specifier}:${referrer}`);
      return new URL(specifier, referrer).href;
    });
    const importHook: ImportHook = vi.fn(async (fullSpecifier) => {
      events.push(`import:${fullSpecifier}`);
      return { source: sources[fullSpecifier] };
    });
    const world = createWorld({}, { engine: { resolveHook, importHook } });

    await world.engine.load('./main.js');

    expect(world.importerMock).not.toHaveBeenCalled();
    expect(events.slice(0, 4)).toEqual([
      'resolve:./main.js:https://a.host/',
      'import:https://a.host/main.js',
      'resolve:./dep.js:https://a.host/main.js',
      'import:https://a.host/dep.js',
    ]);

    await world.engine.import('./main.js');
    await world.engine.import('./main.js');
    expect(importHook).toHaveBeenCalledTimes(2);
  });

  it('memoizes rejected importHook promises', async () => {
    const failure = new TypeError('hook failed');
    const importHook: ImportHook = vi.fn(() => Promise.reject(failure));
    const world = createWorld({}, { engine: { importHook } });

    await expect(world.engine.load('./missing.js')).rejects.toBe(failure);
    await expect(world.engine.load('./missing.js')).rejects.toBe(failure);
    expect(importHook).toHaveBeenCalledTimes(1);
  });

  it('uses modules descriptors before importHook and follows redirect chains', async () => {
    const importHook: ImportHook = vi.fn(() => Promise.reject(new Error('must not be called')));
    const world = createWorld(
      {},
      {
        engine: {
          importHook,
          modules: {
            'virtual:alias': { specifier: 'virtual:middle' },
            'virtual:middle': { specifier: 'virtual:target' },
            'virtual:target': { source: `export const target = true;` },
          },
        },
      },
    );

    const namespace = (await world.engine.import('virtual:alias')) as { code: string };

    expect(importHook).not.toHaveBeenCalled();
    expect(namespace.code).toContain('sourceURL=virtual:target');
    const imports = readInjectedImports();
    expect(imports[`${world.engine.instanceKey}/virtual:alias`]).toBeDefined();
    expect(imports[`${world.engine.instanceKey}/virtual:middle`]).toBe(
      imports[`${world.engine.instanceKey}/virtual:alias`],
    );
  });

  it('rejects modules redirect cycles with the complete chain', async () => {
    const world = createWorld(
      {},
      {
        engine: {
          modules: {
            a: { specifier: 'b' },
            b: { specifier: 'a' },
          },
        },
      },
    );

    await expect(world.engine.load('a')).rejects.toThrowError(/module redirect cycle: a -> b -> a/);
  });

  it('keeps every redirect alias pointed at the blob rebuilt by collision probing', async () => {
    const world = createWorld(
      {},
      {
        engine: {
          modules: {
            'virtual:alias': { specifier: 'virtual:target' },
            'virtual:target': {
              source: `const history = {};
window.history = history;
export { history };`,
            },
          },
        },
      },
    );

    await world.engine.load('virtual:alias');

    const imports = readInjectedImports();
    const aliasUrl = imports[`${world.engine.instanceKey}/virtual:alias`];
    const targetUrl = imports[`${world.engine.instanceKey}/virtual:target`];
    expect(aliasUrl).toBe(targetUrl);
    expect(world.codeByUrl.get(targetUrl)).not.toMatch(/const \{ [^}]*history[^}]*\} = __qk_view;/);
  });

  it('materializes host redirects as descriptors instead of changing resolveHook', async () => {
    const target = 'https://shared.host/main.js';
    const materializeRedirect = vi.fn((specifier: string) =>
      specifier === 'https://a.host/main.js' ? target : undefined,
    );
    const importHook: ImportHook = vi.fn(async (specifier) => {
      expect(specifier).toBe(target);
      return { source: `export const shared = true;` };
    });
    const world = createWorld({}, { engine: { importHook, materializeRedirect } });

    await world.engine.load('./main.js');

    expect(materializeRedirect).toHaveBeenCalledWith('https://a.host/main.js');
    expect(importHook).toHaveBeenCalledTimes(1);
    expect(importHook).toHaveBeenCalledWith(target);
  });

  it('uses loadHook as an importHook alias and rejects conflicting hooks', async () => {
    const loadHook: ImportHook = vi.fn(async () => ({ source: `export const loaded = true;` }));
    const world = createWorld({}, { engine: { loadHook } });

    await world.engine.load('./main.js');
    expect(loadHook).toHaveBeenCalledWith('https://a.host/main.js');

    const importHook: ImportHook = async () => ({ source: '' });
    expect(() => createWorld({}, { engine: { importHook, loadHook } })).toThrowError(
      /importHook and loadHook must reference the same hook/,
    );
  });

  it.each([
    [
      'multiple descriptor fields',
      { source: '', specifier: './target.js' },
      /must contain exactly one of source, namespace or specifier/,
    ],
    ['a malformed ModuleSource', { source: { code: '' } }, /must be a string or ModuleSource/],
    ['an empty redirect', { specifier: '' }, /must be a non-empty specifier/],
    ['a primitive namespace', { namespace: 1 }, /must be a module namespace object/],
  ])('rejects %s returned by importHook', async (_label, descriptor, expected) => {
    const importHook: ImportHook = async () => descriptor as unknown as ModuleDescriptor;
    const world = createWorld({}, { engine: { importHook } });

    await expect(world.engine.load('./main.js')).rejects.toThrowError(expected);
  });

  it('materializes one portable precompiled graph in multiple instances without mutating the descriptors', async () => {
    const entryUrl = 'https://a.host/precompiled.js';
    const depUrl = 'https://a.host/dep.js';
    const resolveHook: ResolveHook = (specifier, referrer) => new URL(specifier, referrer).href;
    const entrySource = `import { value } from './dep.js';\ndocument.title;\nexport const result = value + '-source-path';`;
    const entryArtifact = precompileModuleSource({
      source: entrySource,
      url: entryUrl,
      globalsBaseSet: ['document'],
      resolveHook,
    });
    // Test-only marker: consuming the linked `code` must preserve this change. A
    // rewrite from `source` inside the engine would restore "source-path".
    entryArtifact.code = entryArtifact.code.replace('source-path', 'linked-path');
    const depArtifact = precompileModuleSource({
      source: `export const value = 'dep';`,
      url: depUrl,
      globalsBaseSet: ['document'],
      resolveHook,
    });
    Object.freeze(entryArtifact.deps);
    Object.freeze(entryArtifact.typedDeps);
    Object.freeze(entryArtifact.destructured);
    Object.freeze(entryArtifact);
    Object.freeze(depArtifact);

    const artifacts = new Map([
      [entryUrl, entryArtifact],
      [depUrl, depArtifact],
    ]);
    const createHook = (): ImportHook =>
      vi.fn(async (specifier) => {
        const source = artifacts.get(specifier);
        if (!source) throw new TypeError(`missing artifact ${specifier}`);
        return { source };
      });
    const firstHook = createHook();
    const secondHook = createHook();
    const first = createWorld({}, { appName: 'first', engine: { importHook: firstHook } });
    const second = createWorld({}, { appName: 'second', engine: { importHook: secondHook } });

    const firstNamespace = (await first.engine.import('./precompiled.js')) as { code: string };
    const secondNamespace = (await second.engine.import('./precompiled.js')) as { code: string };

    expect(first.fetchMock).not.toHaveBeenCalled();
    expect(second.fetchMock).not.toHaveBeenCalled();
    expect(firstHook).toHaveBeenCalledTimes(2);
    expect(secondHook).toHaveBeenCalledTimes(2);
    expect(firstNamespace.code).toContain('linked-path');
    expect(secondNamespace.code).toContain('linked-path');
    expect(firstNamespace.code).toContain(first.engine.instanceKey);
    expect(secondNamespace.code).toContain(second.engine.instanceKey);
    expect(firstNamespace.code).not.toContain(moduleSourceInstanceKeyPlaceholder);
    expect(secondNamespace.code).not.toContain(moduleSourceInstanceKeyPlaceholder);
    expect(entryArtifact.instanceKey).toBe(moduleSourceInstanceKeyPlaceholder);
    expect(entryArtifact.code).toContain(moduleSourceInstanceKeyPlaceholder);
  });

  it('relocates only structured synthetic prefixes in portable ModuleSource code', async () => {
    const placeholder = moduleSourceInstanceKeyPlaceholder;
    const entryUrl = `https://a.host/apps/${placeholder}/entry.js`;
    const depUrl = `https://cdn.host/deps/${placeholder}/dep.js`;
    const userString = `${placeholder}/user-string`;
    const userComment = `${placeholder}/user-comment`;
    const resolveHook: ResolveHook = (specifier, referrer) =>
      specifier === 'collision-dep' ? depUrl : new URL(specifier, referrer).href;
    const entryArtifact = precompileModuleSource({
      source: [
        `import { value } from 'collision-dep';`,
        `const marker = ${JSON.stringify(userString)};`,
        `// ${userComment}`,
        `export const metaUrl = import.meta.url;`,
        `export const result = marker + value;`,
      ].join('\n'),
      url: entryUrl,
      globalsBaseSet: [],
      resolveHook,
    });
    const depArtifact = precompileModuleSource({
      source: `export const value = '-dep';`,
      url: depUrl,
      globalsBaseSet: [],
      resolveHook,
    });
    const originalLinkedCode = entryArtifact.code;
    const artifacts = new Map([
      [entryUrl, entryArtifact],
      [depUrl, depArtifact],
    ]);
    const importHook: ImportHook = vi.fn(async (specifier) => {
      const source = artifacts.get(specifier);
      if (!source) throw new TypeError(`missing artifact ${specifier}`);
      return { source };
    });
    const world = createWorld({}, { engine: { importHook } });

    const namespace = (await world.engine.import(entryUrl)) as { code: string };

    expect(namespace.code).toContain(`${world.engine.instanceKey}/${depUrl}`);
    expect(namespace.code).not.toContain(`${placeholder}/${depUrl}`);
    expect(namespace.code).toContain(JSON.stringify(userString));
    expect(namespace.code).toContain(`// ${userComment}`);
    expect(namespace.code).toContain(`const __qk_import_meta = { url: ${JSON.stringify(entryUrl)}`);
    expect(namespace.code).toContain(`//# sourceURL=${entryUrl}`);
    expect(entryArtifact.code).toBe(originalLinkedCode);
    expect(entryArtifact.deps).toEqual([depUrl]);
    expect(importHook).toHaveBeenCalledTimes(2);
    expect(world.fetchMock).not.toHaveBeenCalled();
  });

  it('rebuilds a precompiled ModuleSource collision without recalling importHook', async () => {
    const originalSource = `const history = {};
window.history = history;
export { history };`;
    const source = precompileModuleSource({
      source: originalSource,
      url: 'https://a.host/precompiled.js',
      globalsBaseSet: ['history', 'window'],
      resolveHook: (specifier, referrer) => new URL(specifier, referrer).href,
    });
    const importHook: ImportHook = vi.fn(async () => ({
      source,
    }));
    const world = createWorld({}, { engine: { importHook } });

    const namespace = (await world.engine.import('./precompiled.js')) as { code: string };

    expect(importHook).toHaveBeenCalledTimes(1);
    expect(namespace.code).toMatch(/const \{ window \} = __qk_view;/);
    expect(namespace.code).not.toMatch(/const \{ [^}]*history[^}]*\} = __qk_view;/);
  });

  it('returns namespace descriptors by identity and builds a bridge for static imports', async () => {
    const sharedValue = { stable: true };
    const sharedNamespace = { default: sharedValue, sharedValue };
    const world = createWorld(
      {},
      {
        engine: {
          importHook: async (specifier) => {
            expect(specifier).toBe('https://a.host/main.js');
            return { source: `import value, { sharedValue } from 'virtual:shared';\nexport { value, sharedValue };` };
          },
          modules: {
            'virtual:shared': { namespace: sharedNamespace },
          },
        },
      },
    );

    expect(await world.engine.import('virtual:shared')).toBe(sharedNamespace);
    await world.engine.load('./main.js');

    const imports = readInjectedImports();
    const bridgeUrl = imports[`${world.engine.instanceKey}/virtual:shared`];
    expect(bridgeUrl).toBeDefined();
    const bridgeCode = world.codeByUrl.get(bridgeUrl);
    expect(bridgeCode).toContain('__qk_get_namespace');
    expect(bridgeCode).toContain('export default __qk_namespace.default');
    expect(bridgeCode).toContain('export const sharedValue');
  });

  it('rebuilds probe collisions without recalling importHook', async () => {
    const importHook: ImportHook = vi.fn(async () => ({
      source: `const history = { push() {} };\nhistory.push();\nwindow.foo = 1;\nexport const mount = () => history;`,
    }));
    const world = createWorld({}, { engine: { importHook } });

    world.engine.registerDocumentModule({
      url: 'https://a.host/main.js',
      baseUrl: 'https://a.host/',
      isEntry: true,
    });
    const namespace = (await world.engine.importDocumentModules()) as { code: string };

    expect(importHook).toHaveBeenCalledTimes(1);
    expect(namespace.code).toMatch(/const \{ window \} = __qk_view;/);
    expect(namespace.code).not.toMatch(/const \{ [^}]*history[^}]*\} = __qk_view;/);
  });
});
