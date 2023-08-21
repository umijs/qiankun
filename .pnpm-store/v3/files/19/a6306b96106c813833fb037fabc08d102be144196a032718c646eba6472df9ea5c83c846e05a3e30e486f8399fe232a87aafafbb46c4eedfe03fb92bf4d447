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

// src/config/purgecssWebpackPlugin.ts
var purgecssWebpackPlugin_exports = {};
__export(purgecssWebpackPlugin_exports, {
  applyPurgeCSSWebpackPlugin: () => applyPurgeCSSWebpackPlugin
});
module.exports = __toCommonJS(purgecssWebpackPlugin_exports);
var import_types = require("../types");
async function applyPurgeCSSWebpackPlugin(opts) {
  const { config, userConfig, cwd, env } = opts;
  config;
  userConfig;
  cwd;
  env;
  if (userConfig.purgeCSS && env === import_types.Env.production) {
    config.plugin("purgecss-webpack-plugin").use(require("@umijs/bundler-webpack/compiled/purgecss-webpack-plugin"), [
      {
        paths: []
      }
    ]);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  applyPurgeCSSWebpackPlugin
});
