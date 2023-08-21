"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPkgPath = getPkgPath;
exports.shouldTransform = shouldTransform;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

var _pkgUpContainName = require("./pkgUpContainName");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pkgPathCache = {};

function getPkgPath(filePath) {
  const dir = (0, _path().dirname)(filePath);
  if (dir in pkgPathCache) return pkgPathCache[dir];
  pkgPathCache[dir] = (0, _pkgUpContainName.pkgUpContainName)(filePath);
  return pkgPathCache[dir];
}

function shouldTransform(pkgPath, include) {
  const _require = require(pkgPath),
        name = _require.name; // eslint-disable-line


  return name === include;
}