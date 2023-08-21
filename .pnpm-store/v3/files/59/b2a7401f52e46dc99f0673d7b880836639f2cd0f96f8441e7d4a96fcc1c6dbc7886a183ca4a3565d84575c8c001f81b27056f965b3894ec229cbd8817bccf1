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

// src/mfsu/strategyStaticAnalyze.ts
var strategyStaticAnalyze_exports = {};
__export(strategyStaticAnalyze_exports, {
  StaticAnalyzeStrategy: () => StaticAnalyzeStrategy
});
module.exports = __toCommonJS(strategyStaticAnalyze_exports);
var import_utils = require("@umijs/utils");
var import_checkMatch = require("../babelPlugins/awaitImport/checkMatch");
var import_MFImport = __toESM(require("../babelPlugins/awaitImport/MFImport"));
var import_staticDepInfo = require("../staticDepInfo/staticDepInfo");
var import_webpackUtils = require("../utils/webpackUtils");
var StaticAnalyzeStrategy = class {
  constructor({ mfsu, srcCodeCache }) {
    this.mfsu = mfsu;
    this.staticDepInfo = new import_staticDepInfo.StaticDepInfo({
      mfsu,
      srcCodeCache
    });
  }
  init(webpackConfig) {
    const config = (0, import_webpackUtils.extractBabelPluginImportOptions)(webpackConfig);
    this.staticDepInfo.setBabelPluginImportConfig(config);
    this.staticDepInfo.init();
  }
  getDepModules() {
    return this.staticDepInfo.getDepModules();
  }
  getCacheFilePath() {
    return this.staticDepInfo.getCacheFilePath();
  }
  shouldBuild() {
    return this.staticDepInfo.shouldBuild();
  }
  writeCache() {
    this.staticDepInfo.writeCache();
  }
  getBabelPlugin() {
    return [import_MFImport.default, this.getMfImportOpts()];
  }
  getMfImportOpts() {
    const mfsu = this.mfsu;
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
    return {
      resolveImportSource: (source) => {
        const match = (0, import_checkMatch.checkMatch)({
          value: source,
          filename: "_.js",
          opts: {
            exportAllMembers: mfsuOpts.exportAllMembers,
            unMatchLibs: unMatches,
            remoteName: mfsuOpts.mfName,
            alias: mfsu.alias,
            externals: mfsu.externals
          }
        });
        if (!match.isMatch) {
          return source;
        }
        const depMat = this.staticDepInfo.getDependencies();
        const m = depMat[match.value];
        if (m) {
          return m.replaceValue;
        }
        return match.value;
      },
      exportAllMembers: mfsuOpts.exportAllMembers,
      unMatchLibs: mfsuOpts.unMatchLibs,
      remoteName: mfsuOpts.mfName,
      alias: mfsu.alias,
      externals: mfsu.externals
    };
  }
  getBuildDepPlugConfig() {
    const mfsu = this.mfsu;
    return {
      beforeCompile: async () => {
        if (mfsu.depBuilder.isBuilding) {
          mfsu.buildDepsAgain = true;
        } else {
          import_utils.logger.event(`[MFSU][eager] start build deps`);
          this.staticDepInfo.consumeAllProducedEvents();
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
      },
      onFileChange: async (c) => {
        import_utils.logger.debug(
          "webpack found changes modified:",
          c.modifiedFiles,
          "removed:",
          c.removedFiles
        );
        const srcPath = this.staticDepInfo.opts.srcCodeCache.getSrcPath();
        const fileEvents = [
          ...this.staticDepInfo.opts.srcCodeCache.replayChangeEvents(),
          ...extractJSCodeFiles(srcPath, c.modifiedFiles).map((f) => {
            return {
              event: "change",
              path: f
            };
          }),
          ...extractJSCodeFiles(srcPath, c.removedFiles).map((f) => {
            return {
              event: "unlink",
              path: f
            };
          })
        ];
        import_utils.logger.debug("all file events", fileEvents);
        if (fileEvents.length === 0) {
          return;
        }
        const start = Date.now();
        try {
          await this.staticDepInfo.opts.srcCodeCache.handleFileChangeEvents(
            fileEvents
          );
        } catch (e) {
          import_utils.logger.error("MFSU[eager] analyze dependencies failed with error", e);
        }
        import_utils.logger.debug(`webpack waited ${Date.now() - start} ms`);
      },
      onCompileDone: () => {
      }
    };
  }
  loadCache() {
    this.staticDepInfo.loadCache();
  }
  refresh() {
    this.staticDepInfo.snapshot();
  }
};
var REG_CODE_EXT = /\.(jsx|js|ts|tsx)$/;
function extractJSCodeFiles(folderBase, files) {
  const jsFiles = [];
  if (!files) {
    return jsFiles;
  }
  for (let file of files.values()) {
    if (file.startsWith(folderBase) && REG_CODE_EXT.test(file) && file.indexOf("node_modules") === -1) {
      jsFiles.push(file);
    }
  }
  return jsFiles;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StaticAnalyzeStrategy
});
