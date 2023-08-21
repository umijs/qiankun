"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pkgUpContainName = void 0;

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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * find the closet package.json which contains `name`
 * why not use pkg-up directly? some package (such as htmlparser2@8) put a `package.json` with
 * `{ "type": "module" }` to provide pure esm dist, but it is not the npm `package.json` we want
 */
const pkgUpContainName = dir => {
  let pkgPath = _utils().pkgUp.sync({
    cwd: dir
  });

  if (!pkgPath) return pkgPath;

  const _require = require(pkgPath),
        name = _require.name; // invalid package


  if (!name) {
    return pkgUpContainName(_path().default.resolve(dir, '../..'));
  }

  return pkgPath;
};

exports.pkgUpContainName = pkgUpContainName;