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

// src/utils/webpackUtils.ts
var webpackUtils_exports = {};
__export(webpackUtils_exports, {
  extractBabelPluginImportOptions: () => extractBabelPluginImportOptions,
  getResolver: () => getResolver
});
module.exports = __toCommonJS(webpackUtils_exports);
var import_webpack = require("webpack");
var import_utils = require("@umijs/utils");
var import_enhanced_resolve = __toESM(require("enhanced-resolve"));
var { property, compact, flatMap } = import_utils.lodash;
function extractBabelPluginImportOptions(webpackConfig) {
  var _a;
  const rules = ((_a = webpackConfig.module) == null ? void 0 : _a.rules) || [];
  const uses = compact(flatMap(rules, property(["use"]))).filter(
    (u) => {
      var _a2;
      return ((_a2 = u == null ? void 0 : u.loader) == null ? void 0 : _a2.indexOf("babel-loader")) >= 0;
    }
  );
  const pluginConfigs = compact(
    flatMap(uses, property(["options", "plugins"]))
  ).filter(
    (p) => {
      var _a2, _b;
      return Array.isArray(p) && ((_b = (_a2 = p[0]) == null ? void 0 : _a2.indexOf) == null ? void 0 : _b.call(_a2, "babel-plugin-import")) >= 0;
    }
  );
  const configs = /* @__PURE__ */ new Map();
  for (const c of pluginConfigs) {
    !configs.has(c[1].libraryName) && configs.set(c[1].libraryName, c[1]);
  }
  return configs;
}
function getResolver(opts) {
  const context = opts.context ?? process.cwd();
  const resolveDefaults = {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    // keep same with previous mfsu version
    roots: [context]
  };
  const mergedResolve = import_webpack.util.cleverMerge(resolveDefaults, opts.resolve);
  const resolver = import_enhanced_resolve.default.create.sync(mergedResolve);
  return (path) => {
    return resolver(context, path);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extractBabelPluginImportOptions,
  getResolver
});
