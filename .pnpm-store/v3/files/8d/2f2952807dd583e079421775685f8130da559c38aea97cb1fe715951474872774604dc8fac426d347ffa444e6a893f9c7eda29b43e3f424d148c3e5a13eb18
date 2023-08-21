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

// src/mfsu/strategyCompileTime.ts
var strategyCompileTime_exports = {};
__export(strategyCompileTime_exports, {
  StrategyCompileTime: () => StrategyCompileTime
});
module.exports = __toCommonJS(strategyCompileTime_exports);
var import_utils = require("@umijs/utils");
var import_awaitImport = __toESM(require("../babelPlugins/awaitImport/awaitImport"));
var import_getRealPath = require("../babelPlugins/awaitImport/getRealPath");
var import_dep = require("../dep/dep");
var import_depInfo = require("../depInfo");
var StrategyCompileTime = class {
  constructor({ mfsu }) {
    this.mfsu = mfsu;
    this.depInfo = new import_depInfo.DepInfo({ mfsu });
  }
  getDepModules() {
    return this.depInfo.getDepModules();
  }
  getCacheFilePath() {
    return this.depInfo.getCacheFilePath();
  }
  init() {
  }
  shouldBuild() {
    return this.depInfo.shouldBuild();
  }
  loadCache() {
    this.depInfo.loadCache();
  }
  writeCache() {
    this.depInfo.writeCache();
  }
  refresh() {
    this.depInfo.snapshot();
  }
  getBabelPlugin() {
    return [import_awaitImport.default, this.getAwaitImportCollectOpts()];
  }
  getBuildDepPlugConfig() {
    const mfsu = this.mfsu;
    return {
      onCompileDone: () => {
        if (mfsu.depBuilder.isBuilding) {
          mfsu.buildDepsAgain = true;
        } else {
          mfsu.buildDeps().then(() => {
            mfsu.onProgress({
              done: true
            });
          }).catch((e) => {
            import_utils.printHelp.runtime(e);
            mfsu.onProgress({
              done: true
            });
          });
        }
      }
    };
  }
  getAwaitImportCollectOpts() {
    const mfsuOpts = this.mfsu.opts;
    const mfsu = this.mfsu;
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
    return {
      onTransformDeps: () => {
      },
      onCollect: ({
        file,
        data
      }) => {
        this.depInfo.moduleGraph.onFileChange({
          file,
          // @ts-ignore
          deps: [
            ...Array.from(data.matched).map((item) => ({
              file: item.sourceValue,
              isDependency: true,
              version: import_dep.Dep.getDepVersion({
                dep: item.sourceValue,
                cwd: mfsuOpts.cwd
              })
            })),
            ...Array.from(data.unMatched).map((item) => ({
              file: (0, import_getRealPath.getRealPath)({
                file,
                dep: item.sourceValue
              }),
              isDependency: false
            }))
          ]
        });
      },
      exportAllMembers: mfsuOpts.exportAllMembers,
      unMatchLibs: unMatches,
      remoteName: mfsuOpts.mfName,
      alias: mfsu.alias,
      externals: mfsu.externals
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StrategyCompileTime
});
