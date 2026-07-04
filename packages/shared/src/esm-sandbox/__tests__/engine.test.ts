import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EsmSandboxEngine } from '../engine';
import { injectImportMapEntries, resetImportMapRegistry } from '../import-map-registry';
import type { EsmRealm, RealmHandle } from '../realm-registry';

type MockWorld = {
  engine: EsmSandboxEngine;
  fetchMock: ReturnType<typeof vi.fn>;
  importerMock: ReturnType<typeof vi.fn>;
  codeByUrl: Map<string, string>;
  revoked: string[];
  getRealm: () => EsmRealm;
};

// reach an engine's realm through the same random-key/token bridge the runtime module blob uses,
// which is exactly how a real browser resolves it (accessor key and token are both unguessable)
const realmOf = (handle: RealmHandle): EsmRealm | undefined =>
  (globalThis as unknown as Record<string, (token: string) => EsmRealm | undefined>)[handle.accessorKey]?.(
    handle.token,
  );

/**
 * The mock importer simulates the browser module pipeline order: parse errors (duplicate lexical
 * declarations between the injected destructuring and module-own declarations) surface before
 * resolution errors, and probe specifiers never resolve.
 */
const createWorld = (modules: Record<string, string>, opts: { appName?: string } = {}): MockWorld => {
  const codeByUrl = new Map<string, string>();
  const revoked: string[] = [];
  let seq = 0;

  const fetchMock = vi.fn((input: RequestInfo | URL): Promise<Response> => {
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
    getRealm: () => realmOf(engine.realmHandle)!,
  };
};

const readInjectedImports = (): Record<string, string> =>
  Array.from(document.head.querySelectorAll('script[type="importmap"][data-qiankun="esm"]')).reduce(
    (acc, script) => ({ ...acc, ...(JSON.parse(script.textContent!) as { imports: Record<string, string> }).imports }),
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

    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    expect(engine.sealAndExecute()).toBe(true);

    const ns = (await engine.entryNamespacePromise) as { code: string };

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

    engine.loadModuleScript({ url: 'https://a.host/first.js', baseUrl: 'https://a.host/' });
    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/' });
    engine.sealAndExecute();

    const ns = (await engine.entryNamespacePromise) as { code: string };
    expect(ns.code).toContain('sourceURL=https://a.host/main.js');
    // both module scripts executed, in document order
    expect(world.importerMock.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('recovers from destructuring redeclaration collisions via probe and retry', async () => {
    const world = createWorld({
      'https://a.host/main.js': `const history = { push() {} };\nhistory.push();\nwindow.foo = 1;\nexport const mount = () => history;`,
    });
    const { engine } = world;

    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    engine.sealAndExecute();

    const ns = (await engine.entryNamespacePromise) as { code: string };
    // `history` was excluded after the redeclaration probe, `window` remains sandboxed
    expect(ns.code).toMatch(/const \{ window \} = __qk_view;/);
    expect(ns.code).not.toMatch(/const \{ [^}]*history[^}]*\} = __qk_view;/);
  });

  it('registers a shielded realm exposing view/resolve/dynamicImport', () => {
    const world = createWorld({});
    const realm = world.getRealm();

    expect(realm.view).toEqual({});
    expect(realm.resolve('./x.js', 'https://a.host/sub/')).toBe('https://a.host/sub/x.js');
  });

  it('resolves bare specifiers through the app own import map without injecting it into the document', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import { createApp } from 'vue';\nexport const mount = createApp;`,
      'https://cdn.host/vue.js': `export const createApp = () => {};`,
    });
    const { engine } = world;

    engine.registerAppImportMap(JSON.stringify({ imports: { vue: 'https://cdn.host/vue.js' } }), 'https://a.host/');
    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    engine.sealAndExecute();

    const ns = (await engine.entryNamespacePromise) as { code: string };
    expect(world.fetchMock.mock.calls.map((call) => call[0])).toContain('https://cdn.host/vue.js');
    expect(ns.code).toContain(`from '${engine.instanceKey}/https://cdn.host/vue.js'`);
    // the bare specifier itself never reaches the document import map
    expect(readInjectedImports()['vue']).toBeUndefined();
  });

  it('rejects the entry when a bare specifier cannot be resolved', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import { x } from 'unresolvable-pkg';\nexport const mount = x;`,
    });
    const { engine } = world;

    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    engine.sealAndExecute();

    await expect(engine.entryNamespacePromise).rejects.toThrowError(/bare specifier 'unresolvable-pkg'/);
  });

  it('runs the dynamic import pipeline with import map entries flushed beforehand', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export const mount = 1;`,
      'https://a.host/lazy.js': `import './lazy-dep.js';\nexport const lazy = true;`,
      'https://a.host/lazy-dep.js': `export const dep = true;`,
    });
    const { engine } = world;

    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    engine.sealAndExecute();
    await engine.entryNamespacePromise;

    const realm = world.getRealm();
    const ns = (await realm.dynamicImport('./lazy.js', 'https://a.host/main.js')) as { code: string };

    expect(ns.code).toContain('sourceURL=https://a.host/lazy.js');
    const imports = readInjectedImports();
    expect(imports[`${engine.instanceKey}/https://a.host/lazy.js`]).toBeDefined();
    expect(imports[`${engine.instanceKey}/https://a.host/lazy-dep.js`]).toBeDefined();
  });

  it('rejects synthetic specifiers in dynamic imports', async () => {
    const world = createWorld({});
    const realm = world.getRealm();

    await expect(realm.dynamicImport('__qk_other_1_1__/__runtime__', 'https://a.host/')).rejects.toThrowError(
      /synthetic specifier/,
    );
  });

  it('executes inline module scripts through the pipeline', async () => {
    const world = createWorld({});
    const { engine } = world;

    engine.loadModuleScript({
      code: `console.log(window);\nexport async function mount() {}`,
      baseUrl: 'https://a.host/',
    });
    engine.sealAndExecute();

    const ns = (await engine.entryNamespacePromise) as { code: string };
    expect(ns.code).toMatch(/const \{ (console, window|window, console) \} = __qk_view;/);
    expect(ns.code).toContain('sourceURL=https://a.host/');
  });

  it('substitutes /@vite/client with the HMR-disabled stub', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import { createHotContext } from '/@vite/client';\nexport const mount = createHotContext;`,
    });
    const { engine } = world;

    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    engine.sealAndExecute();

    await engine.entryNamespacePromise;
    // the vite client is never fetched from the network, its stub feeds the pipeline directly
    expect(world.fetchMock.mock.calls.map((call) => call[0])).not.toContain('https://a.host/@vite/client');
    const imports = readInjectedImports();
    expect(imports[`${engine.instanceKey}/https://a.host/@vite/client`]).toBeDefined();
  });

  it('resolves the entry namespace with undefined when no module script exists', async () => {
    const world = createWorld({});
    expect(world.engine.sealAndExecute()).toBe(false);
    await expect(world.engine.entryNamespacePromise).resolves.toBeUndefined();
  });

  it('generates unique instance keys even for the same app instance', () => {
    const world1 = createWorld({});
    const world2 = createWorld({});
    expect(world1.engine.instanceKey).not.toBe(world2.engine.instanceKey);
  });

  it('revokes module urls and unregisters the realm on dispose', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export const mount = 1;`,
      'https://a.host/dep.js': `export const dep = 1;`,
    });
    const { engine } = world;

    engine.loadModuleScript({ code: `import './dep.js';\nexport const mount = 1;`, baseUrl: 'https://a.host/' });
    engine.sealAndExecute();
    await engine.entryNamespacePromise;

    const createdCount = world.codeByUrl.size;
    engine.dispose();
    await Promise.resolve();

    expect(realmOf(engine.realmHandle)).toBeUndefined();
    // every created blob (runtime + inline module + its dependency) is revoked, none leaked
    expect(world.revoked.length).toBeGreaterThanOrEqual(createdCount);
  });

  it('uses a random accessor key and unguessable token (not the guessable instanceKey)', () => {
    const world = createWorld({});
    const { accessorKey, token } = world.engine.realmHandle;
    // the accessor is not reachable under a fixed/guessable name, and the token is not the instanceKey
    expect(accessorKey).toMatch(/^__qk_r_[0-9a-f]+$/);
    expect(token).not.toBe(world.engine.instanceKey);
    expect((globalThis as Record<string, unknown>).__qk_realm).toBeUndefined();
  });

  it('picks the entry by lifecycle namespace when no entry attribute is marked', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export function bootstrap() {}\nexport function mount() {}\nexport function unmount() {}`,
      'https://a.host/analytics.js': `export const track = () => {};`,
    });
    const { engine } = world;

    // the lifecycle module is registered FIRST, a non-lifecycle module LAST, neither marked entry
    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/' });
    engine.loadModuleScript({ url: 'https://a.host/analytics.js', baseUrl: 'https://a.host/' });
    engine.sealAndExecute();

    const ns = (await engine.entryNamespacePromise) as { code: string };
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
    engine.loadModuleScript({ url: 'https://a.host/analytics.js', baseUrl: 'https://a.host/' });
    engine.sealAndExecute();

    const ns = (await engine.entryNamespacePromise) as { code: string };
    expect(ns.code).toContain('sourceURL=https://a.host/analytics.js');
  });

  it('does not reject the entry when a non-entry module fails and no entry is marked', async () => {
    const world = createWorld({
      'https://a.host/broken.js': `import 'unresolvable-pkg';\nexport const x = 1;`,
      'https://a.host/main.js': `export function bootstrap() {}\nexport function mount() {}\nexport function unmount() {}`,
    });
    const { engine } = world;
    vi.spyOn(console, 'error').mockImplementation(() => {});

    engine.loadModuleScript({ url: 'https://a.host/broken.js', baseUrl: 'https://a.host/' });
    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/' });
    engine.sealAndExecute();

    // the broken module is logged, not fatal; the lifecycle module still becomes the entry
    const ns = (await engine.entryNamespacePromise) as { code: string };
    expect(ns.code).toContain('sourceURL=https://a.host/main.js');
  });

  it('passes typed static imports through to their original URL without fetching them as JS', async () => {
    const world = createWorld({
      'https://a.host/main.js': `import data from './data.json' with { type: 'json' };\nexport const mount = () => data;`,
    });
    const { engine } = world;
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    engine.sealAndExecute();
    await engine.entryNamespacePromise;

    // the json module is never fetched/rewritten; its synthetic specifier maps straight to the original URL
    expect(world.fetchMock.mock.calls.map((call) => call[0])).not.toContain('https://a.host/data.json');
    const imports = readInjectedImports();
    expect(imports[`${engine.instanceKey}/https://a.host/data.json`]).toBe('https://a.host/data.json');
  });

  it('forwards fetch credentials derived from the entry crossorigin', async () => {
    const world = createWorld({
      'https://a.host/main.js': `export const mount = 1;`,
    });
    const { engine } = world;

    engine.setFetchCredentials('include');
    engine.loadModuleScript({ url: 'https://a.host/main.js', baseUrl: 'https://a.host/', isEntry: true });
    engine.sealAndExecute();
    await engine.entryNamespacePromise;

    expect(world.fetchMock).toHaveBeenCalledWith('https://a.host/main.js', { credentials: 'include' });
  });
});
