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

// src/constants.ts
var constants_exports = {};
__export(constants_exports, {
  DEFAULT_BROWSER_TARGETS: () => DEFAULT_BROWSER_TARGETS,
  DEFAULT_DEVTOOL: () => DEFAULT_DEVTOOL,
  DEFAULT_ESBUILD_TARGET_KEYS: () => DEFAULT_ESBUILD_TARGET_KEYS,
  DEFAULT_OUTPUT_PATH: () => DEFAULT_OUTPUT_PATH,
  MESSAGE_TYPE: () => MESSAGE_TYPE,
  MFSU_NAME: () => MFSU_NAME
});
module.exports = __toCommonJS(constants_exports);
var DEFAULT_DEVTOOL = "cheap-module-source-map";
var DEFAULT_OUTPUT_PATH = "dist";
var MFSU_NAME = "MFSU";
var MESSAGE_TYPE = /* @__PURE__ */ ((MESSAGE_TYPE2) => {
  MESSAGE_TYPE2["ok"] = "ok";
  MESSAGE_TYPE2["warnings"] = "warnings";
  MESSAGE_TYPE2["errors"] = "errors";
  MESSAGE_TYPE2["hash"] = "hash";
  MESSAGE_TYPE2["stillOk"] = "still-ok";
  MESSAGE_TYPE2["invalid"] = "invalid";
  return MESSAGE_TYPE2;
})(MESSAGE_TYPE || {});
var DEFAULT_BROWSER_TARGETS = {
  chrome: 80
};
var DEFAULT_ESBUILD_TARGET_KEYS = [
  "chrome",
  "firefox",
  "edge",
  "safari"
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_BROWSER_TARGETS,
  DEFAULT_DEVTOOL,
  DEFAULT_ESBUILD_TARGET_KEYS,
  DEFAULT_OUTPUT_PATH,
  MESSAGE_TYPE,
  MFSU_NAME
});
