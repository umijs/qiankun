"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

var _Plugin = _interopRequireDefault(require("./Plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default({
  types
}) {
  let plugins = null; // Only for test

  global.__clearBabelAntdPlugin = () => {
    plugins = null;
  };

  function applyInstance(method, args, context) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        const plugin = _step.value;

        if (plugin[method]) {
          plugin[method].apply(plugin, [...args, context]);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  const Program = {
    enter(path, {
      opts = {}
    }) {
      // Init plugin instances once.
      if (!plugins) {
        if (Array.isArray(opts)) {
          plugins = opts.map(({
            libraryName,
            libraryDirectory,
            style,
            camel2DashComponentName,
            camel2UnderlineComponentName,
            fileName,
            customName,
            transformToDefaultImport
          }, index) => {
            (0, _assert.default)(libraryName, 'libraryName should be provided');
            return new _Plugin.default(libraryName, libraryDirectory, style, camel2DashComponentName, camel2UnderlineComponentName, fileName, customName, transformToDefaultImport, types, index);
          });
        } else {
          (0, _assert.default)(opts.libraryName, 'libraryName should be provided');
          plugins = [new _Plugin.default(opts.libraryName, opts.libraryDirectory, opts.style, opts.camel2DashComponentName, opts.camel2UnderlineComponentName, opts.fileName, opts.customName, opts.transformToDefaultImport, types)];
        }
      }

      applyInstance('ProgramEnter', arguments, this); // eslint-disable-line
    },

    exit() {
      applyInstance('ProgramExit', arguments, this); // eslint-disable-line
    }

  };
  const methods = ['ImportDeclaration', 'CallExpression', 'MemberExpression', 'Property', 'VariableDeclarator', 'ArrayExpression', 'LogicalExpression', 'ConditionalExpression', 'IfStatement', 'ExpressionStatement', 'ReturnStatement', 'ExportDefaultDeclaration', 'BinaryExpression', 'NewExpression', 'ClassDeclaration'];
  const ret = {
    visitor: {
      Program
    }
  };

  for (var _i = 0; _i < methods.length; _i++) {
    const method = methods[_i];

    ret.visitor[method] = function () {
      // eslint-disable-line
      applyInstance(method, arguments, ret.visitor); // eslint-disable-line
    };
  }

  return ret;
}