"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enable = enable;
exports.onFilesChange = onFilesChange;
exports.startWatcher = startWatcher;
exports.updateExternalDependencies = updateExternalDependencies;
exports.watch = watch;
function _path() {
  const data = require("path");
  _path = function () {
    return data;
  };
  return data;
}
const fileToDeps = new Map();
const depToFiles = new Map();
let isWatchMode = false;
let watcher;
const watchQueue = new Set();
let hasStarted = false;
function enable({
  enableGlobbing
}) {
  isWatchMode = true;
  const {
    FSWatcher
  } = requireChokidar();
  const options = {
    disableGlobbing: !enableGlobbing,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 50,
      pollInterval: 10
    }
  };
  watcher = new FSWatcher(options);
  watcher.on("unlink", unwatchFile);
}
function startWatcher() {
  hasStarted = true;
  for (const dep of watchQueue) {
    watcher.add(dep);
  }
  watchQueue.clear();
  watcher.on("ready", () => {
    console.log("The watcher is ready.");
  });
}
function watch(filename) {
  if (!isWatchMode) {
    throw new Error("Internal Babel error: .watch called when not in watch mode.");
  }
  if (!hasStarted) {
    watchQueue.add(_path().resolve(filename));
  } else {
    watcher.add(_path().resolve(filename));
  }
}
function onFilesChange(callback) {
  if (!isWatchMode) {
    throw new Error("Internal Babel error: .onFilesChange called when not in watch mode.");
  }
  watcher.on("all", (event, filename) => {
    var _depToFiles$get;
    if (event !== "change" && event !== "add") return;
    const absoluteFile = _path().resolve(filename);
    callback([absoluteFile, ...((_depToFiles$get = depToFiles.get(absoluteFile)) != null ? _depToFiles$get : [])], event, absoluteFile);
  });
}
function updateExternalDependencies(filename, dependencies) {
  if (!isWatchMode) return;
  const absFilename = _path().resolve(filename);
  const absDependencies = new Set(Array.from(dependencies, dep => _path().resolve(dep)));
  const deps = fileToDeps.get(absFilename);
  if (deps) {
    for (const dep of deps) {
      if (!absDependencies.has(dep)) {
        removeFileDependency(absFilename, dep);
      }
    }
  }
  for (const dep of absDependencies) {
    let deps = depToFiles.get(dep);
    if (!deps) {
      depToFiles.set(dep, deps = new Set());
      if (!hasStarted) {
        watchQueue.add(dep);
      } else {
        watcher.add(dep);
      }
    }
    deps.add(absFilename);
  }
  fileToDeps.set(absFilename, absDependencies);
}
function removeFileDependency(filename, dep) {
  const deps = depToFiles.get(dep);
  deps.delete(filename);
  if (deps.size === 0) {
    depToFiles.delete(dep);
    if (!hasStarted) {
      watchQueue.delete(dep);
    } else {
      watcher.unwatch(dep);
    }
  }
}
function unwatchFile(filename) {
  const deps = fileToDeps.get(filename);
  if (!deps) return;
  for (const dep of deps) {
    removeFileDependency(filename, dep);
  }
  fileToDeps.delete(filename);
}
function requireChokidar() {
  try {
    return parseInt(process.versions.node) >= 8 ? require("chokidar") : require("@nicolo-ribaudo/chokidar-2");
  } catch (err) {
    console.error("The optional dependency chokidar failed to install and is required for " + "--watch. Chokidar is likely not supported on your platform.");
    throw err;
  }
}

//# sourceMappingURL=watcher.js.map
