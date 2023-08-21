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

// src/isMonorepo.ts
var isMonorepo_exports = {};
__export(isMonorepo_exports, {
  isMonorepo: () => isMonorepo
});
module.exports = __toCommonJS(isMonorepo_exports);
var import_path = require("path");
var import_fs = require("fs");
var MONOREPO_FILE = ["pnpm-workspace.yaml", "lerna.json"];
function isMonorepo(opts) {
  const pkgPath = (0, import_path.join)(opts.root, "package.json");
  let pkg = {};
  try {
    pkg = require(pkgPath);
  } catch (e) {
  }
  const pkgExist = (0, import_fs.existsSync)(pkgPath);
  return pkgExist && (MONOREPO_FILE.some((file) => {
    return (0, import_fs.existsSync)((0, import_path.join)(opts.root, file));
  }) || (pkg == null ? void 0 : pkg.workspaces));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isMonorepo
});
