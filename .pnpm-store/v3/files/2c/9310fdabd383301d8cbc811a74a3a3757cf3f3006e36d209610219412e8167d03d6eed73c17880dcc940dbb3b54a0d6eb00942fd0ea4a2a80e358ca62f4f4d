import type { Compiler } from 'webpack';
import type { ForkTsCheckerWebpackPluginState } from '../plugin-state';
import type { WatchFileSystem } from './watch-file-system';
declare class InclusiveNodeWatchFileSystem implements WatchFileSystem {
    private watchFileSystem;
    private compiler;
    private pluginState;
    get watcher(): import("./watch-file-system").Watchpack | undefined;
    private readonly dirsWatchers;
    private paused;
    private deletedFiles;
    constructor(watchFileSystem: WatchFileSystem, compiler: Compiler, pluginState: ForkTsCheckerWebpackPluginState);
    watch: WatchFileSystem['watch'];
}
export { InclusiveNodeWatchFileSystem };
