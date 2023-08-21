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

// src/config/nodePrefixPlugin.ts
var nodePrefixPlugin_exports = {};
__export(nodePrefixPlugin_exports, {
  addNodePrefixPlugin: () => addNodePrefixPlugin
});
module.exports = __toCommonJS(nodePrefixPlugin_exports);
var import_webpack = require("@umijs/bundler-webpack/compiled/webpack");
async function addNodePrefixPlugin(opts) {
  const { config } = opts;
  config.plugin("node-prefix-plugin").use(import_webpack.NormalModuleReplacementPlugin, [
    /^node:/,
    (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
    }
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addNodePrefixPlugin
});
