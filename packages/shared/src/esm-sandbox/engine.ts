/**
 * Per-instance ESM mechanism behind the Compartment module facade.
 */
import { noop } from 'lodash';
import type { Fetch } from '../fetch-utils/utils';
import { QiankunError } from '../reporter/QiankunError';
import { Deferred, keys } from '../utils';
import { isLiveBindableDunderName } from './identifier-scan';
import { injectImportMapEntries } from './import-map-registry';
import {
  createRandomHex,
  type EsmInstance,
  type InstanceHandle,
  registerEsmInstance,
  unregisterEsmInstance,
} from './instance-registry';
import { prepareEsmLexer } from './lexer';
import { relocateModuleSourceInstanceKey } from './precompile';
import { buildSyntheticSpecifier, esmInternalPrefix, rewriteModule, runtimeModuleSubpath } from './rewrite';
import type {
  CompartmentModuleFacade,
  DocumentModule,
  ImportHook,
  ModuleDescriptor,
  ModuleNamespace,
  Modules,
  ModuleSource,
  ResolveHook,
} from './types';
import { isViteClientUrl, viteClientStubSource } from './vite-client-stub';

export type EsmSandboxEngineOpts = {
  appName: string;
  instanceId: number;
  /** Entry HTML URL: root resolution base for import/load and base-less dynamic imports. */
  entryUrl: string;
  fetch: Fetch;
  getGlobalsView: () => Record<string, unknown>;
  globalsBaseSet: readonly string[];
  modules?: Modules;
  resolveHook?: ResolveHook;
  importHook?: ImportHook;
  /** Layer-4 terminology alias for importHook. */
  loadHook?: ImportHook;
  /**
   * Host adapter for the legacy dependencymap resolver. A match is materialized
   * as a redirect descriptor rather than changing resolveHook semantics.
   */
  materializeRedirect?: (fullSpecifier: string) => string | undefined;
  subscribeGlobalSets?: (listener: (p: PropertyKey) => void) => () => void;
  isLifecycleNamespace?: (ns: ModuleNamespace) => boolean;
  moduleImporter?: (moduleUrl: string) => Promise<ModuleNamespace>;
  createModuleUrl?: (code: string) => string;
  revokeModuleUrl?: (moduleUrl: string) => void;
};

type Module = {
  /** Cache identity: canonical descriptor key partitioned by credential context. */
  cacheKey: string;
  /** Canonical descriptor key (an inline module uses its unique inline key). */
  url: string;
  loadContext: ModuleLoadContext;
  source: ModuleSource;
  /** Every alias that must be updated when probe rebuilding replaces the blob. */
  syntheticSpecifiers: Set<string>;
  moduleUrl: string;
  probed: boolean;
  namespace?: ModuleNamespace;
};

type ModuleScriptTask = {
  url?: string;
  explicitEntry: boolean;
  modulePromise: Promise<Module>;
};

type ModuleCredentialsKey = NonNullable<RequestInit['credentials']>;

type ModuleLoadContext = Readonly<{
  credentialsKey: ModuleCredentialsKey;
  credentials?: RequestInit['credentials'];
  /** Synthetic import-map namespace for this credential context. */
  instanceKey: string;
}>;

/**
 * A module-local nonce distinguishes independently bundled qiankun copies; the
 * per-engine nonce below prevents collisions within one copy without relying on
 * a resettable counter.
 */
const syntheticKeyCopyNonce = createRandomHex(8);

const defaultModuleImporter = (moduleUrl: string): Promise<ModuleNamespace> =>
  import(/* webpackIgnore: true */ /* @vite-ignore */ moduleUrl) as Promise<ModuleNamespace>;

const defaultCreateModuleUrl = (code: string): string =>
  URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

const defaultRevokeModuleUrl = (moduleUrl: string): void => {
  URL.revokeObjectURL(moduleUrl);
};

const redeclarationPatterns = [
  /Identifier '(.+?)' has already been declared/,
  /redeclaration of (?:\S+ )?['"]?([A-Za-z_$][\w$]*)['"]?/,
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

const declarationKeywordPattern = /\b(?:const|let|var|function|class)\b/;

const isUrlLikeSpecifier = (specifier: string): boolean =>
  specifier.startsWith('/') ||
  specifier.startsWith('./') ||
  specifier.startsWith('../') ||
  /^[a-z][a-z0-9+.-]*:/i.test(specifier);

const normalizeBaseUrl = (url: string): string =>
  new URL(url, typeof location === 'undefined' ? undefined : location.href).href;

const isModuleSource = (source: string | ModuleSource): source is ModuleSource => typeof source !== 'string';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isValidModuleSource = (value: unknown): value is ModuleSource => {
  if (value === null || typeof value !== 'object') return false;
  const source = value as Partial<ModuleSource>;
  return (
    typeof source.instanceKey === 'string' &&
    typeof source.source === 'string' &&
    typeof source.code === 'string' &&
    isStringArray(source.deps) &&
    isStringArray(source.typedDeps) &&
    isStringArray(source.destructured) &&
    typeof source.importMetaUrl === 'string'
  );
};

const assertModuleDescriptor = (specifier: string, descriptor: unknown): ModuleDescriptor => {
  if (descriptor === null || typeof descriptor !== 'object') {
    throw new QiankunError(`module hook for ${specifier} did not return a module descriptor`);
  }

  const fields = ['source', 'namespace', 'specifier'].filter((field) => field in descriptor);
  if (fields.length !== 1) {
    throw new QiankunError(
      `module descriptor for ${specifier} must contain exactly one of source, namespace or specifier`,
    );
  }

  const candidate = descriptor as Record<string, unknown>;
  if ('source' in candidate && typeof candidate.source !== 'string' && !isValidModuleSource(candidate.source)) {
    throw new QiankunError(`module descriptor source for ${specifier} must be a string or ModuleSource`);
  }
  if (
    'namespace' in candidate &&
    (candidate.namespace === null || typeof candidate.namespace !== 'object' || Array.isArray(candidate.namespace))
  ) {
    throw new QiankunError(`module descriptor namespace for ${specifier} must be a module namespace object`);
  }
  if ('specifier' in candidate && (typeof candidate.specifier !== 'string' || candidate.specifier.length === 0)) {
    throw new QiankunError(`module descriptor redirect for ${specifier} must be a non-empty specifier`);
  }
  return descriptor as ModuleDescriptor;
};

export class EsmSandboxEngine implements CompartmentModuleFacade {
  readonly instanceKey: string;

  private readonly opts: EsmSandboxEngineOpts;

  private readonly globalsBaseSet: Set<string>;

  private readonly resolveHook: ResolveHook;

  private readonly importHook: ImportHook | undefined;

  private readonly modules: Map<string, ModuleDescriptor>;

  private readonly descriptorPromises = new Map<string, Promise<ModuleDescriptor>>();

  private readonly moduleLoadContexts = new Map<ModuleCredentialsKey, ModuleLoadContext>();

  private readonly defaultModuleLoadContext: ModuleLoadContext;

  private readonly moduleImporter: (moduleUrl: string) => Promise<ModuleNamespace>;

  private readonly createModuleUrl: (code: string) => string;

  private readonly revokeModuleUrl: (moduleUrl: string) => void;

  private readonly createdModuleUrls = new Set<string>();

  private readonly appImportMap = new Map<string, string>();

  private readonly modulePromises = new Map<string, Promise<Module>>();

  private readonly inlineModules: Module[] = [];

  private readonly excludedNames = new Map<string, Set<string>>();

  private pendingImportMapEntries: Record<string, string> = {};

  private readonly moduleScriptTasks: ModuleScriptTask[] = [];

  private readonly entryDeferred = new Deferred<ModuleNamespace | undefined>();

  private sealed = false;

  private disposed = false;

  private readonly liveBindingRefreshers = new Set<() => void>();

  private readonly unsubscribeGlobalSets: (() => void) | undefined;

  private inlineModuleSeq = 0;

  private namespaceSeq = 0;

  private warnedTypedModule = false;

  private readonly entryBaseUrl: string;

  private readonly namespaceDescriptors = new Map<string, ModuleNamespace>();

  readonly instanceHandle: InstanceHandle;

  constructor(opts: EsmSandboxEngineOpts) {
    if (opts.importHook && opts.loadHook && opts.importHook !== opts.loadHook) {
      throw new QiankunError('importHook and loadHook must reference the same hook when both are provided');
    }

    this.opts = opts;
    this.entryBaseUrl = normalizeBaseUrl(opts.entryUrl);
    this.instanceKey = `${esmInternalPrefix}${opts.appName.replace(/[^\w-]/g, '_')}_${
      opts.instanceId
    }_${syntheticKeyCopyNonce}_${createRandomHex(8)}__`;
    this.globalsBaseSet = new Set(opts.globalsBaseSet);
    this.modules = new Map(Object.entries(opts.modules ?? {}));
    this.resolveHook = opts.resolveHook ?? this.defaultResolveHook;
    this.importHook = opts.importHook ?? opts.loadHook;
    this.moduleImporter = opts.moduleImporter ?? defaultModuleImporter;
    this.createModuleUrl = opts.createModuleUrl ?? defaultCreateModuleUrl;
    this.revokeModuleUrl = opts.revokeModuleUrl ?? defaultRevokeModuleUrl;

    const instance: EsmInstance = {
      get view() {
        return opts.getGlobalsView();
      },
      resolve: (specifier, baseUrl) => this.resolveModuleSpecifier(specifier, baseUrl ?? this.entryBaseUrl),
      dynamicImport: (credentialsKey, specifier, ...args) => this.dynamicImport(credentialsKey, specifier, ...args),
      track: (refresh) => {
        if (!this.disposed) this.liveBindingRefreshers.add(refresh);
      },
      getNamespace: (token) => this.namespaceDescriptors.get(token),
    };
    this.instanceHandle = registerEsmInstance(instance);

    this.unsubscribeGlobalSets = opts.subscribeGlobalSets?.((p) => {
      if (this.liveBindingRefreshers.size === 0 || !isLiveBindableDunderName(String(p))) return;
      this.liveBindingRefreshers.forEach((refresh) => refresh());
    });

    this.defaultModuleLoadContext = Object.freeze({
      credentialsKey: 'same-origin',
      instanceKey: this.instanceKey,
    });
    this.moduleLoadContexts.set(this.defaultModuleLoadContext.credentialsKey, this.defaultModuleLoadContext);
    this.registerRuntimeSpecifier(this.defaultModuleLoadContext);
  }

  registerImportMap(mapText: string, baseUrl: string): void {
    this.assertAlive();
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

  registerDocumentModule(script: DocumentModule): void {
    this.assertAlive();
    if (this.sealed) {
      throw new QiankunError(`document module registration for app ${this.opts.appName} is already sealed`);
    }

    const { isEntry } = script;
    const baseUrl = normalizeBaseUrl(script.baseUrl);
    const url = script.url;
    const loadContext = this.getModuleLoadContext(script.credentials);

    const modulePromise = (async (): Promise<Module> => {
      let module: Module;
      if (url !== undefined) {
        const fullSpecifier = this.resolveModuleSpecifier(url, baseUrl);
        module = await this.ensureModule(fullSpecifier, [], loadContext);
        this.assertAlive();
      } else {
        await prepareEsmLexer();
        this.assertAlive();
        const inlineKey = `${baseUrl}#qiankun-inline-module-${this.inlineModuleSeq++}`;
        const cacheKey = this.getModuleCacheKey(inlineKey, loadContext);
        const source = this.compileModuleSource(cacheKey, script.code, baseUrl, loadContext.instanceKey);
        module = this.createSourceModule(inlineKey, source, undefined, loadContext);
        this.inlineModules.push(module);
      }
      const graph = await this.collectGraph(module);
      this.assertAlive();
      await this.probeModules(graph.values());
      this.assertAlive();
      return module;
    })();
    modulePromise.catch(noop);

    this.moduleScriptTasks.push({ url, explicitEntry: !!isEntry, modulePromise });
  }

  importDocumentModules(): Promise<ModuleNamespace | undefined> {
    this.assertAlive();
    if (!this.sealed) {
      this.sealed = true;
      if (this.moduleScriptTasks.length > 0) {
        void this.executeModuleScripts().catch((e: unknown) => {
          if (!this.entryDeferred.isSettled()) this.entryDeferred.reject(e);
        });
      } else {
        this.entryDeferred.resolve(undefined);
      }
    }
    return this.entryDeferred.promise;
  }

  async load(specifier: string): Promise<void> {
    this.assertAlive();
    const fullSpecifier = this.resolveModuleSpecifier(specifier, this.entryBaseUrl);
    await this.prepareResolvedModule(fullSpecifier);
  }

  async import(specifier: string): Promise<ModuleNamespace> {
    this.assertAlive();
    return this.importFrom(specifier, this.entryBaseUrl);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.unsubscribeGlobalSets?.();
    this.liveBindingRefreshers.clear();
    this.namespaceDescriptors.clear();
    unregisterEsmInstance(this.instanceHandle.token);
    this.createdModuleUrls.forEach((moduleUrl) => this.revokeModuleUrl(moduleUrl));
    this.createdModuleUrls.clear();
    this.descriptorPromises.clear();
    this.modulePromises.clear();
    this.inlineModules.length = 0;
    this.moduleScriptTasks.length = 0;
    this.pendingImportMapEntries = {};
  }

  private track(moduleUrl: string): string {
    if (this.disposed) {
      this.revokeModuleUrl(moduleUrl);
      this.assertAlive();
    }
    this.createdModuleUrls.add(moduleUrl);
    return moduleUrl;
  }

  private assertAlive(): void {
    if (this.disposed) {
      throw new QiankunError(`ESM sandbox engine of app ${this.opts.appName} has been disposed`);
    }
  }

  private readonly defaultResolveHook: ResolveHook = (specifier, referrer) => {
    const mapped = this.matchAppImportMap(specifier);
    if (mapped) return mapped;

    // A modules entry may intentionally use a bare canonical key.
    if (this.modules.has(specifier)) return specifier;

    if (isUrlLikeSpecifier(specifier)) {
      return new URL(specifier, referrer).href;
    }

    throw new QiankunError(
      `failed to resolve the bare specifier '${specifier}' imported from ${referrer}: no import map entry found in app ${this.opts.appName}`,
    );
  };

  private readonly defaultImportHook = async (
    fullSpecifier: string,
    loadContext: ModuleLoadContext,
  ): Promise<ModuleDescriptor> => {
    await prepareEsmLexer();
    this.assertAlive();
    const source = await this.fetchModuleSource(fullSpecifier, loadContext);
    this.assertAlive();
    const moduleSource = this.compileModuleSource(
      this.getModuleCacheKey(fullSpecifier, loadContext),
      source,
      fullSpecifier,
      loadContext.instanceKey,
    );
    return { source: moduleSource };
  };

  private getModuleLoadContext(credentials: RequestInit['credentials']): ModuleLoadContext {
    const credentialsKey = credentials ?? 'same-origin';
    const existing = this.moduleLoadContexts.get(credentialsKey);
    if (existing) return existing;

    const loadContext: ModuleLoadContext = Object.freeze({
      credentialsKey,
      credentials: credentialsKey,
      instanceKey: `${this.instanceKey}credentials_${credentialsKey}__`,
    });
    this.moduleLoadContexts.set(credentialsKey, loadContext);
    this.registerRuntimeSpecifier(loadContext);
    return loadContext;
  }

  private registerRuntimeSpecifier(loadContext: ModuleLoadContext): void {
    const runtimeModuleSource = [
      `const instance = globalThis[${JSON.stringify(this.instanceHandle.accessorKey)}](${JSON.stringify(
        this.instanceHandle.token,
      )});`,
      'export const __qk_view = instance.view;',
      'export const __qk_resolve = instance.resolve;',
      `export const __qk_dynamic_import = (specifier, ...args) => instance.dynamicImport(${JSON.stringify(
        loadContext.credentialsKey,
      )}, specifier, ...args);`,
      'export const __qk_track = instance.track;',
      'export const __qk_get_namespace = instance.getNamespace;',
    ].join('\n');
    const runtimeModuleUrl = this.track(this.createModuleUrl(runtimeModuleSource));
    this.pendingImportMapEntries[buildSyntheticSpecifier(loadContext.instanceKey, runtimeModuleSubpath)] =
      runtimeModuleUrl;
  }

  private getModuleCacheKey(fullSpecifier: string, loadContext: ModuleLoadContext): string {
    return JSON.stringify([loadContext.credentialsKey, fullSpecifier]);
  }

  private resolveModuleSpecifier(specifier: string, referrer: string): string {
    if (specifier.startsWith(esmInternalPrefix)) {
      throw new QiankunError(
        `synthetic specifier ${specifier} is not allowed in application code of ${this.opts.appName}`,
      );
    }

    const resolved = this.resolveHook(specifier, referrer);
    if (typeof resolved !== 'string' || resolved.length === 0) {
      throw new QiankunError(`resolveHook for '${specifier}' imported from ${referrer} did not return a specifier`);
    }
    if (resolved.startsWith(esmInternalPrefix)) {
      throw new QiankunError(`resolveHook returned a reserved synthetic specifier ${resolved}`);
    }
    return resolved;
  }

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

  private getModuleDescriptor(fullSpecifier: string, loadContext: ModuleLoadContext): Promise<ModuleDescriptor> {
    let descriptor = this.modules.get(fullSpecifier);
    if (!descriptor) {
      const redirect = this.opts.materializeRedirect?.(fullSpecifier);
      if (redirect && redirect !== fullSpecifier) {
        descriptor = { specifier: redirect };
        this.modules.set(fullSpecifier, descriptor);
      }
    }

    // Explicit descriptors and custom hooks describe one canonical graph and stay
    // memoized by specifier. Only the default network hook varies by credentials.
    const descriptorKey =
      descriptor || this.importHook ? fullSpecifier : this.getModuleCacheKey(fullSpecifier, loadContext);
    let pending = this.descriptorPromises.get(descriptorKey);
    if (!pending) {
      pending = descriptor
        ? Promise.resolve(assertModuleDescriptor(fullSpecifier, descriptor))
        : Promise.resolve()
            .then(() => {
              this.assertAlive();
              return this.importHook
                ? this.importHook(fullSpecifier)
                : this.defaultImportHook(fullSpecifier, loadContext);
            })
            .then((imported) => {
              this.assertAlive();
              return assertModuleDescriptor(fullSpecifier, imported);
            });
      this.descriptorPromises.set(descriptorKey, pending);
      pending.catch(noop);
    }
    return pending;
  }

  private ensureModule(
    fullSpecifier: string,
    redirectTrail: string[] = [],
    loadContext: ModuleLoadContext = this.defaultModuleLoadContext,
  ): Promise<Module> {
    if (redirectTrail.includes(fullSpecifier)) {
      throw new QiankunError(`module redirect cycle: ${[...redirectTrail, fullSpecifier].join(' -> ')}`);
    }

    const cacheKey = this.getModuleCacheKey(fullSpecifier, loadContext);
    let pending = this.modulePromises.get(cacheKey);
    if (!pending) {
      pending = this.createModule(fullSpecifier, redirectTrail, loadContext);
      this.modulePromises.set(cacheKey, pending);
      pending.catch(noop);
    }
    return pending;
  }

  private async createModule(
    fullSpecifier: string,
    redirectTrail: string[],
    loadContext: ModuleLoadContext,
  ): Promise<Module> {
    this.assertAlive();
    const descriptor = await this.getModuleDescriptor(fullSpecifier, loadContext);
    this.assertAlive();

    if (descriptor.specifier !== undefined) {
      const target = this.resolveModuleSpecifier(descriptor.specifier, fullSpecifier);
      const module = await this.ensureModule(target, [...redirectTrail, fullSpecifier], loadContext);
      this.assertAlive();
      this.addSyntheticSpecifier(module, fullSpecifier);
      return module;
    }

    if (descriptor.namespace !== undefined) {
      return this.createNamespaceModule(fullSpecifier, descriptor.namespace, loadContext);
    }

    if (isModuleSource(descriptor.source)) {
      const source = this.materializeModuleSource(descriptor.source, loadContext);
      return this.createSourceModule(fullSpecifier, source, fullSpecifier, loadContext);
    }

    await prepareEsmLexer();
    this.assertAlive();
    const source = this.compileModuleSource(
      this.getModuleCacheKey(fullSpecifier, loadContext),
      descriptor.source,
      fullSpecifier,
      loadContext.instanceKey,
    );
    return this.createSourceModule(fullSpecifier, source, fullSpecifier, loadContext);
  }

  private materializeModuleSource(source: ModuleSource, loadContext: ModuleLoadContext): ModuleSource {
    return relocateModuleSourceInstanceKey(source, loadContext.instanceKey);
  }

  private compileModuleSource(
    cacheKey: string,
    source: string,
    importMetaUrl: string,
    instanceKey: string,
  ): ModuleSource {
    const { code, deps, typedDeps, destructured } = rewriteModule({
      source,
      url: importMetaUrl,
      instanceKey,
      globalsBaseSet: this.globalsBaseSet,
      excludedNames: this.excludedNames.get(cacheKey),
      resolveSpecifier: (specifier, referrer) => this.resolveModuleSpecifier(specifier, referrer),
    });
    return { instanceKey, source, code, deps, typedDeps, destructured, importMetaUrl };
  }

  private createSourceModule(
    url: string,
    source: ModuleSource,
    syntheticSpecifier: string | undefined,
    loadContext: ModuleLoadContext,
  ): Module {
    this.assertAlive();
    const module: Module = {
      cacheKey: this.getModuleCacheKey(url, loadContext),
      url,
      loadContext,
      source,
      syntheticSpecifiers: new Set(),
      moduleUrl: this.track(this.createModuleUrl(source.code)),
      probed: false,
    };

    if (syntheticSpecifier) this.addSyntheticSpecifier(module, syntheticSpecifier);
    this.registerTypedDependencies(source.typedDeps, loadContext);
    source.deps.forEach((dep) => void this.ensureModule(dep, [], loadContext));
    return module;
  }

  private createNamespaceModule(url: string, namespace: ModuleNamespace, loadContext: ModuleLoadContext): Module {
    this.assertAlive();
    const token = String(++this.namespaceSeq);
    this.namespaceDescriptors.set(token, namespace);

    const lines = [
      `import { __qk_get_namespace } from ${JSON.stringify(
        buildSyntheticSpecifier(loadContext.instanceKey, runtimeModuleSubpath),
      )};`,
      `const __qk_namespace = __qk_get_namespace(${JSON.stringify(token)});`,
      `if (!__qk_namespace) throw new Error(${JSON.stringify(`namespace descriptor ${url} is unavailable`)});`,
    ];
    Object.keys(namespace).forEach((name, index) => {
      if (name === 'default') {
        lines.push('export default __qk_namespace.default;');
      } else if (/^[A-Za-z_$][\w$]*$/.test(name)) {
        lines.push(`export const ${name} = __qk_namespace[${JSON.stringify(name)}];`);
      } else {
        const localName = `__qk_export_${index}`;
        lines.push(
          `const ${localName} = __qk_namespace[${JSON.stringify(name)}];`,
          `export { ${localName} as ${JSON.stringify(name)} };`,
        );
      }
    });
    lines.push(`//# sourceURL=${url}`);

    const code = lines.join('\n');
    const source: ModuleSource = {
      instanceKey: loadContext.instanceKey,
      source: code,
      code,
      deps: [],
      typedDeps: [],
      destructured: [],
      importMetaUrl: url,
    };
    const module = this.createSourceModule(url, source, url, loadContext);
    module.namespace = namespace;
    return module;
  }

  private addSyntheticSpecifier(module: Module, specifier: string): void {
    const syntheticSpecifier = buildSyntheticSpecifier(module.loadContext.instanceKey, specifier);
    module.syntheticSpecifiers.add(syntheticSpecifier);
    this.pendingImportMapEntries[syntheticSpecifier] = module.moduleUrl;
  }

  private registerTypedDependencies(typedDeps: string[], loadContext: ModuleLoadContext): void {
    typedDeps.forEach((typedUrl) => {
      // Typed modules bypass the engine fetch pipeline. Native module loading
      // cannot inherit this document task's credentials setting, so this v1
      // passthrough provides neither instance isolation nor graph credentials.
      this.pendingImportMapEntries[buildSyntheticSpecifier(loadContext.instanceKey, typedUrl)] = typedUrl;
      if (!this.warnedTypedModule) {
        this.warnedTypedModule = true;
        console.warn(
          `[qiankun] typed module imports (JSON/CSS/WASM, e.g. ${typedUrl}) in app ${this.opts.appName} are loaded natively from their original URL without instance isolation or document-graph credentials (RFC §14)`,
        );
      }
    });
  }

  private fetchModuleSource(url: string, loadContext: ModuleLoadContext): Promise<string> {
    if (isViteClientUrl(url)) return Promise.resolve(viteClientStubSource);
    return this.opts
      .fetch(url, loadContext.credentials ? { credentials: loadContext.credentials } : undefined)
      .then((res) => res.text());
  }

  private async collectGraph(module: Module, acc = new Map<string, Module>()): Promise<Map<string, Module>> {
    if (acc.has(module.cacheKey)) return acc;
    acc.set(module.cacheKey, module);
    await Promise.all(
      module.source.deps.map(async (dep) => {
        const child = await this.ensureModule(dep, [], module.loadContext);
        if (!acc.has(child.cacheKey)) await this.collectGraph(child, acc);
      }),
    );
    return acc;
  }

  private async probeModules(modules: Iterable<Module>): Promise<void> {
    const candidates = Array.from(modules).filter((module) => !module.probed && this.mayCollide(module));
    await Promise.all(candidates.map((module) => this.probeModule(module)));
  }

  private mayCollide(module: Module): boolean {
    if (module.source.destructured.length === 0) return false;
    return declarationKeywordPattern.test(module.source.source);
  }

  private async probeModule(module: Module): Promise<void> {
    const runtimeSpecifier = buildSyntheticSpecifier(module.loadContext.instanceKey, runtimeModuleSubpath);
    const probeSpecifier = buildSyntheticSpecifier(module.loadContext.instanceKey, '__probe__');

    module.probed = true;
    for (;;) {
      const probeCode = module.source.code.replace(runtimeSpecifier, probeSpecifier);
      this.assertAlive();
      const probeUrl = this.track(this.createModuleUrl(probeCode));
      try {
        await this.moduleImporter(probeUrl);
        this.assertAlive();
        return;
      } catch (e) {
        this.assertAlive();
        const collided = extractRedeclaredIdentifier(e);
        if (!collided || !module.source.destructured.includes(collided)) return;
        const excluded = this.excludedNames.get(module.cacheKey) ?? new Set<string>();
        excluded.add(collided);
        this.excludedNames.set(module.cacheKey, excluded);
        this.rebuildModule(module);
      } finally {
        if (this.createdModuleUrls.delete(probeUrl)) {
          this.revokeModuleUrl(probeUrl);
        }
      }
    }
  }

  private rebuildModule(module: Module): void {
    this.assertAlive();
    this.createdModuleUrls.delete(module.moduleUrl);
    this.revokeModuleUrl(module.moduleUrl);
    module.source = this.compileModuleSource(
      module.cacheKey,
      module.source.source,
      module.source.importMetaUrl,
      module.loadContext.instanceKey,
    );
    module.moduleUrl = this.track(this.createModuleUrl(module.source.code));
    module.syntheticSpecifiers.forEach((specifier) => {
      this.pendingImportMapEntries[specifier] = module.moduleUrl;
    });
  }

  private flushImportMapEntries(): void {
    this.assertAlive();
    const entries = this.pendingImportMapEntries;
    if (keys(entries).length > 0) {
      this.pendingImportMapEntries = {};
      injectImportMapEntries(entries);
    }
  }

  private async prepareResolvedModule(
    fullSpecifier: string,
    loadContext: ModuleLoadContext = this.defaultModuleLoadContext,
  ): Promise<Module> {
    const module = await this.ensureModule(fullSpecifier, [], loadContext);
    this.assertAlive();
    const graph = await this.collectGraph(module);
    this.assertAlive();
    await this.probeModules(graph.values());
    this.assertAlive();
    this.flushImportMapEntries();
    return module;
  }

  private async executeModule(module: Module): Promise<ModuleNamespace> {
    this.assertAlive();
    const namespace = module.namespace ?? (await this.moduleImporter(module.moduleUrl));
    this.assertAlive();
    return namespace;
  }

  private async executeModuleScripts(): Promise<void> {
    const tasks = [...this.moduleScriptTasks];
    const explicitEntry = tasks.find((task) => task.explicitEntry);
    const executed: ModuleNamespace[] = [];

    for (const task of tasks) {
      try {
        const module = await task.modulePromise;
        this.assertAlive();
        this.flushImportMapEntries();
        const namespace = await this.executeModule(module);
        this.assertAlive();
        executed.push(namespace);
        if (task === explicitEntry && !this.entryDeferred.isSettled()) {
          this.entryDeferred.resolve(namespace);
        }
      } catch (e) {
        if (this.disposed) throw e;
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

    if (!explicitEntry && !this.entryDeferred.isSettled()) {
      this.assertAlive();
      const { isLifecycleNamespace } = this.opts;
      const picked =
        (isLifecycleNamespace && executed.find((ns) => isLifecycleNamespace(ns))) ?? executed[executed.length - 1];
      this.entryDeferred.resolve(picked);
    }
  }

  private async importFrom(
    specifier: string,
    referrer: string,
    loadContext: ModuleLoadContext = this.defaultModuleLoadContext,
  ): Promise<ModuleNamespace> {
    const fullSpecifier = this.resolveModuleSpecifier(specifier, referrer);
    const module = await this.prepareResolvedModule(fullSpecifier, loadContext);
    this.assertAlive();
    return this.executeModule(module);
  }

  private readonly dynamicImport = async (
    credentialsKey: string,
    specifier: unknown,
    ...args: unknown[]
  ): Promise<ModuleNamespace> => {
    this.assertAlive();
    const loadContext = this.moduleLoadContexts.get(credentialsKey as ModuleCredentialsKey);
    if (!loadContext) {
      throw new QiankunError(`unknown module credentials context ${credentialsKey} in app ${this.opts.appName}`);
    }
    const spec = String(specifier);
    const baseUrl = typeof args[args.length - 1] === 'string' ? (args[args.length - 1] as string) : this.entryBaseUrl;
    return this.importFrom(spec, baseUrl, loadContext);
  };
}
