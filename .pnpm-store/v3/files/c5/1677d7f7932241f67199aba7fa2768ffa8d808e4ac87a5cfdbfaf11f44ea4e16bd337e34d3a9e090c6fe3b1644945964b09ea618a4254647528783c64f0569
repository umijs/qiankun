"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findModuleById = findModuleById;
exports.evalModuleCode = evalModuleCode;
exports.compareModulesByIdentifier = compareModulesByIdentifier;
exports.MODULE_TYPE = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _module() {
  const data = _interopRequireDefault(require("module"));

  _module = function _module() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

const MODULE_TYPE = 'css/mini-extract';
exports.MODULE_TYPE = MODULE_TYPE;

function findModuleById(compilation, id) {
  const modules = compilation.modules,
        chunkGraph = compilation.chunkGraph;

  var _iterator = _createForOfIteratorHelper(modules),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const module = _step.value;
      const moduleId = typeof chunkGraph !== 'undefined' ? chunkGraph.getModuleId(module) : module.id;

      if (moduleId === id) {
        return module;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return null;
}

function evalModuleCode(loaderContext, code, filename) {
  const module = new (_module().default)(filename, loaderContext);
  module.paths = _module().default._nodeModulePaths(loaderContext.context); // eslint-disable-line no-underscore-dangle

  module.filename = filename;

  module._compile(code, filename); // eslint-disable-line no-underscore-dangle


  return module.exports;
}

function compareIds(a, b) {
  if (typeof a !== typeof b) {
    return typeof a < typeof b ? -1 : 1;
  }

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

function compareModulesByIdentifier(a, b) {
  return compareIds(a.identifier(), b.identifier());
}