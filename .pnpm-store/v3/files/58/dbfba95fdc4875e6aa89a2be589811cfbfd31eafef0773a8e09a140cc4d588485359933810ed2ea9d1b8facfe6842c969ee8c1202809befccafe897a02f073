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

// src/tryPaths.ts
var tryPaths_exports = {};
__export(tryPaths_exports, {
  tryPaths: () => tryPaths
});
module.exports = __toCommonJS(tryPaths_exports);
var import_fs = require("fs");
function tryPaths(paths) {
  for (const path of paths) {
    if ((0, import_fs.existsSync)(path))
      return path;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tryPaths
});
