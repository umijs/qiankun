"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FileCache {
  constructor() {
    this.cache = {};
  }
  add(filePath, value, key) {
    this.cache[key || filePath] = {
      filePath,
      value,
      updatedTime: _fs().default.lstatSync(filePath).mtimeMs
    };
  }
  get(key) {
    let result;
    if (this.cache[key] && _fs().default.lstatSync(this.cache[key].filePath).mtimeMs === this.cache[key].updatedTime) {
      result = this.cache[key].value;
    }
    return result;
  }
}
exports.default = FileCache;