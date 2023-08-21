import { SyncHook, SyncWaterfallHook, AsyncSeriesWaterfallHook } from 'tapable';
import type * as webpack from 'webpack';
import type { FilesChange } from './files-change';
import type { Issue } from './issue';
declare function createPluginHooks(): {
    start: AsyncSeriesWaterfallHook<[FilesChange, webpack.Compilation], import("tapable").UnsetAdditionalOptions>;
    waiting: SyncHook<[webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
    canceled: SyncHook<[webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
    error: SyncHook<[unknown, webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
    issues: SyncWaterfallHook<[Issue[], webpack.Compilation | undefined], void>;
};
declare type ForkTsCheckerWebpackPluginHooks = ReturnType<typeof createPluginHooks>;
declare function getPluginHooks(compiler: webpack.Compiler | webpack.MultiCompiler): {
    start: AsyncSeriesWaterfallHook<[FilesChange, webpack.Compilation], import("tapable").UnsetAdditionalOptions>;
    waiting: SyncHook<[webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
    canceled: SyncHook<[webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
    error: SyncHook<[unknown, webpack.Compilation], void, import("tapable").UnsetAdditionalOptions>;
    issues: SyncWaterfallHook<[Issue[], webpack.Compilation | undefined], void>;
};
export { getPluginHooks, ForkTsCheckerWebpackPluginHooks };
