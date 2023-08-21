var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugins/less-plugin-alias/index.ts
var less_plugin_alias_exports = {};
__export(less_plugin_alias_exports, {
  default: () => LessAliasPlugin
});
module.exports = __toCommonJS(less_plugin_alias_exports);
var import_utils = require("@umijs/utils");
var import_utils2 = require("./utils");
function matches(pattern, importee) {
  if (pattern instanceof RegExp) {
    return pattern.test(importee);
  }
  if (importee.length < pattern.length) {
    return false;
  }
  if (importee === pattern) {
    return true;
  }
  return importee.startsWith(pattern + "/");
}
var LessAliasPlugin = class {
  constructor(options) {
    this.options = options;
  }
  install(less, pluginManager) {
    const alias = (0, import_utils2.parseAlias)(this.options.alias);
    function resolveId(filename) {
      if (!filename) {
        return null;
      }
      const matchedEntry = alias.find((entry) => matches(entry.find, filename));
      if (!matchedEntry) {
        return filename;
      }
      const resolvedPath = filename.replace(
        matchedEntry.find,
        matchedEntry.replacement
      );
      return resolvedPath;
    }
    class AliasePlugin extends less.FileManager {
      loadFile(filename, currentDirectory, options, enviroment) {
        let resolved;
        try {
          resolved = resolveId(filename);
        } catch (error) {
          import_utils.logger.error(error);
        }
        if (!resolved) {
          const error = new Error(
            `[less-plugin-alias]: '${filename}' not found.`
          );
          import_utils.logger.error(error);
          throw error;
        }
        return super.loadFile(resolved, currentDirectory, options, enviroment);
      }
      loadFileSync(filename, currentDirectory, options, enviroment) {
        let resolved;
        try {
          resolved = resolveId(filename);
        } catch (error) {
          import_utils.logger.error(error);
        }
        if (!resolved) {
          const error = new Error(
            `[less-plugin-alias]: '${filename}' not found.`
          );
          import_utils.logger.error(error);
          throw error;
        }
        return super.loadFileSync(
          resolved,
          currentDirectory,
          options,
          enviroment
        );
      }
    }
    pluginManager.addFileManager(new AliasePlugin());
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
