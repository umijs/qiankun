"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * generate assets when webpack bundler emit
 */
class AssetWebpackPlugin {
  constructor(assetPaths) {
    this.assetPaths = assetPaths;
    this.assetPaths = assetPaths;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('AssetWebpack', compilation => {
      this.assetPaths.forEach(({
        name,
        path,
        content
      }) => {
        if (!name) {
          return;
        }

        const filePath = path || '';
        const assetContent = (0, _fs().existsSync)(filePath) ? (0, _fs().readFileSync)(filePath, 'utf-8') : content;

        if (assetContent) {
          compilation.assets[name] = {
            source: () => assetContent,
            size: () => assetContent.length
          };
        }
      });
    });
  }

}

exports.default = AssetWebpackPlugin;