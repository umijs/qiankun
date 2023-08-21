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

// src/babelPlugins/awaitImport/getRealPath.ts
var getRealPath_exports = {};
__export(getRealPath_exports, {
  getRealPath: () => getRealPath
});
module.exports = __toCommonJS(getRealPath_exports);
var import_fs = require("fs");
var import_path = require("path");
var FILE_EXT_NAMES = [".tsx", ".ts", ".jsx", ".mjs", ".js"];
function getRealPath(opts) {
  const target = (0, import_path.isAbsolute)(opts.dep) ? opts.dep : (0, import_path.join)((0, import_path.dirname)(opts.file), opts.dep);
  if (FILE_EXT_NAMES.includes((0, import_path.extname)(target))) {
    return target;
  } else {
    for (const fileExtName of FILE_EXT_NAMES) {
      const targetWithExtName = `${target}${fileExtName}`;
      if ((0, import_fs.existsSync)(targetWithExtName)) {
        return targetWithExtName;
      }
    }
    return null;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRealPath
});
