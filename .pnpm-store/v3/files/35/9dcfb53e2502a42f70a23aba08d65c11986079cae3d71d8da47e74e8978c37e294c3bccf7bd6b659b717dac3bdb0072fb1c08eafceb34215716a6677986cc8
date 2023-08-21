"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addHtmlSuffix = addHtmlSuffix;
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _pathToRegexp() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/path-to-regexp"));

  _pathToRegexp = function _pathToRegexp() {
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

function _stream() {
  const data = require("stream");

  _stream = function _stream() {
    return data;
  };

  return data;
}

var _constants = require("../features/ssr/constants");

var _utils2 = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = api => {
  api.describe({
    key: 'exportStatic',
    config: {
      schema(joi) {
        return joi.object({
          htmlSuffix: joi.boolean(),
          dynamicRoot: joi.boolean(),

          /**
           * 在 windows 下面不要生成 .uuid.html
           */
          supportWin: joi.boolean(),
          // 不能通过直接 patch 路由的方式，拿不到 match.[id]，是一个 render paths 的概念
          extraRoutePaths: joi.function().description('extra render paths only enable in ssr')
        });
      }

    },
    enableBy: () => {
      var _api$config;

      return (// TODO: api.EnableBy.config 读取的 userConfig，modifyDefaultConfig hook 修改后对这个判断不起效
        'exportStatic' in api.userConfig ? api.userConfig.exportStatic : (_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.exportStatic
      );
    }
  });
  api.modifyConfig(memo => {
    var _memo$exportStatic;

    if (memo.exportStatic && ((_memo$exportStatic = memo.exportStatic) === null || _memo$exportStatic === void 0 ? void 0 : _memo$exportStatic.dynamicRoot)) {
      memo.runtimePublicPath = true;
    }

    return memo;
  });
  api.onPatchRoute(({
    route
  }) => {
    var _api$config$exportSta;

    if (api.config.exportStatic && !((_api$config$exportSta = api.config.exportStatic) === null || _api$config$exportSta === void 0 ? void 0 : _api$config$exportSta.htmlSuffix)) return;

    if (route.path) {
      route.path = addHtmlSuffix(route.path, !!route.routes);
    }
  });
  api.onPatchRoutes(({
    routes
  }) => {
    // copy / to /index.html
    let rootIndex = null;
    routes.forEach((route, index) => {
      if (route.path === '/' && route.exact) {
        rootIndex = index;
      }
    });
    /**
     * 不知道为啥有这个，会导致这个问题
     * https://github.com/ant-design/ant-design-pro/issues/9441
     */

    if (rootIndex !== null) {
      routes.splice(rootIndex, 0, _objectSpread(_objectSpread({}, routes[rootIndex]), {}, {
        path: '/index.html'
      }));
    }
  }); // modify export html using routes

  api.modifyExportRouteMap( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (defaultRouteMap, {
      html
    }) {
      const routeMap = (yield html.getRouteMap()) || defaultRouteMap;
      const exportStatic = api.config.exportStatic; // for dynamic routes

      if (exportStatic && typeof exportStatic.extraRoutePaths === 'function') {
        const extraRoutePaths = yield exportStatic.extraRoutePaths();
        extraRoutePaths === null || extraRoutePaths === void 0 ? void 0 : extraRoutePaths.forEach(path => {
          const match = routeMap.find(({
            route
          }) => {
            return route.path && (0, _pathToRegexp().default)(route.path).exec(path);
          });

          if (match) {
            var _api$config$exportSta2;

            const newPath = (0, _utils().deepmerge)(match, {
              route: {
                path
              },
              file: html.getHtmlPath(path)
            });
            /**
             * supportWin 打开之后下面不要生成 .uuid.html
             * 为什么不单独设置windows？
             * 因为 mac 下面生成了 .uuid.html，在 windows 下面 clone 不下来。
             */

            if (api.config.exportStatic && ( //@ts-ignore
            (_api$config$exportSta2 = api.config.exportStatic) === null || _api$config$exportSta2 === void 0 ? void 0 : _api$config$exportSta2.supportWin) && path.includes(':')) {
              return;
            }

            routeMap.push(newPath);
          }
        });
      }

      return routeMap;
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()); // for debug prerender error

  let serverRenderFailed = false; // 不使用 api.modifyHTML 原因是不需要转 cheerio，提高预渲染效率

  api.modifyProdHTMLContent( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (memo, args) {
      const route = args.route;
      const serverFilePath = (0, _path().join)(api.paths.absOutputPath, _constants.OUTPUT_SERVER_FILENAME);
      const ssr = api.config.ssr;

      if (ssr && api.env === 'production' && (0, _fs().existsSync)(serverFilePath) && !(0, _utils2.isDynamicRoute)(route.path)) {
        try {
          // do server-side render
          const render = require(serverFilePath);

          const _yield$render = yield render({
            path: route.path,
            htmlTemplate: memo,
            // prevent default manifest assets generation
            manifest: {}
          }),
                html = _yield$render.html,
                error = _yield$render.error;

          api.logger.info(`${route.path} render success`);

          if (!error) {
            // convert into string if html instance stream
            return html instanceof _stream().Stream ? (0, _utils2.streamToString)(html) : html;
          } else {
            serverRenderFailed = true;
            api.logger.error(`[SSR] ${route.path}`, error);
          }
        } catch (e) {
          serverRenderFailed = true;
          api.logger.error(`${route.path} render failed`, e);
          throw e;
        }
      }

      return memo;
    });

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
  api.onBuildComplete(({
    err
  }) => {
    var _api$config2;

    if (!err && ((_api$config2 = api.config) === null || _api$config2 === void 0 ? void 0 : _api$config2.ssr)) {
      if (serverRenderFailed) {
        // tips: COMPRESS=none to debug
        api.logger.info('You can use COMPRESS=none to debug.');
      } // RM_SERVER_FILE prior to serverFailed


      if (process.env.RM_SERVER_FILE ? process.env.RM_SERVER_FILE !== 'none' : !serverRenderFailed) {
        // remove umi.server.js
        const serverFilePath = (0, _path().join)(api.paths.absOutputPath, _constants.OUTPUT_SERVER_FILENAME);

        if ((0, _fs().existsSync)(serverFilePath)) {
          _utils().rimraf.sync(serverFilePath);
        }
      }
    }
  });
};

exports.default = _default;

function addHtmlSuffix(path, hasRoutes) {
  if (path === '/') return path;

  if (hasRoutes) {
    return path.endsWith('/') ? path : `${path}(.html)?`;
  } else {
    return path.endsWith('/') ? `${path.slice(0, -1)}.html` : `${path}.html`;
  }
}