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

// src/webpackPlugins/buildDepPlugin.ts
var buildDepPlugin_exports = {};
__export(buildDepPlugin_exports, {
  BuildDepPlugin: () => BuildDepPlugin
});
module.exports = __toCommonJS(buildDepPlugin_exports);
var import_utils = require("@umijs/utils");
var PLUGIN_NAME = "MFSUBuildDeps";
var BuildDepPlugin = class {
  constructor(opts) {
    this.opts = opts;
  }
  apply(compiler) {
    compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, (c) => {
      var _a, _b;
      import_utils.logger.debug(
        "webpack watched change",
        "modified: ",
        c.modifiedFiles,
        "removed: ",
        c.removedFiles
      );
      return ((_b = (_a = this.opts).onFileChange) == null ? void 0 : _b.call(_a, c)) || Promise.resolve();
    });
    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, () => {
      var _a, _b;
      if (this.opts.beforeCompile) {
        return (_b = (_a = this.opts).beforeCompile) == null ? void 0 : _b.call(_a);
      } else {
        return Promise.resolve();
      }
    });
    compiler.hooks.done.tap(PLUGIN_NAME, (stats) => {
      if (!stats.hasErrors()) {
        this.opts.onCompileDone();
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BuildDepPlugin
});
