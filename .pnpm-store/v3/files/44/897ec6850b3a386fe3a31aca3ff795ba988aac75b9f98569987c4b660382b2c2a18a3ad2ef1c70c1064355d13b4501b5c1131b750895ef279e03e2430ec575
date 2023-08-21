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

// src/plugins/RuntimePublicPathPlugin.ts
var RuntimePublicPathPlugin_exports = {};
__export(RuntimePublicPathPlugin_exports, {
  RuntimePublicPathPlugin: () => RuntimePublicPathPlugin
});
module.exports = __toCommonJS(RuntimePublicPathPlugin_exports);
var PLUGIN_NAME = "RuntimePublicPath";
var RuntimePublicPathPlugin = class {
  apply(compiler) {
    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.runtimeModule.tap(
        PLUGIN_NAME,
        (module2) => {
          if (module2.constructor.name === "PublicPathRuntimeModule") {
            if (module2.getGeneratedCode().includes("webpack:///mini-css-extract-plugin"))
              return;
            module2._cachedGeneratedCode = `__webpack_require__.p = (typeof globalThis !== 'undefined' ? globalThis : window).publicPath || '/';`;
          }
        }
      );
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RuntimePublicPathPlugin
});
