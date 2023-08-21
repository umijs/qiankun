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

// src/utils/sortByAffix.ts
var sortByAffix_exports = {};
__export(sortByAffix_exports, {
  sortByAffix: () => sortByAffix
});
module.exports = __toCommonJS(sortByAffix_exports);
function sortByAffix(opts) {
  return opts.arr.sort((a, b) => {
    if (a.endsWith(opts.affix) && b.endsWith(opts.affix))
      return 0;
    if (a.endsWith(opts.affix))
      return -1;
    if (b.endsWith(opts.affix))
      return 1;
    else
      return 0;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sortByAffix
});
