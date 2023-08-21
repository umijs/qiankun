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

// src/getCorejsVersion.ts
var getCorejsVersion_exports = {};
__export(getCorejsVersion_exports, {
  getCorejsVersion: () => getCorejsVersion
});
module.exports = __toCommonJS(getCorejsVersion_exports);
var import_fs_extra = require("../compiled/fs-extra");
var getCorejsVersion = (pkgPath) => {
  var _a;
  const pkg = (0, import_fs_extra.readJsonSync)(pkgPath, { encoding: "utf-8" });
  const version = ((_a = pkg.dependencies["core-js"]) == null ? void 0 : _a.split(".").slice(0, 2).join(".")) || "3";
  return version;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCorejsVersion
});
