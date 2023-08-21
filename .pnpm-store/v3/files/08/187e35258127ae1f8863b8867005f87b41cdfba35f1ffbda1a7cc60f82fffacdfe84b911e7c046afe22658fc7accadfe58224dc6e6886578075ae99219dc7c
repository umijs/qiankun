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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/updatePackageJSON.ts
var updatePackageJSON_exports = {};
__export(updatePackageJSON_exports, {
  default: () => updatePackageJSON_default
});
module.exports = __toCommonJS(updatePackageJSON_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_deepmerge = __toESM(require("../compiled/deepmerge"));
function updatePackageJSON({
  opts,
  cwd = process.cwd()
}) {
  const packageJsonPath = (0, import_path.resolve)(cwd, "package.json");
  const pkg = require(packageJsonPath);
  const projectPkg = (0, import_deepmerge.default)(pkg, opts);
  (0, import_fs.writeFileSync)(
    packageJsonPath,
    `${JSON.stringify(projectPkg, null, 2)}
`,
    "utf-8"
  );
}
var updatePackageJSON_default = updatePackageJSON;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
