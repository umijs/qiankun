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

// src/config/assetRules.ts
var assetRules_exports = {};
__export(assetRules_exports, {
  addAssetRules: () => addAssetRules
});
module.exports = __toCommonJS(assetRules_exports);
async function addAssetRules(opts) {
  const { config, userConfig } = opts;
  const inlineLimit = userConfig.inlineLimit;
  const rule = config.module.rule("asset");
  rule.oneOf("avif").test(/\.avif$/).type("asset").mimetype("image/avif").parser({
    dataUrlCondition: {
      maxSize: inlineLimit
    }
  });
  rule.oneOf("image").test(/\.(bmp|gif|jpg|jpeg|png)$/).type("asset").parser({
    dataUrlCondition: {
      maxSize: inlineLimit
    }
  });
  const fallback = rule.oneOf("fallback").exclude.add(/^$/).add(/\.(js|mjs|cjs|jsx|ts|tsx)$/).add(/\.(css|less|sass|scss|stylus)$/).add(/\.html$/).add(/\.json$/);
  if (userConfig.mdx) {
    fallback.add(/\.mdx?$/);
  }
  fallback.end().type("asset/resource");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addAssetRules
});
