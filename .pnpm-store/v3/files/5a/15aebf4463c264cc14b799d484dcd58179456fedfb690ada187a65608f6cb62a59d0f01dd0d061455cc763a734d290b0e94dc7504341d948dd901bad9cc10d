"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRoutes;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _ast() {
  const data = require("@umijs/ast");

  _ast = function _ast() {
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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 考虑多种情况：
// 可能是目录，没有后缀，比如 [post]/add.tsx
// 可能是文件，有后缀，比如 [id].tsx
// [id$] 是可选动态路由
const RE_DYNAMIC_ROUTE = /^\[(.+?)\]/;

function getFiles(root) {
  if (!(0, _fs().existsSync)(root)) return [];
  return (0, _fs().readdirSync)(root).filter(file => {
    const absFile = (0, _path().join)(root, file);
    const fileStat = (0, _fs().statSync)(absFile);
    const isDirectory = fileStat.isDirectory();
    const isFile = fileStat.isFile();

    if (isDirectory && ['components', 'component', 'utils', 'util'].includes(file)) {
      return false;
    }

    if (file.charAt(0) === '.') return false;
    if (file.charAt(0) === '_') return false; // exclude test file

    if (/\.(test|spec|e2e)\.(j|t)sx?$/.test(file)) return false; // d.ts

    if (/\.d\.ts$/.test(file)) return false;

    if (isFile) {
      if (!/\.(j|t)sx?$/.test(file)) return false;
      const content = (0, _fs().readFileSync)(absFile, 'utf-8');

      try {
        if (!(0, _ast().isReactComponent)(content)) return false;
      } catch (e) {
        throw new Error(`Parse conventional route component ${absFile} failed, ${e.message}`);
      }
    }

    return true;
  });
}

function fileToRouteReducer(opts, memo, file) {
  const root = opts.root,
        _opts$relDir = opts.relDir,
        relDir = _opts$relDir === void 0 ? '' : _opts$relDir;
  const absFile = (0, _path().join)(root, relDir, file);
  const stats = (0, _fs().statSync)(absFile);

  const __isDynamic = RE_DYNAMIC_ROUTE.test(file);

  if (stats.isDirectory()) {
    const relFile = (0, _path().join)(relDir, file);
    const layoutFile = (0, _utils().getFile)({
      base: (0, _path().join)(root, relFile),
      fileNameWithoutExt: '_layout',
      type: 'javascript'
    });

    const route = _objectSpread({
      path: normalizePath(relFile, opts),
      routes: getRoutes(_objectSpread(_objectSpread({}, opts), {}, {
        relDir: (0, _path().join)(relFile)
      })),
      __isDynamic
    }, layoutFile ? {
      component: layoutFile.path
    } : {
      exact: true,
      __toMerge: true
    });

    memo.push(normalizeRoute(route, opts));
  } else {
    const bName = (0, _path().basename)(file, (0, _path().extname)(file));
    memo.push(normalizeRoute({
      path: normalizePath((0, _path().join)(relDir, bName), opts),
      exact: true,
      component: absFile,
      __isDynamic
    }, opts));
  }

  return memo;
}

function normalizeRoute(route, opts) {
  let props = undefined;

  if (route.component) {
    try {
      props = (0, _ast().getExportProps)((0, _fs().readFileSync)(route.component, 'utf-8'));
    } catch (e) {
      throw new Error(`Parse conventional route component ${route.component} failed, ${e.message}`);
    }

    route.component = (0, _utils().winPath)((0, _path().relative)((0, _path().join)(opts.root, '..'), route.component));
    route.component = `${opts.componentPrefix || '@/'}${route.component}`;
  }

  return _objectSpread(_objectSpread({}, route), typeof props === 'object' ? props : {});
}

function normalizePath(path, opts) {
  path = (0, _utils().winPath)(path).split('/').map(p => {
    // dynamic route
    p = p.replace(RE_DYNAMIC_ROUTE, ':$1'); // :post$ => :post?

    if (p.endsWith('$')) {
      p = p.slice(0, -1) + '?';
    }

    return p;
  }).join('/');
  path = `/${path}`; // /index/index -> /

  if (path === '/index/index') {
    path = '/';
  } // /xxxx/index -> /xxxx/


  path = path.replace(/\/index$/, '/'); // remove the last slash
  // e.g. /abc/ -> /abc

  if (path !== '/' && path.slice(-1) === '/') {
    path = path.slice(0, -1);
  }

  return path;
}

function normalizeRoutes(routes) {
  const paramsRoutes = [];
  const exactRoutes = [];
  const layoutRoutes = [];
  routes.forEach(route => {
    const __isDynamic = route.__isDynamic,
          exact = route.exact;
    delete route.__isDynamic;

    if (__isDynamic) {
      paramsRoutes.push(route);
    } else if (exact) {
      exactRoutes.push(route);
    } else {
      layoutRoutes.push(route);
    }
  });
  (0, _assert().default)(paramsRoutes.length <= 1, `We should not have multiple dynamic routes under a directory.`);
  return [...exactRoutes, ...layoutRoutes, ...paramsRoutes].reduce((memo, route) => {
    if (route.__toMerge && route.routes) {
      memo = memo.concat(route.routes);
    } else {
      memo.push(route);
    }

    return memo;
  }, []);
}

function getRoutes(opts) {
  const root = opts.root,
        _opts$relDir2 = opts.relDir,
        relDir = _opts$relDir2 === void 0 ? '' : _opts$relDir2,
        config = opts.config;
  const files = getFiles((0, _path().join)(root, relDir));
  const routes = normalizeRoutes(files.reduce(fileToRouteReducer.bind(null, opts), []));

  if (!relDir) {
    const globalLayoutFile = (0, _utils().getFile)({
      base: root,
      fileNameWithoutExt: `../${config.singular ? 'layout' : 'layouts'}/index`,
      type: 'javascript'
    });

    if (globalLayoutFile) {
      return [normalizeRoute({
        path: '/',
        component: globalLayoutFile.path,
        routes
      }, opts)];
    }
  }

  return routes;
}