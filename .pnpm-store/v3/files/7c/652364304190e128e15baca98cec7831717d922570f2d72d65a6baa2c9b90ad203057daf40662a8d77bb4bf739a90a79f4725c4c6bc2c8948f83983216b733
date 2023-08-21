"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAliasedDep = getAliasedDep;
exports.getDepVersion = getDepVersion;

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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
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

function isJSFile(path) {
  return ['.js', '.jsx', '.ts', '.tsx'].includes((0, _path().extname)(path));
}

function addLastSlash(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

function getAliasedDep(opts) {
  let dep = opts.dep;
  const webpackAlias = opts.webpackAlias || {};

  for (var _i = 0, _Object$keys = Object.keys(webpackAlias); _i < _Object$keys.length; _i++) {
    const key = _Object$keys[_i];
    // Support config.resolve.alias.xyz$
    // https://webpack.docschina.org/configuration/resolve/
    const isStrict = key.endsWith('$');
    const strictKey = isStrict ? key.slice(0, -1) : key;
    const value = webpackAlias[key];

    if (isJSFile(value)) {
      if (dep === strictKey) {
        dep = value;
        break;
      }
    } else {
      if (dep === strictKey) {
        dep = value;
        break;
      } else if (isStrict) {
        continue;
      }

      const slashedKey = addLastSlash(strictKey);

      if (dep.startsWith(slashedKey)) {
        dep = dep.replace(new RegExp(`^${slashedKey}`), addLastSlash(value));
        break;
      }
    }
  }

  return dep;
}

function getDepVersion(opts) {
  const originDep = opts.dep;
  let version = '*';
  const dep = getAliasedDep(opts); // absolute

  if ((0, _path().isAbsolute)(dep)) {
    let tmpDep = dep;
    let tmpVersion;
    let count = 0; // Fix invalid package.json
    // ref: https://unpkg.alibaba-inc.com/browse/@babel/runtime@7.14.6/helpers/esm/package.json

    while (!tmpVersion && count <= 10) {
      const pkg = _utils().pkgUp.sync({
        cwd: tmpDep
      });

      (0, _assert().default)(pkg, `[MFSU] package.json not found for dep ${originDep} which is imported from ${opts.from}`);
      tmpVersion = require(pkg).version;
      tmpDep = (0, _path().dirname)((0, _path().dirname)(pkg));
      count += 1;
    }

    (0, _assert().default)(count !== 10, `[MFSU] infinite loop when finding version for dep ${originDep} which is imported from ${opts.from}`);
    version = tmpVersion; // @ts-ignore
  } else if (!!process.binding('natives')[dep]) {
    // native module 功能稳定，不需要更新
    version = '*';
  } else {
    const pkg = _utils().pkgUp.sync({
      cwd: (0, _path().join)(opts.cwd, 'node_modules', dep)
    });

    (0, _assert().default)(pkg, `[MFSU] package.json not found for dep ${originDep} which is imported from ${opts.from}`);
    (0, _assert().default)((0, _utils().winPath)(pkg) !== (0, _utils().winPath)((0, _path().join)(opts.cwd, 'package.json')), `[MFSU] package.json not found for dep ${originDep} which is imported from ${opts.from}`);
    version = require(pkg).version;
  }

  return version;
}