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

// src/utils/browsersList.ts
var browsersList_exports = {};
__export(browsersList_exports, {
  getBrowsersList: () => getBrowsersList
});
module.exports = __toCommonJS(browsersList_exports);
function getBrowsersList({ targets }) {
  return targets.browsers || Object.keys(targets).map((key) => {
    return `${key} >= ${targets[key] === true ? "0" : targets[key]}`;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBrowsersList
});
