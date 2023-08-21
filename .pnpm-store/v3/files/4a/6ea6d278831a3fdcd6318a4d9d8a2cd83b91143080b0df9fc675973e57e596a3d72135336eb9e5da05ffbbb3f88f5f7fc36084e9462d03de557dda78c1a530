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

// src/config/ssrPlugin.ts
var ssrPlugin_exports = {};
__export(ssrPlugin_exports, {
  default: () => addSSRPlugin
});
module.exports = __toCommonJS(ssrPlugin_exports);
var import_webpack = require("@umijs/bundler-webpack/compiled/webpack");
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_path = require("path");
var import_constants = require("../constants");
var PLUGIN_NAME = "SSR_PLUGIN";
var SSRPlugin = class {
  constructor(opts) {
    this.opts = opts;
    this.manifest = /* @__PURE__ */ new Map();
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(PLUGIN_NAME, () => {
        const publicPath = compiler.options.output.publicPath || "/";
        const assets = compilation.getAssets().filter((asset) => {
          if (asset.info.hotModuleReplacement) {
            return false;
          }
          return true;
        });
        assets.forEach((asset) => {
          if (asset.info.sourceFilename) {
            this.manifest.set(
              asset.info.sourceFilename,
              publicPath + asset.name
            );
          }
        });
        const stats = compilation.getStats().toJson({
          all: false,
          assets: true,
          cachedAssets: true,
          cachedModules: true
        });
        const { assetsByChunkName } = stats;
        Object.keys(assetsByChunkName).forEach((chunkName) => {
          assetsByChunkName[chunkName].forEach((filename) => {
            const ext = (0, import_path.extname)(filename.split(/[?#]/)[0]);
            if (!filename.includes(".hot-update.")) {
              this.manifest.set(chunkName + ext, publicPath + filename);
            }
          });
        });
        const assetsSource = JSON.stringify(
          {
            assets: Object.fromEntries(this.manifest)
          },
          null,
          2
        );
        if (process.env.NODE_ENV === "production" || this.opts.userConfig.writeToDisk) {
          compilation.emitAsset(
            "build-manifest.json",
            new import_webpack.sources.RawSource(assetsSource, false)
          );
        } else {
          const outputPath = compiler.options.output.path;
          import_utils.fsExtra.mkdirpSync(outputPath);
          (0, import_fs.writeFileSync)(
            (0, import_path.join)(outputPath, "build-manifest.json"),
            assetsSource,
            "utf-8"
          );
        }
      });
    });
  }
};
function addSSRPlugin(opts) {
  if (opts.userConfig.ssr && opts.name !== import_constants.MFSU_NAME) {
    opts.config.plugin("ssr-plugin").use(SSRPlugin, [opts]);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
