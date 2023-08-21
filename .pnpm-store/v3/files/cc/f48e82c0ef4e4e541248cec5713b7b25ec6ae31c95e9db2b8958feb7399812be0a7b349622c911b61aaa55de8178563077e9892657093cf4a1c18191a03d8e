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

// src/readDirFiles.ts
var readDirFiles_exports = {};
__export(readDirFiles_exports, {
  readDirFiles: () => readDirFiles
});
module.exports = __toCommonJS(readDirFiles_exports);
var import_path = require("path");
var import_fs_extra = require("../compiled/fs-extra");
var readDirFiles = (opts) => {
  const { dir, exclude = [] } = opts;
  const list = [];
  const recursiveReadFiles = (p) => {
    if (!(0, import_fs_extra.existsSync)(p)) {
      return;
    }
    const isFile = (0, import_fs_extra.statSync)(p).isFile();
    if (isFile) {
      const name = (0, import_path.basename)(p);
      list.push({
        filePath: p,
        name
      });
      return;
    }
    const files = (0, import_fs_extra.readdirSync)(p).filter((name) => {
      return name !== ".DS_Store";
    }).map((file) => {
      const absolutePath = (0, import_path.join)(p, file);
      return absolutePath;
    }).filter((file) => {
      const isExclude = exclude.some((reg) => reg.test(file));
      return !isExclude;
    });
    files.forEach((file) => {
      recursiveReadFiles(file);
    });
  };
  recursiveReadFiles(dir);
  return list;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  readDirFiles
});
