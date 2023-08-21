"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memFileSystem = void 0;
const path_1 = require("path");
const memfs_1 = require("memfs");
const real_file_system_1 = require("./real-file-system");
/**
 * It's an implementation of FileSystem interface which reads and writes to the in-memory file system.
 */
exports.memFileSystem = Object.assign(Object.assign({}, real_file_system_1.realFileSystem), { exists(path) {
        return exists(real_file_system_1.realFileSystem.realPath(path));
    },
    readFile(path, encoding) {
        return readFile(real_file_system_1.realFileSystem.realPath(path), encoding);
    },
    readDir(path) {
        return readDir(real_file_system_1.realFileSystem.realPath(path));
    },
    readStats(path) {
        return readStats(real_file_system_1.realFileSystem.realPath(path));
    },
    writeFile(path, data) {
        writeFile(real_file_system_1.realFileSystem.realPath(path), data);
    },
    deleteFile(path) {
        deleteFile(real_file_system_1.realFileSystem.realPath(path));
    },
    createDir(path) {
        createDir(real_file_system_1.realFileSystem.realPath(path));
    },
    updateTimes(path, atime, mtime) {
        updateTimes(real_file_system_1.realFileSystem.realPath(path), atime, mtime);
    },
    clearCache() {
        real_file_system_1.realFileSystem.clearCache();
    } });
function exists(path) {
    return memfs_1.fs.existsSync(real_file_system_1.realFileSystem.normalizePath(path));
}
function readStats(path) {
    return exists(path) ? memfs_1.fs.statSync(real_file_system_1.realFileSystem.normalizePath(path)) : undefined;
}
function readFile(path, encoding) {
    const stats = readStats(path);
    if (stats && stats.isFile()) {
        return memfs_1.fs
            .readFileSync(real_file_system_1.realFileSystem.normalizePath(path), { encoding: encoding })
            .toString();
    }
}
function readDir(path) {
    const stats = readStats(path);
    if (stats && stats.isDirectory()) {
        return memfs_1.fs.readdirSync(real_file_system_1.realFileSystem.normalizePath(path), {
            withFileTypes: true,
        });
    }
    return [];
}
function createDir(path) {
    memfs_1.fs.mkdirSync(real_file_system_1.realFileSystem.normalizePath(path), { recursive: true });
}
function writeFile(path, data) {
    if (!exists((0, path_1.dirname)(path))) {
        createDir((0, path_1.dirname)(path));
    }
    memfs_1.fs.writeFileSync(real_file_system_1.realFileSystem.normalizePath(path), data);
}
function deleteFile(path) {
    if (exists(path)) {
        memfs_1.fs.unlinkSync(real_file_system_1.realFileSystem.normalizePath(path));
    }
}
function updateTimes(path, atime, mtime) {
    if (exists(path)) {
        memfs_1.fs.utimesSync(real_file_system_1.realFileSystem.normalizePath(path), atime, mtime);
    }
}
