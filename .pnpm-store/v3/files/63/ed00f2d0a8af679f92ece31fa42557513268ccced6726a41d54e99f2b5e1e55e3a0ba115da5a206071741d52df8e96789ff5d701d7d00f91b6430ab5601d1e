"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizePath = normalizePath;
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

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

var _context = _interopRequireDefault(require("../context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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
  return (0, _slash().default)(_path().default.join(localePath, (0, _slash().default)(oPath) // discard filename for the default entries (index, README.zh-CN)
  .replace(new RegExp(`/(index|readme)(\\.(${locales.map(([name]) => name).join('|')}))?$`, 'i'), '/') // convert TheComponent to the-component
  .replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())).replace(/([^]+)\/$/, '$1'); // discard end slashZ
}

function splitLocalePathFromFilename(filename, locales) {
  const matchList = filename.match(/^(.+)\.([^.]+)$/);
  const result = ['', filename];

  if (matchList) {
    const locale = locales.find(([name]) => name === matchList[2]); // set locale path if there has locale config & it is not the default locale

    if (locale && locales.indexOf(locale) > 0) {
      result[0] = `/${locale[0]}`; // locale path
    } // eslint-disable-next-line prefer-destructuring


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
  var _opts$resolve, _opts$resolve$example;

  const isExampleDir = (_opts$resolve = opts.resolve) === null || _opts$resolve === void 0 ? void 0 : (_opts$resolve$example = _opts$resolve.examples) === null || _opts$resolve$example === void 0 ? void 0 : _opts$resolve$example.some(dir => {
    var _ctx$umi;

    return _path().default.join(((_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : _ctx$umi.cwd) || process.cwd(), dir) === absPath;
  });

  const mixture = _fs().default.readdirSync(absPath).filter(isValidPath);

  const routes = []; // separate files & child directories

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
        dirs = _mixture$reduce2[1]; // make sure file is front of child directory in routes


  files.forEach(file => {
    const fileParsed = _path().default.parse(file);

    const _splitLocalePathFromF = splitLocalePathFromFilename(fileParsed.name, opts.locales),
          _splitLocalePathFromF2 = _slicedToArray(_splitLocalePathFromF, 2),
          localePath = _splitLocalePathFromF2[0],
          realFilename = _splitLocalePathFromF2[1];

    const filePath = _path().default.join(absPath, file);

    const isRcFile = ['.tsx', '.jsx'].includes(fileParsed.ext);
    const isExample = isExampleDir && isRcFile;

    let routePath = _path().default.join(parentRoutePath, realFilename); // collect all examples under examples dir path in site mode


    if (isExampleDir && opts.mode === 'site') {
      routePath = _path().default.join('/', _path().default.parse(absPath).name, routePath);
    }

    if ( // process markdown file always
    fileParsed.ext === '.md' || // process React Component if search in example directory
    isRcFile && isExampleDir) {
      var _ctx$umi2;

      const route = {
        path: normalizePath(routePath, localePath, opts.locales),
        component: `./${(0, _slash().default)(_path().default.relative(((_ctx$umi2 = _context.default.umi) === null || _ctx$umi2 === void 0 ? void 0 : _ctx$umi2.cwd) || process.cwd(), filePath))}`,
        exact: true
      }; // add example flag

      if (isExample) {
        route.meta = {
          example: true
        };
      }

      routes.push(route);
    }
  }); // continue to find child routes for non-example directory

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