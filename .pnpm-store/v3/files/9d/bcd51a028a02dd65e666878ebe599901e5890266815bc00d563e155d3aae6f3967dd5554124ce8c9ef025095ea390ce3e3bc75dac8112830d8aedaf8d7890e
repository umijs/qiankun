"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CSS_EXT_NAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

function _default() {
  return {
    visitor: {
      ImportDeclaration(path, {
        opts
      }) {
        const _path$node = path.node,
              specifiers = _path$node.specifiers,
              source = _path$node.source,
              value = _path$node.source.value;

        if (specifiers.length && CSS_EXT_NAMES.includes((0, _path().extname)(value))) {
          source.value = `${value}?${opts.flag || 'modules'}`;
        }
      },

      // e.g.
      // const styles = await import('./index.less');
      VariableDeclarator(path, {
        opts
      }) {
        const node = path.node;

        if (_utils().t.isAwaitExpression(node.init) && _utils().t.isCallExpression(node.init.argument) && _utils().t.isImport(node.init.argument.callee) && node.init.argument.arguments.length === 1 && _utils().t.isStringLiteral(node.init.argument.arguments[0]) && CSS_EXT_NAMES.includes((0, _path().extname)(node.init.argument.arguments[0].value))) {
          node.init.argument.arguments[0].value = `${node.init.argument.arguments[0].value}?${opts.flag || 'modules'}`;
        }
      }

    }
  };
}