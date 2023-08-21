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

// src/aliasUtils/getAliasValue.ts
var getAliasValue_exports = {};
__export(getAliasValue_exports, {
  getAliasValue: () => getAliasValue
});
module.exports = __toCommonJS(getAliasValue_exports);
var import_path = __toESM(require("path"));
function getAliasValue(opts) {
  const { imported, alias } = opts;
  if (alias[imported]) {
    return alias[imported];
  }
  for (const key of Object.keys(alias)) {
    const value = alias[key];
    if (key.endsWith("$")) {
      if (imported === key.slice(0, -1)) {
        return value;
      } else {
        continue;
      }
    }
    const keyWithLastSlash = addLastSlash(key);
    if (imported.startsWith(keyWithLastSlash)) {
      const isWinPath = process.platform === "win32" && value.includes(import_path.default.sep);
      if (isWinPath) {
        return import_path.default.join(value, imported.slice(keyWithLastSlash.length));
      }
      return imported.replace(keyWithLastSlash, addLastSlash(value));
    }
  }
}
function addLastSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAliasValue
});
