"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilePath = getFilePath;
exports.getProperCwd = getProperCwd;

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

// similar with resolve.extensions in webpack config
const EXT_NAMES = ['.mjs', '.js', '.jsx', '.ts', '.tsx'];

function getPathWithExt(path) {
  if ((0, _fs().existsSync)(path) && (0, _fs().statSync)(path).isFile()) {
    return path;
  }

  var _iterator = _createForOfIteratorHelper(EXT_NAMES),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const extName = _step.value;
      const newPath = `${path}${extName}`;

      if ((0, _fs().existsSync)(newPath) && (0, _fs().statSync)(newPath).isFile()) {
        return newPath;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return null;
}

function getPathWithPkgJSON(path) {
  // TODO: 这里是否会有 symlink 问题?
  if ((0, _fs().existsSync)(path) && (0, _fs().statSync)(path).isDirectory()) {
    const pkgPath = (0, _path().join)(path, 'package.json');

    if ((0, _fs().existsSync)(pkgPath)) {
      const pkg = JSON.parse((0, _fs().readFileSync)(pkgPath, 'utf-8')); // ref: https://webpack.js.org/configuration/resolve/#resolvemainfields
      // TODO: support browser object
      // ref: https://unpkg.alibaba-inc.com/browse/react-dom@17.0.2/package.json

      const indexTarget = (0, _path().join)(path, 'index.js');
      return pkg.module && (getPathWithExt((0, _path().join)(path, pkg.module)) || getPathWithIndexFile((0, _path().join)(path, pkg.module))) || pkg.main && (getPathWithExt((0, _path().join)(path, pkg.main)) || getPathWithIndexFile((0, _path().join)(path, pkg.main))) || getPathWithExt(indexTarget) || getPathWithIndexFile(indexTarget);
    }
  }

  return null;
}

function getPathWithIndexFile(path) {
  if ((0, _fs().existsSync)(path) && (0, _fs().statSync)(path).isDirectory()) {
    var _iterator2 = _createForOfIteratorHelper(EXT_NAMES),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        const extName = _step2.value;
        const indexFilePath = (0, _path().join)(path, `index${extName}`);

        if ((0, _fs().existsSync)(indexFilePath) && (0, _fs().statSync)(indexFilePath).isFile()) {
          return indexFilePath;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  return null;
}

function getFilePath(path) {
  // 1. 文件存在
  // 2. 加后缀
  const pathWithExt = getPathWithExt(path);

  if (pathWithExt) {
    return (0, _utils().winPath)(pathWithExt);
  } // 3. path + package.json


  const pathWithPkgJSON = getPathWithPkgJSON(path);

  if (pathWithPkgJSON) {
    return (0, _utils().winPath)(pathWithPkgJSON);
  } // 4. path + index.js


  const pathWithIndexFile = getPathWithIndexFile(path);

  if (pathWithIndexFile) {
    return (0, _utils().winPath)(pathWithIndexFile);
  }

  return null;
} // 当 APP_ROOT 有值，但 依赖(package.json) 仍然安装在 process.cwd() 时
// 返回正常可用的 cwd


function getProperCwd(cwd) {
  const rawCwd = process.cwd();
  const pkgLocationWithCwd = (0, _fs().existsSync)((0, _path().join)(cwd, 'package.json'));

  if (pkgLocationWithCwd) {
    return cwd;
  }

  return rawCwd;
}