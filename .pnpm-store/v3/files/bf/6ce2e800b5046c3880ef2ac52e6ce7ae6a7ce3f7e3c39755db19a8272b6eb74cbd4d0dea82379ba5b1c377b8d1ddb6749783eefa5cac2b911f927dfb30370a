"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
var _context = _interopRequireDefault(require("../../context"));
var _getRouteConfig = _interopRequireDefault(require("../../routes/getRouteConfig"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _default = api => {
  const assetsPkg = {
    name: api.userConfig.title || api.pkg.name,
    package: api.pkg.name,
    logo: api.userConfig.logo,
    assets: {
      atoms: [],
      examples: []
    }
  };
  /**
   * register dumi assets command
   */
  api.registerCommand({
    name: 'assets',
    fn({
      args
    }) {
      return _asyncToGenerator(function* () {
        const assetsOutputPath = _path().default.resolve(api.paths.cwd, args._[0] || 'assets.json');
        const fileName = _path().default.parse(assetsOutputPath).base;
        api.logger.log(`Start to generate ${fileName}...`);
        yield (0, _getRouteConfig.default)(api, _context.default.opts);
        const finalPkg = yield api.applyPlugins({
          key: 'dumi.modifyAssetsMeta',
          type: api.ApplyPluginsType.modify,
          initialValue: assetsPkg
        });
        // remove useless _sourcePath field in remark/meta.ts
        finalPkg.assets.atoms.forEach(atom => {
          // @ts-ignore
          delete atom._sourcePath;
        });
        _fs().default.writeFileSync(assetsOutputPath, JSON.stringify(finalPkg, null, 2));
        api.logger.log(`Generate ${fileName} successfully!`);
      })();
    }
  });
  api.register({
    key: 'dumi.detectCodeBlock',
    fn(block) {
      if (block.identifier) {
        const pos = assetsPkg.assets.examples.findIndex(b => b.identifier === block.identifier);
        if (pos > -1) {
          assetsPkg.assets.examples.splice(pos, 1, block);
        } else {
          assetsPkg.assets.examples.push(block);
        }
      }
    }
  });
  api.register({
    key: 'dumi.detectAtomAsset',
    fn(atom) {
      const pos = assetsPkg.assets.atoms.findIndex(a => a.identifier === atom.identifier);
      if (pos > -1) {
        assetsPkg.assets.atoms.splice(pos, 1, atom);
      } else {
        assetsPkg.assets.atoms.push(atom);
      }
    }
  });
};
exports.default = _default;