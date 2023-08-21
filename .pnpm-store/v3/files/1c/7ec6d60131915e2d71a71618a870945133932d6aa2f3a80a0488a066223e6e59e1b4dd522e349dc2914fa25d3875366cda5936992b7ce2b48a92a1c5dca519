"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMatch = isMatch;
exports.excludeToPkgs = excludeToPkgs;
exports.es5ImcompatibleVersionsToPkg = es5ImcompatibleVersionsToPkg;
exports.TYPE_ALL_EXCLUDE = void 0;

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
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _pkgUpContainName = require("./pkgUpContainName");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const pkgPathCache = {};
const pkgCache = {}; // type 为 all 时以下依赖不走 babel 编译

const TYPE_ALL_EXCLUDE = ['@ant-design/icons', '@ant-design/icons-svg', '@babel/runtime', 'bizcharts', 'core-js', 'echarts', 'lodash', 'react', 'react-dom']; // 参考：
// https://github.com/umijs/umi/blob/2.x/packages/af-webpack/src/getWebpackConfig/es5ImcompatibleVersions.js

exports.TYPE_ALL_EXCLUDE = TYPE_ALL_EXCLUDE;

function isMatch(opts) {
  const pkgPath = getPkgPath(opts); // 可能没有 package.json

  if (!pkgPath) return false;
  if (pkgPath in pkgCache) return pkgCache[pkgPath];

  const _require = require(pkgPath),
        name = _require.name,
        version = _require.version; // eslint-disable-line


  if (opts.pkgs[name]) {
    pkgCache[pkgPath] = opts.pkgs[name].some(v => {
      return _utils().semver.satisfies(version, v);
    });
  } else {
    pkgCache[pkgPath] = false;
  }

  return pkgCache[pkgPath];
}

function getPkgPath(opts) {
  const dir = (0, _path().dirname)(opts.path);
  if (dir in pkgPathCache) return pkgPathCache[dir];
  pkgPathCache[dir] = (0, _pkgUpContainName.pkgUpContainName)(opts.path);
  return pkgPathCache[dir];
}

function excludeToPkgs(opts) {
  return opts.exclude.reduce((memo, exclude) => {
    const _excludeToPkg = excludeToPkg({
      exclude
    }),
          name = _excludeToPkg.name,
          versions = _excludeToPkg.versions;

    memo[name] = versions;
    return memo;
  }, {});
}

function excludeToPkg(opts) {
  let firstAt = '';
  let left = opts.exclude;

  if (left.charAt(0) === '@') {
    firstAt = '@';
    left = left.slice(1);
  }

  let _left$split = left.split('@'),
      _left$split2 = _slicedToArray(_left$split, 2),
      name = _left$split2[0],
      version = _left$split2[1];

  name = `${firstAt}${name}`;

  if (!version) {
    version = '*';
  }

  return {
    name,
    versions: [version]
  };
}

function es5ImcompatibleVersionsToPkg() {
  const _require2 = require('es5-imcompatible-versions/package.json'),
        config = _require2.config['es5-imcompatible-versions'];

  return Object.keys(config).reduce((memo, key) => {
    memo[key] = Object.keys(config[key]);
    return memo;
  }, {});
}