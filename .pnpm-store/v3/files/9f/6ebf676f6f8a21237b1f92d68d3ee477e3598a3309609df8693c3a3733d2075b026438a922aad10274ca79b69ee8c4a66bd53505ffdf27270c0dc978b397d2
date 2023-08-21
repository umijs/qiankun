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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    visitor: {
      Program(path) {
        let hasExport = false;
        path.node.body.forEach(node => {
          if ( // esm
          _utils().t.isExportNamedDeclaration(node) || _utils().t.isExportDefaultDeclaration(node) || _utils().t.isExportAllDeclaration(node) || // cjs
          _utils().t.isExpressionStatement(node) && _utils().t.isAssignmentExpression(node.expression) && _utils().t.isMemberExpression(node.expression.left) && ( // exports.xxx =
          _utils().t.isIdentifier(node.expression.left.object, {
            name: 'exports'
          }) || // module.exports =
          _utils().t.isIdentifier(node.expression.left.object, {
            name: 'module'
          }) && _utils().t.isIdentifier(node.expression.left.property, {
            name: 'exports'
          }))) {
            hasExport = true;
          }
        });

        if (!hasExport) {
          // console.warn(
          //   chalk.yellow(
          //     // @ts-ignore
          //     `[MFSU] no export found in ${path.hub.file.opts.filename}.`,
          //   ),
          // );
          path.node.body.push(_utils().t.exportNamedDeclaration(_utils().t.variableDeclaration('const', [_utils().t.variableDeclarator(_utils().t.identifier('__mfsu'), _utils().t.numericLiteral(1))])));
        }
      }

    }
  };
}