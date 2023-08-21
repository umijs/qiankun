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

// src/config/detectDeadCodePlugin.ts
var detectDeadCodePlugin_exports = {};
__export(detectDeadCodePlugin_exports, {
  addDetectDeadCodePlugin: () => addDetectDeadCodePlugin
});
module.exports = __toCommonJS(detectDeadCodePlugin_exports);
var import_types = require("../types");
var import_detectDeadCode = __toESM(require("./detectDeadCode"));
var defaultOptions = {
  patterns: [],
  exclude: [],
  failOnHint: false,
  detectUnusedFiles: true,
  detectUnusedExport: true
};
var DetectDeadCodePlugin = class {
  constructor(options) {
    this.options = defaultOptions;
    this.handleAfterEmit = (compilation, callback) => {
      (0, import_detectDeadCode.default)(compilation, this.options);
      callback();
    };
    if (!options) {
      return;
    }
    this.options = {
      ...this.options,
      ...options
    };
  }
  apply(compiler) {
    if (!this.options.context) {
      this.options = {
        ...this.options,
        context: compiler.context
      };
    }
    compiler.hooks.afterEmit.tapAsync(
      "DetectDeadCodePlugin",
      this.handleAfterEmit
    );
  }
};
async function addDetectDeadCodePlugin(opts) {
  const { config, userConfig } = opts;
  const isDev = opts.env === import_types.Env.development;
  if (userConfig.deadCode && !isDev) {
    config.plugin("detect-dead-code-plugin").use(DetectDeadCodePlugin, [userConfig.deadCode]);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addDetectDeadCodePlugin
});
