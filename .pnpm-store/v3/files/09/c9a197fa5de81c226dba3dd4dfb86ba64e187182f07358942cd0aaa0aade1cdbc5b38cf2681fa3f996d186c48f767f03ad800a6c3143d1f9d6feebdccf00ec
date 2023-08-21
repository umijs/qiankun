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

// src/config/harmonyLinkingErrorPlugin.ts
var harmonyLinkingErrorPlugin_exports = {};
__export(harmonyLinkingErrorPlugin_exports, {
  addHarmonyLinkingErrorPlugin: () => addHarmonyLinkingErrorPlugin
});
module.exports = __toCommonJS(harmonyLinkingErrorPlugin_exports);
var LINKING_ERROR_TAG = "was not found in";
var CSS_NO_EXPORTS = /\.(css|sass|scss|styl|less)' \(module has no exports\)/;
var HarmonyLinkingErrorPlugin = class {
  apply(compiler) {
    compiler.hooks.afterCompile.tap(
      "HarmonyLinkingErrorPlugin",
      (compilation) => {
        if (!compilation.warnings.length) {
          return;
        }
        const harmonyLinkingErrors = compilation.warnings.filter((w) => {
          return w.name === "ModuleDependencyWarning" && !w.module.resource.includes("node_modules") && w.message.includes(LINKING_ERROR_TAG) && !CSS_NO_EXPORTS.test(w.message);
        });
        if (!harmonyLinkingErrors.length) {
          return;
        }
        compilation.errors.push(...harmonyLinkingErrors);
      }
    );
  }
};
async function addHarmonyLinkingErrorPlugin(opts) {
  const { config } = opts;
  config.plugin("harmony-linking-error-plugin").use(HarmonyLinkingErrorPlugin);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addHarmonyLinkingErrorPlugin
});
