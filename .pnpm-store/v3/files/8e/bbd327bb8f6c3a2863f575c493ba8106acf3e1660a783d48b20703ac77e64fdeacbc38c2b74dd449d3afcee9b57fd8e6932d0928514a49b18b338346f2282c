import type webpack from 'webpack';
import type { ForkTsCheckerWebpackPluginOptions } from './plugin-options';
declare class ForkTsCheckerWebpackPlugin {
    /**
     * Current version of the plugin
     */
    static readonly version: string;
    /**
     * Default pools for the plugin concurrency limit
     */
    static readonly issuesPool: import("./utils/async/pool").Pool;
    static readonly dependenciesPool: import("./utils/async/pool").Pool;
    /**
     * @deprecated Use ForkTsCheckerWebpackPlugin.issuesPool instead
     */
    static readonly pool: import("./utils/async/pool").Pool;
    private readonly options;
    constructor(options?: ForkTsCheckerWebpackPluginOptions);
    static getCompilerHooks(compiler: webpack.Compiler): {
        start: import("tapable").AsyncSeriesWaterfallHook<[import("./files-change").FilesChange, webpack.Compilation], import("tapable").UnsetAdditionalOptions>;
        waiting: import("tapable").SyncHook<[webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
        canceled: import("tapable").SyncHook<[webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
        error: import("tapable").SyncHook<[unknown, webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
        issues: import("tapable").SyncWaterfallHook<[import("./issue/issue").Issue[], webpack.Compilation | undefined], void>;
    };
    apply(compiler: webpack.Compiler): void;
}
export { ForkTsCheckerWebpackPlugin };
