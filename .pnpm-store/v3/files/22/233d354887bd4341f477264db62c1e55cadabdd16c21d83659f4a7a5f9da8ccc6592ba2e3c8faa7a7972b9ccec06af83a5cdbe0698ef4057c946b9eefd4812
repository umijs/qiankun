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

// src/config/speedMeasureWebpackPlugin.ts
var speedMeasureWebpackPlugin_exports = {};
__export(speedMeasureWebpackPlugin_exports, {
  addSpeedMeasureWebpackPlugin: () => addSpeedMeasureWebpackPlugin
});
module.exports = __toCommonJS(speedMeasureWebpackPlugin_exports);
var import_speed_measure_webpack_plugin = __toESM(require("@umijs/bundler-webpack/compiled/speed-measure-webpack-plugin"));
var import_path = require("path");
async function addSpeedMeasureWebpackPlugin(opts) {
  var _a, _b;
  let webpackConfig = opts.webpackConfig;
  if (process.env.SPEED_MEASURE) {
    const miniCssExtractPluginIdx = (_a = webpackConfig.plugins) == null ? void 0 : _a.findIndex(
      (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
    );
    const miniCssExtractPlugin = (_b = webpackConfig.plugins) == null ? void 0 : _b[miniCssExtractPluginIdx];
    const smpOption = process.env.SPEED_MEASURE === "JSON" ? {
      outputFormat: "json",
      outputTarget: (0, import_path.join)(process.cwd(), "SPEED_MEASURE.json")
    } : { outputFormat: "human", outputTarget: console.log };
    webpackConfig = new import_speed_measure_webpack_plugin.default(smpOption).wrap(webpackConfig);
    if (miniCssExtractPlugin) {
      webpackConfig.plugins[miniCssExtractPluginIdx] = miniCssExtractPlugin;
    }
  }
  return webpackConfig;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addSpeedMeasureWebpackPlugin
});
