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
function findSandboxFiles(modules, directories, currentDir, path) {
    if (path === void 0) { path = ""; }
    var result = {};
    var modulesInDirectory = modules.filter(function (m) { return m.directoryShortid === currentDir; });
    modulesInDirectory.forEach(function (m) {
        var newPath = path_1.join(path, m.title);
        result[newPath] = { content: m.code || "", isBinary: m.isBinary };
    });
    var childrenFiles = directories
        .filter(function (d) { return d.directoryShortid === currentDir; })
        .forEach(function (dir) {
        var newPath = path_1.join(path, dir.title);
        var dirResult = findSandboxFiles(modules, directories, dir.shortid, newPath);
        result = __assign(__assign({}, result), dirResult);
    });
    return result;
}
function normalizeSandboxFiles(modules, directories) {
    return findSandboxFiles(modules, directories, null);
}
exports.default = normalizeSandboxFiles;
//# sourceMappingURL=normalize.js.map