"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function _path() {
  const data = _interopRequireWildcard(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

var _getConventionalRoutes = _interopRequireDefault(require("./getConventionalRoutes"));

var _routesToJSON = _interopRequireDefault(require("./routesToJSON"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Route {
  constructor(opts) {
    this.opts = void 0;
    this.opts = opts || {};
  }

  getRoutes(opts) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const config = opts.config,
            root = opts.root,
            componentPrefix = opts.componentPrefix; // 避免修改配置里的 routes，导致重复 patch

      let routes = _utils().lodash.cloneDeep(config.routes);

      let isConventional = false;

      if (!routes) {
        (0, _assert().default)(root, `opts.root must be supplied for conventional routes.`);
        routes = _this.getConventionRoutes({
          root: root,
          config,
          componentPrefix
        });
        isConventional = true;
      }

      yield _this.patchRoutes(routes, _objectSpread(_objectSpread({}, opts), {}, {
        isConventional
      }));
      return routes;
    })();
  } // TODO:
  // 1. 移动 /404 到最后，并处理 component 和 redirect


  patchRoutes(routes, opts) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (_this2.opts.onPatchRoutesBefore) {
        yield _this2.opts.onPatchRoutesBefore({
          routes,
          parentRoute: opts.parentRoute
        });
      }

      var _iterator = _createForOfIteratorHelper(routes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          const route = _step.value;
          yield _this2.patchRoute(route, opts);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (_this2.opts.onPatchRoutes) {
        yield _this2.opts.onPatchRoutes({
          routes,
          parentRoute: opts.parentRoute
        });
      }
    })();
  }

  patchRoute(route, opts) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (_this3.opts.onPatchRouteBefore) {
        yield _this3.opts.onPatchRouteBefore({
          route,
          parentRoute: opts.parentRoute
        });
      } // route.path 的修改需要在子路由 patch 之前做


      if (route.path && route.path.charAt(0) !== '/' && !/^https?:\/\//.test(route.path)) {
        var _opts$parentRoute;

        route.path = (0, _utils().winPath)((0, _path().join)(((_opts$parentRoute = opts.parentRoute) === null || _opts$parentRoute === void 0 ? void 0 : _opts$parentRoute.path) || '/', route.path));
      }

      if (route.redirect && route.redirect.charAt(0) !== '/') {
        var _opts$parentRoute2;

        route.redirect = (0, _utils().winPath)((0, _path().join)(((_opts$parentRoute2 = opts.parentRoute) === null || _opts$parentRoute2 === void 0 ? void 0 : _opts$parentRoute2.path) || '/', route.redirect));
      }

      if (route.routes) {
        yield _this3.patchRoutes(route.routes, _objectSpread(_objectSpread({}, opts), {}, {
          parentRoute: route
        }));
      } else {
        if (!('exact' in route)) {
          // exact by default
          route.exact = true;
        }
      } // resolve component path


      if (route.component && !opts.isConventional && typeof route.component === 'string' && !route.component.startsWith('@/') && !_path().default.isAbsolute(route.component)) {
        route.component = (0, _utils().winPath)((0, _path().join)(opts.root, route.component));
      } // resolve wrappers path


      if (route.wrappers) {
        route.wrappers = route.wrappers.map(wrapper => {
          if (wrapper.startsWith('@/') || _path().default.isAbsolute(wrapper)) {
            return wrapper;
          } else {
            return (0, _utils().winPath)((0, _path().join)(opts.root, wrapper));
          }
        });
      }

      if (_this3.opts.onPatchRoute) {
        yield _this3.opts.onPatchRoute({
          route,
          parentRoute: opts.parentRoute
        });
      }
    })();
  }

  getConventionRoutes(opts) {
    return (0, _getConventionalRoutes.default)(opts);
  }

  getJSON(opts) {
    return (0, _routesToJSON.default)(opts);
  }

  getPaths({
    routes
  }) {
    return _utils().lodash.uniq(routes.reduce((memo, route) => {
      if (route.path) memo.push(route.path);
      if (route.routes) memo = memo.concat(this.getPaths({
        routes: route.routes
      }));
      return memo;
    }, []));
  }

}

var _default = Route;
exports.default = _default;