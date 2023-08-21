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
      CallExpression(path) {
        const node = path.node;

        if (_utils().t.isIdentifier(node.callee, {
          name: 'require'
        })) {
          if (_utils().t.isStringLiteral(node.arguments[0])) {
            const val = node.arguments[0].value; // ./core/routes 在 .umi/umi.ts 里通过 hmr 使用，是正常的
            // @babel/runtime 在 .umi/dumi/demos/index.ts 里有使用

            if (val !== './core/routes' && !val.includes('@babel/runtime')) {
              console.warn(_utils().chalk.yellow( // @ts-ignore
              `[MFSU] require('${val}') found in ${path.hub.file.opts.filename}, which will broken the MFSU prebuild match, please change to esm module import.`));
            }
          } else {
            console.warn(_utils().chalk.yellow( // @ts-ignore
            `[MFSU] require() syntax found in ${path.hub.file.opts.filename}, which will broken the MFSU prebuild match, please change to esm module import.`));
          }
        }
      }

    }
  };
}