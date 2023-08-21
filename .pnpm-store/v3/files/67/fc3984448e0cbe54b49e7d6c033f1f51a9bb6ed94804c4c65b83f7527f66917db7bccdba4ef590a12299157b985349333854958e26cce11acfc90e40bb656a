/// <reference types="node" />
import type { NextFunction, Request, Response } from '@umijs/bundler-utils/compiled/express';
import webpack, { Configuration } from 'webpack';
import type { Worker } from 'worker_threads';
import { DepBuilder } from '../depBuilder/depBuilder';
import { DepModule } from '../depInfo';
import { Mode } from '../types';
import { IBuildDepPluginOpts } from '../webpackPlugins/buildDepPlugin';
interface IOpts {
    cwd?: string;
    excludeNodeNatives?: boolean;
    exportAllMembers?: Record<string, string[]>;
    getCacheDependency?: Function;
    onMFSUProgress?: Function;
    mfName?: string;
    mode?: Mode;
    tmpBase?: string;
    unMatchLibs?: Array<string | RegExp>;
    runtimePublicPath?: boolean | string;
    implementor: typeof webpack;
    buildDepWithESBuild?: boolean;
    depBuildConfig: any;
    strategy?: 'eager' | 'normal';
    include?: string[];
    srcCodeCache?: any;
    shared?: any;
    remoteName?: string;
    remoteAliases?: string[];
    startBuildWorker: (dep: any[]) => Worker;
}
export declare class MFSU {
    opts: IOpts;
    alias: Record<string, string>;
    externals: (Record<string, string> | Function)[];
    depBuilder: DepBuilder;
    depConfig: Configuration | null;
    buildDepsAgain: boolean;
    progress: any;
    onProgress: Function;
    publicPath: string;
    private strategy;
    private lastBuildError;
    constructor(opts: IOpts);
    asyncImport(content: string): string;
    setWebpackConfig(opts: {
        config: Configuration;
        depConfig: Configuration;
    }): Promise<void>;
    buildDeps(opts?: {
        useWorker: boolean;
    }): Promise<void>;
    getMiddlewares(): (((req: Request, res: Response, next: NextFunction) => void) | import("@umijs/bundler-utils/compiled/express/serve-static").RequestHandler<Response<any, Record<string, any>>>)[];
    getBabelPlugins(): any[][];
    getEsbuildLoaderHandler(): any[];
    getCacheFilePath(): string;
}
export declare function resolvePublicPath(config: Configuration): string;
export interface IMFSUStrategy {
    init(webpackConfig: Configuration): void;
    shouldBuild(): string | boolean;
    getBabelPlugin(): any[];
    getBuildDepPlugConfig(): IBuildDepPluginOpts;
    loadCache(): void;
    getCacheFilePath(): string;
    getDepModules(): Record<string, DepModule>;
    refresh(): void;
    writeCache(): void;
}
export {};
