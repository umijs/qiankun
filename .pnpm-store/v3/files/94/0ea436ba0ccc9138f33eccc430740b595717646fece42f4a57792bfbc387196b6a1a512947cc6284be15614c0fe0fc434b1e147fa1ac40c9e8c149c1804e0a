"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var shortid_1 = require("shortid");
var resolve_1 = require("../../create-sandbox/utils/resolve");
function generateSandboxFile(module, path, parentDirectoryShortid) {
    var sandboxFile = {
        shortid: shortid_1.generate(),
        code: module.content,
        directoryShortid: parentDirectoryShortid,
        title: path_1.basename(path),
        uploadId: module.uploadId,
        isBinary: module.isBinary,
        sha: module.sha,
    };
    if ("binaryContent" in module) {
        sandboxFile.binaryContent = module.binaryContent;
    }
    return sandboxFile;
}
function createDirectoryRecursively(path, directories) {
    if (directories[path]) {
        return directories[path];
    }
    var parentDir = path_1.dirname(path);
    // This means root, so create it
    if (parentDir === ".") {
        directories[path] = generateSandboxDirectory(path, undefined);
        return;
    }
    if (!directories[parentDir]) {
        createDirectoryRecursively(parentDir, directories);
    }
    directories[path] = generateSandboxDirectory(path_1.basename(path), directories[parentDir].shortid);
}
function generateSandboxDirectory(title, parentDirectoryShortid) {
    return {
        shortid: shortid_1.generate(),
        directoryShortid: parentDirectoryShortid,
        title: title,
    };
}
function denormalize(paramFiles, existingDirs) {
    if (existingDirs === void 0) { existingDirs = []; }
    var existingDirPathsParams = resolve_1.getDirectoryPaths(existingDirs);
    // Remove all leading slashes
    var existingDirPaths = {};
    Object.keys(existingDirPathsParams).forEach(function (path) {
        existingDirPaths[path.replace(/^\//, "")] = existingDirPathsParams[path];
    });
    var files = {};
    Object.keys(paramFiles).forEach(function (path) {
        files[path.replace(/^\//, "")] = paramFiles[path];
    });
    var directories = new Set();
    Object.keys(files).forEach(function (path) {
        var dir = path_1.dirname(path);
        if (dir !== "." && !existingDirPaths["/" + dir]) {
            directories.add(path_1.dirname(path));
        }
        var file = files[path];
        if (file.type === "directory") {
            directories.add(path);
        }
    });
    var sandboxDirectories = __assign({}, existingDirPaths);
    Array.from(directories).forEach(function (dirPath) {
        createDirectoryRecursively(dirPath, sandboxDirectories);
    });
    var sandboxModules = Object.keys(files)
        .map(function (path) {
        var dir = sandboxDirectories[path_1.dirname(path)];
        var parentShortid = dir ? dir.shortid : undefined;
        var fileOrDirectory = files[path];
        if (fileOrDirectory.type === "directory") {
            return;
        }
        else {
            return generateSandboxFile(fileOrDirectory, path, parentShortid);
        }
    })
        .filter(function (x) { return x !== undefined; });
    var dirs = Object.keys(sandboxDirectories)
        .map(function (s) { return !existingDirPaths[s] && sandboxDirectories[s]; })
        .filter(Boolean);
    return {
        modules: sandboxModules,
        directories: dirs,
    };
}
exports.default = denormalize;
//# sourceMappingURL=denormalize.js.map