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
var _moduleResolver = require("../../utils/moduleResolver");
var _getHostPkgAlias = _interopRequireDefault(require("../../utils/getHostPkgAlias"));
var _symlink = _interopRequireDefault(require("../../utils/symlink"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * plugin for create node_modules symlink & webpack alias for local packages
 */
var _default = api => {
  // set to umi to be able to use @umijs/preset-dumi alone
  api.chainWebpack(config => {
    config.resolve.alias.set('dumi', process.env.UMI_DIR);
    return config;
  });
  // only apply symlinks for non-integrated mode
  if (_context.default.opts.isIntegrate) return;
  const hostPkgAlias = (0, _getHostPkgAlias.default)(api.paths).filter(([pkgName]) => pkgName);
  /* istanbul ignore if */
  if (hostPkgAlias.length === 1 && hostPkgAlias[0][0] === 'dumi') {
    // exit if this project called dumi, will cause import x from 'dumi' not work
    api.logger.error('[dumi]: cannot start, detected this project is named \'dumi\', please rename it in package.json file.');
    process.exit(1);
  }
  // create symlink for packages
  hostPkgAlias.forEach(([pkgName, pkgPath]) => {
    const linkPath = _path().default.join(api.paths.cwd, 'node_modules', pkgName);
    // link current pkgs into node_modules, for module resolve in editor
    if (!_fs().default.existsSync(linkPath) || _fs().default.lstatSync(linkPath).isSymbolicLink() && _path().default.resolve(_path().default.dirname(linkPath), _fs().default.readlinkSync(linkPath)) !== pkgPath) {
      api.utils.rimraf.sync(linkPath);
      (0, _symlink.default)(pkgPath, linkPath);
    }
  });
  // create webpack alias to src directory for packages
  api.chainWebpack(config => {
    hostPkgAlias.forEach(([pkgName, pkgPath]) => {
      let srcModule;
      const srcPath = _path().default.join(pkgPath, 'src');
      try {
        srcModule = (0, _moduleResolver.getModuleResolvePath)({
          basePath: pkgPath,
          sourcePath: './src/index',
          silent: true
        });
      } catch (err) {/* nothing */}
      // use src path instead of main field in package.json if exists
      if (srcModule) {
        // exclude es & lib folder
        if (!config.resolve.alias.has(`${pkgName}/es`)) {
          config.resolve.alias.set(`${pkgName}/es`, srcPath);
        }
        if (!config.resolve.alias.has(`${pkgName}/lib`)) {
          config.resolve.alias.set(`${pkgName}/lib`, srcPath);
        }
        if (!config.resolve.alias.has(pkgName)) {
          config.resolve.alias.set(`${pkgName}/src`, srcPath);
          config.resolve.alias.set(pkgName, srcPath);
        }
      } else if (!config.resolve.alias.has(pkgName)) {
        config.resolve.alias.set(pkgName, pkgPath);
      }
    });
    return config;
  });
};
exports.default = _default;