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

// src/plugins/ProgressPlugin.ts
var ProgressPlugin_exports = {};
__export(ProgressPlugin_exports, {
  default: () => ProgressPlugin_default
});
module.exports = __toCommonJS(ProgressPlugin_exports);
var import_webpack = require("@umijs/bundler-webpack/compiled/webpack");
var import_utils = require("@umijs/utils");
var PLUGIN_NAME = "ProgressPlugin";
var UmiProgressPlugin = class extends import_webpack.ProgressPlugin {
  constructor(options = {}) {
    super({ activeModules: true });
    this.options = options;
    this.handler = (percent, message, ...details) => {
      this.updateProgress({ percent, message, details });
    };
  }
  apply(compiler) {
    const prefix = this.options.name ? `[${this.options.name}]` : "[Webpack]";
    compiler.hooks.invalid.tap(PLUGIN_NAME, () => {
      import_utils.logger.wait(`${prefix} Compiling...`);
    });
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      const { errors, warnings } = stats.toJson({
        all: false,
        warnings: true,
        errors: true,
        colors: true
      });
      const hasErrors = !!(errors == null ? void 0 : errors.length);
      const hasWarnings = !!(warnings == null ? void 0 : warnings.length);
      hasWarnings;
      if (hasErrors) {
        errors.forEach((error) => {
          import_utils.logger.error(
            `${error.moduleName}${error.loc ? `:${error.loc}` : ""}`
          );
          console.log(error.message);
        });
      } else {
        import_utils.logger.event(
          `${prefix} Compiled in ${stats.endTime - stats.startTime} ms (${stats.compilation.modules.size} modules)`
        );
      }
    });
  }
  updateProgress(opts) {
    opts;
  }
};
var ProgressPlugin_default = UmiProgressPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
