"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportProps = getExportProps;

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

var _parse = require("../utils/parse");

var _propertyResolver = require("./propertyResolver");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function getExportProps(code) {
  const ast = (0, _parse.parse)(code);
  let props = undefined;

  _utils().traverse.default(ast, {
    Program: {
      enter(path) {
        const node = path.node;
        const defaultExport = findExportDefault(node);
        if (!defaultExport) return;

        if (_utils().t.isIdentifier(defaultExport)) {
          const name = defaultExport.name;
          props = findAssignmentExpressionProps({
            programNode: node,
            name
          });
        } else if (_utils().t.isObjectExpression(defaultExport)) {
          props = (0, _propertyResolver.findObjectMembers)(defaultExport);
        } else if (_utils().t.isArrayExpression(defaultExport)) {
          props = (0, _propertyResolver.findArrayElements)(defaultExport);
        } else {
          const resolver = _propertyResolver.NODE_RESOLVERS.find(resolver => resolver.is(defaultExport));

          if (resolver) {
            props = resolver.get(defaultExport);
          }
        }
      }

    }
  });

  return props;
}

function findExportDefault(programNode) {
  var _iterator = _createForOfIteratorHelper(programNode.body),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      const n = _step.value;

      if (_utils().t.isExportDefaultDeclaration(n)) {
        return n.declaration;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return null;
}

function findAssignmentExpressionProps(opts) {
  const props = {};

  var _iterator2 = _createForOfIteratorHelper(opts.programNode.body),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      const n = _step2.value;
      let node = n;

      if (_utils().t.isExpressionStatement(node)) {
        node = node.expression;
      }

      if (_utils().t.isAssignmentExpression(node) && _utils().t.isMemberExpression(node.left) && _utils().t.isIdentifier(node.left.object) && node.left.object.name === opts.name) {
        const resolver = _propertyResolver.NODE_RESOLVERS.find(resolver => resolver.is(_utils().t.isAssignmentExpression(node) && node.right));

        if (resolver) {
          props[node.left.property.name] = resolver.get(node.right);
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return props;
}