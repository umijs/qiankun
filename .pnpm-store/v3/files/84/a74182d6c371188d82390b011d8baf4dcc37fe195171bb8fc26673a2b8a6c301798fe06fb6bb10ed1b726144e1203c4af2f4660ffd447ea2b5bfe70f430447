"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getConfig;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _bundlerUtils() {
  const data = require("@umijs/bundler-utils");

  _bundlerUtils = function _bundlerUtils() {
    return data;
  };

  return data;
}

function _caseSensitivePathsWebpackPlugin() {
  const data = _interopRequireDefault(require("@umijs/case-sensitive-paths-webpack-plugin"));

  _caseSensitivePathsWebpackPlugin = function _caseSensitivePathsWebpackPlugin() {
    return data;
  };

  return data;
}

function defaultWebpack() {
  const data = _interopRequireWildcard(require("@umijs/deps/compiled/webpack"));

  defaultWebpack = function defaultWebpack() {
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

function _webpackChain() {
  const data = _interopRequireDefault(require("webpack-chain"));

  _webpackChain = function _webpackChain() {
    return data;
  };

  return data;
}

var _css = _interopRequireWildcard(require("./css"));

var _nodeModulesTransform = require("./nodeModulesTransform");

var _pkgMatch = require("./pkgMatch");

var _resolveDefine = _interopRequireDefault(require("./resolveDefine"));

var _terserOptions = _interopRequireDefault(require("./terserOptions"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function onWebpackInitWithPromise() {
  return new Promise(resolve => {
    defaultWebpack().onWebpackInit(() => {
      resolve();
    });
  });
}

function getConfig(_x) {
  return _getConfig.apply(this, arguments);
}

function _getConfig() {
  _getConfig = _asyncToGenerator(function* (opts) {
    yield onWebpackInitWithPromise();
    const cwd = opts.cwd,
          config = opts.config,
          type = opts.type,
          env = opts.env,
          entry = opts.entry,
          hot = opts.hot,
          port = opts.port,
          mfsu = opts.mfsu,
          _opts$bundleImplement = opts.bundleImplementor,
          bundleImplementor = _opts$bundleImplement === void 0 ? defaultWebpack() : _opts$bundleImplement,
          modifyBabelOpts = opts.modifyBabelOpts,
          modifyBabelPresetOpts = opts.modifyBabelPresetOpts,
          miniCSSExtractPluginPath = opts.miniCSSExtractPluginPath,
          miniCSSExtractPluginLoaderPath = opts.miniCSSExtractPluginLoaderPath;
    let webpackConfig = new (_webpackChain().default)();
    webpackConfig.mode(env);
    const isWebpack5 = bundleImplementor.version.startsWith('5');
    const isDev = env === 'development';
    const isProd = env === 'production';
    const disableCompress = process.env.COMPRESS === 'none'; // entry

    if (entry) {
      Object.keys(entry).forEach(key => {
        const e = webpackConfig.entry(key); // 提供打包好的版本，不消耗 webpack 编译时间
        // if (hot && isDev) {
        //   e.add(require.resolve('../webpackHotDevClient/webpackHotDevClient'));
        // }

        if (config.runtimePublicPath) {
          e.add(require.resolve('./runtimePublicPathEntry'));
        }

        e.add(entry[key]);
      });
    } // devtool


    const devtool = config.devtool;
    webpackConfig.devtool(isDev ? // devtool 设为 false 时不 fallback 到 cheap-module-source-map
    devtool === false ? false : devtool || 'cheap-module-source-map' : devtool);
    const useHash = mfsu && isDev || config.hash && isProd;
    const absOutputPath = (0, _path().join)(cwd, config.outputPath || 'dist');
    webpackConfig.output.path(absOutputPath).filename(useHash ? `[name].[contenthash:8].js` : `[name].js`).chunkFilename(useHash ? `[name].[contenthash:8].async.js` : `[name].js`).publicPath(config.publicPath).pathinfo(isDev || disableCompress);

    if (!isWebpack5) {
      webpackConfig.output // remove this after webpack@5
      // free memory of assets after emitting
      .futureEmitAssets(true);
    } // resolve
    // prettier-ignore


    webpackConfig.resolve // 不能设为 false，因为 tnpm 是通过 link 处理依赖，设为 false tnpm 下会有大量的冗余模块
    .set('symlinks', true).modules.add('node_modules').add((0, _path().join)(__dirname, '../../node_modules')) // TODO: 处理 yarn 全局安装时的 resolve 问题
    .end().extensions.merge(['.web.js', '.wasm', '.mjs', '.js', '.web.jsx', '.jsx', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json']); // resolve.alias

    if (config.alias) {
      Object.keys(config.alias).forEach(key => {
        webpackConfig.resolve.alias.set(key, config.alias[key]);
      });
    } // 都用绝对地址，应该不用配 resolveLoader
    // webpackConfig.resolveLoader.modules
    //   .add(join(__dirname, '../../node_modules'))
    //   .add(join(__dirname, '../../../../node_modules'));
    // modules and loaders ---------------------------------------------


    const _getTargetsAndBrowser = (0, _bundlerUtils().getTargetsAndBrowsersList)({
      config,
      type
    }),
          targets = _getTargetsAndBrowser.targets,
          browserslist = _getTargetsAndBrowser.browserslist;

    let presetOpts = (0, _bundlerUtils().getBabelPresetOpts)({
      config,
      env,
      targets
    });

    if (modifyBabelPresetOpts) {
      presetOpts = yield modifyBabelPresetOpts(presetOpts, {
        type,
        mfsu
      });
    }

    let babelOpts = (0, _bundlerUtils().getBabelOpts)({
      cwd,
      config,
      presetOpts
    });

    if (modifyBabelOpts) {
      babelOpts = yield modifyBabelOpts(babelOpts, {
        type,
        mfsu
      });
    } // prettier-ignore


    webpackConfig.module.rule('js').test(/\.(js|mjs|jsx|ts|tsx)$/).include.add([cwd, // import module out of cwd using APP_ROOT
    // issue: https://github.com/umijs/umi/issues/5594
    ...(process.env.APP_ROOT ? [process.cwd()] : [])]).end().exclude.add(/node_modules/) // don't compile mfsu temp files
    // TODO: do not hard code
    .add(/\.mfsu/).end().use('babel-loader').loader(require.resolve('@umijs/deps/compiled/babel-loader')).options(babelOpts);

    if (config.extraBabelIncludes) {
      config.extraBabelIncludes.forEach((include, index) => {
        const rule = `extraBabelInclude_${index}`; // prettier-ignore

        webpackConfig.module.rule(rule).test(/\.(js|mjs|jsx)$/).include.add(a => {
          // 支持绝对路径匹配
          if ((0, _path().isAbsolute)(include)) {
            return a.includes(include);
          } // 支持 node_modules 下的 npm 包


          if (!a.includes('node_modules')) return false;
          const pkgPath = (0, _pkgMatch.getPkgPath)(a);
          return (0, _pkgMatch.shouldTransform)(pkgPath, include);
        }).end().use('babel-loader').loader(require.resolve('@umijs/deps/compiled/babel-loader')).options(babelOpts);
      });
    } // prettier-ignore


    webpackConfig.module.rule('ts-in-node_modules').test(/\.(jsx|ts|tsx)$/).include.add(/node_modules/).end().use('babel-loader').loader(require.resolve('@umijs/deps/compiled/babel-loader')).options(babelOpts); // prettier-ignore

    const rule = webpackConfig.module.rule('js-in-node_modules').test(/\.(js|mjs)$/);
    const nodeModulesTransform = config.nodeModulesTransform || {
      type: 'all',
      exclude: []
    };

    if (nodeModulesTransform.type === 'all') {
      const exclude = _utils().lodash.uniq([..._nodeModulesTransform.TYPE_ALL_EXCLUDE, ...(nodeModulesTransform.exclude || [])]);

      const pkgs = (0, _nodeModulesTransform.excludeToPkgs)({
        exclude
      }); // prettier-ignore

      rule.include.add(/node_modules/).end().exclude.add(path => {
        return (0, _nodeModulesTransform.isMatch)({
          path,
          pkgs
        });
      }).end();
    } else {
      const pkgs = _objectSpread(_objectSpread({}, (0, _nodeModulesTransform.es5ImcompatibleVersionsToPkg)()), (0, _nodeModulesTransform.excludeToPkgs)({
        exclude: nodeModulesTransform.exclude || []
      }));

      rule.include.add(path => {
        return (0, _nodeModulesTransform.isMatch)({
          path,
          pkgs
        });
      }).end();
    }

    rule.use('babel-loader').loader(require.resolve('@umijs/deps/compiled/babel-loader')).options((0, _bundlerUtils().getBabelDepsOpts)({
      cwd,
      env,
      config
    }));
    const staticDir = mfsu ? 'mf-static' : 'static'; // prettier-ignore

    webpackConfig.module.rule('images').test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/).use('url-loader').loader(require.resolve('@umijs/deps/compiled/url-loader')).options({
      limit: config.inlineLimit || 10000,
      name: `${staticDir}/[name].[hash:8].[ext]`,
      // require 图片的时候不用加 .default
      esModule: false,
      fallback: {
        loader: require.resolve('@umijs/deps/compiled/file-loader'),
        options: {
          name: `${staticDir}/[name].[hash:8].[ext]`,
          esModule: false
        }
      }
    }); // prettier-ignore

    webpackConfig.module.rule('avif').test(/\.(avif)(\?.*)?$/).use('file-loader').loader(require.resolve('@umijs/deps/compiled/file-loader')).options({
      name: `${staticDir}/[name].[hash:8].[ext]`,
      esModule: false
    }); // prettier-ignore

    webpackConfig.module.rule('svg').test(/\.(svg)(\?.*)?$/).use('file-loader').loader(require.resolve('@umijs/deps/compiled/file-loader')).options({
      name: `${staticDir}/[name].[hash:8].[ext]`,
      esModule: false
    }); // prettier-ignore

    webpackConfig.module.rule('fonts').test(/\.(eot|woff|woff2|ttf)(\?.*)?$/).use('file-loader').loader(require.resolve('@umijs/deps/compiled/file-loader')).options({
      name: `${staticDir}/[name].[hash:8].[ext]`,
      esModule: false
    }); // prettier-ignore

    webpackConfig.module.rule('plaintext').test(/\.(txt|text|md)$/).use('raw-loader').loader(require.resolve('@umijs/deps/compiled/raw-loader'));

    if (config.workerLoader) {
      // prettier-ignore
      webpackConfig.module.rule('worker').test(/.*worker.(ts|js)/).use('worker-loader').loader(require.resolve('@umijs/deps/compiled/worker-loader')).options(config.workerLoader);
    } // css


    (0, _css.default)({
      type,
      mfsu,
      config,
      webpackConfig,
      isDev,
      disableCompress,
      browserslist,
      miniCSSExtractPluginPath,
      miniCSSExtractPluginLoaderPath
    }); // externals

    if (config.externals) {
      webpackConfig.externals(config.externals);
    } // node shims


    if (!isWebpack5) {
      webpackConfig.node.merge({
        setImmediate: false,
        module: 'empty',
        dns: 'mock',
        http2: 'empty',
        process: 'mock',
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
      });
    }

    if (isWebpack5) {
      // @ts-ignore
      webpackConfig.target(['web', 'es5']);
    } // plugins -> ignore moment locale


    if (config.ignoreMomentLocale) {
      webpackConfig.plugin('ignore-moment-locale').use(bundleImplementor.IgnorePlugin, [{
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      }]);
    } // define


    webpackConfig.plugin('define').use(bundleImplementor.DefinePlugin, [(0, _resolveDefine.default)({
      define: config.define || {}
    })]); // progress

    if (process.env.PROGRESS !== 'none') {
      webpackConfig.plugin('progress').use(require.resolve('@umijs/deps/compiled/webpackbar'), [mfsu ? {
        name: 'MFSU',
        color: '#faac00'
      } : config.ssr ? {
        name: type === _types().BundlerConfigType.ssr ? 'Server' : 'Client'
      } : {}]);
    } // copy


    const copyPatterns = [(0, _fs().existsSync)((0, _path().join)(cwd, 'public')) && {
      from: (0, _path().join)(cwd, 'public'),
      info: {
        minimized: true
      }
    }, ...(config.copy ? config.copy.map(item => {
      if (typeof item === 'string') {
        return {
          from: (0, _path().join)(cwd, item),
          to: absOutputPath,
          info: {
            minimized: true
          }
        };
      }

      return {
        from: (0, _path().join)(cwd, item.from),
        to: (0, _path().join)(absOutputPath, item.to),
        info: {
          minimized: true
        }
      };
    }) : [])].filter(Boolean);

    if (copyPatterns.length) {
      webpackConfig.plugin('copy').use(require.resolve('@umijs/deps/compiled/copy-webpack-plugin'), [{
        patterns: copyPatterns
      }]);
    } // timefix
    // webpackConfig
    //   .plugin('MildCompilePlugin')
    //   .use(require('webpack-mild-compile').Plugin);
    // error handler


    if (process.env.FRIENDLY_ERROR !== 'none') {
      webpackConfig.plugin('friendly-error').use(require.resolve('@umijs/deps/compiled/friendly-errors-webpack-plugin'), [{
        clearConsole: false
      }]);
    } // profile


    if (process.env.WEBPACK_PROFILE) {
      webpackConfig.profile(true);
      const statsInclude = ['verbose', 'normal', 'minimal'];
      webpackConfig.stats(statsInclude.includes(process.env.WEBPACK_PROFILE) ? process.env.WEBPACK_PROFILE : 'verbose');

      const StatsPlugin = require('@umijs/deps/compiled/stats-webpack-plugin');

      webpackConfig.plugin('stats-webpack-plugin').use(new StatsPlugin('stats.json', {
        chunkModules: true
      }));
    } // case-sensitive-paths


    webpackConfig.plugin('case-sensitive-paths').use(new (_caseSensitivePathsWebpackPlugin().default)());

    const enableManifest = () => {
      // manifest
      if (config.manifest && type === _types().BundlerConfigType.csr) {
        webpackConfig.plugin('manifest').use(require('@umijs/deps/compiled/webpack-manifest-plugin').WebpackManifestPlugin, [_objectSpread({
          fileName: 'asset-manifest.json'
        }, config.manifest)]);
      }
    };

    webpackConfig.when(isDev, webpackConfig => {
      // mfsu 构建如果有 hmr，会和主应用的 hmr 冲突，因为公用一套全局变量
      if (!mfsu && hot) {
        webpackConfig.plugin('hmr').use(bundleImplementor.HotModuleReplacementPlugin);
      }

      if (config.ssr && config.dynamicImport) {
        enableManifest();
      }
    }, webpackConfig => {
      // don't emit files if have error
      webpackConfig.optimization.noEmitOnErrors(true); // don't show hints when size is too large

      webpackConfig.performance.hints(false); // webpack/lib/HashedModuleIdsPlugin
      // https://webpack.js.org/plugins/hashed-module-ids-plugin/
      // webpack@5 has enabled this in prod by default

      if (!isWebpack5) {
        webpackConfig.plugin('hash-module-ids').use(bundleImplementor.HashedModuleIdsPlugin, []);
      } // manifest


      enableManifest(); // compress

      if (disableCompress) {
        webpackConfig.optimization.minimize(false);
      } else if (!opts.__disableTerserForTest) {
        webpackConfig.optimization.minimizer('terser').use(require.resolve('../webpack/plugins/terser-webpack-plugin'), [{
          terserOptions: (0, _utils().deepmerge)(_terserOptions.default, config.terserOptions || {}),
          sourceMap: Boolean(config.devtool),
          cache: process.env.TERSER_CACHE !== 'none',
          // 兼容内部流程系统，读到的 cpu 数并非真实的
          // 使用 SIGMA_MAX_PROCESSORS_LIMIT 指定真核数
          parallel: process.env.SIGMA_MAX_PROCESSORS_LIMIT ? parseInt(process.env.SIGMA_MAX_PROCESSORS_LIMIT, 10) : true,
          extractComments: false
        }]);
      }
    });

    function createCSSRuleFn(opts) {
      (0, _css.createCSSRule)(_objectSpread({
        webpackConfig,
        config,
        isDev,
        type,
        browserslist,
        miniCSSExtractPluginLoaderPath
      }, opts));
    }

    if (opts.chainWebpack) {
      webpackConfig = yield opts.chainWebpack(webpackConfig, {
        type,
        mfsu,
        webpack: bundleImplementor,
        createCSSRule: createCSSRuleFn
      });
    } // 用户配置的 chainWebpack 优先级最高


    if (config.chainWebpack) {
      // @ts-ignore
      yield config.chainWebpack(webpackConfig, {
        type,
        env,
        // @ts-ignore
        webpack: bundleImplementor,
        createCSSRule: createCSSRuleFn
      });
    }

    let ret = webpackConfig.toConfig(); // node polyfills

    const nodeLibs = require('node-libs-browser');

    const nodePolyfill = process.env.NODE_POLYFILL !== 'none';

    if (isWebpack5 && nodePolyfill) {
      ret.plugins.push(new bundleImplementor.ProvidePlugin({
        process: nodeLibs['process'],
        // ref: https://github.com/umijs/umi/issues/6914
        Buffer: ['buffer', 'Buffer']
      })); // @ts-ignore

      ret.resolve.fallback = _objectSpread(_objectSpread(_objectSpread({}, ret.resolve.fallback), Object.keys(nodeLibs).reduce((memo, key) => {
        if (nodeLibs[key]) {
          memo[key] = nodeLibs[key];
        } else {
          memo[key] = false;
        }

        return memo;
      }, {})), {}, {
        // disable unnecessary node libs
        http: false,
        https: false // css hotModuleReplacement depends on punycode
        // ref: https://github.com/charpeni/react-native-url-polyfill/issues/140
        // punycode: false,
        // mammoth deps on these
        // ref: https://github.com/umijs/umi/issues/6318
        // stream: false,
        // _stream_duplex: false,
        // _stream_passthrough: false,
        // _stream_readable: false,
        // _stream_transform: false,
        // _stream_writable: false,

      });
    } // speed-measure-webpack-plugin


    if (process.env.SPEED_MEASURE && type === _types().BundlerConfigType.csr) {
      const SpeedMeasurePlugin = require('@umijs/deps/compiled/speed-measure-webpack-plugin');

      const smpOption = process.env.SPEED_MEASURE === 'CONSOLE' ? {
        outputFormat: 'human',
        outputTarget: console.log
      } : {
        outputFormat: 'json',
        outputTarget: (0, _path().join)(process.cwd(), 'speed-measure.json')
      };
      const smp = new SpeedMeasurePlugin(smpOption);
      ret = smp.wrap(ret);
    }

    return ret;
  });
  return _getConfig.apply(this, arguments);
}