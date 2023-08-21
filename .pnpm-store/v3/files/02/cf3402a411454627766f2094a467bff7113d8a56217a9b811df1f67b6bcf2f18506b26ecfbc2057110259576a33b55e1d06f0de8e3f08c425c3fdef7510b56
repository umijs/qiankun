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

// src/plugins/alias.ts
var alias_exports = {};
__export(alias_exports, {
  default: () => alias_default
});
module.exports = __toCommonJS(alias_exports);
var import_enhanced_resolve = __toESM(require("enhanced-resolve"));
var import_fs = require("fs");
var import_sortByAffix = require("../utils/sortByAffix");
var resolver = import_enhanced_resolve.default.create({
  mainFields: ["module", "browser", "main"],
  extensions: [".json", ".js", ".jsx", ".ts", ".tsx", ".cjs", ".mjs"],
  // TODO: support exports
  exportsFields: []
});
async function resolve(context, path) {
  return new Promise((resolve2, reject) => {
    resolver(
      context,
      path,
      (err, result) => err ? reject(err) : resolve2(result)
    );
  });
}
var alias_default = (options = {}) => {
  return {
    name: "alias",
    setup({ onResolve }) {
      const keys = (0, import_sortByAffix.sortByAffix)({ arr: Object.keys(options), affix: "$" });
      keys.forEach((key) => {
        let value = options[key];
        let filter;
        if (key.endsWith("$")) {
          filter = new RegExp(`^${key}`);
        } else {
          filter = new RegExp(`^${key}$`);
        }
        onResolve({ filter }, async (args) => {
          const path = await resolve(
            args.importer,
            args.path.replace(filter, value)
          );
          return {
            path
          };
        });
        if (!key.endsWith("/") && (0, import_fs.existsSync)(value) && (0, import_fs.statSync)(value).isDirectory()) {
          const filter2 = new RegExp(`^${addSlashAffix(key)}`);
          onResolve({ filter: filter2 }, async (args) => {
            const path = await resolve(
              args.importer,
              args.path.replace(filter2, addSlashAffix(value))
            );
            return {
              path
            };
          });
        }
      });
    }
  };
};
function addSlashAffix(key) {
  if (key.endsWith("/")) {
    return key;
  }
  return `${key}/`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
