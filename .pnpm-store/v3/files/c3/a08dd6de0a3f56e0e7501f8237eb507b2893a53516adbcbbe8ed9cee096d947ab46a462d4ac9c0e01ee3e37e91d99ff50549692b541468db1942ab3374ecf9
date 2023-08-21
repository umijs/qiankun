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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/importLazy.ts
var importLazy_exports = {};
__export(importLazy_exports, {
  importLazy: () => importLazy
});
module.exports = __toCommonJS(importLazy_exports);
var import_import_lazy = __toESM(require("../compiled/import-lazy"));
function importLazy(moduleName, requireFn) {
  const importLazyLocal = (0, import_import_lazy.default)(
    requireFn || require
  );
  return importLazyLocal(moduleName);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  importLazy
});
