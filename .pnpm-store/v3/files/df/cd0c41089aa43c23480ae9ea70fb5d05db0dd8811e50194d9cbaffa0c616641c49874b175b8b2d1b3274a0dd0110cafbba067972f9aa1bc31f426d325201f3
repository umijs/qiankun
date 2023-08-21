"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chunksToFiles = chunksToFiles;
exports.getHtmlGenerator = getHtmlGenerator;
exports.getFlatRoutes = getFlatRoutes;

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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function chunksToFiles(opts) {
  let chunksMap = {};

  if (opts.chunks) {
    chunksMap = Array.from(opts.chunks).reduce((memo, chunk) => {
      const key = chunk.name || chunk.id;

      if (key && chunk.files) {
        chunk.files.forEach(file => {
          if (!file.includes('.hot-update')) {
            memo[`${key}${(0, _path().extname)(file)}`] = file;
          }
        });
      }

      return memo;
    }, {});
  }

  const cssFiles = [];
  const jsFiles = [];
  const headJSFiles = [];
  const htmlChunks = opts.htmlChunks.map(htmlChunk => {
    return _utils().lodash.isPlainObject(htmlChunk) ? htmlChunk : {
      name: htmlChunk
    };
  });
  htmlChunks.forEach(({
    name,
    headScript
  }) => {
    const cssFile = opts.noChunk ? `${name}.css` : chunksMap[`${name}.css`];

    if (cssFile) {
      cssFiles.push(cssFile);
    }

    const jsFile = opts.noChunk ? `${name}.js` : chunksMap[`${name}.js`];
    (0, _assert().default)(jsFile, `chunk of ${name} not found.`);

    if (headScript) {
      headJSFiles.push(jsFile);
    } else {
      jsFiles.push(jsFile);
    }
  });
  return {
    cssFiles,
    jsFiles,
    headJSFiles
  };
}

function getHtmlGenerator({
  api
}) {
  function getDocumentTplPath() {
    const docPath = (0, _path().join)(api.paths.absPagesPath, 'document.ejs');
    return (0, _fs().existsSync)(docPath) ? docPath : '';
  }

  class Html extends api.Html {
    constructor() {
      super({
        config: api.config,
        tplPath: getDocumentTplPath()
      });
    }

    getContent(args) {
      var _superprop_getGetContent = () => super.getContent,
          _this = this;

      return _asyncToGenerator(function* () {
        var _api$config$exportSta;

        function applyPlugins(_x) {
          return _applyPlugins.apply(this, arguments);
        }

        function _applyPlugins() {
          _applyPlugins = _asyncToGenerator(function* (opts) {
            return yield api.applyPlugins({
              key: opts.key,
              type: api.ApplyPluginsType.add,
              initialValue: opts.initialState || [],
              args: {
                route: args.route
              }
            });
          });
          return _applyPlugins.apply(this, arguments);
        }

        let routerBaseStr = JSON.stringify(api.config.base);
        let publicPathStr = JSON.stringify(api.config.publicPath);

        if (api.config.exportStatic && ((_api$config$exportSta = api.config.exportStatic) === null || _api$config$exportSta === void 0 ? void 0 : _api$config$exportSta.dynamicRoot)) {
          routerBaseStr = `location.pathname.split('/').slice(0, -${args.route.path.split('/').length - 1}).concat('').join('/')`;
          publicPathStr = `location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + window.routerBase`;
        } // window.resourceBaseUrl 用来兼容 egg.js 项目注入的 publicPath


        publicPathStr = `window.resourceBaseUrl || ${publicPathStr};`;
        publicPathStr = yield api.applyPlugins({
          key: 'modifyPublicPathStr',
          type: api.ApplyPluginsType.modify,
          initialValue: publicPathStr,
          args: {
            route: args.route
          }
        });
        const htmlChunks = yield api.applyPlugins({
          key: 'modifyHTMLChunks',
          type: api.ApplyPluginsType.modify,
          initialValue: api.config.chunks || ['umi'],
          args: {
            route: args.route,
            assets: args.assets,
            chunks: args.chunks
          }
        });

        const _chunksToFiles = chunksToFiles({
          htmlChunks,
          chunks: args.chunks,
          noChunk: args.noChunk
        }),
              cssFiles = _chunksToFiles.cssFiles,
              jsFiles = _chunksToFiles.jsFiles,
              headJSFiles = _chunksToFiles.headJSFiles;

        return yield _superprop_getGetContent().call(_this, {
          route: args.route,
          cssFiles,
          headJSFiles,
          jsFiles,
          headScripts: yield applyPlugins({
            key: 'addHTMLHeadScripts',
            initialState: [// routerBase 只在部署路径不固定时才会用到，exportStatic.dynamicRoot
            // UPDATE: 内部 render 会依赖 routerBase，先始终生成

            /* api.config.exportStatic?.dynamicRoot && */
            {
              content: `window.routerBase = ${routerBaseStr};`
            }, // html 里的 publicPath
            // 只在设置了 runtimePublicPath 或 exportStatic?.dynamicRoot 时才会用到
            // 设置了 exportStatic?.dynamicRoot 时会自动设置 runtimePublicPath
            api.config.runtimePublicPath && {
              content: `window.publicPath = ${publicPathStr};`
            }].filter(Boolean)
          }),
          links: yield applyPlugins({
            key: 'addHTMLLinks'
          }),
          metas: yield applyPlugins({
            key: 'addHTMLMetas'
          }),
          scripts: yield applyPlugins({
            key: 'addHTMLScripts'
          }),
          styles: yield applyPlugins({
            key: 'addHTMLStyles'
          }),

          // @ts-ignore
          modifyHTML(memo, args) {
            return _asyncToGenerator(function* () {
              return yield api.applyPlugins({
                key: 'modifyHTML',
                type: api.ApplyPluginsType.modify,
                initialValue: memo,
                args
              });
            })();
          }

        });
      })();
    }

    getRouteMap() {
      var _this2 = this;

      return _asyncToGenerator(function* () {
        const routes = yield api.getRoutes();
        const flatRoutes = getFlatRoutes({
          routes
        });
        return flatRoutes.map(route => {
          // @ts-ignore
          const file = _this2.getHtmlPath(route.path);

          return {
            route,
            file
          };
        });
      })();
    }

  }

  return new Html();
}
/**
 * flatten routes using routes config
 * @param opts
 */


function getFlatRoutes(opts) {
  return opts.routes.reduce((memo, route) => {
    const routes = route.routes,
          path = route.path;

    if (path && !path.includes('?')) {
      memo.push(route);
    }

    if (routes) {
      memo = memo.concat(getFlatRoutes({
        routes
      }));
    }

    return memo;
  }, []);
}