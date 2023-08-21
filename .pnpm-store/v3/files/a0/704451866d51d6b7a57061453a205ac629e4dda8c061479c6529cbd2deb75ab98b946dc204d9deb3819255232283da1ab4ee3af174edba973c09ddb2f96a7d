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

// src/plugins/EsbuildMinifyFix.ts
var EsbuildMinifyFix_exports = {};
__export(EsbuildMinifyFix_exports, {
  EsbuildMinifyFix: () => EsbuildMinifyFix
});
module.exports = __toCommonJS(EsbuildMinifyFix_exports);
var import_utils = require("@umijs/utils");
var import_webpack = require("../../compiled/webpack");
var JS_FILE_REG = /\.(js|mjs|cjs)$/;
var EsbuildMinifyFix = class {
  constructor() {
    this.name = `EsbuildMinifyFix`;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this.name,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING,
          additionalAssets: true
        },
        (assets) => this.minifyFix(compilation, assets)
      );
    });
  }
  isIIFE(source) {
    source = source.trim();
    if (source.startsWith('(function(){"use strict";')) {
      return true;
    }
    if (source.startsWith("(function(){") && (source.endsWith("})()") || source.endsWith("})();"))) {
      return true;
    }
    return false;
  }
  async minifyFix(compilation, assets) {
    const matchObject = import_webpack.ModuleFilenameHelpers.matchObject.bind(void 0, {
      include: [JS_FILE_REG]
    });
    const assetsForMinify = await Promise.all(
      Object.keys(assets).filter((name) => {
        var _a;
        if (!matchObject(name)) {
          return false;
        }
        const { info } = compilation.getAsset(name) || {};
        if (!(info == null ? void 0 : info.minimized)) {
          return false;
        }
        if (info == null ? void 0 : info.copied) {
          return false;
        }
        if (info == null ? void 0 : info.EsbuildMinifyFix) {
          return false;
        }
        if (name.endsWith(".worker.js")) {
          return false;
        }
        if ((_a = info == null ? void 0 : info.related) == null ? void 0 : _a.sourceMap) {
          return false;
        }
        return true;
      }).map(async (name) => {
        const { info, source } = compilation.getAsset(name);
        return { name, info, inputSource: source };
      })
    );
    if (assetsForMinify.length === 0) {
      return;
    }
    const { SourceMapSource, RawSource } = import_webpack.sources;
    for (const asset of assetsForMinify) {
      const { name, inputSource } = asset;
      const { source, map } = inputSource.sourceAndMap();
      const originCode = source.toString();
      let newCode = originCode;
      if (!newCode.startsWith('"use strict";(self.') && !newCode.startsWith("(self.webpack") && !this.isIIFE(newCode)) {
        const bundle = new import_utils.MagicString(newCode);
        bundle.prepend("!(function(){").append("}());");
        newCode = bundle.toString();
        const output = {};
        if (map) {
          const bundleMap = bundle.generateMap({
            source: name,
            file: `${name}.map`,
            includeContent: true,
            hires: true
          });
          const originMapAsString = JSON.stringify(map);
          const mergedMap = (0, import_utils.remapping)(JSON.stringify(bundleMap), (file) => {
            if (file === name) {
              return originMapAsString;
            }
            return null;
          });
          output.source = new SourceMapSource(
            newCode,
            name,
            mergedMap,
            originCode,
            map,
            true
          );
        } else {
          output.source = new RawSource(newCode);
        }
        compilation.updateAsset(name, output.source, {
          ...asset.info,
          EsbuildMinifyFix: true
        });
      }
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EsbuildMinifyFix
});
