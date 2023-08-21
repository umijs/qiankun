"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getServicePaths;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDirectoryAndExist(path) {
  return (0, _fs().existsSync)(path) && (0, _fs().statSync)(path).isDirectory();
}

function normalizeWithWinPath(obj) {
  return _utils().lodash.mapValues(obj, value => (0, _utils().winPath)(value));
}

function getServicePaths({
  cwd,
  config,
  env
}) {
  let absSrcPath = cwd;

  if (isDirectoryAndExist((0, _path().join)(cwd, 'src'))) {
    absSrcPath = (0, _path().join)(cwd, 'src');
  }

  const absPagesPath = config.singular ? (0, _path().join)(absSrcPath, 'page') : (0, _path().join)(absSrcPath, 'pages');
  const tmpDir = ['.umi', env !== 'development' && env].filter(Boolean).join('-');
  return normalizeWithWinPath({
    cwd,
    absNodeModulesPath: (0, _path().join)(cwd, 'node_modules'),
    absOutputPath: (0, _path().join)(cwd, config.outputPath || './dist'),
    absSrcPath,
    absPagesPath,
    absTmpPath: (0, _path().join)(absSrcPath, tmpDir)
  });
}