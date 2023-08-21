"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = _interopRequireDefault(require("../../context"));
var _getRouteConfig = _interopRequireWildcard(require("../../routes/getRouteConfig"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
/**
 * plugin for generate routes
 */
var _default = api => {
  // generate docs routes
  api.onPatchRoutesBefore( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* ({
      routes,
      parentRoute
    }) {
      // only deal with the top level routes
      if (!parentRoute) {
        const result = yield (0, _getRouteConfig.default)(api, _context.default.opts);
        if (_context.default.opts.isIntegrate) {
          // unshit docs routes in integrate mode
          routes.unshift(...result);
        } else {
          // clear original routes
          routes.splice(0, routes.length);
          // append new routes
          routes.push(...result);
        }
      }
    });
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  api.register({
    key: 'dumi.getRootRoute',
    fn(oRoutes = []) {
      return _asyncToGenerator(function* () {
        const findRoot = routes => {
          for (let i = 0; i < routes.length; i += 1) {
            if (routes[i][_getRouteConfig.DUMI_ROOT_FLAG]) {
              return routes[i];
            }
            const childRoot = findRoot(routes[i].routes || []);
            if (childRoot) {
              return childRoot;
            }
          }
          return null;
        };
        return findRoot(oRoutes);
      })();
    }
  });
  // TODO: move this logic into getRouteConfig and make sure tests passed
  api.onPatchRoute(({
    route
  }) => {
    if (route[_getRouteConfig.DUMI_ROOT_FLAG]) {
      // builtin outer layout for initialize context (.umi/dumi/layout.tsx)
      route.wrappers.unshift('../dumi/layout');
      // add empty component for root layout
      route.component = '(props) => props.children';
    }
  });
  // remove useless /index.html from exportStatic feature
  api.onPatchRoutes(({
    routes,
    parentRoute
  }) => {
    if (api.config.exportStatic && (parentRoute === null || parentRoute === void 0 ? void 0 : parentRoute[_getRouteConfig.DUMI_ROOT_FLAG])) {
      const rootHtmlIndex = routes.findIndex(route => route.path === '/index.html');
      if (rootHtmlIndex > -1) {
        routes.splice(rootHtmlIndex, 1);
      }
    }
  });
};
exports.default = _default;