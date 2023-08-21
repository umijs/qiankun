"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixRoutePathInWindows = fixRoutePathInWindows;
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _types() {
  const data = require("@umijs/types");

  _types = function _types() {
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

function _os() {
  const data = require("os");

  _os = function _os() {
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

var _constants = require("../../features/ssr/constants");

var _htmlUtils = require("../htmlUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function fixRoutePathInWindows(path) {
  // window 下 : 不是一个合法路径，所以需要处理一下
  // 不直接删除是为了保证 render 可以生效
  if (!path || !(path === null || path === void 0 ? void 0 : path.includes(':')) || (0, _os().platform)() !== 'win32') {
    return path;
  }

  return path.replace(/:/g, '.');
}

function _default(api) {
  // maybe hack but useful
  function ensureServerFileExisted() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if ((0, _fs().existsSync)((0, _path().join)(api.paths.absOutputPath, _constants.OUTPUT_SERVER_FILENAME))) {
          clearInterval(interval);
          resolve({});
        }
      }, 300);
    });
  }

  class HtmlWebpackPlugin {
    apply(compiler) {
      compiler.hooks.emit.tapPromise('UmiHtmlGeneration', /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (compilation) {
          if (api.config.ssr) {
            // waiting umi.server.js emited
            yield ensureServerFileExisted();
          }

          const html = (0, _htmlUtils.getHtmlGenerator)({
            api
          });
          const routeMap = yield api.applyPlugins({
            key: 'modifyExportRouteMap',
            type: api.ApplyPluginsType.modify,
            initialValue: [{
              route: {
                path: '/'
              },
              file: 'index.html'
            }],
            args: {
              html
            }
          });

          var _iterator = _createForOfIteratorHelper(routeMap),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              const _step$value = _step.value,
                    route = _step$value.route,
                    file = _step$value.file;
              const defaultContent = yield html.getContent({
                route,
                assets: compilation.assets,
                chunks: compilation.chunks
              });
              const content = yield api.applyPlugins({
                key: 'modifyProdHTMLContent',
                type: api.ApplyPluginsType.modify,
                initialValue: defaultContent,
                args: {
                  route,
                  file
                }
              });
              compilation.assets[fixRoutePathInWindows(file)] = {
                source: () => content,
                size: () => content.length
              };
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return true;
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }

  }

  api.modifyBundleConfig((bundleConfig, {
    env,
    mfsu,
    type,
    bundler: {
      id
    }
  }) => {
    const enableWriteToDisk = api.config.devServer && api.config.devServer.writeToDisk;

    if (!mfsu && (env === 'production' || enableWriteToDisk) && id === 'webpack' && process.env.HTML !== 'none' && // avoid ssr bundler build override index.html
    type === _types().BundlerConfigType.csr) {
      var _bundleConfig$plugins;

      (_bundleConfig$plugins = bundleConfig.plugins) === null || _bundleConfig$plugins === void 0 ? void 0 : _bundleConfig$plugins.unshift(new HtmlWebpackPlugin());
    }

    return bundleConfig;
  });
}