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

// src/staticDepInfo/staticDepInfo.ts
var staticDepInfo_exports = {};
__export(staticDepInfo_exports, {
  StaticDepInfo: () => StaticDepInfo
});
module.exports = __toCommonJS(staticDepInfo_exports);
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_why = __toESM(require("is-equal/why"));
var import_path = require("path");
var import_checkMatch = require("../babelPlugins/awaitImport/checkMatch");
var import_dep = require("../dep/dep");
var import_babel_plugin_import = __toESM(require("./simulations/babel-plugin-import"));
var StaticDepInfo = class {
  constructor(opts) {
    this.currentDep = {};
    this.builtWithDep = {};
    this.cacheDependency = {};
    this.produced = [];
    this.mfsu = opts.mfsu;
    this.include = this.mfsu.opts.include || [];
    this.opts = opts;
    this.cacheFilePath = (0, import_path.join)(
      this.opts.mfsu.opts.tmpBase,
      "MFSU_CACHE_v4.json"
    );
    this.cwd = this.mfsu.opts.cwd;
    opts.srcCodeCache.register((info) => {
      this.currentDep = this._getDependencies(info.code, info.imports);
    });
    this.runtimeSimulations = [];
  }
  getProducedEvent() {
    return this.produced;
  }
  consumeAllProducedEvents() {
    this.produced = [];
  }
  shouldBuild() {
    const currentCacheDep = this.opts.mfsu.opts.getCacheDependency();
    if (!import_utils.lodash.isEqual(this.cacheDependency, currentCacheDep)) {
      if (process.env.DEBUG_UMI) {
        const reason = (0, import_why.default)(this.cacheDependency, currentCacheDep);
        import_utils.logger.info(
          "[MFSU][eager]: isEqual(cacheDependency,currentCacheDep) === false, because ",
          reason
        );
      }
      return "cacheDependency has changed";
    }
    if (import_utils.lodash.isEqual(this.builtWithDep, this.currentDep)) {
      return false;
    } else {
      if (process.env.DEBUG_UMI) {
        const reason = (0, import_why.default)(this.builtWithDep, this.currentDep);
        import_utils.logger.info(
          "[MFSU][eager]: isEqual(oldDep,newDep) === false, because ",
          reason
        );
      }
      return "dependencies changed";
    }
  }
  getDepModules() {
    const map = this.getDependencies();
    const staticDeps = {};
    const keys = Object.keys(map);
    for (const k of keys) {
      staticDeps[k] = {
        file: k,
        version: map[k].version
      };
    }
    return staticDeps;
  }
  snapshot() {
    this.builtWithDep = this.currentDep;
    this.cacheDependency = this.mfsu.opts.getCacheDependency();
  }
  loadCache() {
    if ((0, import_fs.existsSync)(this.cacheFilePath)) {
      try {
        const { dep = {}, cacheDependency = {} } = JSON.parse(
          (0, import_fs.readFileSync)(this.cacheFilePath, "utf-8")
        );
        this.builtWithDep = dep;
        this.cacheDependency = cacheDependency;
        import_utils.logger.info("[MFSU][eager] restored cache");
      } catch (e) {
        import_utils.logger.warn(
          "[MFSU][eager] restore cache failed, fallback to Empty dependency",
          e
        );
      }
    }
  }
  writeCache() {
    import_utils.fsExtra.mkdirpSync((0, import_path.dirname)(this.cacheFilePath));
    const newContent = JSON.stringify(
      {
        dep: this.builtWithDep,
        cacheDependency: this.cacheDependency
      },
      null,
      2
    );
    if ((0, import_fs.existsSync)(this.cacheFilePath) && (0, import_fs.readFileSync)(this.cacheFilePath, "utf-8") === newContent) {
      return;
    }
    import_utils.logger.info("[MFSU][eager] write cache");
    (0, import_fs.writeFileSync)(this.cacheFilePath, newContent, "utf-8");
  }
  getCacheFilePath() {
    return this.cacheFilePath;
  }
  getDependencies() {
    return this.currentDep;
  }
  init() {
    const merged = this.opts.srcCodeCache.getMergedCode();
    this.currentDep = this._getDependencies(merged.code, merged.imports);
  }
  _getDependencies(bigCodeString, imports) {
    const start = Date.now();
    const cwd = this.mfsu.opts.cwd;
    const mfsuOpts = this.mfsu.opts;
    const userUnMatches = mfsuOpts.unMatchLibs || [];
    const sharedUnMatches = Object.keys(mfsuOpts.shared || {});
    const remoteAliasUnMatches = (mfsuOpts.remoteAliases || []).map(
      (str) => new RegExp(`^${str}`)
    );
    const unMatches = [
      ...userUnMatches,
      ...sharedUnMatches,
      ...remoteAliasUnMatches
    ];
    const opts = {
      exportAllMembers: this.mfsu.opts.exportAllMembers,
      unMatchLibs: unMatches,
      remoteName: this.mfsu.opts.mfName,
      alias: this.mfsu.alias,
      externals: this.mfsu.externals
    };
    const matched = {};
    const unMatched = /* @__PURE__ */ new Set();
    const pkgNames = this.runtimeSimulations.map(
      ({ packageName }) => packageName
    );
    const groupedMockImports = {};
    for (const imp of imports) {
      if (!imp.n) {
        continue;
      }
      if (pkgNames.indexOf(imp.n) >= 0) {
        const name = imp.n;
        if (groupedMockImports[name]) {
          groupedMockImports[name].push(imp);
        } else {
          groupedMockImports[name] = [imp];
        }
        continue;
      }
      if (unMatched.has(imp.n)) {
        continue;
      }
      if (matched[imp.n]) {
        continue;
      }
      const match = (0, import_checkMatch.checkMatch)({
        value: imp.n,
        depth: 1,
        filename: "_.js",
        opts
      });
      if (match.isMatch) {
        matched[match.value] = {
          ...match,
          version: import_dep.Dep.getDepVersion({
            dep: match.value,
            cwd
          })
        };
      } else {
        unMatched.add(imp.n);
      }
    }
    this.simulateRuntimeTransform(matched, groupedMockImports, bigCodeString);
    this.appendIncludeList(matched, opts);
    import_utils.logger.debug("[MFSU][eager] _getDependencies costs", Date.now() - start);
    return matched;
  }
  simulateRuntimeTransform(matched, groupedImports, rawCode) {
    for (const mock of this.runtimeSimulations) {
      const name = mock.packageName;
      const pathToVersion = (dep) => {
        return import_dep.Dep.getDepVersion({
          dep,
          cwd: this.cwd
        });
      };
      const ms = mock.handleImports({
        imports: groupedImports[name],
        rawCode,
        alias: this.mfsu.alias,
        mfName: this.mfsu.opts.mfName,
        pathToVersion
      });
      for (const m of ms) {
        matched[m.value] = m;
      }
    }
  }
  appendIncludeList(matched, opts) {
    for (const p of this.include) {
      const match = (0, import_checkMatch.checkMatch)({
        value: p,
        depth: 1,
        filename: "_.js",
        opts
      });
      if (match.isMatch) {
        matched[match.value] = {
          ...match,
          version: import_dep.Dep.getDepVersion({
            dep: match.value,
            cwd: this.cwd
          })
        };
      }
    }
  }
  async allRuntimeHelpers() {
  }
  setBabelPluginImportConfig(config) {
    for (const [key, c] of config.entries()) {
      this.runtimeSimulations.push({
        packageName: key,
        handleImports: (0, import_babel_plugin_import.default)(c)
      });
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StaticDepInfo
});
