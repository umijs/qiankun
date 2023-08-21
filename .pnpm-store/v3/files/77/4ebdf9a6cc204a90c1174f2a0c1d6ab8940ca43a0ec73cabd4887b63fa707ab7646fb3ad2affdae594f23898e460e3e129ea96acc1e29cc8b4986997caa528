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

// src/config/copyPlugin.ts
var copyPlugin_exports = {};
__export(copyPlugin_exports, {
  addCopyPlugin: () => addCopyPlugin
});
module.exports = __toCommonJS(copyPlugin_exports);
var import_fs = require("fs");
var import_path = require("path");
async function addCopyPlugin(opts) {
  var _a;
  const { config, userConfig, cwd } = opts;
  const publicDir = (0, import_path.join)(cwd, "public");
  const copyPatterns = [
    (0, import_fs.existsSync)(publicDir) && (0, import_fs.readdirSync)(publicDir).length && {
      from: publicDir,
      // ref: https://github.com/webpack-contrib/copy-webpack-plugin#info
      // Set minimized so terser will not do minimize
      info: { minimized: true }
    },
    ...userConfig.copy ? (_a = userConfig.copy) == null ? void 0 : _a.map((pattern) => {
      if (typeof pattern === "string") {
        return {
          from: (0, import_path.resolve)(cwd, pattern),
          info: { minimized: true }
        };
      }
      return {
        from: (0, import_path.resolve)(cwd, pattern.from),
        to: (0, import_path.resolve)(cwd, pattern.to),
        info: { minimized: true }
      };
    }) : []
  ].filter(Boolean);
  if (copyPatterns.length) {
    config.plugin("copy").use(require("@umijs/bundler-webpack/compiled/copy-webpack-plugin"), [
      {
        patterns: copyPatterns
      }
    ]);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addCopyPlugin
});
