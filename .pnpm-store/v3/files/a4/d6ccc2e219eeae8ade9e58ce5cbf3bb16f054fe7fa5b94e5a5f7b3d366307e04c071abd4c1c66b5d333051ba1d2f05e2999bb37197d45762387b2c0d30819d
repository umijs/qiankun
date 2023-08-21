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

// src/types.ts
var types_exports = {};
__export(types_exports, {
  CSSMinifier: () => CSSMinifier,
  Env: () => Env,
  JSMinifier: () => JSMinifier,
  Transpiler: () => Transpiler
});
module.exports = __toCommonJS(types_exports);
var Env = /* @__PURE__ */ ((Env2) => {
  Env2["development"] = "development";
  Env2["production"] = "production";
  return Env2;
})(Env || {});
var Transpiler = /* @__PURE__ */ ((Transpiler2) => {
  Transpiler2["babel"] = "babel";
  Transpiler2["swc"] = "swc";
  Transpiler2["esbuild"] = "esbuild";
  Transpiler2["none"] = "none";
  return Transpiler2;
})(Transpiler || {});
var JSMinifier = /* @__PURE__ */ ((JSMinifier2) => {
  JSMinifier2["terser"] = "terser";
  JSMinifier2["swc"] = "swc";
  JSMinifier2["esbuild"] = "esbuild";
  JSMinifier2["uglifyJs"] = "uglifyJs";
  JSMinifier2["none"] = "none";
  return JSMinifier2;
})(JSMinifier || {});
var CSSMinifier = /* @__PURE__ */ ((CSSMinifier2) => {
  CSSMinifier2["esbuild"] = "esbuild";
  CSSMinifier2["cssnano"] = "cssnano";
  CSSMinifier2["parcelCSS"] = "parcelCSS";
  CSSMinifier2["none"] = "none";
  return CSSMinifier2;
})(CSSMinifier || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CSSMinifier,
  Env,
  JSMinifier,
  Transpiler
});
