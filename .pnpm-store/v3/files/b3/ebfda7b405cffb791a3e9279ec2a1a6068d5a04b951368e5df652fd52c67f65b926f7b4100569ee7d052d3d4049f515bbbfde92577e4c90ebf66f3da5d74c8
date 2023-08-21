"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.normalizePath = normalizePath;
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
function _ignore() {
  const data = _interopRequireDefault(require("ignore"));
  _ignore = function _ignore() {
    return data;
  };
  return data;
}
var _context = _interopRequireDefault(require("../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
const IGNORE_DIR = ['node_modules', 'fixtures'];
/**
 * discard .dirname & _dirname & ignore directories
 */
function isValidPath(pathname) {
  return !/(^|\/)[._][^/]+/.test(pathname) && IGNORE_DIR.indexOf(pathname) === -1;
}
/**
 * normalize file path to route path
 * @param oPath       original file path
 * @param localePath  locale path (optional)
 * @param locales     current locale options (optional)
 */
function normalizePath(oPath, localePath = '', locales = []) {
  return (0, _slash().default)(_path().default.join(localePath, (0, _slash().default)(oPath)
  // discard filename for the default entries (index, README.zh-CN)
  .replace(new RegExp(`/(index|readme)(\\.(${locales.map(([name]) => name).join('|')}))?$`, 'i'), '/')
  // convert TheComponent to the-component
  .replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())).replace(/([^]+)\/$/, '$1'); // discard end slashZ
}

function splitLocalePathFromFilename(filename, locales) {
  const matchList = filename.match(/^(.+)\.([^.]+)$/);
  const result = ['', filename];
  if (matchList) {
    const locale = locales.find(([name]) => name === matchList[2]);
    // set locale path if there has locale config & it is not the default locale
    if (locale && locales.indexOf(locale) > 0) {
      result[0] = `/${locale[0]}`; // locale path
    }
    // eslint-disable-next-line prefer-destructuring
    result[1] = matchList[1]; // real filename
  }

  return result;
}
/**
 * find child routes for specific path
 * @param absPath           absolute path
 * @param opts              dumi options
 * @param parentRoutePath   route path that need prefix for current
 */
function findChildRoutes(absPath, opts, parentRoutePath = '/') {
  var _ctx$umi, _opts$resolve, _opts$resolve$example, _opts$resolve2, _opts$resolve2$exclud;
  const cwd = ((_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : _ctx$umi.cwd) || process.cwd();
  const isExampleDir = (_opts$resolve = opts.resolve) === null || _opts$resolve === void 0 ? void 0 : (_opts$resolve$example = _opts$resolve.examples) === null || _opts$resolve$example === void 0 ? void 0 : _opts$resolve$example.some(dir => _path().default.join(cwd, dir) === absPath);
  let mixture = _fs().default.readdirSync(absPath).filter(isValidPath);
  if ((_opts$resolve2 = opts.resolve) === null || _opts$resolve2 === void 0 ? void 0 : (_opts$resolve2$exclud = _opts$resolve2.excludes) === null || _opts$resolve2$exclud === void 0 ? void 0 : _opts$resolve2$exclud.length) {
    const ig = (0, _ignore().default)().add(opts.resolve.excludes);
    mixture = mixture.filter(filename => {
      const absoluteFilepath = _path().default.join(absPath, filename);
      const filepath = (0, _slash().default)(_path().default.relative(cwd, absoluteFilepath));
      return !ig.ignores(filepath);
    });
  }
  const routes = [];
  // separate files & child directories
  const _mixture$reduce = mixture.reduce((result, item) => {
      if (_fs().default.statSync(_path().default.join(absPath, item)).isDirectory()) {
        result[1].push(item);
      } else {
        result[0].push(item);
      }
      return result;
    }, [[], []]),
    _mixture$reduce2 = _slicedToArray(_mixture$reduce, 2),
    files = _mixture$reduce2[0],
    dirs = _mixture$reduce2[1];
  // make sure file is front of child directory in routes
  files.forEach(file => {
    const fileParsed = _path().default.parse(file);
    const _splitLocalePathFromF = splitLocalePathFromFilename(fileParsed.name, opts.locales),
      _splitLocalePathFromF2 = _slicedToArray(_splitLocalePathFromF, 2),
      localePath = _splitLocalePathFromF2[0],
      realFilename = _splitLocalePathFromF2[1];
    const filePath = _path().default.join(absPath, file);
    const isRcFile = ['.tsx', '.jsx'].includes(fileParsed.ext);
    const isExample = isExampleDir && isRcFile;
    let routePath = _path().default.join(parentRoutePath, realFilename);
    // collect all examples under examples dir path in site mode
    if (isExampleDir && opts.mode === 'site') {
      routePath = _path().default.join('/', _path().default.parse(absPath).name, routePath);
    }
    if (
    // process markdown file always
    fileParsed.ext === '.md' ||
    // process React Component if search in example directory
    isRcFile && isExampleDir) {
      const route = {
        path: normalizePath(routePath, localePath, opts.locales),
        component: `./${(0, _slash().default)(_path().default.relative(cwd, filePath))}`,
        exact: true
      };
      // add example flag
      if (isExample) {
        route.meta = {
          example: true
        };
      }
      routes.push(route);
    }
  });
  // continue to find child routes for non-example directory
  if (!isExampleDir) {
    dirs.forEach(dir => {
      routes.push(...findChildRoutes(_path().default.join(absPath, dir), opts, _path().default.join(parentRoutePath, dir)));
    });
  }
  return routes;
}
var _default = (absPath, opts) => {
  const routes = [];
  if (_fs().default.existsSync(absPath)) {
    routes.push(...findChildRoutes(absPath, opts));
  }
  return routes;
};
exports.default = _default;