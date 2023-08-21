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

// src/babelPlugins/awaitImport/getAliasedPath.ts
var getAliasedPath_exports = {};
__export(getAliasedPath_exports, {
  getAliasedPathWithLoopDetect: () => getAliasedPathWithLoopDetect
});
module.exports = __toCommonJS(getAliasedPath_exports);
var import_utils = require("@umijs/utils");
function getAliasedPathWithLoopDetect({
  value,
  alias
}) {
  let needUnAlias = value;
  for (let i = 0; i < 10; i++) {
    let unAliased = import_utils.aliasUtils.getAliasValue({ imported: needUnAlias, alias });
    if (unAliased) {
      needUnAlias = unAliased;
    } else {
      return needUnAlias;
    }
  }
  throw Error(
    `endless loop detected in resolve alias for '${value}', please check your alias config.`
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAliasedPathWithLoopDetect
});
