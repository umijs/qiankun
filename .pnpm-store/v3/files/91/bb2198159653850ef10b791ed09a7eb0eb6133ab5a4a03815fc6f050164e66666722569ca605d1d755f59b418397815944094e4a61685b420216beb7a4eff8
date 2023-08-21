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

// src/config/bundleAnalyzerPlugin.ts
var bundleAnalyzerPlugin_exports = {};
__export(bundleAnalyzerPlugin_exports, {
  addBundleAnalyzerPlugin: () => addBundleAnalyzerPlugin
});
module.exports = __toCommonJS(bundleAnalyzerPlugin_exports);
var import_webpack_bundle_analyzer = require("@umijs/bundler-webpack/compiled/webpack-bundle-analyzer");
async function addBundleAnalyzerPlugin(opts) {
  const { config } = opts;
  config.plugin("webpack-bundle-analyzer").use(import_webpack_bundle_analyzer.BundleAnalyzerPlugin, [
    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    {
      analyzerMode: "server",
      analyzerPort: process.env.ANALYZE_PORT || 8888,
      openAnalyzer: false,
      logLevel: "info",
      defaultSizes: "parsed",
      ...opts.userConfig.analyze
    }
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addBundleAnalyzerPlugin
});
