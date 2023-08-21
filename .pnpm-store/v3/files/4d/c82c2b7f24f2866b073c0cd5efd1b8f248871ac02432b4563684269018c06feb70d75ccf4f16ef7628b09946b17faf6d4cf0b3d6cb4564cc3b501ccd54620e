"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.normalizeReqPath = exports.isMonacoWorker = exports.getMfsuPath = exports.checkConfig = void 0;

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

function _mime() {
  const data = _interopRequireDefault(require("mime"));

  _mime = function _mime() {
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

function _webpack() {
  const data = _interopRequireDefault(require("webpack"));

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

var _babelImportRedirectPlugin = _interopRequireDefault(require("./babel-import-redirect-plugin"));

var _babelPluginAutoExport = _interopRequireDefault(require("./babel-plugin-auto-export"));

var _babelPluginWarnRequire = _interopRequireDefault(require("./babel-plugin-warn-require"));

var _constants = require("./constants");

var _DepBuilder = _interopRequireDefault(require("./DepBuilder"));

var _DepInfo = _interopRequireDefault(require("./DepInfo"));

var _getUmiRedirect = require("./getUmiRedirect");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const debug = (0, _utils().createDebug)('umi:mfsu');

const checkConfig = api => {
  const mfsu = api.config.mfsu; // .mfsu directory do not match babel-loader

  if (mfsu && mfsu.development && mfsu.development.output) {
    (0, _assert().default)(/\.mfsu/.test(mfsu.development.output), `[MFSU] mfsu.development.output must match /\.mfsu/.`);
  }

  if (mfsu && mfsu.production && mfsu.production.output) {
    (0, _assert().default)(/\.mfsu/.test(mfsu.production.output), `[MFSU] mfsu.production.output must match /\.mfsu/.`);
  }
};

exports.checkConfig = checkConfig;

const getMfsuPath = (api, {
  mode
}) => {
  if (mode === 'development') {
    var _api$userConfig$mfsu, _api$userConfig$mfsu$;

    const configPath = (_api$userConfig$mfsu = api.userConfig.mfsu) === null || _api$userConfig$mfsu === void 0 ? void 0 : (_api$userConfig$mfsu$ = _api$userConfig$mfsu.development) === null || _api$userConfig$mfsu$ === void 0 ? void 0 : _api$userConfig$mfsu$.output;
    return configPath ? (0, _path().join)(api.cwd, configPath) : (0, _path().join)(api.paths.absTmpPath, '.cache', '.mfsu');
  } else {
    var _api$userConfig$mfsu2, _api$userConfig$mfsu3;

    const configPath = (_api$userConfig$mfsu2 = api.userConfig.mfsu) === null || _api$userConfig$mfsu2 === void 0 ? void 0 : (_api$userConfig$mfsu3 = _api$userConfig$mfsu2.production) === null || _api$userConfig$mfsu3 === void 0 ? void 0 : _api$userConfig$mfsu3.output;
    return configPath ? (0, _path().join)(api.cwd, configPath) : (0, _path().join)(api.cwd, './.mfsu-production');
  }
};

exports.getMfsuPath = getMfsuPath;

const isMonacoWorker = (api, reqPath, fileRelativePath) => /[a-zA-Z0-9]+\.worker\.js$/.test(reqPath) && (0, _fs().existsSync)((0, _path().join)(getMfsuPath(api, {
  mode: 'development'
}), fileRelativePath));

exports.isMonacoWorker = isMonacoWorker;

const normalizeReqPath = (api, reqPath) => {
  let normalPublicPath = api.config.publicPath;

  if (/^https?\:\/\//.test(normalPublicPath)) {
    normalPublicPath = new URL(normalPublicPath).pathname;
  } else {
    normalPublicPath = normalPublicPath.replace(/^(?:\.+\/?)+/, '/'); // normalPublicPath should start with '/'
  }

  const fileRelativePath = reqPath.replace(new RegExp(`^${normalPublicPath}`), '/').slice(1);
  const isMfAssets = reqPath.startsWith(`${normalPublicPath}mf-va_`) || reqPath.startsWith(`${normalPublicPath}mf-dep_`) || reqPath.startsWith(`${normalPublicPath}mf-static/`) || isMonacoWorker(api, reqPath, fileRelativePath);
  return {
    isMfAssets,
    normalPublicPath,
    fileRelativePath
  };
};

exports.normalizeReqPath = normalizeReqPath;

function _default(api) {
  const webpackAlias = {};
  const webpackExternals = [];
  let publicPath = '/';
  let depInfo;
  let depBuilder;
  let mode = 'development';
  api.onPluginReady({
    fn() {
      const command = process.argv[2];

      if (['dev', 'build'].includes(command)) {
        console.log(_utils().chalk.hex('#faac00')('⏱️  MFSU Enabled'));
      }
    },

    stage: 2
  });
  api.onStart( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* ({
      name,
      args
    }) {
      checkConfig(api);

      if (name === 'build') {
        mode = 'production'; // @ts-ignore
      } else if (name === 'mfsu' && args._[1] === 'build' && args.mode) {
        // umi mfsu build --mode
        // @ts-ignore
        mode = args.mode || 'development';
      }

      (0, _assert().default)(['development', 'production'].includes(mode), `[MFSU] Unsupported mode ${mode}, expect development or production.`);
      debug(`mode: ${mode}`);
      const tmpDir = getMfsuPath(api, {
        mode
      });
      debug(`tmpDir: ${tmpDir}`);

      if (!(0, _fs().existsSync)(tmpDir)) {
        _utils().mkdirp.sync(tmpDir);
      }

      depInfo = new _DepInfo.default({
        tmpDir,
        mode,
        api,
        cwd: api.cwd,
        webpackAlias
      });
      debug('load cache');
      depInfo.loadCache();
      depBuilder = new _DepBuilder.default({
        tmpDir,
        mode,
        api
      });
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  api.modifyConfig({
    fn(memo) {
      var _memo$mfsu;

      return _objectSpread(_objectSpread({}, memo), {}, {
        // Always enable dynamicImport when mfsu is enabled
        dynamicImport: memo.dynamicImport || {},
        // Lock chunks when mfsu is enabled
        // @ts-ignore
        chunks: ((_memo$mfsu = memo.mfsu) === null || _memo$mfsu === void 0 ? void 0 : _memo$mfsu.chunks) || ['umi']
      });
    },

    stage: Infinity
  });
  api.onBuildComplete( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* ({
      err
    }) {
      if (err) return;
      debug(`build deps in production`);
      yield buildDeps();
    });

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  api.onDevCompileDone( /*#__PURE__*/_asyncToGenerator(function* () {
    debug(`build deps in development`);
    yield buildDeps();
  }));
  api.describe({
    key: 'mfsu',
    config: {
      schema(joi) {
        return joi.object({
          development: joi.object({
            output: joi.string()
          }),
          production: joi.object({
            output: joi.string()
          }),
          mfName: joi.string(),
          exportAllMembers: joi.object(),
          chunks: joi.array().items(joi.string()),
          ignoreNodeBuiltInModules: joi.boolean()
        }).description('open mfsu feature');
      }

    },

    enableBy() {
      var _api$userConfig$mfsu4;

      return api.env === 'development' && api.userConfig.mfsu || api.env === 'production' && ((_api$userConfig$mfsu4 = api.userConfig.mfsu) === null || _api$userConfig$mfsu4 === void 0 ? void 0 : _api$userConfig$mfsu4.production) || process.env.ENABLE_MFSU;
    }

  });
  api.modifyBabelPresetOpts({
    fn: (opts, args) => {
      var _api$config$mfsu;

      return _objectSpread(_objectSpread({}, opts), args.mfsu ? {} : {
        importToAwaitRequire: {
          remoteName: api.config.mfsu && api.config.mfsu.mfName || _constants.DEFAULT_MF_NAME,
          matchAll: true,
          webpackAlias,
          webpackExternals,
          alias: {
            [api.cwd]: '$CWD$'
          },
          // @ts-ignore
          exportAllMembers: (_api$config$mfsu = api.config.mfsu) === null || _api$config$mfsu === void 0 ? void 0 : _api$config$mfsu.exportAllMembers,

          onTransformDeps(opts) {
            const file = opts.file.replace(api.paths.absSrcPath + '/', '@/');

            if (process.env.MFSU_DEBUG && !opts.source.startsWith('.')) {
              if (process.env.MFSU_DEBUG === 'MATCHED' && !opts.isMatch) return;
              if (process.env.MFSU_DEBUG === 'UNMATCHED' && opts.isMatch) return;
              console.log(`> import ${_utils().chalk[opts.isMatch ? 'green' : 'red'](opts.source)} from ${file}, ${opts.isMatch ? 'MATCHED' : 'UNMATCHED'}`);
            } // collect dependencies


            if (opts.isMatch) {
              depInfo.addTmpDep(opts.source, file);
            }
          }

        }
      });
    },
    stage: Infinity
  });
  api.modifyBabelOpts({
    fn: function () {
      var _fn = _asyncToGenerator(function* (opts) {
        var _opts$presets;

        webpackAlias['core-js'] = (0, _path().dirname)(require.resolve('core-js/package.json'));
        webpackAlias['regenerator-runtime/runtime'] = require.resolve('regenerator-runtime/runtime'); // @ts-ignore

        const umiRedirect = yield (0, _getUmiRedirect.getUmiRedirect)(process.env.UMI_DIR); // 降低 babel-preset-umi 的优先级，保证 core-js 可以被插件及时编译

        (_opts$presets = opts.presets) === null || _opts$presets === void 0 ? void 0 : _opts$presets.forEach(preset => {
          if (preset instanceof Array && /babel-preset-umi/.test(preset[0])) {
            preset[1].env.useBuiltIns = false;
            preset[1].env.corejs = false;
          }
        });
        opts.plugins = [_babelPluginWarnRequire.default, _babelPluginAutoExport.default, [_babelImportRedirectPlugin.default, {
          umi: umiRedirect,
          dumi: umiRedirect,
          '@alipay/bigfish': umiRedirect
        }], ...opts.plugins];
        return opts;
      });

      function fn(_x3) {
        return _fn.apply(this, arguments);
      }

      return fn;
    }(),
    stage: Infinity
  });
  api.addBeforeMiddlewares(() => {
    return (req, res, next) => {
      const path = req.path;

      const _normalizeReqPath = normalizeReqPath(api, req.path),
            isMfAssets = _normalizeReqPath.isMfAssets,
            fileRelativePath = _normalizeReqPath.fileRelativePath;

      if (isMfAssets) {
        depBuilder.onBuildComplete(() => {
          const mfsuPath = getMfsuPath(api, {
            mode: 'development'
          });
          const content = (0, _fs().readFileSync)((0, _path().join)(mfsuPath, fileRelativePath));
          res.setHeader('content-type', `${_mime().default.lookup((0, _path().parse)(path || '').ext)}; charset=UTF-8`); // 排除入口文件，因为 hash 是入口文件控制的

          if (!/remoteEntry.js/.test(req.url)) {
            res.setHeader('cache-control', 'max-age=31536000,immutable');
          }

          res.send(content);
        });
      } else {
        next();
      }
    };
  }); // 修改 webpack 配置

  api.register({
    key: 'modifyBundleConfig',

    fn(memo, {
      type,
      mfsu
    }) {
      if (type === _types().BundlerConfigType.csr) {
        Object.assign(webpackAlias, memo.resolve.alias || {});
        const externals = memo.externals || {};
        webpackExternals.push(...(Array.isArray(externals) ? externals : [externals]));
        publicPath = memo.output.publicPath;

        if (!mfsu) {
          const mfName = api.config.mfsu && api.config.mfsu.mfName || _constants.DEFAULT_MF_NAME;
          memo.plugins.push(new (_webpack().default.container.ModuleFederationPlugin)({
            name: 'umi-app',
            remotes: {
              [mfName]: `${mfName}@${_constants.MF_VA_PREFIX}remoteEntry.js`
            }
          })); // 避免 MonacoEditorWebpackPlugin 在项目编译阶段重复编译 worker

          const hasMonacoPlugin = memo.plugins.some(plugin => {
            return plugin.constructor.name === 'MonacoEditorWebpackPlugin';
          });

          if (hasMonacoPlugin) {
            memo.plugins.push(new class MonacoEditorWebpackPluginHack {
              apply(compiler) {
                const taps = compiler.hooks.make['taps'];
                compiler.hooks.make['taps'] = taps.filter(tap => {
                  // ref: https://github.com/microsoft/monaco-editor-webpack-plugin/blob/3e40369/src/plugins/AddWorkerEntryPointPlugin.ts#L34
                  return !(tap.name === 'AddWorkerEntryPointPlugin');
                });
              }

            }());
          }
        }
      }

      return memo;
    },

    stage: Infinity
  });

  function buildDeps() {
    return _buildDeps.apply(this, arguments);
  } // npx umi mfsu build
  // npx umi mfsu build --mode production
  // npx umi mfsu build --mode development --force


  function _buildDeps() {
    _buildDeps = _asyncToGenerator(function* (opts = {}) {
      const _depInfo$loadTmpDeps = depInfo.loadTmpDeps(),
            shouldBuild = _depInfo$loadTmpDeps.shouldBuild;

      debug(`shouldBuild: ${shouldBuild}, force: ${opts.force}`);

      if (opts.force || shouldBuild) {
        yield depBuilder.build({
          deps: depInfo.data.deps,
          webpackAlias,

          onBuildComplete(err, stats) {
            debug(`build complete with err ${err}`);

            if (err || stats.hasErrors()) {
              return;
            }

            debug('write cache');
            depInfo.writeCache();

            if (mode === 'development') {
              const server = api.getServer();
              debug(`refresh server`);
              server.sockWrite({
                type: 'ok',
                data: {
                  reload: true
                }
              });
            }
          }

        });
      }

      if (mode === 'production') {
        // production 模式，build 完后将产物移动到 dist 中
        debug(`copy mf output files to dist`);
        (0, _utils2.copy)(depBuilder.tmpDir, (0, _path().join)(api.cwd, api.userConfig.outputPath || './dist'));
      }
    });
    return _buildDeps.apply(this, arguments);
  }

  api.registerCommand({
    name: 'mfsu',

    fn({
      args
    }) {
      return _asyncToGenerator(function* () {
        switch (args._[0]) {
          case 'build':
            console.log('[MFSU] build deps...');
            yield buildDeps({
              force: args.force
            });
            break;

          default:
            throw new Error(`[MFSU] Unsupported subcommand ${args._[0]} for mfsu.`);
        }
      })();
    }

  });
}