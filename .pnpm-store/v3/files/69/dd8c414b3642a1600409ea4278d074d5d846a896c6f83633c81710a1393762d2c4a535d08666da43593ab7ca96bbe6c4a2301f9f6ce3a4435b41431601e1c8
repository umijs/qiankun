"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderServer;
exports.loadPageGetInitialProps = void 0;

var _server = _interopRequireDefault(require("react-dom/server"));

var _react = _interopRequireDefault(require("react"));

var _reactRouterConfig = require("react-router-config");

var _runtime = require("@umijs/runtime");

var _rendererReact = require("@umijs/renderer-react");

var _excluded = ["component"],
    _excluded2 = ["path", "context", "basename"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * get current page component getPageInitialProps data
 * @param params
 */
var loadPageGetInitialProps = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
    var ctx, opts, routes, _opts$pathname, pathname, routesMatched, promises, pageInitialProps;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            ctx = _ref.ctx, opts = _ref.opts;
            routes = opts.routes, _opts$pathname = opts.pathname, pathname = _opts$pathname === void 0 ? opts.path : _opts$pathname; // via {routes} to find `getInitialProps`

            routesMatched = (0, _reactRouterConfig.matchRoutes)(routes, pathname || '/');
            promises = routesMatched.map( /*#__PURE__*/function () {
              var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
                var _Component, _Component2;

                var route, match, _ref5, component, restRouteParams, Component, preloadComponent;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        route = _ref3.route, match = _ref3.match;
                        _ref5 = route, component = _ref5.component, restRouteParams = _objectWithoutProperties(_ref5, _excluded);
                        Component = component; // preload for dynamicImport

                        if (!((_Component = Component) === null || _Component === void 0 ? void 0 : _Component.preload)) {
                          _context.next = 8;
                          break;
                        }

                        _context.next = 6;
                        return Component.preload();

                      case 6:
                        preloadComponent = _context.sent;
                        Component = (preloadComponent === null || preloadComponent === void 0 ? void 0 : preloadComponent.default) || preloadComponent;

                      case 8:
                        if (!(Component && ((_Component2 = Component) === null || _Component2 === void 0 ? void 0 : _Component2.getInitialProps))) {
                          _context.next = 18;
                          break;
                        }

                        // handle ctx
                        ctx = Object.assign(ctx, _objectSpread({
                          match: match,
                          route: route
                        }, restRouteParams));

                        if (!Component.getInitialProps) {
                          _context.next = 16;
                          break;
                        }

                        _context.next = 13;
                        return Component.getInitialProps(ctx);

                      case 13:
                        _context.t0 = _context.sent;
                        _context.next = 17;
                        break;

                      case 16:
                        _context.t0 = {};

                      case 17:
                        return _context.abrupt("return", _context.t0);

                      case 18:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref4.apply(this, arguments);
              };
            }()).filter(Boolean);
            _context2.next = 6;
            return Promise.all(promises);

          case 6:
            pageInitialProps = _context2.sent.reduce(function (acc, curr) {
              return Object.assign({}, acc, curr);
            }, {});
            return _context2.abrupt("return", {
              pageInitialProps: pageInitialProps,
              routesMatched: routesMatched
            });

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function loadPageGetInitialProps(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * 处理 getInitialProps、路由 StaticRouter、数据预获取
 * @param opts
 */


exports.loadPageGetInitialProps = loadPageGetInitialProps;

function getRootContainer(opts) {
  var path = opts.path,
      context = opts.context,
      _opts$basename = opts.basename,
      basename = _opts$basename === void 0 ? '/' : _opts$basename,
      renderRoutesProps = _objectWithoutProperties(opts, _excluded2);

  return renderRoutesProps.plugin.applyPlugins({
    type: _runtime.ApplyPluginsType.modify,
    key: 'rootContainer',
    initialValue: /*#__PURE__*/_react.default.createElement(_runtime.StaticRouter, {
      basename: basename === '/' ? '' : basename,
      location: path,
      context: context
    }, (0, _rendererReact.renderRoutes)(renderRoutesProps)),
    args: {
      type: 'ssr',
      history: opts.history,
      routes: opts.routes,
      plugin: opts.plugin,
      ctx: opts.ctx
    }
  });
}

/**
 * 服务端渲染处理，通过 `routes` 来做 页面级 数据预获取
 *
 * @param opts
 */
function renderServer(_x3) {
  return _renderServer.apply(this, arguments);
}

function _renderServer() {
  _renderServer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(opts) {
    var defaultCtx, ctx, _yield$loadPageGetIni, pageInitialProps, routesMatched, rootContainer, _pageHTML, pageHTML;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            defaultCtx = _objectSpread({
              isServer: true,
              // server only
              history: opts.history
            }, opts.getInitialPropsCtx || {}); // modify ctx

            _context3.next = 3;
            return opts.plugin.applyPlugins({
              key: 'ssr.modifyGetInitialPropsCtx',
              type: _runtime.ApplyPluginsType.modify,
              initialValue: defaultCtx,
              async: true
            });

          case 3:
            _context3.t0 = _context3.sent;

            if (_context3.t0) {
              _context3.next = 6;
              break;
            }

            _context3.t0 = defaultCtx;

          case 6:
            ctx = _context3.t0;
            _context3.next = 9;
            return loadPageGetInitialProps({
              ctx: ctx,
              opts: opts
            });

          case 9:
            _yield$loadPageGetIni = _context3.sent;
            pageInitialProps = _yield$loadPageGetIni.pageInitialProps;
            routesMatched = _yield$loadPageGetIni.routesMatched;
            rootContainer = getRootContainer(_objectSpread(_objectSpread({}, opts), {}, {
              pageInitialProps: pageInitialProps,
              ctx: ctx
            }));

            if (!(opts.mode === 'stream')) {
              _context3.next = 16;
              break;
            }

            _pageHTML = _server.default[opts.staticMarkup ? 'renderToStaticNodeStream' : 'renderToNodeStream'](rootContainer);
            return _context3.abrupt("return", {
              pageHTML: _pageHTML,
              pageInitialProps: pageInitialProps,
              routesMatched: routesMatched
            });

          case 16:
            pageHTML = _server.default[opts.staticMarkup ? 'renderToStaticMarkup' : 'renderToString'](rootContainer); // by default

            return _context3.abrupt("return", {
              pageHTML: pageHTML,
              pageInitialProps: pageInitialProps,
              routesMatched: routesMatched
            });

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _renderServer.apply(this, arguments);
}