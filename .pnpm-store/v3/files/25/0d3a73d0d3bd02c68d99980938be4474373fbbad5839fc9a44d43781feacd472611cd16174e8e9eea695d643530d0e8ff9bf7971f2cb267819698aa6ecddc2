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

// src/config/compressPlugin.ts
var compressPlugin_exports = {};
__export(compressPlugin_exports, {
  addCompressPlugin: () => addCompressPlugin
});
module.exports = __toCommonJS(compressPlugin_exports);
var import_css_minimizer_webpack_plugin = __toESM(require("@umijs/bundler-webpack/compiled/css-minimizer-webpack-plugin"));
var import_terser_webpack_plugin = __toESM(require("../../compiled/terser-webpack-plugin"));
var import_EsbuildMinifyFix = require("../plugins/EsbuildMinifyFix");
var import_types = require("../types");
var import_getEsBuildTarget = require("../utils/getEsBuildTarget");
async function addCompressPlugin(opts) {
  const { config, userConfig, env } = opts;
  const jsMinifier = userConfig.jsMinifier || import_types.JSMinifier.esbuild;
  const cssMinifier = userConfig.cssMinifier || import_types.CSSMinifier.esbuild;
  if (env === import_types.Env.development || process.env.COMPRESS === "none" || jsMinifier === import_types.JSMinifier.none && cssMinifier === import_types.CSSMinifier.none) {
    config.optimization.minimize(false);
    return;
  }
  config.optimization.minimize(true);
  const esbuildTarget = (0, import_getEsBuildTarget.getEsBuildTarget)({
    targets: userConfig.targets || {},
    jsMinifier
  });
  if (!esbuildTarget.includes("es2015")) {
    esbuildTarget.push("es2015");
  }
  let minify;
  let terserOptions;
  if (jsMinifier === import_types.JSMinifier.esbuild) {
    minify = import_terser_webpack_plugin.default.esbuildMinify;
    terserOptions = {
      target: esbuildTarget,
      // remove all comments
      legalComments: "none"
    };
    if (userConfig.esbuildMinifyIIFE) {
      config.plugin("EsbuildMinifyFix").use(import_EsbuildMinifyFix.EsbuildMinifyFix);
    }
  } else if (jsMinifier === import_types.JSMinifier.terser) {
    minify = import_terser_webpack_plugin.default.terserMinify;
    terserOptions = {
      format: {
        comments: false
      }
    };
  } else if (jsMinifier === import_types.JSMinifier.swc) {
    minify = import_terser_webpack_plugin.default.swcMinify;
  } else if (jsMinifier === import_types.JSMinifier.uglifyJs) {
    minify = import_terser_webpack_plugin.default.uglifyJsMinify;
    terserOptions = {
      output: {
        comments: false
      }
    };
  } else if (jsMinifier !== import_types.JSMinifier.none) {
    throw new Error(`Unsupported jsMinifier ${userConfig.jsMinifier}.`);
  }
  terserOptions = {
    ...terserOptions,
    ...userConfig.jsMinifierOptions
  };
  if (jsMinifier !== import_types.JSMinifier.none) {
    config.optimization.minimizer(`js-${jsMinifier}`).use(import_terser_webpack_plugin.default, [
      {
        extractComments: false,
        minify,
        terserOptions
      }
    ]);
  }
  let cssMinify;
  let minimizerOptions;
  if (cssMinifier === import_types.CSSMinifier.esbuild) {
    cssMinify = import_css_minimizer_webpack_plugin.default.esbuildMinify;
    minimizerOptions = {
      target: esbuildTarget
    };
  } else if (cssMinifier === import_types.CSSMinifier.cssnano) {
    cssMinify = import_css_minimizer_webpack_plugin.default.cssnanoMinify;
  } else if (cssMinifier === import_types.CSSMinifier.parcelCSS) {
    cssMinify = import_css_minimizer_webpack_plugin.default.parcelCssMinify;
  } else if (cssMinifier !== import_types.CSSMinifier.none) {
    throw new Error(`Unsupported cssMinifier ${userConfig.cssMinifier}.`);
  }
  minimizerOptions = {
    ...minimizerOptions,
    ...userConfig.cssMinifierOptions
  };
  config.optimization.minimizer(`css-${cssMinifier}`).use(import_css_minimizer_webpack_plugin.default, [
    {
      minify: cssMinify,
      minimizerOptions
    }
  ]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addCompressPlugin
});
