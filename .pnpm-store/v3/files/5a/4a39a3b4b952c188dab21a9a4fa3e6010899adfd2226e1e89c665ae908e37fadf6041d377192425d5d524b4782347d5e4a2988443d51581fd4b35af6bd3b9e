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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  isDepPath: () => isDepPath,
  parseModule: () => parseModule,
  parseModuleSync: () => parseModuleSync,
  prettyPrintEsBuildErrors: () => prettyPrintEsBuildErrors
});
module.exports = __toCommonJS(src_exports);
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_es_module_lexer = require("../compiled/es-module-lexer");
var import_esbuild = require("../compiled/esbuild");
__reExport(src_exports, require("./https"), module.exports);
__reExport(src_exports, require("./proxy"), module.exports);
__reExport(src_exports, require("./types"), module.exports);
var babelCodeFrame = (0, import_utils.importLazy)(require.resolve("../compiled/babel/code-frame"));
async function parseModule(opts) {
  await import_es_module_lexer.init;
  return parseModuleSync(opts);
}
function parseModuleSync(opts) {
  let content = opts.content;
  if (opts.path.endsWith(".tsx") || opts.path.endsWith(".jsx")) {
    try {
      content = (0, import_esbuild.transformSync)(content, {
        loader: (0, import_path.extname)(opts.path).slice(1),
        format: "esm"
      }).code;
    } catch (e) {
      prettyPrintEsBuildErrors(e.errors, opts);
      import_utils.logger.error(`transform ${opts.path} failed`);
      throw e;
    }
  }
  try {
    return (0, import_es_module_lexer.parse)(content);
  } catch (e) {
    import_utils.logger.error(`parse ${opts.path} failed`);
    throw e;
  }
}
function isDepPath(path) {
  const umiMonorepoPaths = ["umi/packages/", "umi-next/packages/"];
  return path.includes("node_modules") || umiMonorepoPaths.some((p) => (0, import_utils.winPath)(path).includes(p));
}
function prettyPrintEsBuildErrors(errors = [], opts) {
  var _a, _b;
  for (const error of errors) {
    if (((_a = error.location) == null ? void 0 : _a.line) && ((_b = error.location) == null ? void 0 : _b.column)) {
      const message = babelCodeFrame.codeFrameColumns(
        opts.content,
        {
          start: {
            line: error.location.line,
            column: error.location.column
          }
        },
        {
          message: error.text,
          highlightCode: true
        }
      );
      console.log(`
${opts.path}:
${message}
`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isDepPath,
  parseModule,
  parseModuleSync,
  prettyPrintEsBuildErrors
});
