var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/service/service.ts
var service_exports = {};
__export(service_exports, {
  Service: () => Service
});
module.exports = __toCommonJS(service_exports);
var import_tapable = require("@umijs/bundler-utils/compiled/tapable");
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_fs = require("fs");
var import_path = require("path");
var import_config = require("../config/config");
var import_constants = require("../constants");
var import_types = require("../types");
var import_env = require("./env");
var import_path2 = require("./path");
var import_plugin = require("./plugin");
var import_pluginAPI = require("./pluginAPI");
var import_telemetry = require("./telemetry");
var Service = class {
  constructor(opts) {
    this.appData = {};
    this.args = { _: [], $0: "" };
    this.commands = {};
    this.generators = {};
    this.config = {};
    this.configSchemas = {};
    this.configDefaults = {};
    this.configOnChanges = {};
    this.hooks = {};
    this.name = "";
    this.paths = {};
    // preset is plugin with different type
    this.plugins = {};
    this.keyToPluginMap = {};
    this.pluginMethods = {};
    this.skipPluginIds = /* @__PURE__ */ new Set();
    this.stage = import_types.ServiceStage.uninitialized;
    this.userConfig = {};
    this.configManager = null;
    this.pkg = {};
    this.pkgPath = "";
    this.telemetry = new import_telemetry.Telemetry();
    this.cwd = opts.cwd;
    this.env = opts.env;
    this.opts = opts;
    (0, import_assert.default)((0, import_fs.existsSync)(this.cwd), `Invalid cwd ${this.cwd}, it's not found.`);
  }
  applyPlugins(opts) {
    const hooks = this.hooks[opts.key] || [];
    let type = opts.type;
    if (!type) {
      if (opts.key.startsWith("on")) {
        type = import_types.ApplyPluginsType.event;
      } else if (opts.key.startsWith("modify")) {
        type = import_types.ApplyPluginsType.modify;
      } else if (opts.key.startsWith("add")) {
        type = import_types.ApplyPluginsType.add;
      } else {
        throw new Error(
          `Invalid applyPlugins arguments, type must be supplied for key ${opts.key}.`
        );
      }
    }
    switch (type) {
      case import_types.ApplyPluginsType.add:
        (0, import_assert.default)(
          !("initialValue" in opts) || Array.isArray(opts.initialValue),
          `applyPlugins failed, opts.initialValue must be Array if opts.type is add.`
        );
        const tAdd = new import_tapable.AsyncSeriesWaterfallHook(["memo"]);
        for (const hook of hooks) {
          if (!this.isPluginEnable(hook))
            continue;
          tAdd.tapPromise(
            {
              name: hook.plugin.key,
              stage: hook.stage || 0,
              before: hook.before
            },
            async (memo) => {
              var _a, _b;
              const dateStart = new Date();
              const items = await hook.fn(opts.args);
              (_a = hook.plugin.time.hooks)[_b = opts.key] || (_a[_b] = []);
              hook.plugin.time.hooks[opts.key].push(
                new Date().getTime() - dateStart.getTime()
              );
              return memo.concat(items);
            }
          );
        }
        return tAdd.promise(opts.initialValue || []);
      case import_types.ApplyPluginsType.modify:
        const tModify = new import_tapable.AsyncSeriesWaterfallHook(["memo"]);
        for (const hook of hooks) {
          if (!this.isPluginEnable(hook))
            continue;
          tModify.tapPromise(
            {
              name: hook.plugin.key,
              stage: hook.stage || 0,
              before: hook.before
            },
            async (memo) => {
              var _a, _b;
              const dateStart = new Date();
              const ret = await hook.fn(memo, opts.args);
              (_a = hook.plugin.time.hooks)[_b = opts.key] || (_a[_b] = []);
              hook.plugin.time.hooks[opts.key].push(
                new Date().getTime() - dateStart.getTime()
              );
              return ret;
            }
          );
        }
        return tModify.promise(opts.initialValue);
      case import_types.ApplyPluginsType.event:
        if (opts.sync) {
          const tEvent2 = new import_tapable.SyncWaterfallHook(["_"]);
          hooks.forEach((hook) => {
            if (this.isPluginEnable(hook)) {
              tEvent2.tap(
                {
                  name: hook.plugin.key,
                  stage: hook.stage || 0,
                  before: hook.before
                },
                () => {
                  var _a, _b;
                  const dateStart = new Date();
                  hook.fn(opts.args);
                  (_a = hook.plugin.time.hooks)[_b = opts.key] || (_a[_b] = []);
                  hook.plugin.time.hooks[opts.key].push(
                    new Date().getTime() - dateStart.getTime()
                  );
                }
              );
            }
          });
          return tEvent2.call(1);
        }
        const tEvent = new import_tapable.AsyncSeriesWaterfallHook(["_"]);
        for (const hook of hooks) {
          if (!this.isPluginEnable(hook))
            continue;
          tEvent.tapPromise(
            {
              name: hook.plugin.key,
              stage: hook.stage || 0,
              before: hook.before
            },
            async () => {
              var _a, _b;
              const dateStart = new Date();
              await hook.fn(opts.args);
              (_a = hook.plugin.time.hooks)[_b = opts.key] || (_a[_b] = []);
              hook.plugin.time.hooks[opts.key].push(
                new Date().getTime() - dateStart.getTime()
              );
            }
          );
        }
        return tEvent.promise(1);
      default:
        throw new Error(
          `applyPlugins failed, type is not defined or is not matched, got ${opts.type}.`
        );
    }
  }
  async run(opts) {
    const { name, args = {} } = opts;
    args._ = args._ || [];
    if (args._[0] === name)
      args._.shift();
    this.args = args;
    this.name = name;
    this.stage = import_types.ServiceStage.init;
    (0, import_env.loadEnv)({ cwd: this.cwd, envFile: ".env" });
    let pkg = {};
    let pkgPath = "";
    try {
      pkg = require((0, import_path.join)(this.cwd, "package.json"));
      pkgPath = (0, import_path.join)(this.cwd, "package.json");
    } catch (_e) {
      if (this.cwd !== process.cwd()) {
        try {
          pkg = require((0, import_path.join)(process.cwd(), "package.json"));
          pkgPath = (0, import_path.join)(process.cwd(), "package.json");
        } catch (_e2) {
        }
      }
    }
    this.pkg = pkg;
    this.pkgPath = pkgPath || (0, import_path.join)(this.cwd, "package.json");
    const prefix = this.frameworkName;
    const specifiedEnv = process.env[`${prefix}_ENV`.toUpperCase()];
    const configManager = new import_config.Config({
      cwd: this.cwd,
      env: this.env,
      defaultConfigFiles: this.opts.defaultConfigFiles,
      specifiedEnv
    });
    this.configManager = configManager;
    this.userConfig = configManager.getUserConfig().config;
    this.paths = await this.getPaths();
    const { plugins, presets } = import_plugin.Plugin.getPluginsAndPresets({
      cwd: this.cwd,
      pkg,
      plugins: [require.resolve("./generatePlugin")].concat(
        this.opts.plugins || []
      ),
      presets: [require.resolve("./servicePlugin")].concat(
        this.opts.presets || []
      ),
      userConfig: this.userConfig,
      prefix
    });
    this.stage = import_types.ServiceStage.initPresets;
    const presetPlugins = [];
    while (presets.length) {
      await this.initPreset({
        preset: presets.shift(),
        presets,
        plugins: presetPlugins
      });
    }
    plugins.unshift(...presetPlugins);
    this.stage = import_types.ServiceStage.initPlugins;
    while (plugins.length) {
      await this.initPlugin({ plugin: plugins.shift(), plugins });
    }
    const command = this.commands[name];
    if (!command) {
      this.commandGuessHelper(Object.keys(this.commands), name);
      throw Error(`Invalid command ${import_utils.chalk.red(name)}, it's not registered.`);
    }
    for (const id of Object.keys(this.plugins)) {
      const { config, key } = this.plugins[id];
      if (config.schema)
        this.configSchemas[key] = config.schema;
      if (config.default !== void 0) {
        this.configDefaults[key] = config.default;
      }
      this.configOnChanges[key] = config.onChange || import_types.ConfigChangeType.reload;
    }
    this.stage = import_types.ServiceStage.resolveConfig;
    const { defaultConfig } = await this.resolveConfig();
    if (this.config.outputPath) {
      this.paths.absOutputPath = (0, import_path.isAbsolute)(this.config.outputPath) ? this.config.outputPath : (0, import_path.join)(this.cwd, this.config.outputPath);
    }
    this.paths = await this.applyPlugins({
      key: "modifyPaths",
      initialValue: this.paths
    });
    const storage = await this.applyPlugins({
      key: "modifyTelemetryStorage",
      initialValue: import_telemetry.noopStorage
    });
    this.telemetry.useStorage(storage);
    this.stage = import_types.ServiceStage.collectAppData;
    this.appData = await this.applyPlugins({
      key: "modifyAppData",
      initialValue: {
        // base
        cwd: this.cwd,
        pkg,
        pkgPath,
        plugins: this.plugins,
        presets,
        name,
        args,
        // config
        userConfig: this.userConfig,
        mainConfigFile: configManager.mainConfigFile,
        config: this.config,
        defaultConfig
        // TODO
        // moduleGraph,
        // routes,
        // npmClient,
        // nodeVersion,
        // gitInfo,
        // gitBranch,
        // debugger info,
        // devPort,
        // devHost,
        // env
      }
    });
    this.stage = import_types.ServiceStage.onCheck;
    await this.applyPlugins({
      key: "onCheck"
    });
    this.stage = import_types.ServiceStage.onStart;
    await this.applyPlugins({
      key: "onStart"
    });
    this.stage = import_types.ServiceStage.runCommand;
    let ret = await command.fn({ args });
    this._profilePlugins();
    return ret;
  }
  async getPaths() {
    const paths = (0, import_path2.getPaths)({
      cwd: this.cwd,
      env: this.env,
      prefix: this.frameworkName
    });
    return paths;
  }
  async resolveConfig() {
    (0, import_assert.default)(
      this.stage > import_types.ServiceStage.init,
      `Can't generate final config before init stage`
    );
    const resolveMode = this.commands[this.name].configResolveMode;
    const config = await this.applyPlugins({
      key: "modifyConfig",
      // why clone deep?
      // user may change the config in modifyConfig
      // e.g. memo.alias = xxx
      initialValue: import_utils.lodash.cloneDeep(
        resolveMode === "strict" ? this.configManager.getConfig({
          schemas: this.configSchemas
        }).config : this.configManager.getUserConfig().config
      ),
      args: { paths: this.paths }
    });
    const defaultConfig = await this.applyPlugins({
      key: "modifyDefaultConfig",
      // 避免 modifyDefaultConfig 时修改 this.configDefaults
      initialValue: import_utils.lodash.cloneDeep(this.configDefaults)
    });
    this.config = import_utils.lodash.merge(defaultConfig, config);
    return { config, defaultConfig };
  }
  _profilePlugins() {
    if (this.args.profilePlugins) {
      console.log();
      Object.keys(this.plugins).map((id) => {
        const plugin = this.plugins[id];
        const total = totalTime(plugin);
        return {
          id,
          total,
          register: plugin.time.register || 0,
          hooks: plugin.time.hooks
        };
      }).filter((time) => {
        return time.total > (this.args.profilePluginsLimit ?? 10);
      }).sort((a, b) => b.total > a.total ? 1 : -1).forEach((time) => {
        console.log(import_utils.chalk.green("plugin"), time.id, time.total);
        if (this.args.profilePluginsVerbose) {
          console.log("      ", import_utils.chalk.green("register"), time.register);
          console.log(
            "      ",
            import_utils.chalk.green("hooks"),
            JSON.stringify(sortHooks(time.hooks))
          );
        }
      });
    }
    function sortHooks(hooks) {
      const ret = {};
      Object.keys(hooks).sort((a, b) => {
        return add(hooks[b]) - add(hooks[a]);
      }).forEach((key) => {
        ret[key] = hooks[key];
      });
      return ret;
    }
    function totalTime(plugin) {
      const time = plugin.time;
      return (time.register || 0) + Object.values(time.hooks).reduce((a, b) => a + add(b), 0);
    }
    function add(nums) {
      return nums.reduce((a, b) => a + b, 0);
    }
  }
  async initPreset(opts) {
    const { presets, plugins } = await this.initPlugin({
      plugin: opts.preset,
      presets: opts.presets,
      plugins: opts.plugins
    });
    opts.presets.unshift(...presets || []);
    opts.plugins.push(...plugins || []);
  }
  async initPlugin(opts) {
    var _a, _b;
    (0, import_assert.default)(
      !this.plugins[opts.plugin.id],
      `${opts.plugin.type} ${opts.plugin.id} is already registered by ${(_a = this.plugins[opts.plugin.id]) == null ? void 0 : _a.path}, ${opts.plugin.type} from ${opts.plugin.path} register failed.`
    );
    this.plugins[opts.plugin.id] = opts.plugin;
    const pluginAPI = new import_pluginAPI.PluginAPI({
      plugin: opts.plugin,
      service: this
    });
    pluginAPI.registerPresets = pluginAPI.registerPresets.bind(
      pluginAPI,
      opts.presets || []
    );
    pluginAPI.registerPlugins = pluginAPI.registerPlugins.bind(
      pluginAPI,
      opts.plugins
    );
    const proxyPluginAPI = import_pluginAPI.PluginAPI.proxyPluginAPI({
      service: this,
      pluginAPI,
      serviceProps: [
        "appData",
        "applyPlugins",
        "args",
        "config",
        "cwd",
        "pkg",
        "pkgPath",
        "name",
        "paths",
        "userConfig",
        "env",
        "isPluginEnable"
      ],
      staticProps: {
        ApplyPluginsType: import_types.ApplyPluginsType,
        ConfigChangeType: import_types.ConfigChangeType,
        EnableBy: import_types.EnableBy,
        ServiceStage: import_types.ServiceStage,
        service: this
      }
    });
    let dateStart = new Date();
    let ret = await opts.plugin.apply()(proxyPluginAPI);
    opts.plugin.time.register = new Date().getTime() - dateStart.getTime();
    if (opts.plugin.type === "plugin") {
      (0, import_assert.default)(!ret, `plugin should return nothing`);
    }
    (0, import_assert.default)(
      !this.keyToPluginMap[opts.plugin.key],
      `key ${opts.plugin.key} is already registered by ${(_b = this.keyToPluginMap[opts.plugin.key]) == null ? void 0 : _b.path}, ${opts.plugin.type} from ${opts.plugin.path} register failed.`
    );
    this.keyToPluginMap[opts.plugin.key] = opts.plugin;
    if (ret == null ? void 0 : ret.presets) {
      ret.presets = ret.presets.map(
        (preset) => new import_plugin.Plugin({
          path: preset,
          type: import_types.PluginType.preset,
          cwd: this.cwd
        })
      );
    }
    if (ret == null ? void 0 : ret.plugins) {
      ret.plugins = ret.plugins.map(
        (plugin) => new import_plugin.Plugin({
          path: plugin,
          type: import_types.PluginType.plugin,
          cwd: this.cwd
        })
      );
    }
    return ret || {};
  }
  isPluginEnable(hook) {
    let plugin;
    if (hook.plugin) {
      plugin = hook.plugin;
    } else {
      plugin = this.keyToPluginMap[hook];
      if (!plugin)
        return false;
    }
    const { id, key, enableBy } = plugin;
    if (this.skipPluginIds.has(id))
      return false;
    if (this.userConfig[key] === false)
      return false;
    if (this.config[key] === false)
      return false;
    if (enableBy === import_types.EnableBy.config) {
      return key in this.userConfig || this.config && key in this.config;
    }
    if (typeof enableBy === "function")
      return enableBy({
        userConfig: this.userConfig,
        config: this.config,
        env: this.env
      });
    return true;
  }
  commandGuessHelper(commands, currentCmd) {
    const altCmds = commands.filter((cmd) => {
      return import_utils.fastestLevenshtein.distance(currentCmd, cmd) < currentCmd.length * 0.6 && currentCmd !== cmd;
    });
    const printHelper = altCmds.slice(0, 3).map((cmd) => {
      return ` - ${import_utils.chalk.green(cmd)}`;
    }).join("\n");
    if (altCmds.length) {
      console.log();
      console.log(
        [
          import_utils.chalk.cyan(
            altCmds.length === 1 ? "Did you mean this command ?" : "Did you mean one of these commands ?"
          ),
          printHelper
        ].join("\n")
      );
      console.log();
    }
  }
  get frameworkName() {
    return this.opts.frameworkName || import_constants.DEFAULT_FRAMEWORK_NAME;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Service
});
