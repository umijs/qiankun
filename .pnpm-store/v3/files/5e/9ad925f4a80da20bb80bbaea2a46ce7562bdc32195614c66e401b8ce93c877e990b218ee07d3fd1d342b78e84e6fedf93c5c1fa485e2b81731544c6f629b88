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

// src/plugins/externals.ts
var externals_exports = {};
__export(externals_exports, {
  default: () => externals_default
});
module.exports = __toCommonJS(externals_exports);
var externals_default = (options) => {
  return {
    name: "externals",
    setup({ onLoad, onResolve }) {
      if (!options || Object.keys(options).length === 0) {
        return;
      }
      Object.keys(options).forEach((key) => {
        onResolve({ filter: new RegExp(`^${key}$`) }, (args) => ({
          path: args.path,
          namespace: key
        }));
        onLoad({ filter: /.*/, namespace: key }, () => ({
          contents: `module.export=${options[key]}`,
          loader: "js"
        }));
      });
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
