var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// index.ts
var import_path = __toESM(require("path"));
var PLUGIN_NAME = "CaseSensitivePathsPlugin";
var CaseSensitivePathsPlugin = class {
  constructor() {
    this.context = "";
    this.cacheMap = /* @__PURE__ */ new Map();
    this.deferrerMap = /* @__PURE__ */ new Map();
  }
  isCheckable(res, type, issuer) {
    return type !== "asset/inline" && res.startsWith(this.context) && !/(\/|\\)node_modules\1/.test(res) && res !== issuer;
  }
  async checkFileExistsWithCase(res) {
    return new Promise((resolve, reject) => {
      let full = res;
      let caseError = null;
      const deferrers = [];
      while (full.length > this.context.length) {
        const { dir, base: current } = import_path.default.parse(full);
        let deferrer;
        if (this.cacheMap.get(dir)) {
          deferrer = Promise.resolve(this.cacheMap.get(dir));
        } else if (this.deferrerMap.get(dir)) {
          deferrer = this.deferrerMap.get(dir);
        } else {
          deferrer = new Promise((resolve2) => {
            this.fs.readdir(dir, (_, files = []) => {
              this.cacheMap.set(dir, files);
              resolve2(files);
              this.deferrerMap.delete(dir);
            });
          });
          this.deferrerMap.set(dir, deferrer);
        }
        deferrer.then((files) => {
          if (!files.includes(current) && !caseError) {
            const correctName = files.find((file) => file.toLowerCase() === current.toLowerCase());
            if (correctName) {
              caseError = new Error(`[${PLUGIN_NAME}] \`${import_path.default.join(res)}\` does not match the corresponding path on disk \`${correctName}\``);
              reject(caseError);
            }
          }
        });
        deferrers.push(deferrer);
        full = dir;
      }
      Promise.all(deferrers).then(() => {
        if (!caseError) {
          resolve(caseError);
        }
      });
    });
  }
  reset() {
    this.cacheMap = /* @__PURE__ */ new Map();
    this.deferrerMap = /* @__PURE__ */ new Map();
  }
  apply(compiler) {
    this.context = compiler.options.context || process.cwd();
    this.fs = compiler.inputFileSystem;
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, (factory) => {
      factory.hooks.afterResolve.tapAsync(PLUGIN_NAME, (data, done) => {
        var _a, _b;
        const { createData = data } = data;
        if (createData.resource && this.isCheckable(createData.resource, createData.type, (_b = (_a = createData.resourceResolveData) == null ? void 0 : _a.context) == null ? void 0 : _b.issuer)) {
          this.checkFileExistsWithCase(createData.resource.replace(/\?.+$/, "").replace("\0#", "#")).then(() => done(null), (err) => done(err));
        } else {
          done(null);
        }
      });
    });
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      this.reset();
    });
  }
};
module.exports = CaseSensitivePathsPlugin;
