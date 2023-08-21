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

// src/loader/svgr.ts
var svgr_exports = {};
__export(svgr_exports, {
  default: () => svgr_default
});
module.exports = __toCommonJS(svgr_exports);
var import_core = require("@svgr/core");
var import_plugin_jsx = __toESM(require("@svgr/plugin-jsx"));
var import_plugin_svgo = __toESM(require("@svgr/plugin-svgo"));
var import_esbuild = require("@umijs/bundler-utils/compiled/esbuild");
var import_path = require("path");
var import_util = require("util");
var tranformSvg = (0, import_util.callbackify)(
  async (contents, options, state) => {
    const jsCode = await (0, import_core.transform)(contents, options, state);
    const result = await (0, import_esbuild.transform)(jsCode, {
      loader: "tsx",
      target: "es2015"
    });
    if (!(result == null ? void 0 : result.code)) {
      throw new Error(`Error while transforming using Esbuild`);
    }
    return result.code;
  }
);
function svgrLoader(contents) {
  this.cacheable && this.cacheable();
  const callback = this.async();
  const options = this.getOptions();
  const previousExport = (() => {
    if (contents.startsWith("export "))
      return contents;
    const exportMatches = contents.match(/^module.exports\s*=\s*(.*)/);
    return exportMatches ? `export default ${exportMatches[1]}` : null;
  })();
  const state = {
    caller: {
      name: "svgr-loader",
      previousExport,
      defaultPlugins: [import_plugin_svgo.default, import_plugin_jsx.default]
    },
    filePath: (0, import_path.normalize)(this.resourcePath)
  };
  if (!previousExport) {
    tranformSvg(contents, options, state, callback);
  } else {
    this.fs.readFile(this.resourcePath, (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      tranformSvg(String(result), options, state, callback);
    });
  }
}
var svgr_default = svgrLoader;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
