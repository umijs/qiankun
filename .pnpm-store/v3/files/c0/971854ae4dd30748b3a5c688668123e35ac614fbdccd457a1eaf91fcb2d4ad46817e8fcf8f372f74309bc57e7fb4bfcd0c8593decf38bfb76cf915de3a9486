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

var _default = api => {
  api.describe({
    key: 'webpack5',

    enableBy() {
      var _api$userConfig$mfsu;

      return (// 需要和 USE_WEBPACK_5 区分开，因为有 mfsu 配置不一定开启 webpack 5
        process.env.ENABLE_WEBPACK_5 || api.userConfig.webpack5 || api.env === 'development' && api.userConfig.mfsu || api.env === 'production' && ((_api$userConfig$mfsu = api.userConfig.mfsu) === null || _api$userConfig$mfsu === void 0 ? void 0 : _api$userConfig$mfsu.production)
      );
    },

    config: {
      schema(joi) {
        return joi.object().keys({
          // Ref: https://webpack.js.org/configuration/experiments/#experimentslazycompilation
          lazyCompilation: joi.object().keys({
            entries: joi.boolean(),
            imports: joi.boolean(),
            test: joi.any()
          })
        });
      }

    }
  });
  api.onPluginReady(() => {
    const command = process.argv[2];

    if (['dev', 'build'].includes(command)) {
      console.log('Bundle with webpack 5...');
    }

    process.env.USE_WEBPACK_5 = '1'; // 开启 persistent caching 后，不再需要 babel cache 了
    // 只要不禁用物理缓存，就禁用 babel 缓存

    if (process.env.WEBPACK_FS_CACHE !== 'none') {
      process.env.BABEL_CACHE = 'none';
    }
  });
  api.modifyBundleConfig(memo => {
    var _api$config$webpack;

    // lazy compilation
    // @ts-ignore
    if (api.env === 'development' && ((_api$config$webpack = api.config.webpack5) === null || _api$config$webpack === void 0 ? void 0 : _api$config$webpack.lazyCompilation)) {
      // @ts-ignore
      memo.experiments = _objectSpread(_objectSpread({}, memo.experiments), {}, {
        lazyCompilation: _objectSpread({
          // client: require.resolve(
          //   '@umijs/deps/compiled/webpack/5/lazy-compilation-web.js',
          // ),
          backend: require('@umijs/deps/compiled/webpack/5/lazyCompilationBackend.js'),
          entries: false
        }, api.config.webpack5.lazyCompilation)
      });
    } // 默认开启 top level await
    // @ts-ignore


    memo.experiments = _objectSpread(_objectSpread({}, memo.experiments), {}, {
      topLevelAwait: true
    }); // 缓存默认开启，可通过环境变量关闭

    if (process.env.WEBPACK_FS_CACHE !== 'none') {
      const configFile = api.service.configInstance.configFile;
      memo.cache = {
        type: 'filesystem',
        // using umi version as `cache.version`
        version: process.env.UMI_VERSION,
        buildDependencies: {
          config: [(0, _path().join)(api.cwd, 'package.json'), api.config.webpack5 && configFile ? (0, _path().join)(api.cwd, configFile) : undefined].filter(Boolean)
        },
        cacheDirectory: (0, _path().join)(api.paths.absTmpPath, '.cache', 'webpack')
      }; // tnpm 安装依赖的情况 webpack 默认的 managedPaths 不生效
      // 使用 immutablePaths 避免 node_modules 的内容被写入缓存
      // tnpm 安装的依赖路径中同时包含包名和版本号，满足 immutablePaths 使用的条件
      // ref: smallfish

      if (
      /*isTnpm*/
      require('react-router/package').__npminstall_done) {
        // @ts-ignore
        memo.snapshot = _objectSpread(_objectSpread({}, memo.snapshot || {}), {}, {
          immutablePaths: [api.paths.absNodeModulesPath]
        });
      } // 缓存失效会有日志，这里清除下日志
      // @ts-ignore


      memo.infrastructureLogging = _objectSpread({
        level: 'error'
      }, process.env.WEBPACK_FS_CACHE_DEBUG ? {
        debug: /webpack\.cache/
      } : {});
    }

    return memo;
  });
};

exports.default = _default;