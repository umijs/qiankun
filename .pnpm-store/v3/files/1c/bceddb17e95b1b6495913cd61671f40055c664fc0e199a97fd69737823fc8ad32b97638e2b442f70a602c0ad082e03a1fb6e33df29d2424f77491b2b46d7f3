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

// src/plugins/watchRebuild.ts
var watchRebuild_exports = {};
__export(watchRebuild_exports, {
  esbuildWatchRebuildPlugin: () => esbuildWatchRebuildPlugin
});
module.exports = __toCommonJS(watchRebuild_exports);
function failureErrorWithLog(text, errors, warnings) {
  let limit = 5;
  let summary = errors.length < 1 ? "" : ` with ${errors.length} error${errors.length < 2 ? "" : "s"}:` + errors.slice(0, limit + 1).map((e, i) => {
    if (i === limit)
      return "\n...";
    if (!e.location)
      return `
error: ${e.text}`;
    let { file, line, column } = e.location;
    let pluginText = e.pluginName ? `[plugin: ${e.pluginName}] ` : "";
    return `
${file}:${line}:${column}: ERROR: ${pluginText}${e.text}`;
  }).join("");
  let error = new Error(`${text}${summary}`);
  error.errors = errors;
  error.warnings = warnings;
  return error;
}
function esbuildWatchRebuildPlugin(options) {
  return {
    name: "watch-rebuild-plugin",
    setup(build) {
      let count = 0;
      build.onEnd((result) => {
        if (count++ === 0) {
          return;
        }
        if (result.errors.length > 0) {
          options.onRebuild(
            failureErrorWithLog("Build failed", result.errors, result.warnings),
            null
          );
          return;
        }
        options.onRebuild(null, result);
      });
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  esbuildWatchRebuildPlugin
});
