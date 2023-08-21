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

// src/service/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  Plugin: () => Plugin
});
module.exports = __toCommonJS(plugin_exports);
var import_esbuild = __toESM(require("@umijs/bundler-utils/compiled/esbuild"));
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_fs = require("fs");
var import_path = require("path");
var import_types = require("../types");
var RE = {
  plugin: /^(@umijs\/|umi-)plugin-/,
  preset: /^(@umijs\/|umi-)preset-/
};
var Plugin = class {
  constructor(opts) {
    this.config = {};
    this.time = { hooks: {} };
    this.enableBy = import_types.EnableBy.register;
    this.type = opts.type;
    this.path = (0, import_utils.winPath)(opts.path);
    this.cwd = opts.cwd;
    (0, import_assert.default)(
      (0, import_fs.existsSync)(this.path),
      `Invalid ${this.type} ${this.path}, it's not exists.`
    );
    let pkg = null;
    let isPkgEntry = false;
    const pkgJSONPath = import_utils.pkgUp.pkgUpSync({ cwd: this.path });
    if (pkgJSONPath) {
      pkg = require(pkgJSONPath);
      isPkgEntry = (0, import_utils.winPath)((0, import_path.join)((0, import_path.dirname)(pkgJSONPath), pkg.main || "index.js")) === (0, import_utils.winPath)(this.path);
    }
    this.id = this.getId({ pkg, isPkgEntry, pkgJSONPath });
    this.key = this.getKey({ pkg, isPkgEntry });
    this.apply = () => {
      import_utils.register.register({
        implementor: import_esbuild.default,
        exts: [".ts", ".mjs"]
      });
      import_utils.register.clearFiles();
      let ret;
      try {
        ret = require(this.path);
      } catch (e) {
        throw new Error(
          `Register ${this.type} ${this.path} failed, since ${e.message}`,
          { cause: e }
        );
      } finally {
        import_utils.register.restore();
      }
      return ret.__esModule ? ret.default : ret;
    };
  }
  merge(opts) {
    if (opts.key)
      this.key = opts.key;
    if (opts.config)
      this.config = opts.config;
    if (opts.enableBy)
      this.enableBy = opts.enableBy;
  }
  getId(opts) {
    let id;
    if (opts.isPkgEntry) {
      id = opts.pkg.name;
    } else if ((0, import_utils.winPath)(this.path).startsWith((0, import_utils.winPath)(this.cwd))) {
      id = `./${(0, import_utils.winPath)((0, import_path.relative)(this.cwd, this.path))}`;
    } else if (opts.pkgJSONPath) {
      id = (0, import_utils.winPath)(
        (0, import_path.join)(opts.pkg.name, (0, import_path.relative)((0, import_path.dirname)(opts.pkgJSONPath), this.path))
      );
    } else {
      id = (0, import_utils.winPath)(this.path);
    }
    id = id.replace("@umijs/preset-umi/lib/plugins", "@@");
    id = id.replace(/\.js$/, "");
    return id;
  }
  getKey(opts) {
    function nameToKey(name) {
      return name.split(".").map((part) => import_utils.lodash.camelCase(part)).join(".");
    }
    return nameToKey(
      opts.isPkgEntry ? Plugin.stripNoneUmiScope(opts.pkg.name).replace(RE[this.type], "") : (0, import_path.basename)(this.path, (0, import_path.extname)(this.path))
    );
  }
  static isPluginOrPreset(type, name) {
    return RE[type].test(Plugin.stripNoneUmiScope(name));
  }
  static stripNoneUmiScope(name) {
    if (name.charAt(0) === "@" && !name.startsWith("@umijs/")) {
      name = name.split("/")[1];
    }
    return name;
  }
  static getPluginsAndPresets(opts) {
    function get(type) {
      const types = `${type}s`;
      return [
        // opts
        ...opts[types] || [],
        // env
        ...(process.env[`${opts.prefix}_${types}`.toUpperCase()] || "").split(",").filter(Boolean),
        // dependencies
        // ...Object.keys(opts.pkg.devDependencies || {})
        //   .concat(Object.keys(opts.pkg.dependencies || {}))
        //   .filter(Plugin.isPluginOrPreset.bind(null, type)),
        // user config
        ...opts.userConfig[types] || []
      ].map((path) => {
        (0, import_assert.default)(
          typeof path === "string",
          `Invalid plugin ${path}, it must be string.`
        );
        let resolved;
        try {
          resolved = import_utils.resolve.sync(path, {
            basedir: opts.cwd,
            extensions: [".tsx", ".ts", ".mjs", ".jsx", ".js"]
          });
        } catch (_e) {
          throw new Error(`Invalid plugin ${path}, can not be resolved.`, {
            cause: _e
          });
        }
        return new Plugin({
          path: resolved,
          type,
          cwd: opts.cwd
        });
      });
    }
    return {
      presets: get("preset"),
      plugins: get("plugin")
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Plugin
});
