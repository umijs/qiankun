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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * webpack plugin for add extra sideEffects item if user configured sideEffects in package.json
 */
class docSideEffectsWebpackPlugin {
  constructor(opts) {
    this.opts = void 0;
    this.opts = opts;
  }
  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(this.constructor.name, normalModuleFactory => {
      normalModuleFactory.hooks.afterResolve.tap(this.constructor.name, data => {
        var _resourceResolveData$;
        // compatible with webpack5 (data.createData) & webpack4 (data)
        const createData = data.createData || data;
        const resourceResolveData = createData.resourceResolveData;
        const sideEffectsFlag = resourceResolveData === null || resourceResolveData === void 0 ? void 0 : (_resourceResolveData$ = resourceResolveData.descriptionFileData) === null || _resourceResolveData$ === void 0 ? void 0 : _resourceResolveData$.sideEffects;
        if (resourceResolveData && (sideEffectsFlag === false || Array.isArray(sideEffectsFlag)) && _path().default.normalize(resourceResolveData.descriptionFilePath) === this.opts.pkgPath) {
          const list = new Set(sideEffectsFlag || []);
          this.opts.sideEffects.forEach(item => list.add(item));
          resourceResolveData.descriptionFileData.sideEffects = Array.from(list);
        }
      });
    });
  }
}
exports.default = docSideEffectsWebpackPlugin;