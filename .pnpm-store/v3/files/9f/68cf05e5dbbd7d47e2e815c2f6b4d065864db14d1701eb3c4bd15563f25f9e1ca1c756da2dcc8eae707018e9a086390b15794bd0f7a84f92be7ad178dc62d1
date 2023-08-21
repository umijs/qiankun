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

// src/plugins/_SamplePlugin.ts
var SamplePlugin_exports = {};
__export(SamplePlugin_exports, {
  default: () => SamplePlugin_default
});
module.exports = __toCommonJS(SamplePlugin_exports);
var PLUGIN_NAME = "SamplePlugin";
var _SamplePlugin = class {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.chunkHash.tap(PLUGIN_NAME, () => {
      });
    });
  }
};
var SamplePlugin_default = _SamplePlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
