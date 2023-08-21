"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackageInfo = exports.getModuleResolvePkg = exports.getModuleResolvePath = exports.getModuleResolveContent = exports.getHostPkgPath = exports.getHostModuleResolvePkg = void 0;
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
function _slash() {
  const data = _interopRequireDefault(require("slash2"));
  _slash = function _slash() {
    return data;
  };
  return data;
}
function _enhancedResolve() {
  const data = _interopRequireDefault(require("enhanced-resolve"));
  _enhancedResolve = function _enhancedResolve() {
    return data;
  };
  return data;
}
var _getHostPkgAlias = _interopRequireDefault(require("./getHostPkgAlias"));
var _context = _interopRequireDefault(require("../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_EXT = ['.tsx', '.jsx', '.js', '.ts'];
/**
 * get package related paths from source path
 * @param identifier  module path, such as dumi/lib/a.js or /path/to/node_modules/dumi/lib/a.js
 */
const getPkgPathsFromPath = identifier => {
  const matches = identifier.match(/^(.*node_modules)\/((?:@[^/]+\/)?[^/]+)/) || [];
  return {
    absSourcePath: identifier,
    absPkgModulePath: matches[0],
    absNodeModulesPath: matches[1],
    pkgName: matches[2]
  };
};
/**
 * get package root path if it is a local package
 * @param pkg   package name
 */
const getHostPkgPath = (() => {
  let cache;
  return pkg => {
    var _cache$find;
    if (!cache) {
      var _ctx$umi;
      cache = (0, _getHostPkgAlias.default)((_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : _ctx$umi.paths);
    }
    return (_cache$find = cache.find(([name]) => name === pkg)) === null || _cache$find === void 0 ? void 0 : _cache$find[1];
  };
})();
/**
 * resolve module path base on umi context (alias)
 */
exports.getHostPkgPath = getHostPkgPath;
const getModuleResolvePath = ({
  basePath,
  sourcePath,
  extensions = DEFAULT_EXT,
  silent
}) => {
  // treat local packages as 3rd-party module for collect as dependencies
  if (/^[a-z]@/.test(sourcePath) && getHostPkgPath(getPkgPathsFromPath(sourcePath).pkgName)) {
    return (0, _slash().default)(_path().default.join(_context.default.umi.paths.absNodeModulesPath, sourcePath));
  }
  try {
    var _ctx$umi2, _ctx$umi2$config;
    return (0, _slash().default)(_enhancedResolve().default.create.sync({
      extensions,
      alias: (_ctx$umi2 = _context.default.umi) === null || _ctx$umi2 === void 0 ? void 0 : (_ctx$umi2$config = _ctx$umi2.config) === null || _ctx$umi2$config === void 0 ? void 0 : _ctx$umi2$config.alias,
      symlinks: false,
      mainFiles: ['index', 'package.json']
    })(_fs().default.statSync(basePath).isDirectory() ? basePath : _path().default.parse(basePath).dir, sourcePath));
  } catch (err) {
    if (!silent) {
      var _ctx$umi3;
      (_ctx$umi3 = _context.default.umi) === null || _ctx$umi3 === void 0 ? void 0 : _ctx$umi3.logger.error(`[dumi]: cannot resolve module ${sourcePath} from ${basePath}`);
    }
    throw err;
  }
};
/**
 * get package info by modulePath
 */
exports.getModuleResolvePath = getModuleResolvePath;
const getPackageInfo = modulePath => {
  let version;
  let name;
  let peerDependencies;
  const pkgPath = _path().default.join(modulePath, 'package.json');
  if (modulePath && _fs().default.existsSync(pkgPath)) {
    const pkg = require(pkgPath);
    version = pkg.version;
    name = pkg.name;
    peerDependencies = pkg.peerDependencies;
  } else {
    var _ctx$umi4;
    (_ctx$umi4 = _context.default.umi) === null || _ctx$umi4 === void 0 ? void 0 : _ctx$umi4.logger.error(`[dumi]: cannot find valid package.json for module ${modulePath}`);
  }
  return {
    name,
    version,
    peerDependencies
  };
};
/**
 * resolve module version
 */
exports.getPackageInfo = getPackageInfo;
const getModuleResolvePkg = ({
  basePath,
  sourcePath,
  extensions = DEFAULT_EXT
}) => {
  const resolvePath = getModuleResolvePath({
    basePath,
    sourcePath,
    extensions
  });
  const _getPkgPathsFromPath = getPkgPathsFromPath(resolvePath),
    pkgName = _getPkgPathsFromPath.pkgName,
    absPkgModulePath = _getPkgPathsFromPath.absPkgModulePath;
  // use project path as module path for local packages
  const modulePath = getHostPkgPath(pkgName) || absPkgModulePath;
  return getPackageInfo(modulePath);
};
/**
 * resolve module content
 */
exports.getModuleResolvePkg = getModuleResolvePkg;
const getModuleResolveContent = ({
  basePath,
  sourcePath,
  extensions = DEFAULT_EXT
}) => {
  const resolvePath = getModuleResolvePath({
    basePath,
    sourcePath,
    extensions
  });
  return resolvePath ? _fs().default.readFileSync(resolvePath, 'utf8').toString() : '';
};
/**
 * resolve host module version
 */
exports.getModuleResolveContent = getModuleResolveContent;
const getHostModuleResolvePkg = requireStr => {
  return getPackageInfo(getHostPkgPath(requireStr));
};
exports.getHostModuleResolvePkg = getHostModuleResolvePkg;