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

// src/service/path.ts
var path_exports = {};
__export(path_exports, {
  getPaths: () => getPaths
});
module.exports = __toCommonJS(path_exports);
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_path = require("path");
var import_types = require("../types");
function winJoin(...args) {
  return (0, import_utils.winPath)((0, import_path.join)(...args));
}
function getPaths(opts) {
  const cwd = opts.cwd;
  const src = winJoin(cwd, "src");
  const absSrcPath = (0, import_fs.existsSync)(src) && (0, import_fs.statSync)(src).isDirectory() ? src : cwd;
  const absPagesPath = winJoin(absSrcPath, "pages");
  const absApiRoutesPath = winJoin(absSrcPath, "api");
  const tmp = opts.env === import_types.Env.development ? `.${opts.prefix}` : `.${opts.prefix}-${opts.env}`;
  const absTmpPath = winJoin(absSrcPath, tmp);
  const absNodeModulesPath = winJoin(cwd, "node_modules");
  const absOutputPath = winJoin(cwd, "dist");
  return {
    cwd,
    absSrcPath,
    absPagesPath,
    absApiRoutesPath,
    absTmpPath,
    absNodeModulesPath,
    absOutputPath
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getPaths
});
