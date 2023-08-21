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

// src/plugins/less-plugin-alias/utils.ts
var utils_exports = {};
__export(utils_exports, {
  parseAlias: () => parseAlias
});
module.exports = __toCommonJS(utils_exports);
function hoistAlias(alias) {
  function getFinalReplacement(oAlias, replacement, index) {
    const newAlias = oAlias.slice();
    newAlias.splice(index, 1);
    for (let i = 0; i < newAlias.length; i++) {
      if (newAlias[i].find.test(replacement)) {
        replacement = replacement.replace(
          newAlias[i].find,
          newAlias[i].replacement
        );
        return getFinalReplacement(newAlias, replacement, i);
      }
    }
    return replacement;
  }
  alias.forEach((rule, index, alias2) => {
    rule.replacement = getFinalReplacement(alias2, rule.replacement, index);
  });
  return alias;
}
function parseAlias(alias) {
  const wholeAlias = [
    // to support less-loader ~ for local deps, refer: https://github.com/vitejs/vite/issues/2185
    { find: /^~/, replacement: "" }
  ];
  const userAlias = Object.entries(alias).map(([name, target]) => ({
    find: new RegExp(`^~?${name.replace(/(?<!\$)$/, "(?=/|$)")}`),
    replacement: target
  }));
  wholeAlias.unshift(...userAlias);
  return hoistAlias(wholeAlias);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseAlias
});
