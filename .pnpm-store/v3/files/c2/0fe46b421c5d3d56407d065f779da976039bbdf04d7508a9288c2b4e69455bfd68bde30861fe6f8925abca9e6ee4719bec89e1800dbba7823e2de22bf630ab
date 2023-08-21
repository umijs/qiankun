"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passiveFileSystem = void 0;
const mem_file_system_1 = require("./mem-file-system");
const real_file_system_1 = require("./real-file-system");
/**
 * It's an implementation of FileSystem interface which reads from the real file system, but write to the in-memory file system.
 */
exports.passiveFileSystem = Object.assign(Object.assign({}, mem_file_system_1.memFileSystem), { exists(path) {
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
    realPath(path) {
        return real_file_system_1.realFileSystem.realPath(path);
    },
    clearCache() {
        real_file_system_1.realFileSystem.clearCache();
    } });
function exists(path) {
    return real_file_system_1.realFileSystem.exists(path) || mem_file_system_1.memFileSystem.exists(path);
}
function readFile(path, encoding) {
    const fsStats = real_file_system_1.realFileSystem.readStats(path);
    const memStats = mem_file_system_1.memFileSystem.readStats(path);
    if (fsStats && memStats) {
        return fsStats.mtimeMs > memStats.mtimeMs
            ? real_file_system_1.realFileSystem.readFile(path, encoding)
            : mem_file_system_1.memFileSystem.readFile(path, encoding);
    }
    else if (fsStats) {
        return real_file_system_1.realFileSystem.readFile(path, encoding);
    }
    else if (memStats) {
        return mem_file_system_1.memFileSystem.readFile(path, encoding);
    }
}
function readDir(path) {
    const fsDirents = real_file_system_1.realFileSystem.readDir(path);
    const memDirents = mem_file_system_1.memFileSystem.readDir(path);
    // merge list of dirents from fs and mem
    return fsDirents
        .filter((fsDirent) => !memDirents.some((memDirent) => memDirent.name === fsDirent.name))
        .concat(memDirents);
}
function readStats(path) {
    const fsStats = real_file_system_1.realFileSystem.readStats(path);
    const memStats = mem_file_system_1.memFileSystem.readStats(path);
    if (fsStats && memStats) {
        return fsStats.mtimeMs > memStats.mtimeMs ? fsStats : memStats;
    }
    else if (fsStats) {
        return fsStats;
    }
    else if (memStats) {
        return memStats;
    }
}
