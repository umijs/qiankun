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

// src/dep/getModuleExports.ts
var getModuleExports_exports = {};
__export(getModuleExports_exports, {
  getModuleExports: () => getModuleExports
});
module.exports = __toCommonJS(getModuleExports_exports);
var import_es_module_lexer = require("@umijs/bundler-utils/compiled/es-module-lexer");
var import_esbuild = require("@umijs/bundler-utils/compiled/esbuild");
var import_path = require("path");
var import_getCJSExports = require("./getCJSExports");
async function getModuleExports({
  content,
  filePath
}) {
  if (filePath && /\.(tsx|jsx)$/.test(filePath)) {
    content = (await (0, import_esbuild.transform)(content, {
      sourcemap: false,
      sourcefile: filePath,
      format: "esm",
      target: "es6",
      loader: (0, import_path.extname)(filePath).slice(1)
    })).code;
  }
  await import_es_module_lexer.init;
  const [imports, exports] = (0, import_es_module_lexer.parse)(content);
  let isCJS = !imports.length && !exports.length;
  let cjsEsmExports = null;
  if (isCJS) {
    cjsEsmExports = (0, import_getCJSExports.getCJSExports)({ content });
    if (cjsEsmExports.includes("__esModule")) {
      isCJS = false;
    }
  }
  return {
    exports: cjsEsmExports || exports,
    isCJS
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getModuleExports
});
