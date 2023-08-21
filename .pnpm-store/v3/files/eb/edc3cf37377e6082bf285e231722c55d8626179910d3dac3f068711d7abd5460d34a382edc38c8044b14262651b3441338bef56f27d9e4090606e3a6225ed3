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

// src/config/manifestPlugin.ts
var manifestPlugin_exports = {};
__export(manifestPlugin_exports, {
  addManifestPlugin: () => addManifestPlugin
});
module.exports = __toCommonJS(manifestPlugin_exports);
var import_webpack_manifest_plugin = require("@umijs/bundler-webpack/compiled/webpack-manifest-plugin");
async function addManifestPlugin(opts) {
  const { config, userConfig } = opts;
  if (userConfig.manifest) {
    config.plugin("manifest-plugin").use(import_webpack_manifest_plugin.WebpackManifestPlugin, [
      {
        fileName: "asset-manifest.json",
        ...userConfig.manifest
      }
    ]);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addManifestPlugin
});
