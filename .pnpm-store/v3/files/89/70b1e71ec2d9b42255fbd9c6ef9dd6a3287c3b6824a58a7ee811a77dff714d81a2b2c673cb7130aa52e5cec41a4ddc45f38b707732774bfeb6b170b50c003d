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

// src/dep/dep.ts
var dep_exports = {};
__export(dep_exports, {
  Dep: () => Dep
});
module.exports = __toCommonJS(dep_exports);
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_crypto = require("crypto");
var import_fs = require("fs");
var import_path = require("path");
var import_constants = require("../constants");
var import_resolveUtils = require("../utils/resolveUtils");
var import_trimFileContent = require("../utils/trimFileContent");
var import_getExposeFromContent = require("./getExposeFromContent");
var Dep = class {
  constructor(opts) {
    this.file = (0, import_utils.winPath)(opts.file);
    this.version = opts.version;
    this.cwd = opts.cwd;
    this.shortFile = this.file;
    this.normalizedFile = this.normalizePath(this.shortFile);
    this.filePath = `${import_constants.MF_VA_PREFIX}${this.normalizedFile}.js`;
    this.excludeNodeNatives = opts.excludeNodeNatives;
    this.importer = opts.importer;
  }
  normalizePath(p) {
    let longPath = p;
    if (longPath.startsWith(this.cwd)) {
      longPath = longPath.slice(this.cwd.length);
    }
    longPath = longPath.replace(/\//g, "_").replace(/:/g, "_");
    if (longPath.length <= 200) {
      return longPath;
    }
    const hash = (0, import_crypto.createHash)("md5").update(longPath).digest("hex").slice(0, 16);
    const post = longPath.slice(-200);
    return `${hash}_${post}`;
  }
  async buildExposeContent() {
    const isNodeNatives = !!process.binding("natives")[this.file];
    if (isNodeNatives) {
      return (0, import_trimFileContent.trimFileContent)(
        this.excludeNodeNatives ? `
const _ = require('${this.file}');
module.exports = _;
      ` : `
import _ from '${this.file}';
export default _;
export * from '${this.file}';
      `
      );
    }
    const realFile = await this.getRealFile();
    if (!realFile) {
      import_utils.logger.error(
        `Can not resolve dependence : '${import_utils.chalk.red(
          this.file
        )}', please install it`
      );
    }
    (0, import_assert.default)(realFile, `dependence not found: ${this.file}`);
    const content = (0, import_fs.readFileSync)(realFile, "utf-8");
    return await (0, import_getExposeFromContent.getExposeFromContent)({
      content,
      filePath: realFile,
      dep: this
    });
  }
  async getRealFile() {
    try {
      const contexts = this.importer ? [(0, import_path.dirname)(this.importer), this.cwd] : [this.cwd];
      return await (0, import_resolveUtils.resolveFromContexts)(contexts, this.file);
    } catch (e) {
      return null;
    }
  }
  static buildDeps(opts) {
    return Object.keys(opts.deps).map((file) => {
      return new Dep({
        ...opts.deps[file],
        cwd: opts.cwd,
        excludeNodeNatives: opts.mfsu.opts.excludeNodeNatives
      });
    });
  }
  static getDepVersion(opts) {
    if (!!process.binding("natives")[opts.dep]) {
      return "*";
    }
    const dep = (0, import_path.isAbsolute)(opts.dep) ? opts.dep : (0, import_path.join)(opts.cwd, "node_modules", opts.dep);
    const pkg = import_utils.pkgUp.pkgUpSync({
      cwd: dep
    });
    (0, import_assert.default)(pkg, `package.json not found for ${opts.dep}`);
    return require(pkg).version || null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Dep
});
