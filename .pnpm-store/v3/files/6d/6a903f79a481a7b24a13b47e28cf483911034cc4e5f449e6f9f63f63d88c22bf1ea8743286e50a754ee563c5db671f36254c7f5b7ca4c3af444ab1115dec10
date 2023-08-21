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

// src/depInfo.ts
var depInfo_exports = {};
__export(depInfo_exports, {
  DepInfo: () => DepInfo
});
module.exports = __toCommonJS(depInfo_exports);
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_path = require("path");
var import_moduleGraph = require("./moduleGraph");
var DepInfo = class {
  constructor(opts) {
    this.moduleGraph = new import_moduleGraph.ModuleGraph();
    this.cacheDependency = {};
    this.opts = opts;
    this.cacheFilePath = (0, import_path.join)(this.opts.mfsu.opts.tmpBase, "MFSU_CACHE.json");
  }
  shouldBuild() {
    if (!import_utils.lodash.isEqual(
      this.cacheDependency,
      this.opts.mfsu.opts.getCacheDependency()
    )) {
      return "cacheDependency has changed";
    }
    if (this.moduleGraph.hasDepChanged()) {
      return "moduleGraph has changed";
    }
    return false;
  }
  snapshot() {
    this.cacheDependency = this.opts.mfsu.opts.getCacheDependency();
    this.moduleGraph.snapshotDeps();
  }
  loadCache() {
    if ((0, import_fs.existsSync)(this.cacheFilePath)) {
      import_utils.logger.info("[MFSU] restore cache");
      try {
        const { cacheDependency, moduleGraph } = JSON.parse(
          (0, import_fs.readFileSync)(this.cacheFilePath, "utf-8")
        );
        this.cacheDependency = cacheDependency;
        this.moduleGraph.restore(moduleGraph);
      } catch (e) {
        import_utils.logger.error("[MFSU] restore cache failed", e);
        import_utils.logger.error("please `rm -rf  node_modules/.cache`, and try again");
        throw e;
      }
    }
  }
  writeCache() {
    import_utils.fsExtra.mkdirpSync((0, import_path.dirname)(this.cacheFilePath));
    const newContent = JSON.stringify(
      {
        cacheDependency: this.cacheDependency,
        moduleGraph: this.moduleGraph.toJSON()
      },
      null,
      2
    );
    if ((0, import_fs.existsSync)(this.cacheFilePath) && (0, import_fs.readFileSync)(this.cacheFilePath, "utf-8") === newContent) {
      return;
    }
    import_utils.logger.info("[MFSU] write cache");
    (0, import_fs.writeFileSync)(this.cacheFilePath, newContent, "utf-8");
  }
  getDepModules() {
    return this.moduleGraph.depSnapshotModules;
  }
  getCacheFilePath() {
    return this.cacheFilePath;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DepInfo
});
