"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

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

  add(filePath, value) {
    this.cache[filePath] = {
      updatedTime: _fs().default.lstatSync(filePath).mtimeMs,
      value
    };
  }

  get(filePath) {
    var _this$cache$filePath;

    let result;

    if (filePath && _fs().default.lstatSync(filePath).mtimeMs === ((_this$cache$filePath = this.cache[filePath]) === null || _this$cache$filePath === void 0 ? void 0 : _this$cache$filePath.updatedTime)) {
      result = this.cache[filePath].value;
    }

    return result;
  }

}

exports.default = FileCache;