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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/BaseGenerator/BaseGenerator.ts
var BaseGenerator_exports = {};
__export(BaseGenerator_exports, {
  default: () => BaseGenerator
});
module.exports = __toCommonJS(BaseGenerator_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_fs_extra = __toESM(require("../../compiled/fs-extra"));
var import_Generator = __toESM(require("../Generator/Generator"));
var BaseGenerator = class extends import_Generator.default {
  constructor({
    path,
    target,
    data,
    questions,
    baseDir,
    slient
  }) {
    super({ baseDir: baseDir || target, args: data, slient });
    this.path = path;
    this.target = target;
    this.data = data;
    this.questions = questions || [];
  }
  prompting() {
    return this.questions;
  }
  async writing() {
    const context = {
      ...this.data,
      ...this.prompts
    };
    if ((0, import_fs.statSync)(this.path).isDirectory()) {
      this.copyDirectory({
        context,
        path: this.path,
        target: this.target
      });
    } else {
      if (this.path.endsWith(".tpl")) {
        this.copyTpl({
          templatePath: this.path,
          target: this.target,
          context
        });
      } else {
        const absTarget = this.target;
        import_fs_extra.default.mkdirpSync((0, import_path.dirname)(absTarget));
        (0, import_fs.copyFileSync)(this.path, absTarget);
      }
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
