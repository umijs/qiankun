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

// src/esbuildHandlers/autoCssModules.ts
var autoCssModules_exports = {};
__export(autoCssModules_exports, {
  autoCssModulesHandler: () => autoCssModulesHandler
});
module.exports = __toCommonJS(autoCssModules_exports);
var import_utils = require("@umijs/utils");
var CSS_MODULES_QUERY = "?modules";
var QUERY_LENGTH = CSS_MODULES_QUERY.length;
function autoCssModulesHandler(opts) {
  let { code } = opts;
  let offset = 0;
  opts.imports.forEach((i) => {
    if (i.d < 0 && (0, import_utils.isStyleFile)({ filename: i.n })) {
      const importSegment = code.substring(i.ss + offset, i.s + offset);
      if (~importSegment.indexOf(" from")) {
        code = `${code.substring(
          0,
          i.e + offset
        )}${CSS_MODULES_QUERY}${code.substring(i.e + offset)}`;
        offset += QUERY_LENGTH;
      }
    }
  });
  return code;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  autoCssModulesHandler
});
