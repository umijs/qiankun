import { ViteHotContext } from 'vite/types/hot';
import { E as EncodedSourceMap } from './types.d-7442d07f.js';

declare const DEFAULT_REQUEST_STUBS: Record<string, Record<string, unknown>>;
declare class ModuleCacheMap extends Map<string, ModuleCache> {
    normalizePath(fsPath: string): string;
    /**
     * Assign partial data to the map
     */
    update(fsPath: string, mod: ModuleCache): this;
    setByModuleId(modulePath: string, mod: ModuleCache): this;
    set(fsPath: string, mod: ModuleCache): this;
    getByModuleId(modulePath: string): ModuleCache & Required<Pick<ModuleCache, "imports" | "importers">>;
    get(fsPath: string): ModuleCache & Required<Pick<ModuleCache, "imports" | "importers">>;
    deleteByModuleId(modulePath: string): boolean;
    delete(fsPath: string): boolean;
    invalidateModule(mod: ModuleCache): boolean;
    /**
     * Invalidate modules that dependent on the given modules, up to the main entry
     */
    invalidateDepTree(ids: string[] | Set<string>, invalidated?: Set<string>): Set<string>;
    /**
     * Invalidate dependency modules of the given modules, down to the bottom-level dependencies
     */
    invalidateSubDepTree(ids: string[] | Set<string>, invalidated?: Set<string>): Set<string>;
    /**
     * Return parsed source map based on inlined source map of the module
     */
    getSourceMap(id: string): EncodedSourceMap | null;
}
declare class ViteNodeRunner {
    options: ViteNodeRunnerOptions;
    root: string;
    debug: boolean;
    /**
     * Holds the cache of modules
     * Keys of the map are filepaths, or plain package names
     */
    moduleCache: ModuleCacheMap;
    constructor(options: ViteNodeRunnerOptions);
    executeFile(file: string): Promise<any>;
    executeId(rawId: string): Promise<any>;
    /** @internal */
    cachedRequest(id: string, fsPath: string, callstack: string[]): Promise<any>;
    shouldResolveId(id: string, _importee?: string): boolean;
    private _resolveUrl;
    resolveUrl(id: string, importee?: string): Promise<[url: string, fsPath: string]>;
    /** @internal */
    dependencyRequest(id: string, fsPath: string, callstack: string[]): Promise<any>;
    /** @internal */
    directRequest(id: string, fsPath: string, _callstack: string[]): Promise<any>;
    protected getContextPrimitives(): {
        Object: ObjectConstructor;
        Reflect: typeof Reflect;
        Symbol: SymbolConstructor;
    };
    protected runModule(context: Record<string, any>, transformed: string): Promise<void>;
    prepareContext(context: Record<string, any>): Record<string, any>;
    /**
     * Define if a module should be interop-ed
     * This function mostly for the ability to override by subclass
     */
    shouldInterop(path: string, mod: any): boolean;
    protected importExternalModule(path: string): Promise<any>;
    /**
     * Import a module and interop it
     */
    interopedImport(path: string): Promise<any>;
}

type Nullable<T> = T | null | undefined;
type Arrayable<T> = T | Array<T>;
type Awaitable<T> = T | PromiseLike<T>;
interface DepsHandlingOptions {
    external?: (string | RegExp)[];
    inline?: (string | RegExp)[] | true;
    /**
     * A list of directories that are considered to hold Node.js modules
     * Have to include "/" at the start and end of the path
     *
     * Vite-Node checks the whole absolute path of the import, so make sure you don't include
     * unwanted files accidentally
     * @default ['/node_modules/']
     */
    moduleDirectories?: string[];
    cacheDir?: string;
    /**
     * Try to guess the CJS version of a package when it's invalid ESM
     * @default false
     */
    fallbackCJS?: boolean;
}
interface StartOfSourceMap {
    file?: string;
    sourceRoot?: string;
}

interface RawSourceMap extends StartOfSourceMap {
    version: string;
    sources: string[];
    names: string[];
    sourcesContent?: string[];
    mappings: string;
}
interface FetchResult {
    code?: string;
    externalize?: string;
    map?: EncodedSourceMap | null;
}
type HotContext = Omit<ViteHotContext, 'acceptDeps' | 'decline'>;
type FetchFunction = (id: string) => Promise<FetchResult>;
type ResolveIdFunction = (id: string, importer?: string) => Awaitable<ViteNodeResolveId | null | undefined | void>;
type CreateHotContextFunction = (runner: ViteNodeRunner, url: string) => HotContext;
interface ModuleCache {
    promise?: Promise<any>;
    exports?: any;
    evaluated?: boolean;
    resolving?: boolean;
    code?: string;
    map?: EncodedSourceMap;
    /**
     * Module ids that imports this module
     */
    importers?: Set<string>;
    imports?: Set<string>;
}
interface ViteNodeRunnerOptions {
    root: string;
    fetchModule: FetchFunction;
    resolveId?: ResolveIdFunction;
    createHotContext?: CreateHotContextFunction;
    base?: string;
    moduleCache?: ModuleCacheMap;
    interopDefault?: boolean;
    requestStubs?: Record<string, any>;
    debug?: boolean;
}
interface ViteNodeResolveId {
    external?: boolean | 'absolute' | 'relative';
    id: string;
    meta?: Record<string, any> | null;
    moduleSideEffects?: boolean | 'no-treeshake' | null;
    syntheticNamedExports?: boolean | string | null;
}
interface ViteNodeServerOptions {
    /**
     * Inject inline sourcemap to modules
     * @default 'inline'
     */
    sourcemap?: 'inline' | boolean;
    /**
     * Deps handling
     */
    deps?: DepsHandlingOptions;
    /**
     * Transform method for modules
     */
    transformMode?: {
        ssr?: RegExp[];
        web?: RegExp[];
    };
    debug?: DebuggerOptions;
}
interface DebuggerOptions {
    /**
     * Dump the transformed module to filesystem
     * Passing a string will dump to the specified path
     */
    dumpModules?: boolean | string;
    /**
     * Read dumpped module from filesystem whenever exists.
     * Useful for debugging by modifying the dump result from the filesystem.
     */
    loadDumppedModules?: boolean;
}

export { Arrayable as A, CreateHotContextFunction as C, DepsHandlingOptions as D, FetchResult as F, HotContext as H, ModuleCacheMap as M, Nullable as N, RawSourceMap as R, StartOfSourceMap as S, ViteNodeRunnerOptions as V, Awaitable as a, FetchFunction as b, ResolveIdFunction as c, ModuleCache as d, ViteNodeResolveId as e, ViteNodeServerOptions as f, DebuggerOptions as g, ViteNodeRunner as h, DEFAULT_REQUEST_STUBS as i };
