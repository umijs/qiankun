"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.system = void 0;
const path_1 = require("path");
const forward_slash_1 = require("../../../utils/path/forward-slash");
const mem_file_system_1 = require("./file-system/mem-file-system");
const passive_file_system_1 = require("./file-system/passive-file-system");
const real_file_system_1 = require("./file-system/real-file-system");
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
const mode = worker_config_1.config.mode;
let artifacts = {
    files: [],
    dirs: [],
    excluded: [],
    extensions: [],
};
let isInitialRun = true;
// watchers
const fileWatcherCallbacksMap = new Map();
const directoryWatcherCallbacksMap = new Map();
const recursiveDirectoryWatcherCallbacksMap = new Map();
const deletedFiles = new Map();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const timeoutCallbacks = new Set();
// based on the ts.ignorePaths
const ignoredPaths = ['/node_modules/.', '/.git', '/.#'];
exports.system = Object.assign(Object.assign({}, typescript_1.typescript.sys), { useCaseSensitiveFileNames: true, realpath(path) {
        return getReadFileSystem(path).realPath(path);
    },
    fileExists(path) {
        const stats = getReadFileSystem(path).readStats(path);
        return !!stats && stats.isFile();
    },
    readFile(path, encoding) {
        return getReadFileSystem(path).readFile(path, encoding);
    },
    getFileSize(path) {
        const stats = getReadFileSystem(path).readStats(path);
        return stats ? stats.size : 0;
    },
    writeFile(path, data) {
        getWriteFileSystem(path).writeFile(path, data);
        exports.system.invokeFileChanged(path);
    },
    deleteFile(path) {
        getWriteFileSystem(path).deleteFile(path);
        exports.system.invokeFileDeleted(path);
    },
    directoryExists(path) {
        var _a;
        return Boolean((_a = getReadFileSystem(path).readStats(path)) === null || _a === void 0 ? void 0 : _a.isDirectory());
    },
    createDirectory(path) {
        getWriteFileSystem(path).createDir(path);
        invokeDirectoryWatchers(path);
    },
    getDirectories(path) {
        const dirents = getReadFileSystem(path).readDir(path);
        return dirents
            .filter((dirent) => dirent.isDirectory() ||
            (dirent.isSymbolicLink() && exports.system.directoryExists((0, path_1.join)(path, dirent.name))))
            .map((dirent) => dirent.name);
    },
    getModifiedTime(path) {
        const stats = getReadFileSystem(path).readStats(path);
        if (stats) {
            return stats.mtime;
        }
    },
    setModifiedTime(path, date) {
        getWriteFileSystem(path).updateTimes(path, date, date);
        invokeDirectoryWatchers(path);
        invokeFileWatchers(path, typescript_1.typescript.FileWatcherEventKind.Changed);
    },
    watchFile(path, callback) {
        return createWatcher(fileWatcherCallbacksMap, path, callback);
    },
    watchDirectory(path, callback, recursive = false) {
        return createWatcher(recursive ? recursiveDirectoryWatcherCallbacksMap : directoryWatcherCallbacksMap, path, callback);
    }, 
    // use immediate instead of timeout to avoid waiting 250ms for batching files changes
    setTimeout: (callback, timeout, ...args) => {
        const timeoutId = setImmediate(() => {
            callback(...args);
            timeoutCallbacks.delete(timeoutId);
        });
        timeoutCallbacks.add(timeoutId);
        return timeoutId;
    }, clearTimeout: (timeoutId) => {
        clearImmediate(timeoutId);
        timeoutCallbacks.delete(timeoutId);
    }, waitForQueued() {
        return __awaiter(this, void 0, void 0, function* () {
            while (timeoutCallbacks.size > 0) {
                yield new Promise((resolve) => setImmediate(resolve));
            }
            isInitialRun = false;
        });
    },
    invokeFileCreated(path) {
        const normalizedPath = normalizeAndResolvePath(path);
        invokeFileWatchers(path, typescript_1.typescript.FileWatcherEventKind.Created);
        invokeDirectoryWatchers(normalizedPath);
        deletedFiles.set(normalizedPath, false);
    },
    invokeFileChanged(path) {
        const normalizedPath = normalizeAndResolvePath(path);
        if (deletedFiles.get(normalizedPath) || !fileWatcherCallbacksMap.has(normalizedPath)) {
            invokeFileWatchers(path, typescript_1.typescript.FileWatcherEventKind.Created);
            invokeDirectoryWatchers(normalizedPath);
            deletedFiles.set(normalizedPath, false);
        }
        else {
            invokeFileWatchers(path, typescript_1.typescript.FileWatcherEventKind.Changed);
        }
    },
    invokeFileDeleted(path) {
        const normalizedPath = normalizeAndResolvePath(path);
        if (!deletedFiles.get(normalizedPath)) {
            invokeFileWatchers(path, typescript_1.typescript.FileWatcherEventKind.Deleted);
            invokeDirectoryWatchers(path);
            deletedFiles.set(normalizedPath, true);
        }
    },
    invalidateCache() {
        real_file_system_1.realFileSystem.clearCache();
        mem_file_system_1.memFileSystem.clearCache();
        passive_file_system_1.passiveFileSystem.clearCache();
    },
    setArtifacts(nextArtifacts) {
        artifacts = nextArtifacts;
    } });
function createWatcher(watchersMap, path, callback) {
    const normalizedPath = normalizeAndResolvePath(path);
    const watchers = watchersMap.get(normalizedPath) || [];
    const nextWatchers = [...watchers, callback];
    watchersMap.set(normalizedPath, nextWatchers);
    return {
        close: () => {
            const watchers = watchersMap.get(normalizedPath) || [];
            const nextWatchers = watchers.filter((watcher) => watcher !== callback);
            if (nextWatchers.length > 0) {
                watchersMap.set(normalizedPath, nextWatchers);
            }
            else {
                watchersMap.delete(normalizedPath);
            }
        },
    };
}
function invokeFileWatchers(path, event) {
    const normalizedPath = normalizeAndResolvePath(path);
    if (normalizedPath.endsWith('.js')) {
        // trigger relevant .d.ts file watcher - handles the case, when we have webpack watcher
        // that points to a symlinked package
        invokeFileWatchers(normalizedPath.slice(0, -3) + '.d.ts', event);
    }
    const fileWatcherCallbacks = fileWatcherCallbacksMap.get(normalizedPath);
    if (fileWatcherCallbacks) {
        // typescript expects normalized paths with posix forward slash
        fileWatcherCallbacks.forEach((fileWatcherCallback) => fileWatcherCallback((0, forward_slash_1.forwardSlash)(normalizedPath), event));
    }
}
function invokeDirectoryWatchers(path) {
    const normalizedPath = normalizeAndResolvePath(path);
    const directory = (0, path_1.dirname)(normalizedPath);
    if (ignoredPaths.some((ignoredPath) => (0, forward_slash_1.forwardSlash)(normalizedPath).includes(ignoredPath))) {
        return;
    }
    const directoryWatcherCallbacks = directoryWatcherCallbacksMap.get(directory);
    if (directoryWatcherCallbacks) {
        directoryWatcherCallbacks.forEach((directoryWatcherCallback) => directoryWatcherCallback((0, forward_slash_1.forwardSlash)(normalizedPath)));
    }
    recursiveDirectoryWatcherCallbacksMap.forEach((recursiveDirectoryWatcherCallbacks, watchedDirectory) => {
        if (watchedDirectory === directory ||
            (directory.startsWith(watchedDirectory) &&
                (0, forward_slash_1.forwardSlash)(directory)[watchedDirectory.length] === '/')) {
            recursiveDirectoryWatcherCallbacks.forEach((recursiveDirectoryWatcherCallback) => recursiveDirectoryWatcherCallback((0, forward_slash_1.forwardSlash)(normalizedPath)));
        }
    });
}
function normalizeAndResolvePath(path) {
    let normalizedPath = real_file_system_1.realFileSystem.normalizePath(path);
    try {
        normalizedPath = real_file_system_1.realFileSystem.realPath(normalizedPath);
    }
    catch (error) {
        // ignore error - maybe file doesn't exist
    }
    return normalizedPath;
}
function isArtifact(path) {
    return ((artifacts.dirs.some((dir) => path.includes(dir)) ||
        artifacts.files.some((file) => path === file)) &&
        artifacts.extensions.some((extension) => path.endsWith(extension)));
}
function getReadFileSystem(path) {
    if ((mode === 'readonly' || mode === 'write-tsbuildinfo') && isArtifact(path)) {
        if (isInitialRun && !mem_file_system_1.memFileSystem.exists(path) && passive_file_system_1.passiveFileSystem.exists(path)) {
            // copy file to memory on initial run
            const stats = passive_file_system_1.passiveFileSystem.readStats(path);
            if (stats === null || stats === void 0 ? void 0 : stats.isFile()) {
                const content = passive_file_system_1.passiveFileSystem.readFile(path);
                if (content) {
                    mem_file_system_1.memFileSystem.writeFile(path, content);
                    mem_file_system_1.memFileSystem.updateTimes(path, stats.atime, stats.mtime);
                }
            }
            return mem_file_system_1.memFileSystem;
        }
    }
    return passive_file_system_1.passiveFileSystem;
}
function getWriteFileSystem(path) {
    if (mode === 'write-references' ||
        (mode === 'write-tsbuildinfo' && path.endsWith('.tsbuildinfo')) ||
        (mode === 'write-dts' &&
            ['.tsbuildinfo', '.d.ts', '.d.ts.map'].some((suffix) => path.endsWith(suffix)))) {
        return real_file_system_1.realFileSystem;
    }
    return passive_file_system_1.passiveFileSystem;
}
