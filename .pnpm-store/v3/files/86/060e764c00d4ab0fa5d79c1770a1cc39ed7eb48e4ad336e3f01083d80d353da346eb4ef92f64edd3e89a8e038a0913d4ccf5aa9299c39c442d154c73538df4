"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuntimePublicPathPlugin = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _webpackSources() {
  const data = require("@umijs/deps/compiled/webpack-sources2");

  _webpackSources = function _webpackSources() {
    return data;
  };

  return data;
}

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
class RuntimePublicPathPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap('RuntimePublicPathPlugin', compilation => {
      // @ts-ignore
      compilation.hooks.processAssets.tap('RuntimePublicPathPlugin', () => {
        const s = compilation.getAsset(`${_constants.MF_VA_PREFIX}remoteEntry.js`);

        if (s) {
          compilation.updateAsset(`${_constants.MF_VA_PREFIX}remoteEntry.js`, () => {
            return new (_webpackSources().RawSource)(s.source.source().toString().replace(`__webpack_require__.p = "/";`, `__webpack_require__.p = window.publicPath;`));
          });
        }
      });
    });
  }

}

exports.RuntimePublicPathPlugin = RuntimePublicPathPlugin;