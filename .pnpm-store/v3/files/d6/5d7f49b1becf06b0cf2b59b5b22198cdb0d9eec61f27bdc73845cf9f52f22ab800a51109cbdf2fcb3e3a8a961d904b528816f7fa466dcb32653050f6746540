"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
var _docSideEffectsWebpackPlugin = _interopRequireDefault(require("./docSideEffectsWebpackPlugin"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * plugin for register a webpack plugin, to avoid tree-shaking for .umi directory if package.json has sideEffects: false
 * because dumi may care some umi runtime plugins, such as .umi/plugin-qiankun
 */
var _default = api => {
  api.chainWebpack(memo => {
    memo.plugin('docSideEffects').use(_docSideEffectsWebpackPlugin.default, [{
      sideEffects: [
      // such as src/.umi-production/**
      api.utils.winPath(_path().default.relative(api.cwd, _path().default.join(api.paths.absTmpPath, '**'))),
      // .dumi local theme
      '.dumi/theme/**'],
      pkgPath: _path().default.join(api.cwd, 'package.json')
    }]);
    return memo;
  });
};
exports.default = _default;