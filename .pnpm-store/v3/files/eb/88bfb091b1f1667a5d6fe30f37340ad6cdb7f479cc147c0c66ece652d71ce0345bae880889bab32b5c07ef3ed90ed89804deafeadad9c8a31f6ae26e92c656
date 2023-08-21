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

// src/config/definePlugin.ts
var definePlugin_exports = {};
__export(definePlugin_exports, {
  addDefinePlugin: () => addDefinePlugin,
  resolveDefine: () => resolveDefine
});
module.exports = __toCommonJS(definePlugin_exports);
var import_webpack = require("@umijs/bundler-webpack/compiled/webpack");
var prefixRE = /^UMI_APP_/;
var ENV_SHOULD_PASS = ["NODE_ENV", "HMR", "SOCKET_SERVER", "ERROR_OVERLAY"];
function resolveDefine(opts) {
  const env = {};
  Object.keys(process.env).forEach((key) => {
    if (prefixRE.test(key) || ENV_SHOULD_PASS.includes(key)) {
      env[key] = process.env[key];
    }
  });
  env.PUBLIC_PATH = opts.publicPath || "/";
  for (const key in env) {
    env[key] = JSON.stringify(env[key]);
  }
  const define = {};
  if (opts.define) {
    for (const key in opts.define) {
      define[key] = JSON.stringify(opts.define[key]);
    }
  }
  return {
    "process.env": env,
    ...define
  };
}
async function addDefinePlugin(opts) {
  const { config, userConfig } = opts;
  config.plugin("define").use(import_webpack.DefinePlugin, [
    resolveDefine({
      define: userConfig.define || {},
      publicPath: userConfig.publicPath
    })
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addDefinePlugin,
  resolveDefine
});
