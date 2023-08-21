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

function _tapable() {
  const data = require("@umijs/deps/compiled/tapable");

  _tapable = function _tapable() {
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

function _events() {
  const data = require("events");

  _events = function _events() {
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

var _Config = _interopRequireDefault(require("../Config/Config"));

var _configUtils = require("../Config/utils/configUtils");

var _Logger = _interopRequireDefault(require("../Logger/Logger"));

var _enums = require("./enums");

var _getPaths = _interopRequireDefault(require("./getPaths"));

var _PluginAPI = _interopRequireDefault(require("./PluginAPI"));

var _isPromise = _interopRequireDefault(require("./utils/isPromise"));

var _loadDotEnv = _interopRequireDefault(require("./utils/loadDotEnv"));

var _pluginUtils = require("./utils/pluginUtils");

const _excluded = ["presets", "plugins"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = new _Logger.default('umi:core:Service'); // TODO
// 1. duplicated key

class Service extends _events().EventEmitter {
  // lifecycle stage
  // registered commands
  // including presets and plugins
  // plugin methods
  // initial presets and plugins from arguments, config, process.env, and package.json
  // presets and plugins for registering
  // user config
  // babel register
  // hooks
  // paths
  constructor(opts) {
    super();
    this.cwd = void 0;
    this.pkg = void 0;
    this.skipPluginIds = new Set();
    this.stage = _enums.ServiceStage.uninitialized;
    this.commands = {};
    this.plugins = {};
    this.pluginMethods = {};
    this.initialPresets = void 0;
    this.initialPlugins = void 0;
    this._extraPresets = [];
    this._extraPlugins = [];
    this.userConfig = void 0;
    this.configInstance = void 0;
    this.config = null;
    this.babelRegister = void 0;
    this.hooksByPluginId = {};
    this.hooks = {};
    this.paths = {};
    this.env = void 0;
    this.ApplyPluginsType = _enums.ApplyPluginsType;
    this.EnableBy = _enums.EnableBy;
    this.ConfigChangeType = _enums.ConfigChangeType;
    this.ServiceStage = _enums.ServiceStage;
    this.args = void 0;
    logger.debug('opts:');
    logger.debug(opts);
    this.cwd = opts.cwd || process.cwd(); // repoDir should be the root dir of repo

    this.pkg = opts.pkg || this.resolvePackage();
    this.env = opts.env || process.env.NODE_ENV;
    (0, _assert().default)((0, _fs().existsSync)(this.cwd), `cwd ${this.cwd} does not exist.`); // register babel before config parsing

    this.babelRegister = new (_utils().BabelRegister)(); // load .env or .local.env

    logger.debug('load env');
    this.loadEnv(); // get user config without validation

    logger.debug('get user config');
    const configFiles = opts.configFiles;
    this.configInstance = new _Config.default({
      cwd: this.cwd,
      service: this,
      localConfig: this.env === 'development',
      configFiles: Array.isArray(configFiles) && !!configFiles[0] ? configFiles : undefined
    });
    this.userConfig = this.configInstance.getUserConfig();
    logger.debug('userConfig:');
    logger.debug(this.userConfig); // get paths

    this.paths = (0, _getPaths.default)({
      cwd: this.cwd,
      config: this.userConfig,
      env: this.env
    });
    logger.debug('paths:');
    logger.debug(this.paths); // setup initial presets and plugins

    const baseOpts = {
      pkg: this.pkg,
      cwd: this.cwd
    };
    this.initialPresets = (0, _pluginUtils.resolvePresets)(_objectSpread(_objectSpread({}, baseOpts), {}, {
      presets: opts.presets || [],
      userConfigPresets: this.userConfig.presets || []
    }));
    this.initialPlugins = (0, _pluginUtils.resolvePlugins)(_objectSpread(_objectSpread({}, baseOpts), {}, {
      plugins: opts.plugins || [],
      userConfigPlugins: this.userConfig.plugins || []
    }));
    this.babelRegister.setOnlyMap({
      key: 'initialPlugins',
      value: _utils().lodash.uniq([...this.initialPresets.map(({
        path
      }) => path), ...this.initialPlugins.map(({
        path
      }) => path)])
    });
    logger.debug('initial presets:');
    logger.debug(this.initialPresets);
    logger.debug('initial plugins:');
    logger.debug(this.initialPlugins);
  }

  setStage(stage) {
    this.stage = stage;
  }

  resolvePackage() {
    try {
      return require((0, _path().join)(this.cwd, 'package.json'));
    } catch (e) {
      return {};
    }
  }

  loadEnv() {
    const basePath = (0, _path().join)(this.cwd, '.env');
    const localPath = `${basePath}.local`;
    (0, _loadDotEnv.default)(localPath);
    (0, _loadDotEnv.default)(basePath);
  }

  init() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.setStage(_enums.ServiceStage.init); // we should have the final hooksByPluginId which is added with api.register()


      yield _this.initPresetsAndPlugins(); // collect false configs, then add to this.skipPluginIds
      // skipPluginIds include two parts:
      // 1. api.skipPlugins()
      // 2. user config with the `false` value
      // Object.keys(this.hooksByPluginId).forEach(pluginId => {
      //   const { key } = this.plugins[pluginId];
      //   if (this.getPluginOptsWithKey(key) === false) {
      //     this.skipPluginIds.add(pluginId);
      //   }
      // });
      // delete hooks from this.hooksByPluginId with this.skipPluginIds
      // for (const pluginId of this.skipPluginIds) {
      //   if (this.hooksByPluginId[pluginId]) delete this.hooksByPluginId[pluginId];
      //   delete this.plugins[pluginId];
      // }
      // hooksByPluginId -> hooks
      // hooks is mapped with hook key, prepared for applyPlugins()

      _this.setStage(_enums.ServiceStage.initHooks);

      Object.keys(_this.hooksByPluginId).forEach(id => {
        const hooks = _this.hooksByPluginId[id];
        hooks.forEach(hook => {
          const key = hook.key;
          hook.pluginId = id;
          _this.hooks[key] = (_this.hooks[key] || []).concat(hook);
        });
      }); // plugin is totally ready

      _this.setStage(_enums.ServiceStage.pluginReady);

      yield _this.applyPlugins({
        key: 'onPluginReady',
        type: _enums.ApplyPluginsType.event
      }); // get config, including:
      // 1. merge default config
      // 2. validate

      _this.setStage(_enums.ServiceStage.getConfig);

      const defaultConfig = yield _this.applyPlugins({
        key: 'modifyDefaultConfig',
        type: _this.ApplyPluginsType.modify,
        initialValue: yield _this.configInstance.getDefaultConfig()
      });
      _this.config = yield _this.applyPlugins({
        key: 'modifyConfig',
        type: _this.ApplyPluginsType.modify,
        initialValue: _this.configInstance.getConfig({
          defaultConfig
        })
      }); // merge paths to keep the this.paths ref

      _this.setStage(_enums.ServiceStage.getPaths); // config.outputPath may be modified by plugins


      if (_this.config.outputPath) {
        _this.paths.absOutputPath = (0, _path().join)(_this.cwd, _this.config.outputPath);
      }

      const paths = yield _this.applyPlugins({
        key: 'modifyPaths',
        type: _enums.ApplyPluginsType.modify,
        initialValue: _this.paths
      });
      Object.keys(paths).forEach(key => {
        _this.paths[key] = paths[key];
      });
    })();
  }

  initPresetsAndPlugins() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.setStage(_enums.ServiceStage.initPresets);

      _this2._extraPlugins = [];

      while (_this2.initialPresets.length) {
        yield _this2.initPreset(_this2.initialPresets.shift());
      }

      _this2.setStage(_enums.ServiceStage.initPlugins);

      _this2._extraPlugins.push(..._this2.initialPlugins);

      while (_this2._extraPlugins.length) {
        yield _this2.initPlugin(_this2._extraPlugins.shift());
      }
    })();
  }

  getPluginAPI(opts) {
    const pluginAPI = new _PluginAPI.default(opts); // register built-in methods

    ['onPluginReady', 'modifyPaths', 'onStart', 'modifyDefaultConfig', 'modifyConfig'].forEach(name => {
      pluginAPI.registerMethod({
        name,
        exitsError: false
      });
    });
    return new Proxy(pluginAPI, {
      get: (target, prop) => {
        // 由于 pluginMethods 需要在 register 阶段可用
        // 必须通过 proxy 的方式动态获取最新，以实现边注册边使用的效果
        if (this.pluginMethods[prop]) return this.pluginMethods[prop];

        if (['applyPlugins', 'ApplyPluginsType', 'EnableBy', 'ConfigChangeType', 'babelRegister', 'stage', 'ServiceStage', 'paths', 'cwd', 'pkg', 'userConfig', 'config', 'env', 'args', 'hasPlugins', 'hasPresets'].includes(prop)) {
          return typeof this[prop] === 'function' ? this[prop].bind(this) : this[prop];
        }

        return target[prop];
      }
    });
  }

  applyAPI(opts) {
    return _asyncToGenerator(function* () {
      let ret = opts.apply()(opts.api);

      if ((0, _isPromise.default)(ret)) {
        ret = yield ret;
      }

      return ret || {};
    })();
  }

  initPreset(preset) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const id = preset.id,
            key = preset.key,
            apply = preset.apply;
      preset.isPreset = true;

      const api = _this3.getPluginAPI({
        id,
        key,
        service: _this3
      }); // register before apply


      _this3.registerPlugin(preset); // TODO: ...defaultConfigs 考虑要不要支持，可能这个需求可以通过其他渠道实现


      const _yield$_this3$applyAP = yield _this3.applyAPI({
        api,
        apply
      }),
            presets = _yield$_this3$applyAP.presets,
            plugins = _yield$_this3$applyAP.plugins,
            defaultConfigs = _objectWithoutProperties(_yield$_this3$applyAP, _excluded); // register extra presets and plugins


      if (presets) {
        (0, _assert().default)(Array.isArray(presets), `presets returned from preset ${id} must be Array.`); // 插到最前面，下个 while 循环优先执行

        _this3._extraPresets.splice(0, 0, ...presets.map(path => {
          return (0, _pluginUtils.pathToObj)({
            type: _enums.PluginType.preset,
            path,
            cwd: _this3.cwd
          });
        }));
      } // 深度优先


      const extraPresets = _utils().lodash.clone(_this3._extraPresets);

      _this3._extraPresets = [];

      while (extraPresets.length) {
        yield _this3.initPreset(extraPresets.shift());
      }

      if (plugins) {
        (0, _assert().default)(Array.isArray(plugins), `plugins returned from preset ${id} must be Array.`);

        _this3._extraPlugins.push(...plugins.map(path => {
          return (0, _pluginUtils.pathToObj)({
            type: _enums.PluginType.plugin,
            path,
            cwd: _this3.cwd
          });
        }));
      }
    })();
  }

  initPlugin(plugin) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const id = plugin.id,
            key = plugin.key,
            apply = plugin.apply;

      const api = _this4.getPluginAPI({
        id,
        key,
        service: _this4
      }); // register before apply


      _this4.registerPlugin(plugin);

      yield _this4.applyAPI({
        api,
        apply
      });
    })();
  }

  getPluginOptsWithKey(key) {
    return (0, _configUtils.getUserConfigWithKey)({
      key,
      userConfig: this.userConfig
    });
  }

  registerPlugin(plugin) {
    // 考虑要不要去掉这里的校验逻辑
    // 理论上不会走到这里，因为在 describe 的时候已经做了冲突校验
    if (this.plugins[plugin.id]) {
      const name = plugin.isPreset ? 'preset' : 'plugin';
      throw new Error(`\
${name} ${plugin.id} is already registered by ${this.plugins[plugin.id].path}, \
${name} from ${plugin.path} register failed.`);
    }

    this.plugins[plugin.id] = plugin;
  }

  isPluginEnable(pluginId) {
    // api.skipPlugins() 的插件
    if (this.skipPluginIds.has(pluginId)) return false;
    const _this$plugins$pluginI = this.plugins[pluginId],
          key = _this$plugins$pluginI.key,
          enableBy = _this$plugins$pluginI.enableBy; // 手动设置为 false

    if (this.userConfig[key] === false) return false; // 配置开启

    if (enableBy === this.EnableBy.config && !(key in this.userConfig)) {
      return false;
    } // 函数自定义开启


    if (typeof enableBy === 'function') {
      return enableBy();
    } // 注册开启


    return true;
  }

  hasPlugins(pluginIds) {
    return pluginIds.every(pluginId => {
      const plugin = this.plugins[pluginId];
      return plugin && !plugin.isPreset && this.isPluginEnable(pluginId);
    });
  }

  hasPresets(presetIds) {
    return presetIds.every(presetId => {
      const preset = this.plugins[presetId];
      return preset && preset.isPreset && this.isPluginEnable(presetId);
    });
  }

  applyPlugins(opts) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const hooks = _this5.hooks[opts.key] || [];

      switch (opts.type) {
        case _enums.ApplyPluginsType.add:
          if ('initialValue' in opts) {
            (0, _assert().default)(Array.isArray(opts.initialValue), `applyPlugins failed, opts.initialValue must be Array if opts.type is add.`);
          }

          const tAdd = new (_tapable().AsyncSeriesWaterfallHook)(['memo']);

          var _iterator = _createForOfIteratorHelper(hooks),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              const hook = _step.value;

              if (!_this5.isPluginEnable(hook.pluginId)) {
                continue;
              }

              tAdd.tapPromise({
                name: hook.pluginId,
                stage: hook.stage || 0,
                // @ts-ignore
                before: hook.before
              }, /*#__PURE__*/function () {
                var _ref = _asyncToGenerator(function* (memo) {
                  const items = yield hook.fn(opts.args);
                  return memo.concat(items);
                });

                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }());
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return yield tAdd.promise(opts.initialValue || []);

        case _enums.ApplyPluginsType.modify:
          const tModify = new (_tapable().AsyncSeriesWaterfallHook)(['memo']);

          var _iterator2 = _createForOfIteratorHelper(hooks),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              const hook = _step2.value;

              if (!_this5.isPluginEnable(hook.pluginId)) {
                continue;
              }

              tModify.tapPromise({
                name: hook.pluginId,
                stage: hook.stage || 0,
                // @ts-ignore
                before: hook.before
              }, /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator(function* (memo) {
                  return yield hook.fn(memo, opts.args);
                });

                return function (_x2) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          return yield tModify.promise(opts.initialValue);

        case _enums.ApplyPluginsType.event:
          const tEvent = new (_tapable().AsyncSeriesWaterfallHook)(['_']);

          var _iterator3 = _createForOfIteratorHelper(hooks),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              const hook = _step3.value;

              if (!_this5.isPluginEnable(hook.pluginId)) {
                continue;
              }

              tEvent.tapPromise({
                name: hook.pluginId,
                stage: hook.stage || 0,
                // @ts-ignore
                before: hook.before
              }, /*#__PURE__*/_asyncToGenerator(function* () {
                yield hook.fn(opts.args);
              }));
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          return yield tEvent.promise();

        default:
          throw new Error(`applyPlugin failed, type is not defined or is not matched, got ${opts.type}.`);
      }
    })();
  }

  run({
    name,
    args = {}
  }) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      args._ = args._ || []; // shift the command itself

      if (args._[0] === name) args._.shift();
      _this6.args = args;
      yield _this6.init();
      logger.debug('plugins:');
      logger.debug(_this6.plugins);

      _this6.setStage(_enums.ServiceStage.run);

      yield _this6.applyPlugins({
        key: 'onStart',
        type: _enums.ApplyPluginsType.event,
        args: {
          name,
          args
        }
      });
      return _this6.runCommand({
        name,
        args
      });
    })();
  }

  runCommand({
    name,
    args = {}
  }) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      (0, _assert().default)(_this7.stage >= _enums.ServiceStage.init, `service is not initialized.`);
      args._ = args._ || []; // shift the command itself

      if (args._[0] === name) args._.shift();
      const command = typeof _this7.commands[name] === 'string' ? _this7.commands[_this7.commands[name]] : _this7.commands[name];
      (0, _assert().default)(command, `run command failed, command ${name} does not exists.`);
      const fn = command.fn;
      return fn({
        args
      });
    })();
  }

}

exports.default = Service;