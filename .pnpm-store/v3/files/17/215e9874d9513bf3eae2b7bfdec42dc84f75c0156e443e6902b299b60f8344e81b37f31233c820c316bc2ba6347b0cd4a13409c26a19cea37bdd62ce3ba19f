"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PLAIN_TEXT_EXT = exports.LOCAL_MODULE_EXT = exports.LOCAL_DEP_EXT = void 0;
exports.getCSSForDep = getCSSForDep;
exports.isHostPackage = void 0;
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
function _crypto() {
  const data = _interopRequireDefault(require("crypto"));
  _crypto = function _crypto() {
    return data;
  };
  return data;
}
function babel() {
  const data = _interopRequireWildcard(require("@babel/core"));
  babel = function babel() {
    return data;
  };
  return data;
}
function types() {
  const data = _interopRequireWildcard(require("@babel/types"));
  types = function types() {
    return data;
  };
  return data;
}
function _traverse() {
  const data = _interopRequireDefault(require("@babel/traverse"));
  _traverse = function _traverse() {
    return data;
  };
  return data;
}
var _moduleResolver = require("../../utils/moduleResolver");
var _cache = _interopRequireDefault(require("../../utils/cache"));
var _options = require("./options");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const cachers = {
  file: new _cache.default(),
  content: new _cache.default()
};
const getContentHash = content => {
  const hash = _crypto().default.createHash('sha256');
  hash.update(content);
  return hash.digest('hex');
};
const LOCAL_DEP_EXT = ['.jsx', '.tsx', '.js', '.ts'];
exports.LOCAL_DEP_EXT = LOCAL_DEP_EXT;
const LOCAL_MODULE_EXT = [...LOCAL_DEP_EXT, '.json'];
// local dependency extensions which will be collected
exports.LOCAL_MODULE_EXT = LOCAL_MODULE_EXT;
const PLAIN_TEXT_EXT = [...LOCAL_MODULE_EXT, '.less', '.css', '.scss', '.sass', '.styl'];
exports.PLAIN_TEXT_EXT = PLAIN_TEXT_EXT;
const isHostPackage = packageName => (0, _moduleResolver.getHostPkgPath)(packageName);
exports.isHostPackage = isHostPackage;
function analyzeDeps(raw, {
  isTSX,
  fileAbsPath,
  entryAbsPath,
  files = {}
}) {
  const cacheKey = fileAbsPath.endsWith('.md') ? `${fileAbsPath}-${getContentHash(raw)}` : fileAbsPath;
  const dependencies = {};
  let cache = fileAbsPath && cachers.file.get(fileAbsPath);
  if (!cache) {
    cache = {
      dependencies: [],
      files: []
    };
    // support to pass babel transform result directly
    const _babel$transformSync = babel().transformSync(raw, (0, _options.getBabelOptions)({
        isTSX,
        fileAbsPath,
        transformRuntime: false
      })),
      ast = _babel$transformSync.ast;
    // traverse all require call expression
    (0, _traverse().default)(ast, {
      CallExpression(callPath) {
        const callPathNode = callPath.node;
        // tranverse all require statement
        if (types().isIdentifier(callPathNode.callee) && callPathNode.callee.name === 'require' && types().isStringLiteral(callPathNode.arguments[0])) {
          const requireStr = callPathNode.arguments[0].value;
          const resolvePath = (0, _moduleResolver.getModuleResolvePath)({
            basePath: fileAbsPath,
            sourcePath: requireStr,
            extensions: LOCAL_MODULE_EXT
          });
          const resolvePathParsed = _path().default.parse(resolvePath);
          const isHostPkg = isHostPackage(requireStr);
          if (resolvePath.includes('node_modules') || isHostPkg) {
            // save external deps
            const pkg = isHostPkg ? (0, _moduleResolver.getHostModuleResolvePkg)(requireStr) : (0, _moduleResolver.getModuleResolvePkg)({
              basePath: fileAbsPath,
              sourcePath: resolvePath,
              extensions: LOCAL_MODULE_EXT
            });
            const css = getCSSForDep(pkg.name);
            const peerDeps = [];
            // process peer dependencies from dependency
            Object.keys(pkg.peerDependencies || {}).forEach(dep => {
              const peerCSS = getCSSForDep(dep);
              peerDeps.push({
                name: dep,
                version: pkg.peerDependencies[dep],
                // also collect css file for peerDependencies
                css: peerCSS
              });
            });
            cache.dependencies.push({
              resolvePath,
              name: pkg.name,
              version: pkg.version,
              css,
              peerDeps
            });
          } else if (
          // only analysis for valid local file type
          PLAIN_TEXT_EXT.includes(resolvePathParsed.ext) &&
          // do not collect entry file
          resolvePath !== (0, _slash().default)(entryAbsPath || '') &&
          // to avoid collect alias module
          requireStr.startsWith('.')) {
            // save local deps
            const filename = (0, _slash().default)(_path().default.relative(entryAbsPath || fileAbsPath, resolvePath)).replace(/(\.\/|\..\/)/g, '');
            cache.files.push({
              resolvePath,
              requireStr,
              filename
            });
          }
        }
      }
    });
  }
  // visit all dependencies
  cache.dependencies.forEach(item => {
    dependencies[item.name] = _objectSpread({
      version: item.version
    }, item.css ? {
      css: item.css
    } : {});
  });
  // visit all peer dependencies, to make sure collect 1-level dependency first
  cache.dependencies.reduce((result, item) => result.concat(item.peerDeps), []).filter(item => !dependencies[item]).forEach(item => {
    dependencies[item.name] = _objectSpread({
      version: item.version
    }, item.css ? {
      css: item.css
    } : {});
  });
  // visit all local files
  cache.files.filter(item => {
    // to avoid circular-reference
    return !files[item.filename];
  }).forEach(item => {
    const ext = _path().default.extname(item.resolvePath);
    files[item.filename] = cachers.content.get(item.resolvePath) || {
      import: item.requireStr,
      fileAbsPath: item.resolvePath
    };
    // cache resolve content
    cachers.content.add(item.resolvePath, files[item.filename]);
    // continue to collect deps for dep
    if (LOCAL_DEP_EXT.includes(ext)) {
      const content = (0, _moduleResolver.getModuleResolveContent)({
        basePath: fileAbsPath,
        sourcePath: item.resolvePath,
        extensions: LOCAL_DEP_EXT
      });
      const result = analyzeDeps(content, {
        isTSX: /\.tsx?/.test(ext),
        fileAbsPath: item.resolvePath,
        entryAbsPath: entryAbsPath || fileAbsPath,
        files
      });
      Object.assign(files, result.files);
      Object.assign(dependencies, result.dependencies);
    }
  });
  // cache analyze result for single demo code
  if (fileAbsPath) {
    cachers.file.add(fileAbsPath, cache, cacheKey);
  }
  return {
    files,
    dependencies
  };
}
function getCSSForDep(dep) {
  const pkgWithoutGroup = dep.match(/([^\/]+)$/)[1];
  const guessFiles = [
  // @group/pkg-suffic => pkg-suffix
  `${pkgWithoutGroup}`,
  // @group/pkg-suffix => pkgsuffix @ant-design/pro-card => card
  ...(pkgWithoutGroup.includes('-') ? [pkgWithoutGroup.replace(/-/g, ''), pkgWithoutGroup.split('-')[1]] : []),
  // guess normal css files
  'main', 'index'].reduce((files, name) => files.concat([`${name}.css`, `${name}.min.css`]), []);
  // detect guess css files
  for (let i = 0; i <= guessFiles.length; i += 1) {
    const file = guessFiles[i];
    try {
      // try to resolve CSS file
      const guessFilePath = `${dep}/dist/${file}`;
      // 判断一下文件是不是存在，不存在 throw 错误没必要加入
      require.resolve(guessFilePath);
      return guessFilePath;
    } catch (err) {
      /* nothing */
    }
  }
}
var _default = analyzeDeps;
exports.default = _default;