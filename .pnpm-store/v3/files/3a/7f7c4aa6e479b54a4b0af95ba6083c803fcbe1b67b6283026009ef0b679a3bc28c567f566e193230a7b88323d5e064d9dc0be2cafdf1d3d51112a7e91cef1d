import { MFSU } from './mfsu/mfsu';
import { ModuleGraph } from './moduleGraph';
interface IOpts {
    mfsu: MFSU;
}
export declare type DepModule = {
    file: string;
    version: string;
    importer?: string;
};
export interface IDepInfo {
    shouldBuild(): string | boolean;
    snapshot(): void;
    loadCache(): void;
    writeCache(): void;
    getCacheFilePath(): string;
    getDepModules(): Record<string, DepModule>;
}
export declare class DepInfo implements IDepInfo {
    private opts;
    private readonly cacheFilePath;
    moduleGraph: ModuleGraph;
    private cacheDependency;
    constructor(opts: IOpts);
    shouldBuild(): false | "cacheDependency has changed" | "moduleGraph has changed";
    snapshot(): void;
    loadCache(): void;
    writeCache(): void;
    getDepModules(): Record<string, DepModule>;
    getCacheFilePath(): string;
}
export {};
