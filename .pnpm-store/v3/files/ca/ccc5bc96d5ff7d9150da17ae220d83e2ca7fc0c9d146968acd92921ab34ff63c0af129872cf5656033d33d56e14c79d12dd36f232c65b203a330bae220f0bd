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

// src/aliasUtils/parseCircleAlias.ts
var parseCircleAlias_exports = {};
__export(parseCircleAlias_exports, {
  parseCircleAlias: () => parseCircleAlias
});
module.exports = __toCommonJS(parseCircleAlias_exports);
var import_path = require("path");
var import_fs_extra = require("../../compiled/fs-extra");
var import_getAliasValue = require("./getAliasValue");
var DEFAULT_MAX_DEPTH = 5;
var parseCircleAlias = (opts) => {
  const { alias, maxDepth = DEFAULT_MAX_DEPTH } = opts;
  const isExist = (value) => {
    return value.startsWith(".") || (0, import_path.isAbsolute)(value) || (0, import_fs_extra.existsSync)(value);
  };
  const parsed = {};
  Object.entries(alias).forEach(([key, value]) => {
    if (isExist(value)) {
      parsed[key] = value;
    } else {
      let realPath = value;
      for (let i = 0; i < maxDepth; i++) {
        const deeperPath = (0, import_getAliasValue.getAliasValue)({ imported: realPath, alias });
        if (!deeperPath) {
          parsed[key] = realPath;
          break;
        } else {
          if (isExist(deeperPath)) {
            parsed[key] = deeperPath;
            break;
          } else {
            realPath = deeperPath;
          }
        }
        if (i === maxDepth - 1) {
          throw Error(
            `endless loop detected in resolve alias for '${key}': '${value}', please check your alias config.`
          );
        }
      }
    }
  });
  return parsed;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseCircleAlias
});
