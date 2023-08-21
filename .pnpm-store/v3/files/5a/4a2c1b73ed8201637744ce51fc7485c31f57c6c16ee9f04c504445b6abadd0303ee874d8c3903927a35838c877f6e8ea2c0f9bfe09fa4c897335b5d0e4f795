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

// src/config/config.ts
var config_exports = {};
__export(config_exports, {
  Config: () => Config
});
module.exports = __toCommonJS(config_exports);
var import_esbuild = __toESM(require("@umijs/bundler-utils/compiled/esbuild"));
var import_utils = require("@umijs/utils");
var import_joi = __toESM(require("@umijs/utils/compiled/@hapi/joi"));
var import_assert = __toESM(require("assert"));
var import_fs = require("fs");
var import_path = require("path");
var import_just_diff = require("../../compiled/just-diff");
var import_constants = require("../constants");
var import_types = require("../types");
var import_utils2 = require("./utils");
var Config = class {
  constructor(opts) {
    this.files = [];
    this.opts = opts;
    this.mainConfigFile = Config.getMainConfigFile(this.opts);
    this.prevConfig = null;
  }
  getUserConfig() {
    const configFiles = Config.getConfigFiles({
      mainConfigFile: this.mainConfigFile,
      env: this.opts.env,
      specifiedEnv: this.opts.specifiedEnv
    });
    return Config.getUserConfig({
      configFiles: (0, import_utils2.getAbsFiles)({
        files: configFiles,
        cwd: this.opts.cwd
      })
    });
  }
  getConfig(opts) {
    const { config, files } = this.getUserConfig();
    Config.validateConfig({ config, schemas: opts.schemas });
    this.files = files;
    return this.prevConfig = {
      config,
      files
    };
  }
  watch(opts) {
    const watcher = import_utils.chokidar.watch(
      [
        ...this.files,
        ...this.mainConfigFile ? [] : (0, import_utils2.getAbsFiles)({
          files: this.opts.defaultConfigFiles || import_constants.DEFAULT_CONFIG_FILES,
          cwd: this.opts.cwd
        })
      ],
      {
        ignoreInitial: true,
        cwd: this.opts.cwd
      }
    );
    watcher.on(
      "all",
      import_utils.lodash.debounce((event, path) => {
        const { config: origin } = this.prevConfig;
        const { config: updated, files } = this.getConfig({
          schemas: opts.schemas
        });
        watcher.add(files);
        const data = Config.diffConfigs({
          origin,
          updated,
          onChangeTypes: opts.onChangeTypes
        });
        opts.onChange({
          data,
          event,
          path
        }).catch((e) => {
          throw e;
        });
      }, import_constants.WATCH_DEBOUNCE_STEP)
    );
    return () => watcher.close();
  }
  static getMainConfigFile(opts) {
    let mainConfigFile = null;
    for (const configFile of opts.defaultConfigFiles || import_constants.DEFAULT_CONFIG_FILES) {
      const absConfigFile = (0, import_path.join)(opts.cwd, configFile);
      if ((0, import_fs.existsSync)(absConfigFile)) {
        mainConfigFile = absConfigFile;
        break;
      }
    }
    return mainConfigFile;
  }
  static getConfigFiles(opts) {
    const ret = [];
    const { mainConfigFile } = opts;
    const specifiedEnv = opts.specifiedEnv || "";
    if (mainConfigFile) {
      const env = import_constants.SHORT_ENV[opts.env] || opts.env;
      ret.push(
        ...[
          mainConfigFile,
          specifiedEnv && (0, import_utils2.addExt)({ file: mainConfigFile, ext: `.${specifiedEnv}` }),
          (0, import_utils2.addExt)({ file: mainConfigFile, ext: `.${env}` }),
          specifiedEnv && (0, import_utils2.addExt)({
            file: mainConfigFile,
            ext: `.${env}.${specifiedEnv}`
          })
        ].filter(Boolean)
      );
      if (opts.env === import_types.Env.development) {
        ret.push((0, import_utils2.addExt)({ file: mainConfigFile, ext: import_constants.LOCAL_EXT }));
      }
    }
    return ret;
  }
  static getUserConfig(opts) {
    let config = {};
    let files = [];
    for (const configFile of opts.configFiles) {
      if ((0, import_fs.existsSync)(configFile)) {
        import_utils.register.register({
          implementor: import_esbuild.default
        });
        import_utils.register.clearFiles();
        try {
          config = import_utils.lodash.merge(config, require(configFile).default);
        } catch (e) {
          if (import_utils.semver.lt(import_utils.semver.clean(process.version), "16.9.0")) {
            throw e;
          }
          throw new Error(`Parse config file failed: [${configFile}]`, {
            cause: e
          });
        }
        for (const file of import_utils.register.getFiles()) {
          delete require.cache[file];
        }
        files.push(...import_utils.register.getFiles());
        import_utils.register.restore();
      } else {
        files.push(configFile);
      }
    }
    return {
      config,
      files
    };
  }
  static validateConfig(opts) {
    const errors = /* @__PURE__ */ new Map();
    const configKeys = new Set(Object.keys(opts.config));
    for (const key of Object.keys(opts.schemas)) {
      configKeys.delete(key);
      if (!opts.config[key])
        continue;
      const schema = opts.schemas[key]({ ...import_joi.default, zod: import_utils.zod });
      if (import_joi.default.isSchema(schema)) {
        const { error } = schema.validate(opts.config[key]);
        if (error)
          errors.set(key, error);
      } else {
        (0, import_assert.default)(
          (0, import_utils.isZodSchema)(schema),
          `schema for config ${key} is not valid, neither joi nor zod.`
        );
        const { error } = schema.safeParse(opts.config[key]);
        if (error)
          errors.set(key, error);
      }
    }
    (0, import_assert.default)(
      errors.size === 0,
      `Invalid config values: ${Array.from(errors.keys()).join(", ")}
${Array.from(errors.keys()).map((key) => {
        return `Invalid value for ${key}:
${errors.get(key).message}`;
      })}`
    );
    (0, import_assert.default)(
      configKeys.size === 0,
      `Invalid config keys: ${Array.from(configKeys).join(", ")}`
    );
  }
  static diffConfigs(opts) {
    const patch = (0, import_just_diff.diff)(opts.origin, opts.updated);
    const changes = {};
    const fns = [];
    for (const item of patch) {
      const key = item.path[0];
      const onChange = opts.onChangeTypes[key];
      (0, import_assert.default)(onChange, `Invalid onChange config for key ${key}`);
      if (typeof onChange === "string") {
        changes[onChange] || (changes[onChange] = []);
        changes[onChange].push(String(key));
      } else if (typeof onChange === "function") {
        fns.push(onChange);
      } else {
        throw new Error(`Invalid onChange value for key ${key}`);
      }
    }
    return {
      changes,
      fns
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config
});
