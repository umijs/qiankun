"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectoryPaths = void 0;
function getDirectoryPaths(directories) {
    var paths = {};
    var addDirectory = function (prevPath, directoryShortid) {
        var dirs = directories.filter(function (d) { return d.directoryShortid === directoryShortid; });
        dirs.forEach(function (dir) {
            var dirPath = prevPath + "/" + dir.title;
            paths[dirPath] = dir;
            addDirectory(dirPath, dir.shortid);
        });
    };
    directories
        .filter(function (x) { return x.directoryShortid == null; })
        .forEach(function (dir) {
        paths["/" + dir.title] = dir;
        addDirectory("/" + dir.title, dir.shortid);
    });
    return paths;
}
exports.getDirectoryPaths = getDirectoryPaths;
//# sourceMappingURL=resolve.js.map