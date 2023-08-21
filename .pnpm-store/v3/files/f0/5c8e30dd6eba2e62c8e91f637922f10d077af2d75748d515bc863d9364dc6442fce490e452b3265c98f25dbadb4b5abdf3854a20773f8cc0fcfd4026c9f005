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

// src/service/utils.ts
var utils_exports = {};
__export(utils_exports, {
  isPromise: () => isPromise,
  makeArray: () => makeArray
});
module.exports = __toCommonJS(utils_exports);
function isPromise(obj) {
  return (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
function makeArray(item) {
  return Array.isArray(item) ? item : [item];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isPromise,
  makeArray
});
