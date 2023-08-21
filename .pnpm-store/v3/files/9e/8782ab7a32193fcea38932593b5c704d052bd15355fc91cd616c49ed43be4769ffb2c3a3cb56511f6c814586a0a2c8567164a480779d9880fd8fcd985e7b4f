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

// src/config/miniCSSExtractPlugin.ts
var miniCSSExtractPlugin_exports = {};
__export(miniCSSExtractPlugin_exports, {
  addMiniCSSExtractPlugin: () => addMiniCSSExtractPlugin
});
module.exports = __toCommonJS(miniCSSExtractPlugin_exports);
var import_mini_css_extract_plugin = __toESM(require("@umijs/bundler-webpack/compiled/mini-css-extract-plugin"));
async function addMiniCSSExtractPlugin(opts) {
  const { config, userConfig, useHash } = opts;
  const hash = useHash ? ".[contenthash:8]" : "";
  if (!userConfig.styleLoader) {
    config.plugin("mini-css-extract-plugin").use(import_mini_css_extract_plugin.default, [
      {
        filename: `[name]${hash}.css`,
        chunkFilename: opts.userConfig.ssr ? (
          // TODO: FIXME
          `umi${hash}.css`
        ) : `[name]${hash}.chunk.css`,
        ignoreOrder: true
      }
    ]);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addMiniCSSExtractPlugin
});
