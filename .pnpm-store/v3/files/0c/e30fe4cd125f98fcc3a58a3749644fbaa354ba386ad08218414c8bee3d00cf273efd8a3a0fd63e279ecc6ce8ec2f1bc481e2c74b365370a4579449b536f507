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

// src/isLocalDev.ts
var isLocalDev_exports = {};
__export(isLocalDev_exports, {
  isLocalDev: () => isLocalDev
});
module.exports = __toCommonJS(isLocalDev_exports);
var import_fs = require("fs");
var import_path = require("path");
var root = (0, import_path.join)(__dirname, "../../../");
var rootPkg = (0, import_path.join)(root, "./package.json");
var isLocalDev = () => {
  const isLocal = (0, import_fs.existsSync)(rootPkg) && require(rootPkg)._local;
  return isLocal ? root : false;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isLocalDev
});
