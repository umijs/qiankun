"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.REQUIRED_THEME_BUILTINS = void 0;
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
function _utils() {
  const data = require("@umijs/utils");
  _utils = function _utils() {
    return data;
  };
  return data;
}
var _moduleResolver = require("../utils/moduleResolver");
var _context = _interopRequireDefault(require("../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const debug = (0, _utils().createDebug)('dumi:theme');
const THEME_PREFIX = 'dumi-theme-';
const LOCAL_THEME_PATH = '.dumi/theme';
const FALLBACK_THEME = `${THEME_PREFIX}default`;
const REQUIRED_THEME_BUILTINS = ['Alert', 'API', 'Badge', 'Example', 'Previewer', 'SourceCode', 'Tree', 'Table'];
exports.REQUIRED_THEME_BUILTINS = REQUIRED_THEME_BUILTINS;
let cache;
/**
 * detect dumi theme in project dependencies
 */
function detectInstalledTheme() {
  const pkg = _context.default.umi.pkg || {};
  const deps = Object.assign({}, pkg.devDependencies, pkg.dependencies);
  return Object.keys(deps).find(name => name.replace(/^@[\w-]+\//, '').startsWith(THEME_PREFIX));
}
/**
 * detect dumi theme in project dependencies
 */
function detectLocalTheme() {
  const detectPath = (0, _utils().winPath)(_path().default.join(_context.default.umi.cwd, LOCAL_THEME_PATH));
  return _fs().default.existsSync(detectPath) ? detectPath : null;
}
/**
 * detect dumi theme
 */
function detectTheme() {
  const localTheme = detectLocalTheme();
  const installedTheme = detectInstalledTheme();
  return [localTheme, process.env.DUMI_THEME || installedTheme, FALLBACK_THEME].filter(Boolean);
}
/**
 * get resolved paths for theme module
 * @param sourcePath
 */
function getThemeResolvePaths(sourcePath) {
  // start search theme from @umijs/preset-dumi package, but use cwd if use relative theme folder
  const basePath = sourcePath.startsWith('.') ? _context.default.umi.cwd : __dirname;
  const srcRegExp = /\/src\/(layout|builtins)/;
  let compiledModulePaths;
  // search compiled module in es/lib instead of src firstly, for compatible with mfsu
  if (srcRegExp.test(sourcePath)) {
    try {
      compiledModulePaths = getThemeResolvePaths(sourcePath.replace(srcRegExp, '/es/$1')) || /* istanbul ignore next */getThemeResolvePaths(sourcePath.replace(srcRegExp, '/lib/$1'));
    } catch (err) {/* nothing */}
  }
  return compiledModulePaths || {
    resolved: (0, _moduleResolver.getModuleResolvePath)({
      basePath,
      sourcePath,
      silent: true
    }),
    source: sourcePath
  };
}
/**
 * join win path and keep the leading period
 * @param args paths
 */
function pathJoin(...args) {
  var _args$0$match;
  return (0, _utils().winPath)(`${((_args$0$match = args[0].match(/^\.[\/\\]/)) === null || _args$0$match === void 0 ? void 0 : _args$0$match[0]) || ''}${_path().default.join(...args)}`);
}
/**
 * get entry directory for theme package
 * @param modulePath  theme package path
 */
function getThemeEntryDir(modulePath) {
  const dirs = [pathJoin(modulePath, 'es'), pathJoin(modulePath, 'lib'), pathJoin(modulePath, 'src')];
  return dirs.find(dir => _fs().default.existsSync(dir));
}
var _default = /*#__PURE__*/_asyncToGenerator(function* () {
  if (!cache || process.env.NODE_ENV === 'test') {
    const _detectTheme = detectTheme(),
      _detectTheme2 = _slicedToArray(_detectTheme, 2),
      theme = _detectTheme2[0],
      _detectTheme2$ = _detectTheme2[1],
      fb = _detectTheme2$ === void 0 ? FALLBACK_THEME : _detectTheme2$;
    const fallback = fb.startsWith('.') ? (0, _utils().winPath)(_path().default.dirname(getThemeResolvePaths(fb).resolved)) : fb;
    const modulePath = _path().default.isAbsolute(theme) ? theme :
    // resolve real absolute path for theme package
    (0, _utils().winPath)(_path().default.dirname(getThemeResolvePaths(theme).resolved));
    // local theme has no src directory but theme package has
    const entryDir = _path().default.isAbsolute(theme) ? theme : getThemeEntryDir(modulePath);
    const builtinPath = pathJoin(entryDir, 'builtins');
    debug('theme:', theme, `fallback:`, fallback);
    const components = _fs().default.existsSync(builtinPath) ? _fs().default.readdirSync(builtinPath).filter(file => {
      const absPath = _path().default.join(builtinPath, file);
      // filter .js/.ts/.jsx/.tsx, and exclude .d.ts
      const isFileComponent = /((?<!\.d)\.ts|\.(jsx?|tsx))$/.test(file);
      // filter Foo/index.(tsx|jsx|js|ts)
      const isDirComponent = _fs().default.lstatSync(absPath).isDirectory() && _fs().default.readdirSync(absPath).some(item => /^index.(t|j)sx?$/.test(item));
      return isFileComponent || isDirComponent;
    }).map(file => ({
      identifier: _path().default.parse(file).name,
      source: theme.startsWith('.') ?
      // use abs path for relative theme folder
      pathJoin(builtinPath, file) :
      // still use module identifier rather than abs path for theme package and absolute theme folder
      pathJoin(theme, builtinPath.replace(modulePath, ''), file),
      modulePath: pathJoin(builtinPath, file)
    })) : [];
    const fallbacks = REQUIRED_THEME_BUILTINS.reduce((result, bName) => {
      if (components.every(({
        identifier
      }) => identifier !== bName)) {
        let cSource;
        let cModulePath;
        try {
          cSource = pathJoin(fallback, 'src', 'builtins', `${bName}`);
          var _getThemeResolvePaths = getThemeResolvePaths(cSource);
          cModulePath = _getThemeResolvePaths.resolved;
          cSource = _getThemeResolvePaths.source;
        } catch (err) {
          debug('fallback to default theme for:', cSource);
          // fallback to default theme if detected fallback theme missed some components
          cSource = pathJoin(FALLBACK_THEME, 'src', 'builtins', `${bName}`);
          var _getThemeResolvePaths2 = getThemeResolvePaths(cSource);
          cModulePath = _getThemeResolvePaths2.resolved;
          cSource = _getThemeResolvePaths2.source;
        }
        result.push({
          identifier: bName,
          source: cSource,
          cModulePath
        });
      }
      return result;
    }, []);
    const layoutPaths = {};
    // outer layout: layout.tsx or layouts/index.tsx
    [pathJoin(entryDir, 'layout'), pathJoin(entryDir, 'layouts'), pathJoin(fallback, 'src', 'layout'), pathJoin(fallback, 'src', 'layouts')].some((layoutPath, i, outerLayoutPaths) => {
      try {
        layoutPaths._ = getThemeResolvePaths(layoutPath).resolved;
        return true;
      } catch (err) {
        // fallback to default theme layout if cannot find any valid layout
        if (i === outerLayoutPaths.length - 1) {
          layoutPaths._ = getThemeResolvePaths(pathJoin(FALLBACK_THEME, 'src', 'layout')).resolved;
        }
      }
    });
    // demo layout
    [pathJoin(entryDir, 'layouts', 'demo'), pathJoin(fallback, 'src', 'layouts', 'demo')].some(layoutPath => {
      try {
        layoutPaths.demo = getThemeResolvePaths(layoutPath).resolved;
        return true;
      } catch (err) {
        /* nothing */
      }
    });
    // get markdown components
    const mdComponents = yield _context.default.umi.applyPlugins({
      type: _context.default.umi.ApplyPluginsType.add,
      key: 'dumi.registerMdComponent',
      initialValue: []
    });
    const customs = mdComponents.map(component => ({
      identifier: component.name,
      source: pathJoin(component.component),
      cModulePath: pathJoin(component.component)
    }));
    cache = yield _context.default.umi.applyPlugins({
      key: 'dumi.modifyThemeResolved',
      type: _context.default.umi.ApplyPluginsType.modify,
      initialValue: {
        name: theme,
        modulePath,
        builtins: components,
        fallbacks,
        layoutPaths,
        customs
      }
    });
    debug(cache);
  }
  return cache;
});
exports.default = _default;