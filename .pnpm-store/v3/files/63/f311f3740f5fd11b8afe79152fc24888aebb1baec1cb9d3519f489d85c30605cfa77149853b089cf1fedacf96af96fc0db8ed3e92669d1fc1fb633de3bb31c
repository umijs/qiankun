/// <reference types="node" />
import type { EventEmitter } from 'events';
import type webpack from 'webpack';
interface Watchpack extends EventEmitter {
    _onChange(item: string, mtime: number, file: string, type?: string): void;
    _onRemove(item: string, file: string, type?: string): void;
}
declare type Watch = webpack.Compiler['watchFileSystem']['watch'];
interface WatchFileSystem {
    watcher?: Watchpack;
    wfs?: {
        watcher: Watchpack;
    };
    watch: Watch;
}
export { WatchFileSystem, Watchpack };
