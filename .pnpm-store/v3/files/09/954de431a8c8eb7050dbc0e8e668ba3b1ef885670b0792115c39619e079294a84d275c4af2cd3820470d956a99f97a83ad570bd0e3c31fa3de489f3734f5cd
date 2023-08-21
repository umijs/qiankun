"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseRequireDeps;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _crequire() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/crequire"));

  _crequire = function _crequire() {
    return data;
  };

  return data;
}

function _lodash() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/lodash"));

  _lodash = function _lodash() {
    return data;
  };

  return data;
}

function _resolve() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/resolve"));

  _resolve = function _resolve() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _winPath = _interopRequireDefault(require("../winPath/winPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
// @ts-ignore
// @ts-ignore
function parse(filePath) {
  const content = (0, _fs().readFileSync)(filePath, 'utf-8');
  return (0, _crequire().default)(content).map(o => o.path).filter(path => path.charAt(0) === '.').map(path => (0, _winPath.default)(_resolve().default.sync(path, {
    basedir: (0, _path().dirname)(filePath),
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  })));
}

function parseRequireDeps(filePath) {
  const paths = [filePath];
  const ret = [(0, _winPath.default)(filePath)];

  while (paths.length) {
    // 避免依赖循环
    const extraPaths = _lodash().default.pullAll(parse(paths.shift()), ret);

    if (extraPaths.length) {
      paths.push(...extraPaths);
      ret.push(...extraPaths);
    }
  }

  return ret;
}