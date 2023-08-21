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

// src/loader/esbuild.ts
var esbuild_exports = {};
__export(esbuild_exports, {
  default: () => esbuild_default,
  esbuildLoader: () => esbuildLoader
});
module.exports = __toCommonJS(esbuild_exports);
var import_es_module_lexer = require("@umijs/bundler-utils/compiled/es-module-lexer");
var import_esbuild = require("@umijs/bundler-utils/compiled/esbuild");
var import_path = require("path");
var LOADER_MAP = {
  // js
  js: "js",
  cjs: "js",
  mjs: "js",
  jsx: "jsx",
  cjsx: "jsx",
  mjsx: "jsx",
  // ts
  ts: "ts",
  cts: "ts",
  mts: "ts",
  tsx: "tsx",
  ctsx: "tsx",
  mtsx: "tsx"
};
async function esbuildTranspiler(source) {
  const done = this.async();
  const options = this.getOptions();
  const { handler = [], implementation, ...otherOptions } = options;
  const transform = (implementation == null ? void 0 : implementation.transform) || import_esbuild.transform;
  const filePath = this.resourcePath;
  const ext = (0, import_path.extname)(filePath).slice(1);
  const loader = LOADER_MAP[ext] ?? "default";
  const transformOptions = {
    ...otherOptions,
    target: options.target ?? "es2015",
    loader,
    sourcemap: this.sourceMap,
    sourcefile: filePath
  };
  try {
    let { code, map } = await transform(source, transformOptions);
    if (handler.length) {
      await import_es_module_lexer.init;
      handler.forEach((handle) => {
        const [imports, exports] = (0, import_es_module_lexer.parse)(code);
        code = handle({ code, imports, exports, filePath });
      });
    }
    done(null, code, map && JSON.parse(map));
  } catch (error) {
    done(error);
  }
}
var esbuild_default = esbuildTranspiler;
var esbuildLoader = __filename;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  esbuildLoader
});
