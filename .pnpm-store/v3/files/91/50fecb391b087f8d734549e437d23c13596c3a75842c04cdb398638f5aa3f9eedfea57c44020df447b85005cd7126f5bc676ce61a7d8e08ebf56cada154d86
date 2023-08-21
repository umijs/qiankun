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

// src/route/utils.ts
var utils_exports = {};
__export(utils_exports, {
  byLongestFirst: () => byLongestFirst,
  createRouteId: () => createRouteId,
  findParentRouteId: () => findParentRouteId,
  isRouteModuleFile: () => isRouteModuleFile,
  stripFileExtension: () => stripFileExtension
});
module.exports = __toCommonJS(utils_exports);
var import_utils = require("@umijs/utils");
var import_path = require("path");
function createRouteId(file) {
  return (0, import_utils.winPath)(stripFileExtension(file));
}
function stripFileExtension(file) {
  return file.replace(/\.[a-z0-9]+$/i, "");
}
function byLongestFirst(a, b) {
  return b.length - a.length;
}
function findParentRouteId(routeIds, childRouteId) {
  return routeIds.find((id) => childRouteId.startsWith(`${id}/`));
}
var routeModuleExts = [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx", ".vue"];
function isRouteModuleFile(opts) {
  for (const excludeRegExp of opts.exclude || []) {
    if (opts.file && excludeRegExp instanceof RegExp && excludeRegExp.test(opts.file)) {
      return false;
    }
  }
  return routeModuleExts.includes((0, import_path.extname)(opts.file));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  byLongestFirst,
  createRouteId,
  findParentRouteId,
  isRouteModuleFile,
  stripFileExtension
});
