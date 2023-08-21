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

// src/build.ts
var build_exports = {};
__export(build_exports, {
  build: () => build
});
module.exports = __toCommonJS(build_exports);
var import_esbuild = require("@umijs/bundler-utils/compiled/esbuild");
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_alias = __toESM(require("./plugins/alias"));
var import_externals = __toESM(require("./plugins/externals"));
var import_less = __toESM(require("./plugins/less"));
var import_style = require("./plugins/style");
async function build(opts) {
  var _a, _b;
  const outputPath = opts.config.outputPath || (0, import_path.join)(opts.cwd, "dist");
  if (opts.clean) {
    import_utils.rimraf.sync(outputPath);
  }
  const config = {
    entryPoints: opts.entry,
    bundle: true,
    format: opts.format || "iife",
    logLevel: "error",
    // splitting: true,
    sourcemap: opts.sourcemap,
    outdir: outputPath,
    metafile: true,
    plugins: [
      (0, import_less.default)({
        modifyVars: opts.config.theme,
        javascriptEnabled: true,
        alias: opts.config.alias,
        // ref: https://github.com/umijs/umi-next/pull/214
        inlineStyle: opts.inlineStyle,
        config: opts.config,
        ...opts.config.lessLoader
      }),
      opts.config.alias && (0, import_alias.default)(addCwdPrefix(opts.config.alias, opts.cwd)),
      opts.config.externals && (0, import_externals.default)(opts.config.externals),
      (0, import_style.style)({
        inlineStyle: opts.inlineStyle,
        config: opts.config
      })
    ].filter(Boolean),
    define: {
      // __dirname sham
      __dirname: JSON.stringify("__dirname"),
      "process.env.NODE_ENV": JSON.stringify(opts.mode || "development"),
      ...opts.config.define
    },
    loader: {
      ".svg": "dataurl",
      ".ttf": "dataurl",
      ".wasm": "dataurl",
      ...opts.config.loader
    }
  };
  await ((_b = (_a = opts.config).modifyConfig) == null ? void 0 : _b.call(_a, config));
  const result = await (0, import_esbuild.build)(config);
  return result;
}
function addCwdPrefix(obj, cwd) {
  Object.keys(obj).forEach((key) => {
    if (obj[key].startsWith(".")) {
      obj[key] = (0, import_utils.winPath)((0, import_path.join)(cwd, obj[key]));
    }
  });
  return obj;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  build
});
