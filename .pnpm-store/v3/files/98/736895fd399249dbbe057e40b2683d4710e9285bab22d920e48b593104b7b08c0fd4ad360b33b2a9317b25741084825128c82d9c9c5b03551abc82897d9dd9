"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matchAll = exports.figureOutExport = exports.copy = void 0;

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

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path2() {
  const data = require("path");

  _path2 = function _path2() {
    return data;
  };

  return data;
}

var _getDepReExportContent = require("./getDepReExportContent");

var _getFilePath = require("./getFilePath");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const copy = (fromDir, toDir) => {
  try {
    const fn = (dir, preserveDir) => {
      const _dir = (0, _fs().readdirSync)(dir);

      _dir.forEach(value => {
        const _path = (0, _path2().join)(dir, value);

        const stat = (0, _fs().statSync)(_path);

        if (stat.isDirectory()) {
          const _toDir = (0, _path2().join)(toDir, preserveDir, value);

          if (!(0, _fs().existsSync)(_toDir)) {
            (0, _fs().mkdirSync)(_toDir);
          }

          fn(_path, (0, _path2().join)(preserveDir, value));
        } else {
          const toDest = (0, _path2().join)(toDir, preserveDir);
          (0, _fs().copyFileSync)(_path, (0, _path2().join)(toDest, value));
        }
      });
    };

    fn(fromDir, '');
  } catch (error) {
    throw error;
  }
};

exports.copy = copy;

const figureOutExport = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (cwd, importFrom, ignoreNodeBuiltInModules) {
    const absImportFrom = (0, _path2().isAbsolute)(importFrom) ? importFrom : (0, _path2().join)((0, _getFilePath.getProperCwd)(cwd), 'node_modules', importFrom);
    const filePath = (0, _getFilePath.getFilePath)(absImportFrom); // @ts-ignore

    const isNodeBuiltinModule = !!process.binding('natives')[importFrom]; // useful while running with target = electron-renderer

    if (isNodeBuiltinModule) {
      if (ignoreNodeBuiltInModules) {
        return `
const _ = require('${importFrom}');
module.exports = _;
      `;
      } else {
        return [`import _ from '${importFrom}';`, `export default _;`, `export * from '${importFrom}';`].join('\n');
      }
    }

    (0, _assert().default)(filePath, `filePath not found of ${importFrom}`);
    const content = (0, _fs().readFileSync)(filePath, 'utf-8');
    return (0, _getDepReExportContent.getDepReExportContent)({
      content,
      filePath,
      importFrom: (0, _utils().winPath)(importFrom)
    });
  });

  return function figureOutExport(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.figureOutExport = figureOutExport;

const matchAll = (regexp, str) => {
  const result = [];
  let match;

  while ((match = regexp.exec(str)) !== null) {
    result.push(match);
  }

  return result;
};

exports.matchAll = matchAll;