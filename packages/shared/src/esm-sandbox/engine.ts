/**
 * @author Kuitos
 * @since 2026-07-04
 * Per-instance ESM sandbox engine: module graph orchestration (parallel fetch + memoization),
 * redeclaration probing, in-order module script evaluation and the dynamic import pipeline.
 */
import { noop } from 'lodash';
import type { Fetch } from '../fetch-utils/utils';
import { QiankunError } from '../reporter/QiankunError';
import { Deferred, keys } from '../utils';
import { isLiveBindableDunderName } from './identifier-scan';
import { injectImportMapEntries } from './import-map-registry';
import { prepareEsmLexer } from './lexer';
import type { EsmRealm, RealmHandle } from './realm-registry';
import { registerEsmRealm, unregisterEsmRealm } from './realm-registry';
import { buildSyntheticSpecifier, esmInternalPrefix, rewriteModule, runtimeModuleSubpath } from './rewrite';
import { isViteClientUrl, viteClientStubSource } from './vite-client-stub';

export type EsmSandboxEngineOpts = {
  appName: string;
  instanceId: number;
  /** entry HTML url, the resolution base for inline modules and base-less dynamic imports */
  entryUrl: string;
  fetch: Fetch;
  /** membrane-backed globals view, resolved lazily as the document proxy is patched after sandbox creation */
  getGlobalsView: () => Record<string, unknown>;
  /** destructurable globals base set, normally esmDestructurableGlobals from @qiankunjs/sandbox */
  globalsBaseSet: readonly string[];
  /** source-level shared dependency canonicalization, v1 only reuses network responses (RFC §11) */
  moduleResolver?: (url: string) => { url: string } | undefined;
  /**
   * Subscribe to sandbox global modifications; the engine refreshes the live dunder-global bindings
   * (`__qk_track` callbacks) of already-evaluated modules on every notification. Returns unsubscribe.
   */
  subscribeGlobalSets?: (listener: (p: PropertyKey) => void) => () => void;
  /**
   * Predicate telling the engine which executed module namespace carries the app lifecycles, used to
   * pick the entry when no `<script type="module" entry>` is marked (e.g. Vite drops the attribute).
   * Without it the engine falls back to the last successfully executed module (RFC §7).
   */
  isLifecycleNamespace?: (ns: Record<string, unknown>) => boolean;
  /** injectable for tests, defaults to native dynamic import */
  moduleImporter?: (moduleUrl: string) => Promise<Record<string, unknown>>;
  /** injectable for tests, defaults to blob URL creation */
  createModuleUrl?: (code: string) => string;
  /** injectable for tests, defaults to URL.revokeObjectURL */
  revokeModuleUrl?: (moduleUrl: string) => void;
};

type ModuleRecord = {
  /** record key: canonical URL for external modules, a unique inline key for inline module scripts */
  url: string;
  source: string;
  code: string;
  /** import.meta.url / resolution base, differs from `url` only for inline modules */
  importMetaUrl: string;
  /** undefined for inline modules, they are executed directly and never referenced by other modules */
  syntheticSpecifier: string | undefined;
  moduleUrl: string;
  deps: string[];
  destructured: string[];
  probed: boolean;
};

type ModuleScriptTask = {
  url?: string;
  explicitEntry: boolean;
  recordPromise: Promise<ModuleRecord>;
};

// global monotonic sequence: retired instance keys must never be reused, otherwise new synthetic
// specifiers would silently hit stale first-wins import map entries (RFC §11)
let instanceSeq = 0;

const defaultModuleImporter = (moduleUrl: string): Promise<Record<string, unknown>> =>
  import(/* webpackIgnore: true */ /* @vite-ignore */ moduleUrl) as Promise<Record<string, unknown>>;

const defaultCreateModuleUrl = (code: string): string =>
  URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

const defaultRevokeModuleUrl = (moduleUrl: string): void => {
  URL.revokeObjectURL(moduleUrl);
};

const redeclarationPatterns = [
  // Chromium
  /Identifier '(.+?)' has already been declared/,
  // Firefox
  /redeclaration of (?:\S+ )?['"]?([A-Za-z_$][\w$]*)['"]?/,
  // WebKit
  /Cannot declare a lexical variable twice: '(.+?)'/,
];

const extractRedeclaredIdentifier = (error: unknown): string | undefined => {
  const message = error instanceof Error ? error.message : String(error);
  for (const pattern of redeclarationPatterns) {
    const matched = pattern.exec(message);
    if (matched) return matched[1];
  }
  return undefined;
};

// only top-level const/let/var/function/class declarations can redeclare an injected global; a module
// without any such keyword can never collide, so it needs no probe. This is a superset (never misses).
const declarationKeywordPattern = /\b(?:const|let|var|function|class)\b/;

const isUrlLikeSpecifier = (specifier: string): boolean =>
  specifier.startsWith('/') ||
  specifier.startsWith('./') ||
  specifier.startsWith('../') ||
  /^[a-z][a-z0-9+.-]*:/i.test(specifier);

// entry / base urls may come in protocol-relative or root-relative forms (e.g. //localhost:5173), which
// are not valid *bases* for new URL(); absolutize against the host document location. (Distinct from the
// shared resolveUrl, which deliberately PRESERVES protocol-relative forms for stable fetch cache keys —
// a preserved `//host` cannot be used as a base, hence a separate normalizer here.)
const normalizeBaseUrl = (url: string): string =>
  new URL(url, typeof location === 'undefined' ? undefined : location.href).href;

export class EsmSandboxEngine {
  readonly instanceKey: string;

  private readonly opts: EsmSandboxEngineOpts;

  private readonly globalsBaseSet: Set<string>;

  private readonly moduleImporter: (moduleUrl: string) => Promise<Record<string, unknown>>;

  private readonly createModuleUrl: (code: string) => string;

  private readonly revokeModuleUrl: (moduleUrl: string) => void;

  /** every blob URL this engine created (runtime, module records, rebuilt records, inline) for dispose */
  private readonly createdModuleUrls = new Set<string>();

  /** sub app own import map, parsed by qiankun itself and never injected into the host document (RFC §5) */
  private readonly appImportMap = new Map<string, string>();

  private readonly moduleRecords = new Map<string, Promise<ModuleRecord>>();

  /** inline module records are executed directly and never referenced, tracked only so dispose can revoke */
  private readonly inlineRecords: ModuleRecord[] = [];

  /** per-module destructuring exclusions accumulated by redeclaration probe retries */
  private readonly excludedNames = new Map<string, Set<string>>();

  /** synthetic specifier -> module URL entries waiting for the next flush into the document import map */
  private pendingImportMapEntries: Record<string, string> = {};

  private readonly moduleScriptTasks: ModuleScriptTask[] = [];

  private readonly entryDeferred = new Deferred<Record<string, unknown> | undefined>();

  private sealed = false;

  private disposed = false;

  /** per-module refresh callbacks for the live dunder-global bindings (registered via __qk_track) */
  private readonly liveBindingRefreshers = new Set<() => void>();

  private readonly unsubscribeGlobalSets: (() => void) | undefined;

  private inlineModuleSeq = 0;

  private warnedTypedModule = false;

  /** fetch credentials derived from the entry module script's crossorigin attribute (RFC §8) */
  private fetchCredentials: RequestInit['credentials'] | undefined;

  private readonly runtimeModuleUrl: string;

  private readonly entryBaseUrl: string;

  /** opaque random {accessorKey, token} the runtime module uses to reach this realm; not sub-app reachable */
  readonly realmHandle: RealmHandle;

  constructor(opts: EsmSandboxEngineOpts) {
    this.opts = opts;
    this.entryBaseUrl = normalizeBaseUrl(opts.entryUrl);
    this.instanceKey = `${esmInternalPrefix}${opts.appName.replace(/[^\w-]/g, '_')}_${opts.instanceId}_${++instanceSeq}__`;
    this.globalsBaseSet = new Set(opts.globalsBaseSet);
    this.moduleImporter = opts.moduleImporter ?? defaultModuleImporter;
    this.createModuleUrl = opts.createModuleUrl ?? defaultCreateModuleUrl;
    this.revokeModuleUrl = opts.revokeModuleUrl ?? defaultRevokeModuleUrl;

    const realm: EsmRealm = {
      get view() {
        return opts.getGlobalsView();
      },
      resolve: (specifier, baseUrl) => this.resolveSpecifier(specifier, baseUrl ?? this.entryBaseUrl),
      dynamicImport: (specifier, ...args) => this.dynamicImport(specifier, ...args),
      track: (refresh) => {
        if (!this.disposed) this.liveBindingRefreshers.add(refresh);
      },
    };
    // register first so the runtime module can inline the random accessor key and unguessable token (RFC §1)
    this.realmHandle = registerEsmRealm(realm);

    // Refresh the modules' live dunder bindings when the sandbox records a global modification.
    // Only dunder-named properties can back a live binding, so every other write (which can be
    // frequent — UMD vendor eval alone performs hundreds of global sets) is filtered out before
    // the O(modules) refresh fan-out. String(symbol) never matches the dunder pattern.
    this.unsubscribeGlobalSets = opts.subscribeGlobalSets?.((p) => {
      if (this.liveBindingRefreshers.size === 0 || !isLiveBindableDunderName(String(p))) return;
      this.liveBindingRefreshers.forEach((refresh) => refresh());
    });

    // the runtime module is generated outside the rewrite pipeline, its globalThis is the real global (RFC §1)
    const runtimeModuleSource = [
      `const rt = globalThis[${JSON.stringify(this.realmHandle.accessorKey)}](${JSON.stringify(
        this.realmHandle.token,
      )});`,
      'export const __qk_view = rt.view;',
      'export const __qk_resolve = rt.resolve;',
      'export const __qk_dynamic_import = rt.dynamicImport;',
      'export const __qk_track = rt.track;',
    ].join('\n');
    this.runtimeModuleUrl = this.track(this.createModuleUrl(runtimeModuleSource));
    this.pendingImportMapEntries[buildSyntheticSpecifier(this.instanceKey, runtimeModuleSubpath)] =
      this.runtimeModuleUrl;
  }

  get entryNamespacePromise(): Promise<Record<string, unknown> | undefined> {
    return this.entryDeferred.promise;
  }

  /** derive fetch credentials from the entry module script's crossorigin attribute (RFC §8) */
  setFetchCredentials(credentials: RequestInit['credentials'] | undefined): void {
    if (credentials !== undefined) {
      this.fetchCredentials = credentials;
    }
  }

  /**
   * Register the sub app own `<script type="importmap">` (RFC §5/§16). Only the imports field is
   * supported in v1, relative targets are resolved against the sub app base URL.
   */
  registerAppImportMap(mapText: string, baseUrl: string): void {
    try {
      const parsed = JSON.parse(mapText) as {
        imports?: Record<string, string>;
        scopes?: Record<string, Record<string, string>>;
      };
      if (parsed.scopes && keys(parsed.scopes).length > 0) {
        console.warn(`[qiankun] scopes of the import map of app ${this.opts.appName} are not supported yet, ignored`);
      }
      const imports = parsed.imports ?? {};
      keys(imports).forEach((specifier) => {
        this.appImportMap.set(specifier, new URL(imports[specifier], baseUrl).href);
      });
    } catch (e) {
      console.error(`[qiankun] failed to parse the import map of app ${this.opts.appName}`, e);
    }
  }

  /**
   * Register a `<script type="module">` of the entry HTML, called synchronously in document order.
   * The transpile pipeline starts immediately, while evaluation is deferred until sealAndExecute to
   * match the native semantics where module scripts run after HTML parsing, in document order.
   */
  loadModuleScript(script: { url?: string; code?: string; baseUrl: string; isEntry?: boolean }): void {
    const { url, code, isEntry } = script;
    const baseUrl = normalizeBaseUrl(script.baseUrl);

    const recordPromise = (async (): Promise<ModuleRecord> => {
      let record: ModuleRecord;
      if (url) {
        record = await this.ensureModuleRecord(this.canonicalize(new URL(url, baseUrl).href));
      } else {
        await prepareEsmLexer();
        this.assertAlive();
        // inline modules get a unique record key but keep the HTML URL as import.meta.url,
        // consistent with native inline module scripts
        const inlineKey = `${baseUrl}#qiankun-inline-module-${this.inlineModuleSeq++}`;
        record = this.buildModuleRecord(inlineKey, code ?? '', undefined, baseUrl);
        this.inlineRecords.push(record);
      }
      const graph = await this.collectGraph(record);
      await this.probeRecords(graph.values());
      return record;
    })();
    // settlement is consumed by the execution queue
    recordPromise.catch(noop);

    this.moduleScriptTasks.push({ url, explicitEntry: !!isEntry, recordPromise });
  }

  /**
   * Called by the loader when the entry HTML stream completes. Starts the in-order evaluation of all
   * registered module scripts and returns whether an ESM entry exists (false lets the loader fall
   * back to the classic latestSetProp path).
   */
  sealAndExecute(): boolean {
    if (!this.sealed) {
      this.sealed = true;
      if (this.moduleScriptTasks.length > 0) {
        void this.executeModuleScripts();
      } else {
        this.entryDeferred.resolve(undefined);
      }
    }
    return this.moduleScriptTasks.length > 0;
  }

  /**
   * Release the instance resources: revoke every blob URL created by this engine and unregister its
   * realm so a retired instance is no longer reachable. Import map entries are irrevocable
   * (document-level) and just retire with the instance key (RFC §11). Wired to the single-spa unload
   * lifecycle in loadApp; remount (which reuses the same engine) never unloads, so it is unaffected.
   */
  dispose(): void {
    this.disposed = true;
    this.unsubscribeGlobalSets?.();
    this.liveBindingRefreshers.clear();
    unregisterEsmRealm(this.realmHandle.token);
    this.createdModuleUrls.forEach((moduleUrl) => this.revokeModuleUrl(moduleUrl));
    this.createdModuleUrls.clear();
    this.moduleRecords.clear();
    this.inlineRecords.length = 0;
  }

  private track(moduleUrl: string): string {
    this.createdModuleUrls.add(moduleUrl);
    return moduleUrl;
  }

  private assertAlive(): void {
    if (this.disposed) {
      throw new QiankunError(`ESM sandbox engine of app ${this.opts.appName} has been disposed`);
    }
  }

  private readonly resolveSpecifier = (specifier: string, baseUrl: string): string => {
    if (specifier.startsWith(esmInternalPrefix)) {
      throw new QiankunError(
        `synthetic specifier ${specifier} is not allowed in application code of ${this.opts.appName}`,
      );
    }

    const mapped = this.matchAppImportMap(specifier);
    if (mapped) {
      return this.canonicalize(mapped);
    }

    if (isUrlLikeSpecifier(specifier)) {
      return this.canonicalize(new URL(specifier, baseUrl).href);
    }

    throw new QiankunError(
      `failed to resolve the bare specifier '${specifier}' imported from ${baseUrl}: no import map entry found in app ${this.opts.appName}`,
    );
  };

  /** standard import map imports matching: exact key, or the longest trailing-slash prefix */
  private matchAppImportMap(specifier: string): string | undefined {
    const exact = this.appImportMap.get(specifier);
    if (exact) return exact;

    let bestKey: string | undefined;
    this.appImportMap.forEach((_, key) => {
      if (key.endsWith('/') && specifier.startsWith(key) && (!bestKey || key.length > bestKey.length)) {
        bestKey = key;
      }
    });

    return bestKey ? this.appImportMap.get(bestKey)! + specifier.slice(bestKey.length) : undefined;
  }

  private canonicalize(url: string): string {
    const matched = this.opts.moduleResolver?.(url);
    return matched?.url ?? url;
  }

  private ensureModuleRecord(url: string): Promise<ModuleRecord> {
    let pending = this.moduleRecords.get(url);
    if (!pending) {
      pending = this.createModuleRecord(url);
      this.moduleRecords.set(url, pending);
      // suppress unhandled rejection noise, consumers surface errors through the graph await
      pending.catch(noop);
    }
    return pending;
  }

  private async createModuleRecord(url: string): Promise<ModuleRecord> {
    await prepareEsmLexer();
    this.assertAlive();
    const source = await this.fetchModuleSource(url);
    this.assertAlive();
    return this.buildModuleRecord(url, source, buildSyntheticSpecifier(this.instanceKey, url), url);
  }

  private buildModuleRecord(
    url: string,
    source: string,
    syntheticSpecifier: string | undefined,
    importMetaUrl: string,
  ): ModuleRecord {
    const { code, deps, typedDeps, destructured } = rewriteModule({
      source,
      url: importMetaUrl,
      instanceKey: this.instanceKey,
      globalsBaseSet: this.globalsBaseSet,
      excludedNames: this.excludedNames.get(url),
      resolveSpecifier: this.resolveSpecifier,
    });

    const moduleUrl = this.track(this.createModuleUrl(code));
    const record: ModuleRecord = {
      url,
      source,
      code,
      importMetaUrl,
      syntheticSpecifier,
      moduleUrl,
      deps,
      destructured,
      probed: false,
    };

    if (syntheticSpecifier) {
      this.pendingImportMapEntries[syntheticSpecifier] = moduleUrl;
    }

    // typed imports (JSON/CSS/WASM modules, RFC §14): passthrough — map the synthetic specifier to the
    // original URL so the browser loads it natively with the preserved `with { type }` clause, instead
    // of pushing it through the JS pipeline (which would hard-crash). Trades instance isolation for
    // correctness and is warned about.
    typedDeps.forEach((typedUrl) => {
      this.pendingImportMapEntries[buildSyntheticSpecifier(this.instanceKey, typedUrl)] = typedUrl;
      if (!this.warnedTypedModule) {
        this.warnedTypedModule = true;
        console.warn(
          `[qiankun] typed module imports (JSON/CSS/WASM, e.g. ${typedUrl}) in app ${this.opts.appName} are loaded natively from their original URL without instance isolation (RFC §14)`,
        );
      }
    });

    // kick off the children eagerly so the whole graph fetches in parallel
    deps.forEach((dep) => void this.ensureModuleRecord(dep));

    return record;
  }

  private fetchModuleSource(url: string): Promise<string> {
    if (isViteClientUrl(url)) {
      return Promise.resolve(viteClientStubSource);
    }
    // the cacheable fetch (makeFetchCacheable) already dedupes by URL, so no local source cache is needed
    return this.opts
      .fetch(url, this.fetchCredentials ? { credentials: this.fetchCredentials } : undefined)
      .then((res) => res.text());
  }

  private async collectGraph(
    record: ModuleRecord,
    acc = new Map<string, ModuleRecord>(),
  ): Promise<Map<string, ModuleRecord>> {
    if (acc.has(record.url)) return acc;
    acc.set(record.url, record);
    await Promise.all(
      record.deps.map(async (dep) => {
        if (acc.has(dep)) return;
        await this.collectGraph(await this.ensureModuleRecord(dep), acc);
      }),
    );
    return acc;
  }

  /**
   * Redeclaration probing (RFC §1 collision handling): importing a module blob whose runtime-module
   * specifier is swapped to a never-registered probe specifier surfaces parse errors (like duplicate
   * lexical declarations with the injected destructuring) without ever evaluating the module, since
   * module resolution is guaranteed to fail after a successful parse. This MUST catch every possible
   * collision before the import map is flushed (first-wins entries cannot be rewritten afterwards).
   */
  private async probeRecords(records: Iterable<ModuleRecord>): Promise<void> {
    const candidates = Array.from(records).filter((record) => !record.probed && this.mayCollide(record));
    await Promise.all(candidates.map((record) => this.probeRecord(record)));
  }

  private mayCollide(record: ModuleRecord): boolean {
    // A collision needs a non-empty destructuring set AND a top-level declaration keyword. Both are
    // necessary conditions, so skipping when either is absent never misses a real collision (any
    // module with declaration keywords is probed regardless of where the keyword sits — no positional
    // window that could let a far-away redeclaration slip through).
    if (record.destructured.length === 0) return false;
    return declarationKeywordPattern.test(record.source);
  }

  private async probeRecord(record: ModuleRecord): Promise<void> {
    const runtimeSpecifier = buildSyntheticSpecifier(this.instanceKey, runtimeModuleSubpath);
    const probeSpecifier = buildSyntheticSpecifier(this.instanceKey, '__probe__');

    record.probed = true;
    for (;;) {
      // the destructuring set is non-empty here, so the header (and the runtime import) must exist
      const probeCode = record.code.replace(runtimeSpecifier, probeSpecifier);
      const probeUrl = this.track(this.createModuleUrl(probeCode));
      try {
        await this.moduleImporter(probeUrl);
        return;
      } catch (e) {
        const collided = extractRedeclaredIdentifier(e);
        if (!collided || !record.destructured.includes(collided)) {
          // resolution failures and other parse errors are expected, the probe only hunts redeclarations
          return;
        }
        const excluded = this.excludedNames.get(record.url) ?? new Set<string>();
        excluded.add(collided);
        this.excludedNames.set(record.url, excluded);
        this.rebuildModuleRecord(record);
      } finally {
        this.createdModuleUrls.delete(probeUrl);
        this.revokeModuleUrl(probeUrl);
      }
    }
  }

  /** rebuild in place so every holder of the record (script tasks, graph collections) sees the new blob */
  private rebuildModuleRecord(record: ModuleRecord): void {
    this.createdModuleUrls.delete(record.moduleUrl);
    this.revokeModuleUrl(record.moduleUrl);
    const { code, destructured } = rewriteModule({
      source: record.source,
      url: record.importMetaUrl,
      instanceKey: this.instanceKey,
      globalsBaseSet: this.globalsBaseSet,
      excludedNames: this.excludedNames.get(record.url),
      resolveSpecifier: this.resolveSpecifier,
    });
    record.code = code;
    record.destructured = destructured;
    record.moduleUrl = this.track(this.createModuleUrl(code));
    if (record.syntheticSpecifier) {
      this.pendingImportMapEntries[record.syntheticSpecifier] = record.moduleUrl;
    }
  }

  private flushImportMapEntries(): void {
    const entries = this.pendingImportMapEntries;
    if (keys(entries).length > 0) {
      this.pendingImportMapEntries = {};
      injectImportMapEntries(entries);
    }
  }

  private async executeModuleScripts(): Promise<void> {
    const tasks = [...this.moduleScriptTasks];
    const explicitEntry = tasks.find((task) => task.explicitEntry);
    const executed: Array<Record<string, unknown>> = [];

    for (const task of tasks) {
      try {
        const record = await task.recordPromise;
        this.flushImportMapEntries();
        const namespace = await this.moduleImporter(record.moduleUrl);
        executed.push(namespace);
        if (task === explicitEntry && !this.entryDeferred.isSettled()) {
          this.entryDeferred.resolve(namespace);
        }
      } catch (e) {
        // an explicit entry failure must be plumbed back to the loader (RFC §7); other module failures
        // do not stop the rest and must not fail the whole app (a classic app may only incidentally
        // include a module script — its real lifecycles come from latestSetProp)
        if (task === explicitEntry && !this.entryDeferred.isSettled()) {
          this.entryDeferred.reject(e);
        } else {
          console.error(
            `[qiankun] ESM module script ${task.url ?? '(inline)'} of app ${this.opts.appName} failed to execute`,
            e,
          );
        }
      }
    }

    // no explicit entry: prefer the module whose namespace carries the lifecycles (Vite drops the entry
    // attribute, and a classic app's incidental module script must not hijack a lifecycle-bearing one);
    // otherwise fall back to the last executed module. Either way loadApp re-validates and falls back to
    // latestSetProp/window[appName] when the picked namespace has no lifecycles (RFC §7).
    if (!explicitEntry && !this.entryDeferred.isSettled()) {
      const { isLifecycleNamespace } = this.opts;
      const picked =
        (isLifecycleNamespace && executed.find((ns) => isLifecycleNamespace(ns))) ?? executed[executed.length - 1];
      this.entryDeferred.resolve(picked);
    }
  }

  private readonly dynamicImport = async (specifier: unknown, ...args: unknown[]): Promise<Record<string, unknown>> => {
    this.assertAlive();
    const spec = String(specifier);
    if (spec.startsWith(esmInternalPrefix)) {
      throw new QiankunError(`synthetic specifier ${spec} is not allowed in dynamic import of ${this.opts.appName}`);
    }

    // the rewrite appends the importer module URL as the last argument (untyped dynamic imports only;
    // typed dynamic imports are left native and never reach here, RFC §14)
    const baseUrl = typeof args[args.length - 1] === 'string' ? (args[args.length - 1] as string) : this.entryBaseUrl;

    const url = this.resolveSpecifier(spec, baseUrl);
    const record = await this.ensureModuleRecord(url);
    const graph = await this.collectGraph(record);
    await this.probeRecords(graph.values());
    // new entries must be visible before the import resolves the synthetic specifiers (RFC §4/§11)
    this.flushImportMapEntries();
    return this.moduleImporter(record.moduleUrl);
  };
}
