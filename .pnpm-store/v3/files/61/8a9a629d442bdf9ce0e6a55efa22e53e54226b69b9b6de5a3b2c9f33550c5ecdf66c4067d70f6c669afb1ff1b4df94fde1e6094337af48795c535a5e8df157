import { TransformResult, ViteDevServer } from 'vite';
import { E as EncodedSourceMap } from './types.d-7442d07f.js';
import { g as DebuggerOptions, D as DepsHandlingOptions, f as ViteNodeServerOptions, F as FetchResult, e as ViteNodeResolveId } from './types-e8623e9c.js';
import 'vite/types/hot';

declare class Debugger {
    options: DebuggerOptions;
    dumpDir: string | undefined;
    initPromise: Promise<void> | undefined;
    externalizeMap: Map<string, string>;
    constructor(root: string, options: DebuggerOptions);
    clearDump(): Promise<void>;
    encodeId(id: string): string;
    recordExternalize(id: string, path: string): Promise<void>;
    dumpFile(id: string, result: TransformResult | null): Promise<void>;
    loadDump(id: string): Promise<TransformResult | null>;
    writeInfo(): Promise<void>;
}

declare function guessCJSversion(id: string): string | undefined;
declare function shouldExternalize(id: string, options?: DepsHandlingOptions, cache?: Map<string, Promise<string | false>>): Promise<string | false>;

declare class ViteNodeServer {
    server: ViteDevServer;
    options: ViteNodeServerOptions;
    private fetchPromiseMap;
    private transformPromiseMap;
    private existingOptimizedDeps;
    fetchCache: Map<string, {
        duration?: number | undefined;
        timestamp: number;
        result: FetchResult;
    }>;
    externalizeCache: Map<string, Promise<string | false>>;
    debugger?: Debugger;
    constructor(server: ViteDevServer, options?: ViteNodeServerOptions);
    shouldExternalize(id: string): Promise<string | false>;
    private ensureExists;
    resolveId(id: string, importer?: string, transformMode?: 'web' | 'ssr'): Promise<ViteNodeResolveId | null>;
    getSourceMap(source: string): EncodedSourceMap | null;
    fetchModule(id: string, transformMode?: 'web' | 'ssr'): Promise<FetchResult>;
    transformRequest(id: string, filepath?: string): Promise<TransformResult | null | undefined>;
    getTransformMode(id: string): "web" | "ssr";
    private _fetchModule;
    protected processTransformResult(filepath: string, result: TransformResult): Promise<TransformResult>;
    private _transformRequest;
}

export { ViteNodeServer, guessCJSversion, shouldExternalize };
