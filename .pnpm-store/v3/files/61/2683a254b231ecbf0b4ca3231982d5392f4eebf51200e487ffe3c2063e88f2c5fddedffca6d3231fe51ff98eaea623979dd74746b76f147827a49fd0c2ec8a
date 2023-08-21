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

// src/Generator/Generator.ts
var Generator_exports = {};
__export(Generator_exports, {
  default: () => Generator_default
});
module.exports = __toCommonJS(Generator_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_chalk = __toESM(require("../../compiled/chalk"));
var import_fs_extra = __toESM(require("../../compiled/fs-extra"));
var import_glob = __toESM(require("../../compiled/glob"));
var import_mustache = __toESM(require("../../compiled/mustache"));
var import_prompts = __toESM(require("../../compiled/prompts"));
var Generator = class {
  constructor({ baseDir, args, slient }) {
    this.baseDir = baseDir;
    this.args = args;
    this.slient = !!slient;
    this.prompts = {};
  }
  async run() {
    const questions = this.prompting();
    this.prompts = await (0, import_prompts.default)(questions, {
      onCancel() {
        process.exit(1);
      }
    });
    await this.writing();
  }
  prompting() {
    return [];
  }
  async writing() {
  }
  copyTpl(opts) {
    const tpl = (0, import_fs.readFileSync)(opts.templatePath, "utf-8");
    const content = import_mustache.default.render(tpl, opts.context);
    import_fs_extra.default.mkdirpSync((0, import_path.dirname)(opts.target));
    if (!this.slient) {
      console.log(
        `${import_chalk.default.green("Write:")} ${(0, import_path.relative)(this.baseDir, opts.target)}`
      );
    }
    (0, import_fs.writeFileSync)(opts.target, content, "utf-8");
  }
  copyDirectory(opts) {
    const files = import_glob.default.sync("**/*", {
      cwd: opts.path,
      dot: true,
      ignore: ["**/node_modules/**"]
    });
    files.forEach((file) => {
      const absFile = (0, import_path.join)(opts.path, file);
      if ((0, import_fs.statSync)(absFile).isDirectory())
        return;
      if (file.endsWith(".tpl")) {
        this.copyTpl({
          templatePath: absFile,
          target: (0, import_path.join)(opts.target, file.replace(/\.tpl$/, "")),
          context: opts.context
        });
      } else {
        if (!this.slient) {
          console.log(`${import_chalk.default.green("Copy: ")} ${file}`);
        }
        const absTarget = (0, import_path.join)(opts.target, file);
        import_fs_extra.default.mkdirpSync((0, import_path.dirname)(absTarget));
        (0, import_fs.copyFileSync)(absFile, absTarget);
      }
    });
  }
};
var Generator_default = Generator;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
