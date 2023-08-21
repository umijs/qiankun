/// <reference types="node" />
import fs from 'fs';
export interface IWatcherItem {
    listeners?: (((event: string, filename: string) => void) & {
        _identifier?: string;
    })[];
    watcher: fs.FSWatcher;
}
export declare const closeFileWatcher: (filePath: string) => void;
export declare const listenFileOnceChange: (filePath: string, listener: IWatcherItem['listeners'][0]) => void;
