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

// src/webpackPlugins/depChunkIdPrefixPlugin.ts
var depChunkIdPrefixPlugin_exports = {};
__export(depChunkIdPrefixPlugin_exports, {
  DepChunkIdPrefixPlugin: () => DepChunkIdPrefixPlugin
});
module.exports = __toCommonJS(depChunkIdPrefixPlugin_exports);
var import_constants = require("../constants");
var pluginId = "MFSUDepChunkIdPrefix";
var DepChunkIdPrefixPlugin = class {
  constructor() {
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginId, (compilation) => {
      compilation.hooks.afterOptimizeChunkIds.tap(
        pluginId,
        (chunks) => {
          for (const chunk of chunks) {
            chunk.id = import_constants.MF_DEP_PREFIX + chunk.id;
            chunk.ids = [chunk.id];
          }
        }
      );
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DepChunkIdPrefixPlugin
});
