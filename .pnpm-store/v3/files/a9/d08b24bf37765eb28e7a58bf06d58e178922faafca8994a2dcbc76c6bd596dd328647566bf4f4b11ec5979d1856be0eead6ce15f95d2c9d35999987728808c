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

// src/webpackPlugins/stripSourceMapUrlPlugin.ts
var stripSourceMapUrlPlugin_exports = {};
__export(stripSourceMapUrlPlugin_exports, {
  StripSourceMapUrlPlugin: () => StripSourceMapUrlPlugin
});
module.exports = __toCommonJS(stripSourceMapUrlPlugin_exports);
var StripSourceMapUrlPlugin = class {
  constructor(opts) {
    this.opts = opts;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "StripSourceMapUrlPlugin",
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: "StripSourceMapUrlPlugin",
            stage: this.opts.webpack.Compilation.PROCESS_ASSETS_STAGE_DERIVE
          },
          (assets) => {
            Object.keys(assets).filter((filename) => /\.js$/.test(filename)).forEach((filename) => {
              const asset = assets[filename];
              const source = asset.source().toString().replace(/# sourceMappingURL=(.+?\.map)/g, "# $1");
              compilation.updateAsset(
                filename,
                new this.opts.webpack.sources.RawSource(source)
              );
            });
          }
        );
      }
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StripSourceMapUrlPlugin
});
