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

// src/config/utils.ts
var utils_exports = {};
__export(utils_exports, {
  addExt: () => addExt,
  getAbsFiles: () => getAbsFiles
});
module.exports = __toCommonJS(utils_exports);
var import_path = require("path");
function addExt(opts) {
  const index = opts.file.lastIndexOf(".");
  return `${opts.file.slice(0, index)}${opts.ext}${opts.file.slice(index)}`;
}
function getAbsFiles(opts) {
  return opts.files.map((file) => {
    return (0, import_path.isAbsolute)(file) ? file : (0, import_path.join)(opts.cwd, file);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addExt,
  getAbsFiles
});
