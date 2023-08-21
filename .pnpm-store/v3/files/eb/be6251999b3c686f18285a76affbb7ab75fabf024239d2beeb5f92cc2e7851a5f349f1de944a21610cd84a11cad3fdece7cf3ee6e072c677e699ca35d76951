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

function _joi() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/@hapi/joi"));

  _joi = function _joi() {
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

var _enums = require("../Service/enums");

var _configUtils = require("./utils/configUtils");

var _isEqual = _interopRequireDefault(require("./utils/isEqual"));

var _mergeDefault = _interopRequireDefault(require("./utils/mergeDefault"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const debug = (0, _utils().createDebug)('umi:core:Config');
const DEFAULT_CONFIG_FILES = ['.umirc.ts', '.umirc.js', 'config/config.ts', 'config/config.js']; // TODO:
// 1. custom config file

class Config {
  constructor(opts) {
    this.cwd = void 0;
    this.service = void 0;
    this.config = void 0;
    this.localConfig = void 0;
    this.configFile = void 0;
    this.configFiles = DEFAULT_CONFIG_FILES;
    this.cwd = opts.cwd || process.cwd();
    this.service = opts.service;
    this.localConfig = opts.localConfig;

    if (Array.isArray(opts.configFiles)) {
      // 配置的优先读取
      this.configFiles = _utils().lodash.uniq(opts.configFiles.concat(this.configFiles));
    }
  }

  getDefaultConfig() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const pluginIds = Object.keys(_this.service.plugins); // collect default config

      let defaultConfig = pluginIds.reduce((memo, pluginId) => {
        const _this$service$plugins = _this.service.plugins[pluginId],
              key = _this$service$plugins.key,
              _this$service$plugins2 = _this$service$plugins.config,
              config = _this$service$plugins2 === void 0 ? {} : _this$service$plugins2;
        if ('default' in config) memo[key] = config.default;
        return memo;
      }, {});
      return defaultConfig;
    })();
  }

  getConfig({
    defaultConfig
  }) {
    (0, _assert().default)(this.service.stage >= _enums.ServiceStage.pluginReady, `Config.getConfig() failed, it should not be executed before plugin is ready.`);
    const userConfig = this.getUserConfig(); // 用于提示用户哪些 key 是未定义的
    // TODO: 考虑不排除 false 的 key

    const userConfigKeys = Object.keys(userConfig).filter(key => {
      return userConfig[key] !== false;
    }); // get config

    const pluginIds = Object.keys(this.service.plugins);
    pluginIds.forEach(pluginId => {
      const _this$service$plugins3 = this.service.plugins[pluginId],
            key = _this$service$plugins3.key,
            _this$service$plugins4 = _this$service$plugins3.config,
            config = _this$service$plugins4 === void 0 ? {} : _this$service$plugins4; // recognize as key if have schema config

      if (!config.schema) return;
      const value = (0, _configUtils.getUserConfigWithKey)({
        key,
        userConfig
      }); // 不校验 false 的值，此时已禁用插件

      if (value === false) return; // do validate

      const schema = config.schema(_joi().default);
      (0, _assert().default)(_joi().default.isSchema(schema), `schema return from plugin ${pluginId} is not valid schema.`);

      const _schema$validate = schema.validate(value),
            error = _schema$validate.error;

      if (error) {
        const e = new Error(`Validate config "${key}" failed, ${error.message}`);
        e.stack = error.stack;
        throw e;
      } // remove key


      const index = userConfigKeys.indexOf(key.split('.')[0]);

      if (index !== -1) {
        userConfigKeys.splice(index, 1);
      } // update userConfig with defaultConfig


      if (key in defaultConfig) {
        const newValue = (0, _mergeDefault.default)({
          defaultConfig: defaultConfig[key],
          config: value
        });
        (0, _configUtils.updateUserConfigWithKey)({
          key,
          value: newValue,
          userConfig
        });
      }
    });

    if (userConfigKeys.length) {
      const keys = userConfigKeys.length > 1 ? 'keys' : 'key';
      throw new Error(`Invalid config ${keys}: ${userConfigKeys.join(', ')}`);
    }

    return userConfig;
  }

  getUserConfig() {
    const configFile = this.getConfigFile();
    this.configFile = configFile; // 潜在问题：
    // .local 和 .env 的配置必须有 configFile 才有效

    if (configFile) {
      let envConfigFile;

      if (process.env.UMI_ENV) {
        var _getFile;

        const envConfigFileName = this.addAffix(configFile, process.env.UMI_ENV);
        const fileNameWithoutExt = envConfigFileName.replace((0, _path().extname)(envConfigFileName), '');
        envConfigFile = (_getFile = (0, _utils().getFile)({
          base: this.cwd,
          fileNameWithoutExt,
          type: 'javascript'
        })) === null || _getFile === void 0 ? void 0 : _getFile.filename;

        if (!envConfigFile) {
          throw new Error(`get user config failed, ${envConfigFile} does not exist, but process.env.UMI_ENV is set to ${process.env.UMI_ENV}.`);
        }
      }

      const files = [configFile, envConfigFile, this.localConfig && this.addAffix(configFile, 'local')].filter(f => !!f).map(f => (0, _path().join)(this.cwd, f)).filter(f => (0, _fs().existsSync)(f)); // clear require cache and set babel register

      const requireDeps = files.reduce((memo, file) => {
        memo = memo.concat((0, _utils().parseRequireDeps)(file));
        return memo;
      }, []);
      requireDeps.forEach(_utils().cleanRequireCache);
      this.service.babelRegister.setOnlyMap({
        key: 'config',
        value: requireDeps
      }); // require config and merge

      return this.mergeConfig(...this.requireConfigs(files));
    } else {
      return {};
    }
  }

  addAffix(file, affix) {
    const ext = (0, _path().extname)(file);
    return file.replace(new RegExp(`${ext}$`), `.${affix}${ext}`);
  }

  requireConfigs(configFiles) {
    return configFiles.map(f => (0, _utils().compatESModuleRequire)(require(f)));
  }

  mergeConfig(...configs) {
    let ret = {};

    for (var _i = 0, _configs = configs; _i < _configs.length; _i++) {
      const config = _configs[_i];
      // TODO: 精细化处理，比如处理 dotted config key
      ret = (0, _utils().deepmerge)(ret, config);
    }

    return ret;
  }

  getConfigFile() {
    // TODO: support custom config file
    const configFile = this.configFiles.find(f => (0, _fs().existsSync)((0, _path().join)(this.cwd, f)));
    return configFile ? (0, _utils().winPath)(configFile) : null;
  }

  getWatchFilesAndDirectories() {
    const umiEnv = process.env.UMI_ENV;

    const configFiles = _utils().lodash.clone(this.configFiles);

    this.configFiles.forEach(f => {
      if (this.localConfig) configFiles.push(this.addAffix(f, 'local'));
      if (umiEnv) configFiles.push(this.addAffix(f, umiEnv));
    });
    const configDir = (0, _utils().winPath)((0, _path().join)(this.cwd, 'config'));
    const files = configFiles.reduce((memo, f) => {
      const file = (0, _utils().winPath)((0, _path().join)(this.cwd, f));

      if ((0, _fs().existsSync)(file)) {
        memo = memo.concat((0, _utils().parseRequireDeps)(file));
      } else {
        memo.push(file);
      }

      return memo;
    }, []).filter(f => !f.startsWith(configDir));
    return [configDir].concat(files);
  }

  watch(opts) {
    let paths = this.getWatchFilesAndDirectories();
    let userConfig = opts.userConfig;

    const watcher = _utils().chokidar.watch(paths, {
      ignoreInitial: true,
      cwd: this.cwd
    });

    watcher.on('all', (event, path) => {
      console.log(_utils().chalk.green(`[${event}] ${path}`));
      const newPaths = this.getWatchFilesAndDirectories();

      const diffs = _utils().lodash.difference(newPaths, paths);

      if (diffs.length) {
        watcher.add(diffs);
        paths = paths.concat(diffs);
      }

      const newUserConfig = this.getUserConfig();
      const pluginChanged = [];
      const valueChanged = [];
      Object.keys(this.service.plugins).forEach(pluginId => {
        const _this$service$plugins5 = this.service.plugins[pluginId],
              key = _this$service$plugins5.key,
              _this$service$plugins6 = _this$service$plugins5.config,
              config = _this$service$plugins6 === void 0 ? {} : _this$service$plugins6; // recognize as key if have schema config

        if (!config.schema) return;

        if (!(0, _isEqual.default)(newUserConfig[key], userConfig[key])) {
          const changed = {
            key,
            pluginId: pluginId
          };

          if (newUserConfig[key] === false || userConfig[key] === false) {
            pluginChanged.push(changed);
          } else {
            valueChanged.push(changed);
          }
        }
      });
      debug(`newUserConfig: ${JSON.stringify(newUserConfig)}`);
      debug(`oldUserConfig: ${JSON.stringify(userConfig)}`);
      debug(`pluginChanged: ${JSON.stringify(pluginChanged)}`);
      debug(`valueChanged: ${JSON.stringify(valueChanged)}`);

      if (pluginChanged.length || valueChanged.length) {
        opts.onChange({
          userConfig: newUserConfig,
          pluginChanged,
          valueChanged
        });
      }

      userConfig = newUserConfig;
    });
    return () => {
      watcher.close();
    };
  }

}

exports.default = Config;