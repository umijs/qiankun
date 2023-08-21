import { IBuildDepPluginOpts } from '../webpackPlugins/buildDepPlugin';
import type { IMFSUStrategy, MFSU } from './mfsu';
import type { Configuration } from 'webpack';
export declare class StaticAnalyzeStrategy implements IMFSUStrategy {
    private readonly mfsu;
    private staticDepInfo;
    constructor({ mfsu, srcCodeCache }: {
        mfsu: MFSU;
        srcCodeCache: any;
    });
    init(webpackConfig: Configuration): void;
    getDepModules(): Record<string, {
        file: string;
        version: string;
    }>;
    getCacheFilePath(): string;
    shouldBuild(): false | "cacheDependency has changed" | "dependencies changed";
    writeCache(): void;
    getBabelPlugin(): any[];
    private getMfImportOpts;
    getBuildDepPlugConfig(): IBuildDepPluginOpts;
    loadCache(): void;
    refresh(): void;
}
