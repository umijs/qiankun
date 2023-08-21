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

function _server2() {
  const data = require("@umijs/server");

  _server2 = function _server2() {
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

var _buildDevUtils = require("../buildDevUtils");

var _generateFiles = _interopRequireDefault(require("../generateFiles"));

var _createRouteMiddleware = _interopRequireDefault(require("./createRouteMiddleware"));

var _watchPkg = require("./watchPkg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

var _default = api => {
  const paths = api.paths,
        _api$utils = api.utils,
        chalk = _api$utils.chalk,
        portfinder = _api$utils.portfinder;
  let port;
  let hostname;
  let server;
  const unwatchs = [];

  function destroy() {
    var _server, _server$listeningApp;

    var _iterator = _createForOfIteratorHelper(unwatchs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        const unwatch = _step.value;
        unwatch();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    (_server = server) === null || _server === void 0 ? void 0 : (_server$listeningApp = _server.listeningApp) === null || _server$listeningApp === void 0 ? void 0 : _server$listeningApp.close();
  }

  const sharedMap = new Map();
  api.onDevCompileDone({
    fn({
      stats,
      type,
      isFirstCompile
    }) {
      // don't need ssr bundler chunks
      if (type === _types().BundlerConfigType.ssr) {
        return;
      } // store client build chunks


      sharedMap.set('chunks', stats.compilation.chunks); // mfsu ad

      if ( // allow user to disable mfsu ad
      process.env.MFSU_AD !== 'none' && // mfsu is not enable
      !(api.config.mfsu || process.env.ENABLE_MFSU)) {
        const _ref = stats || {},
              _ref$startTime = _ref.startTime,
              startTime = _ref$startTime === void 0 ? 0 : _ref$startTime,
              _ref$endTime = _ref.endTime,
              endTime = _ref$endTime === void 0 ? 0 : _ref$endTime;

        const diff = endTime - startTime;
        const devStartTips = '启动时间有点慢，试试新出的 MFSU 方案，1s+ 完成启动，详见 https://github.com/umijs/umi/issues/6766';
        const hmrTips = '热更新有点慢，试试新出的 MFSU 方案，让热更新回到 500ms 内，详见 https://github.com/umijs/umi/issues/6766';

        if (isFirstCompile && diff > 30000) {
          console.log();
          console.log(chalk.red.bold(devStartTips));
        }

        if (!isFirstCompile && diff > 3000) {
          console.log();
          console.log(chalk.red.bold(hmrTips));
        }
      }
    },

    // 在 commands/dev/dev.ts 的 onDevCompileDone 前执行，避免卡主
    stage: -1
  });
  api.registerCommand({
    name: 'dev',
    description: 'start a dev server for development',
    fn: function () {
      var _fn = _asyncToGenerator(function* ({
        args
      }) {
        var _api$config$devServer, _api$config$devServer2, _process$send, _process;

        const defaultPort = // @ts-ignore
        process.env.PORT || (args === null || args === void 0 ? void 0 : args.port) || ((_api$config$devServer = api.config.devServer) === null || _api$config$devServer === void 0 ? void 0 : _api$config$devServer.port);
        port = yield portfinder.getPortPromise({
          port: defaultPort ? parseInt(String(defaultPort), 10) : 8000
        }); // @ts-ignore

        hostname = process.env.HOST || ((_api$config$devServer2 = api.config.devServer) === null || _api$config$devServer2 === void 0 ? void 0 : _api$config$devServer2.host) || '0.0.0.0';
        console.log(chalk.cyan('Starting the development server...'));
        (_process$send = (_process = process).send) === null || _process$send === void 0 ? void 0 : _process$send.call(_process, {
          type: 'UPDATE_PORT',
          port
        }); // enable https, HTTP/2 by default when using --https

        const isHTTPS = process.env.HTTPS || (args === null || args === void 0 ? void 0 : args.https);
        (0, _buildDevUtils.cleanTmpPathExceptCache)({
          absTmpPath: paths.absTmpPath
        });
        const watch = process.env.WATCH !== 'none'; // generate files

        const unwatchGenerateFiles = yield (0, _generateFiles.default)({
          api,
          watch
        });
        if (unwatchGenerateFiles) unwatchs.push(unwatchGenerateFiles);

        if (watch) {
          // watch pkg changes
          const unwatchPkg = (0, _watchPkg.watchPkg)({
            cwd: api.cwd,

            onChange() {
              console.log();
              api.logger.info(`Plugins in package.json changed.`);
              api.restartServer();
            }

          });
          unwatchs.push(unwatchPkg); // watch config change

          const unwatchConfig = api.service.configInstance.watch({
            userConfig: api.service.userConfig,
            onChange: function () {
              var _onChange = _asyncToGenerator(function* ({
                pluginChanged,
                userConfig,
                valueChanged
              }) {
                if (pluginChanged.length) {
                  console.log();
                  api.logger.info(`Plugins of ${pluginChanged.map(p => p.key).join(', ')} changed.`);
                  api.restartServer();
                }

                if (valueChanged.length) {
                  let reload = false;
                  let regenerateTmpFiles = false;
                  const fns = [];
                  const reloadConfigs = [];
                  valueChanged.forEach(({
                    key,
                    pluginId
                  }) => {
                    const _ref2 = api.service.plugins[pluginId].config || {},
                          onChange = _ref2.onChange;

                    if (onChange === api.ConfigChangeType.regenerateTmpFiles) {
                      regenerateTmpFiles = true;
                    }

                    if (!onChange || onChange === api.ConfigChangeType.reload) {
                      reload = true;
                      reloadConfigs.push(key);
                    }

                    if (typeof onChange === 'function') {
                      fns.push(onChange);
                    }
                  });

                  if (reload) {
                    console.log();
                    api.logger.info(`Config ${reloadConfigs.join(', ')} changed.`);
                    api.restartServer();
                  } else {
                    api.service.userConfig = api.service.configInstance.getUserConfig(); // TODO: simplify, 和 Service 里的逻辑重复了
                    // 需要 Service 露出方法

                    const defaultConfig = yield api.applyPlugins({
                      key: 'modifyDefaultConfig',
                      type: api.ApplyPluginsType.modify,
                      initialValue: yield api.service.configInstance.getDefaultConfig()
                    });
                    api.service.config = yield api.applyPlugins({
                      key: 'modifyConfig',
                      type: api.ApplyPluginsType.modify,
                      initialValue: api.service.configInstance.getConfig({
                        defaultConfig
                      })
                    });

                    if (regenerateTmpFiles) {
                      yield (0, _generateFiles.default)({
                        api
                      });
                    } else {
                      fns.forEach(fn => fn());
                    }
                  }
                }
              });

              function onChange(_x2) {
                return _onChange.apply(this, arguments);
              }

              return onChange;
            }()
          });
          unwatchs.push(unwatchConfig);
        } // delay dev server 启动，避免重复 compile
        // https://github.com/webpack/watchpack/issues/25
        // https://github.com/yessky/webpack-mild-compile


        yield (0, _utils().delay)(500); // dev

        const _yield$getBundleAndCo = yield (0, _buildDevUtils.getBundleAndConfigs)({
          api,
          port
        }),
              bundler = _yield$getBundleAndCo.bundler,
              bundleConfigs = _yield$getBundleAndCo.bundleConfigs,
              bundleImplementor = _yield$getBundleAndCo.bundleImplementor;

        const opts = bundler.setupDevServerOpts({
          bundleConfigs: bundleConfigs,
          bundleImplementor
        });
        const beforeMiddlewares = [...(yield api.applyPlugins({
          key: 'addBeforeMiddewares',
          type: api.ApplyPluginsType.add,
          initialValue: [],
          args: {}
        })), ...(yield api.applyPlugins({
          key: 'addBeforeMiddlewares',
          type: api.ApplyPluginsType.add,
          initialValue: [],
          args: {}
        }))];
        const middlewares = [...(yield api.applyPlugins({
          key: 'addMiddewares',
          type: api.ApplyPluginsType.add,
          initialValue: [],
          args: {}
        })), ...(yield api.applyPlugins({
          key: 'addMiddlewares',
          type: api.ApplyPluginsType.add,
          initialValue: [],
          args: {}
        }))];
        server = new (_server2().Server)(_objectSpread(_objectSpread({}, opts), {}, {
          compress: true,
          https: !!isHTTPS,
          headers: {
            'access-control-allow-origin': '*'
          },
          proxy: api.config.proxy,
          beforeMiddlewares,
          afterMiddlewares: [...middlewares, (0, _createRouteMiddleware.default)({
            api,
            sharedMap
          })]
        }, api.config.devServer || {}));
        const listenRet = yield server.listen({
          port,
          hostname
        });
        return _objectSpread(_objectSpread({}, listenRet), {}, {
          compilerMiddleware: opts.compilerMiddleware,
          destroy
        });
      });

      function fn(_x) {
        return _fn.apply(this, arguments);
      }

      return fn;
    }()
  });
  api.registerMethod({
    name: 'getPort',

    fn() {
      // access env when method be called, to allow other plugin run dev command manually
      (0, _assert().default)(api.env === 'development', `api.getPort() is only valid in development.`);
      return port;
    }

  });
  api.registerMethod({
    name: 'getHostname',

    fn() {
      (0, _assert().default)(api.env === 'development', `api.getHostname() is only valid in development.`);
      return hostname;
    }

  });
  api.registerMethod({
    name: 'getServer',

    fn() {
      (0, _assert().default)(api.env === 'development', `api.getServer() is only valid in development.`);
      return server;
    }

  });
  api.registerMethod({
    name: 'restartServer',

    fn() {
      var _process$send2, _process2;

      console.log(chalk.gray(`Try to restart dev server...`));
      destroy();
      (_process$send2 = (_process2 = process).send) === null || _process$send2 === void 0 ? void 0 : _process$send2.call(_process2, {
        type: 'RESTART'
      });
    }

  });
};

exports.default = _default;