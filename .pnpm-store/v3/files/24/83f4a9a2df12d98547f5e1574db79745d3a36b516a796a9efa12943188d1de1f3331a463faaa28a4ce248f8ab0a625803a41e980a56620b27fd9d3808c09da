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

// src/utils/getEsBuildTarget.ts
var getEsBuildTarget_exports = {};
__export(getEsBuildTarget_exports, {
  getEsBuildTarget: () => getEsBuildTarget
});
module.exports = __toCommonJS(getEsBuildTarget_exports);
var import_utils = require("@umijs/utils");
var import_constants = require("../constants");
var import_types = require("../types");
function getEsBuildTarget({ targets, jsMinifier }) {
  if (targets["ie"] && jsMinifier === import_types.JSMinifier.esbuild) {
    import_utils.logger.error(
      `${import_utils.chalk.red(
        `jsMinifier: esbuild`
      )} is not supported when there is ie in the targets, you can use ${import_utils.chalk.green(
        `jsMinifier: 'terser'`
      )}`
    );
    throw new Error("IE is not supported");
  }
  return Object.keys(targets).filter((key) => import_constants.DEFAULT_ESBUILD_TARGET_KEYS.includes(key)).map((key) => {
    return `${key}${targets[key] === true ? "0" : targets[key]}`;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEsBuildTarget
});
