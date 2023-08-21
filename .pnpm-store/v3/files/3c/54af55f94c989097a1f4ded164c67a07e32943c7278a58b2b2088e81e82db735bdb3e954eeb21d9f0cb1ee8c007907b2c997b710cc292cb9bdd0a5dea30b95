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

// src/esbuildHandlers/awaitImport/index.ts
var awaitImport_exports = {};
__export(awaitImport_exports, {
  default: () => getAwaitImportHandler,
  getImportHandlerV4: () => getImportHandlerV4
});
module.exports = __toCommonJS(awaitImport_exports);
var import_checkMatch = require("../../babelPlugins/awaitImport/checkMatch");
function getImportHandlerV4(params) {
  return function awaitImportHandler(opts) {
    let offset = 0;
    let { code } = opts;
    const { imports } = opts;
    imports.forEach((i) => {
      if (!i.n)
        return;
      const isLazyImport = i.d > 0;
      const from = i.n;
      const replaceValue = params.resolveImportSource(from);
      if (replaceValue !== from) {
        const preSeg = code.substring(0, i.s + offset);
        const tailSeg = code.substring(i.e + offset);
        const quote = isLazyImport ? '"' : "";
        code = `${preSeg}${quote}${replaceValue}${quote}${tailSeg}`;
        offset += replaceValue.length - from.length;
      }
    });
    return code;
  };
}
function getAwaitImportHandler(params) {
  return function awaitImportHandler(opts) {
    var _a, _b;
    let offset = 0;
    let { code } = opts;
    const { filePath, imports } = opts;
    imports.forEach((i) => {
      if (!i.n)
        return;
      const isLazyImport = i.d > 0;
      const from = i.n;
      const { isMatch, replaceValue } = (0, import_checkMatch.checkMatch)({
        cache: params.cache,
        value: from,
        opts: params.opts,
        filename: filePath
      });
      if (isMatch) {
        const preSeg = code.substring(0, i.s + offset);
        const tailSeg = code.substring(i.e + offset);
        const quote = isLazyImport ? '"' : "";
        code = `${preSeg}${quote}${replaceValue}${quote}${tailSeg}`;
        offset += replaceValue.length - from.length;
      }
    });
    if (params.cache.has(filePath)) {
      (_b = (_a = params.opts).onCollect) == null ? void 0 : _b.call(_a, {
        file: filePath,
        data: params.cache.get(filePath)
      });
    }
    return code;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getImportHandlerV4
});
