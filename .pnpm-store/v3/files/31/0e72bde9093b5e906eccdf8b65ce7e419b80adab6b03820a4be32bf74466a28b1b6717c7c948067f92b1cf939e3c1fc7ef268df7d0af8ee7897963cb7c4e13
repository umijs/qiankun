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
function _slash() {
  const data = _interopRequireDefault(require("slash2"));
  _slash = function _slash() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Umi process route component from pages path but dumi process with cwd, so the path need to be converted
 */
var relative = function relative(routes) {
  return routes.map(route => {
    if (route.component && !_path().default.isAbsolute(route.component)) {
      var _this$umi, _this$umi$config;
      // same as: https://github.com/umijs/umi/blob/ef674b120c9a3188f0167a9fa2211d3cdbf60a21/packages/core/src/Route/Route.ts#L34
      const isConventional = !((_this$umi = this.umi) === null || _this$umi === void 0 ? void 0 : (_this$umi$config = _this$umi.config) === null || _this$umi$config === void 0 ? void 0 : _this$umi$config.routes);
      route.component = (0, _slash().default)(_path().default.relative(
      // ref: https://github.com/umijs/umi/blob/ef674b120c9a3188f0167a9fa2211d3cdbf60a21/packages/core/src/Route/Route.ts#L114
      isConventional ? _path().default.join(this.umi.paths.absTmpPath, 'core') : this.umi.paths.absPagesPath, _path().default.join(this.umi.paths.cwd, route.component)));
    }
    return route;
  });
};
exports.default = relative;