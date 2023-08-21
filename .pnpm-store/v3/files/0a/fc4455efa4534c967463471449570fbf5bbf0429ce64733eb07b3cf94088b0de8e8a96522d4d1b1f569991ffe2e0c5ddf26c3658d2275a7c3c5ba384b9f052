"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenFileOnceChange = exports.closeFileWatcher = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isDev = () => process.env.NODE_ENV === 'development' || process.env.TEST_WATCHER;
const watchers = {};
const closeFileWatcher = filePath => {
  // close & remove listeners
  watchers[filePath].watcher.close();
  watchers[filePath] = null;
};
exports.closeFileWatcher = closeFileWatcher;
const listenFileOnceChange = (filePath, listener) => {
  if (isDev()) {
    watchers[filePath] = watchers[filePath] || {
      listeners: [],
      watcher: _fs().default.watch(filePath, (...args) => {
        const listeners = watchers[filePath].listeners;
        // close watcher if change triggered
        closeFileWatcher(filePath);
        listeners.forEach(fn => fn(...args));
      })
    };
    const existingListenerIndex = watchers[filePath].listeners.findIndex(fn => (fn._identifier || listener._identifier) && fn._identifier === listener._identifier);
    if (existingListenerIndex > -1) {
      watchers[filePath].listeners.splice(existingListenerIndex, 1);
    }
    watchers[filePath].listeners.push(listener);
  }
};
exports.listenFileOnceChange = listenFileOnceChange;