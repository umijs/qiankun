import { DepModule } from '../depInfo';
import { IBuildDepPluginOpts } from '../webpackPlugins/buildDepPlugin';
import type { IMFSUStrategy, MFSU } from './mfsu';
export declare class StrategyCompileTime implements IMFSUStrategy {
    private readonly mfsu;
    private depInfo;
    constructor({ mfsu }: {
        mfsu: MFSU;
    });
    getDepModules(): Record<string, DepModule>;
    getCacheFilePath(): string;
    init(): void;
    shouldBuild(): false | "cacheDependency has changed" | "moduleGraph has changed";
    loadCache(): void;
    writeCache(): void;
    refresh(): void;
    getBabelPlugin(): any[];
    getBuildDepPlugConfig(): IBuildDepPluginOpts;
    private getAwaitImportCollectOpts;
}
