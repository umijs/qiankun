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

// src/service/pluginAPI.ts
var pluginAPI_exports = {};
__export(pluginAPI_exports, {
  PluginAPI: () => PluginAPI
});
module.exports = __toCommonJS(pluginAPI_exports);
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_types = require("../types");
var import_command = require("./command");
var import_generator = require("./generator");
var import_hook = require("./hook");
var import_plugin = require("./plugin");
var import_utils2 = require("./utils");
var resolveConfigModes = ["strict", "loose"];
var PluginAPI = class {
  constructor(opts) {
    this.service = opts.service;
    this.plugin = opts.plugin;
    this.telemetry = opts.service.telemetry.prefixWith(this.plugin.key);
    const loggerKeys = [
      "wait",
      "error",
      "warn",
      "ready",
      "info",
      "event",
      "debug",
      "fatal",
      "profile"
    ];
    this.logger = loggerKeys.reduce((memo, key) => {
      memo[key] = (...message) => {
        const func = import_utils.logger[key];
        if (typeof func !== "function") {
          return;
        }
        if (key === "profile") {
          func(...message);
        } else {
          func(import_utils.chalk.green(`[plugin: ${this.plugin.id}]`), ...message);
        }
      };
      return memo;
    }, {});
  }
  describe(opts) {
    var _a;
    if (opts.enableBy === import_types.EnableBy.config && ((_a = opts.config) == null ? void 0 : _a.default)) {
      throw new Error(
        `[plugin: ${this.plugin.id}] The config.default is not allowed when enableBy is EnableBy.config.`
      );
    }
    this.plugin.merge(opts);
  }
  registerCommand(opts) {
    const { alias } = opts;
    delete opts.alias;
    const registerCommand = (commandOpts) => {
      var _a;
      const { name, configResolveMode } = commandOpts;
      (0, import_assert.default)(
        !configResolveMode || resolveConfigModes.indexOf(configResolveMode) >= 0,
        `configResolveMode must be one of ${resolveConfigModes.join(
          ","
        )}, but got ${configResolveMode}`
      );
      (0, import_assert.default)(
        !this.service.commands[name],
        `api.registerCommand() failed, the command ${name} is exists from ${(_a = this.service.commands[name]) == null ? void 0 : _a.plugin.id}.`
      );
      this.service.commands[name] = new import_command.Command({
        ...commandOpts,
        plugin: this.plugin
      });
    };
    registerCommand(opts);
    if (alias) {
      const aliases = (0, import_utils2.makeArray)(alias);
      aliases.forEach((alias2) => {
        registerCommand({ ...opts, name: alias2 });
      });
    }
  }
  registerGenerator(opts) {
    var _a;
    const { key } = opts;
    (0, import_assert.default)(
      !this.service.generators[key],
      `api.registerGenerator() failed, the generator ${key} is exists from ${(_a = this.service.generators[key]) == null ? void 0 : _a.plugin.id}.`
    );
    this.service.generators[key] = (0, import_generator.makeGenerator)({
      ...opts,
      plugin: this.plugin
    });
  }
  register(opts) {
    var _a, _b;
    (0, import_assert.default)(
      this.service.stage <= import_types.ServiceStage.initPlugins,
      "api.register() should not be called after plugin register stage."
    );
    (_a = this.service.hooks)[_b = opts.key] || (_a[_b] = []);
    this.service.hooks[opts.key].push(
      new import_hook.Hook({ ...opts, plugin: this.plugin })
    );
  }
  registerMethod(opts) {
    (0, import_assert.default)(
      !this.service.pluginMethods[opts.name],
      `api.registerMethod() failed, method ${opts.name} is already exist.`
    );
    this.service.pluginMethods[opts.name] = {
      plugin: this.plugin,
      fn: opts.fn || // 这里不能用 arrow function，this 需指向执行此方法的 PluginAPI
      // 否则 pluginId 会不会，导致不能正确 skip plugin
      function(fn) {
        this.register({
          key: opts.name,
          ...import_utils.lodash.isPlainObject(fn) ? fn : { fn }
        });
      }
    };
  }
  registerPresets(source, presets) {
    (0, import_assert.default)(
      this.service.stage === import_types.ServiceStage.initPresets,
      `api.registerPresets() failed, it should only used in presets.`
    );
    source.splice(
      0,
      0,
      ...presets.map((preset) => {
        return new import_plugin.Plugin({
          path: preset,
          cwd: this.service.cwd,
          type: import_types.PluginType.preset
        });
      })
    );
  }
  registerPlugins(source, plugins) {
    (0, import_assert.default)(
      this.service.stage === import_types.ServiceStage.initPresets || this.service.stage === import_types.ServiceStage.initPlugins,
      `api.registerPlugins() failed, it should only be used in registering stage.`
    );
    const mappedPlugins = plugins.map((plugin) => {
      if (import_utils.lodash.isPlainObject(plugin)) {
        (0, import_assert.default)(
          plugin.id && plugin.key,
          `Invalid plugin object, id and key must supplied.`
        );
        plugin.type = import_types.PluginType.plugin;
        plugin.enableBy = plugin.enableBy || import_types.EnableBy.register;
        plugin.apply = plugin.apply || (() => () => {
        });
        plugin.config = plugin.config || {};
        plugin.time = { hooks: {} };
        return plugin;
      } else {
        return new import_plugin.Plugin({
          path: plugin,
          cwd: this.service.cwd,
          type: import_types.PluginType.plugin
        });
      }
    });
    if (this.service.stage === import_types.ServiceStage.initPresets) {
      source.push(...mappedPlugins);
    } else {
      source.splice(0, 0, ...mappedPlugins);
    }
  }
  skipPlugins(keys) {
    keys.forEach((key) => {
      (0, import_assert.default)(!(this.plugin.key === key), `plugin ${key} can't skip itself!`);
      (0, import_assert.default)(
        this.service.keyToPluginMap[key],
        `key: ${key} is not be registered by any plugin. You can't skip it!`
      );
      this.service.skipPluginIds.add(this.service.keyToPluginMap[key].id);
    });
  }
  static proxyPluginAPI(opts) {
    return new Proxy(opts.pluginAPI, {
      get: (target, prop) => {
        if (opts.service.pluginMethods[prop]) {
          return opts.service.pluginMethods[prop].fn;
        }
        if (opts.serviceProps.includes(prop)) {
          const serviceProp = opts.service[prop];
          return typeof serviceProp === "function" ? serviceProp.bind(opts.service) : serviceProp;
        }
        if (prop in opts.staticProps) {
          return opts.staticProps[prop];
        }
        return target[prop];
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PluginAPI
});
