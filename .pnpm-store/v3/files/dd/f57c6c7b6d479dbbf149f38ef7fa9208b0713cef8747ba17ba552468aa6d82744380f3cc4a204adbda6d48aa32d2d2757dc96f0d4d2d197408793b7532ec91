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

function _webpack() {
  const data = _interopRequireDefault(require("webpack"));

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

var _buildDevUtils = require("../../commands/buildDevUtils");

var _constants = require("./constants");

var _getDepVersion = require("./getDepVersion");

var _mfsu = require("./mfsu");

var _modifyChunkNamePlugin = _interopRequireDefault(require("./modifyChunkNamePlugin"));

var _RuntimePublicPathPlugin = require("./RuntimePublicPathPlugin");

var _utils2 = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const debug = (0, _utils().createDebug)('umi:mfsu:DepBuilder');

const normalizeDepPath = (dep, cwd) => {
  return dep.replace(cwd, _constants.CWD).replace(/\//g, '_').replace(/\:/g, '_');
};

class DepBuilder {
  constructor(opts) {
    this.api = void 0;
    this.mode = void 0;
    this.compiler = void 0;
    this.tmpDir = void 0;
    this.isBuilding = void 0;
    this.onBuildCompleteQueue = void 0;
    this.api = opts.api;
    this.mode = opts.mode;
    this.tmpDir = opts.tmpDir || (0, _mfsu.getMfsuPath)(this.api, {
      mode: opts.mode
    });
    this.compiler = null;
    this.isBuilding = false;
    this.onBuildCompleteQueue = [];
  }

  onBuildComplete(fn) {
    if (this.isBuilding) {
      this.onBuildCompleteQueue.push(fn);
    } else {
      fn();
    }
  }

  build(opts) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.isBuilding = true;
      yield _this.writeMFFiles(opts.deps, opts.webpackAlias);

      if (!_this.compiler) {
        // start webpack
        const _yield$getBundleAndCo = yield (0, _buildDevUtils.getBundleAndConfigs)({
          api: _this.api,
          mfsu: true
        }),
              bundleConfigs = _yield$getBundleAndCo.bundleConfigs,
              bundler = _yield$getBundleAndCo.bundler;

        (0, _assert().default)(bundleConfigs.length && bundleConfigs[0], `[MFSU] 预编译找不到 Webpack 配置`);

        let mfConfig = _utils().lodash.cloneDeep(bundleConfigs[0]);

        mfConfig = _this.updateWebpackConfig(mfConfig, opts.deps);
        const watch = _this.mode === 'development';

        const _yield$bundler$build = yield bundler.build({
          bundleConfigs: [mfConfig],
          // TODO: 支持 watch 模式
          // 因为 exposes 不支持动态变更，所以暂不能使用 webpack 的 watch 模式
          watch: false,
          onBuildComplete: (err, stats) => {
            _this.isBuilding = false;

            _this.onBuildCompleteQueue.forEach(fn => fn());

            _this.onBuildCompleteQueue = [];
            opts.onBuildComplete(err, stats);
          }
        }),
              compiler = _yield$bundler$build.compiler; // TODO: 支持 watch 模式
        // this.compiler = compiler;

      }
    })();
  }

  writeMFFiles(deps, webpackAlias) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      // TODO：何时清理？还是不需要清理？加 --force 时清理？
      // 清除原先的目录
      // readdirSync(this.tmpDir).forEach((dir) => {
      //   // 不删除 diff 文件
      //   if (dir !== DEP_INFO_CACHE_FILE) {
      //     unlinkSync(join(this.tmpDir, dir));
      //   }
      // });
      for (var _i = 0, _Object$keys = Object.keys(deps); _i < _Object$keys.length; _i++) {
        let dep = _Object$keys[_i];

        try {
          const requireFrom = (0, _getDepVersion.getAliasedDep)({
            dep,
            webpackAlias
          });
          (0, _fs().writeFileSync)((0, _utils().winPath)((0, _path().join)(_this2.tmpDir, normalizeDepPath(`${_constants.MF_VA_PREFIX}${dep}.js`, _this2.api.cwd))), [yield (0, _utils2.figureOutExport)(_this2.api.cwd, (0, _utils().winPath)(requireFrom), // @ts-ignore
          !!_this2.api.config.mfsu.ignoreNodeBuiltInModules), ''].join('\n').trimLeft(), 'utf-8');
        } catch (err) {
          const e = new Error(`[MFSU] Build virtual application failed since ${err.message}.`);
          e.stack = err.stack;
          throw e;
        }
      }

      const entryFile = '"😛"';
      (0, _fs().writeFileSync)((0, _path().join)(_this2.tmpDir, './index.js'), entryFile);
    })();
  }

  updateWebpackConfig(mfConfig, deps) {
    var _mfConfig$output, _mfConfig$output2;

    mfConfig.stats = 'none';
    mfConfig.entry = (0, _path().join)(this.tmpDir, 'index.js');
    mfConfig.output.path = this.tmpDir; // disable devtool

    mfConfig.devtool = false; // disable library
    // library 会影响 external 的语法，导致报错
    // ref: https://github.com/umijs/plugins/blob/6d3fc2d/packages/plugin-qiankun/src/slave/index.ts#L83

    if ((_mfConfig$output = mfConfig.output) === null || _mfConfig$output === void 0 ? void 0 : _mfConfig$output.library) delete mfConfig.output.library;
    if ((_mfConfig$output2 = mfConfig.output) === null || _mfConfig$output2 === void 0 ? void 0 : _mfConfig$output2.libraryTarget) delete mfConfig.output.libraryTarget; // @ts-ignore

    if (mfConfig.cache && mfConfig.cache.cacheDirectory) {
      // @ts-ignore
      mfConfig.cache.cacheDirectory = (0, _path().join)(this.tmpDir, '.webpackFSCache');
    }

    debug('config.cache', mfConfig.cache);
    const remoteEntryFilename = _constants.MF_VA_PREFIX + 'remoteEntry.js';
    const exposes = {};
    Object.keys(deps).forEach(dep => {
      exposes[`./${dep}`.replace(this.api.cwd, _constants.CWD)] = (0, _path().join)(this.tmpDir, normalizeDepPath(`${_constants.MF_VA_PREFIX}${dep}.js`, this.api.cwd));
    });
    mfConfig.plugins = mfConfig.plugins || []; // 修改 chunk 名

    mfConfig.plugins.push(new _modifyChunkNamePlugin.default()); // mf 插件

    const name = this.api.config.mfsu && this.api.config.mfsu.mfName || _constants.DEFAULT_MF_NAME;
    mfConfig.plugins.push( //@ts-ignore
    new (_webpack().default.container.ModuleFederationPlugin)({
      library: {
        type: 'global',
        name
      },
      name,
      filename: remoteEntryFilename,
      exposes
    })); // runtimePublicPath 替换插件

    if (this.api.config.runtimePublicPath) {
      mfConfig.plugins.push(new _RuntimePublicPathPlugin.RuntimePublicPathPlugin());
    }

    return mfConfig;
  }

}

exports.default = DepBuilder;