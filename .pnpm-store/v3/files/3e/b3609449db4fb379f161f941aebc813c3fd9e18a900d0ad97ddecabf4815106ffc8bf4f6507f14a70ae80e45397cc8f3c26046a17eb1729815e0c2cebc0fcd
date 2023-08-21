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

// src/config/nodePolyfill.ts
var nodePolyfill_exports = {};
__export(nodePolyfill_exports, {
  addNodePolyfill: () => addNodePolyfill
});
module.exports = __toCommonJS(nodePolyfill_exports);
var import_webpack = require("@umijs/bundler-webpack/compiled/webpack");
async function addNodePolyfill(opts) {
  const { config } = opts;
  const nodeLibs = require("node-libs-browser");
  config.plugin("node-polyfill-provider").use(import_webpack.ProvidePlugin, [
    {
      Buffer: ["buffer", "Buffer"],
      process: nodeLibs["process"]
    }
  ]);
  config.resolve.fallback.merge({
    ...Object.keys(nodeLibs).reduce((memo, key) => {
      if (nodeLibs[key]) {
        memo[key] = nodeLibs[key];
      } else {
        memo[key] = false;
      }
      return memo;
    }, {}),
    http: false,
    https: false
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addNodePolyfill
});
