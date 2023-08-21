import { ImportSpecifier } from '@umijs/bundler-utils/compiled/es-module-lexer';
import { checkMatch } from '../babelPlugins/awaitImport/checkMatch';
import { MFSU } from '../mfsu/mfsu';
declare type FileChangeEvent = {
    event: 'unlink' | 'change' | 'add';
    path: string;
};
declare type MergedCodeInfo = {
    imports: readonly ImportSpecifier[];
    code: string;
    events: FileChangeEvent[];
};
declare type AutoUpdateSrcCodeCache = {
    register(listener: (info: MergedCodeInfo) => void): void;
    getMergedCode(): MergedCodeInfo;
    handleFileChangeEvents(events: FileChangeEvent[]): void;
    replayChangeEvents(): FileChangeEvent[];
    getSrcPath(): string;
};
interface IOpts {
    mfsu: MFSU;
    srcCodeCache: AutoUpdateSrcCodeCache;
    safeList?: string[];
}
export declare type Match = ReturnType<typeof checkMatch> & {
    version: string;
};
export declare class StaticDepInfo {
    opts: IOpts;
    private readonly cacheFilePath;
    private mfsu;
    private readonly include;
    private currentDep;
    private builtWithDep;
    private cacheDependency;
    private produced;
    private readonly cwd;
    private readonly runtimeSimulations;
    constructor(opts: IOpts);
    getProducedEvent(): {
        changes: unknown[];
    }[];
    consumeAllProducedEvents(): void;
    shouldBuild(): false | "cacheDependency has changed" | "dependencies changed";
    getDepModules(): Record<string, {
        file: string;
        version: string;
    }>;
    snapshot(): void;
    loadCache(): void;
    writeCache(): void;
    getCacheFilePath(): string;
    getDependencies(): Record<string, Match>;
    init(): void;
    private _getDependencies;
    private simulateRuntimeTransform;
    private appendIncludeList;
    allRuntimeHelpers(): Promise<void>;
    setBabelPluginImportConfig(config: Map<string, any>): void;
}
export {};
