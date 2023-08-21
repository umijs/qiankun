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

// src/register.ts
var register_exports = {};
__export(register_exports, {
  clearFiles: () => clearFiles,
  getFiles: () => getFiles,
  register: () => register,
  restore: () => restore
});
module.exports = __toCommonJS(register_exports);
var import_path = require("path");
var import_pirates = require("../compiled/pirates");
var import_index = require("./index");
var COMPILE_EXTS = [".ts", ".tsx", ".js", ".jsx"];
var HOOK_EXTS = [...COMPILE_EXTS, ".mjs"];
var registered = false;
var files = [];
var revert = () => {
};
function transform(opts) {
  const { code, filename, implementor } = opts;
  files.push(filename);
  const ext = (0, import_path.extname)(filename);
  try {
    return implementor.transformSync(code, {
      sourcefile: filename,
      loader: ext.slice(1),
      target: "es2019",
      format: "cjs",
      logLevel: "error"
    }).code;
  } catch (e) {
    import_index.logger.error(e);
    throw new Error(`Parse file failed: [${filename}]`);
  }
}
function register(opts) {
  files = [];
  if (!registered) {
    revert = (0, import_pirates.addHook)(
      (code, filename) => transform({ code, filename, implementor: opts.implementor }),
      {
        ext: opts.exts || HOOK_EXTS,
        ignoreNodeModules: true
      }
    );
    registered = true;
  }
}
function getFiles() {
  return files;
}
function clearFiles() {
  files = [];
}
function restore() {
  revert();
  registered = false;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clearFiles,
  getFiles,
  register,
  restore
});
