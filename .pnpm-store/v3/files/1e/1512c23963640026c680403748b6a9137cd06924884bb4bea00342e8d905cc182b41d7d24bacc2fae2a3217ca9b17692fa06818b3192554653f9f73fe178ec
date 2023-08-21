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

// src/depBuilder/depBuilder.ts
var depBuilder_exports = {};
__export(depBuilder_exports, {
  DepBuilder: () => DepBuilder
});
module.exports = __toCommonJS(depBuilder_exports);
var import_bundler_esbuild = require("@umijs/bundler-esbuild");
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_path = require("path");
var import_constants = require("../constants");
var import_depChunkIdPrefixPlugin = require("../webpackPlugins/depChunkIdPrefixPlugin");
var import_stripSourceMapUrlPlugin = require("../webpackPlugins/stripSourceMapUrlPlugin");
var import_getESBuildEntry = require("./getESBuildEntry");
var MF_ENTRY = "mf_index.js";
var DepBuilder = class {
  constructor(opts) {
    this.completeFns = [];
    this.isBuilding = false;
    this.opts = opts;
  }
  async buildWithWebpack(opts) {
    const config = this.getWebpackConfig({ deps: opts.deps });
    return new Promise((resolve, reject) => {
      const compiler = this.opts.mfsu.opts.implementor(config);
      compiler.run((err, stats) => {
        opts.onBuildComplete();
        if (err || (stats == null ? void 0 : stats.hasErrors())) {
          if (err) {
            reject(err);
          }
          if (stats) {
            const errorMsg = stats.toString("errors-only");
            reject(new Error(errorMsg));
          }
        } else {
          resolve(stats);
        }
        compiler.close(() => {
        });
      });
    });
  }
  // TODO: support watch and rebuild
  async buildWithESBuild(opts) {
    const entryContent = (0, import_getESBuildEntry.getESBuildEntry)({
      mfName: this.opts.mfsu.opts.mfName,
      deps: opts.deps
    });
    const ENTRY_FILE = "esbuild-entry.js";
    const tmpDir = this.opts.mfsu.opts.tmpBase;
    const entryPath = (0, import_path.join)(tmpDir, ENTRY_FILE);
    (0, import_fs.writeFileSync)(entryPath, entryContent, "utf-8");
    const date = new Date().getTime();
    await (0, import_bundler_esbuild.build)({
      cwd: this.opts.mfsu.opts.cwd,
      entry: {
        [`${import_constants.MF_VA_PREFIX}remoteEntry`]: entryPath
      },
      config: {
        ...this.opts.mfsu.opts.depBuildConfig,
        outputPath: tmpDir,
        alias: this.opts.mfsu.alias,
        externals: this.opts.mfsu.externals
      },
      inlineStyle: true
    });
    import_utils.logger.event(
      `[mfsu] compiled with esbuild successfully in ${+new Date() - date} ms`
    );
    opts.onBuildComplete();
  }
  async buildWithWorker(opts) {
    const worker = this.opts.mfsu.opts.startBuildWorker(opts.deps);
    worker.postMessage(opts.deps);
    return new Promise((resolve, reject) => {
      const onMessage = ({
        progress,
        done
      }) => {
        if (done) {
          opts.onBuildComplete();
          worker.off("message", onMessage);
          if (done.withError) {
            import_utils.logger.debug("[MFSU][eager][main] build failed", done.withError);
            reject(done.withError);
          } else {
            resolve();
          }
        }
        if (progress) {
          this.opts.mfsu.onProgress(progress);
        }
      };
      worker.on("message", onMessage);
      worker.once("error", (e) => {
        import_utils.logger.error("[MFSU][eager] worker got Error", e);
        opts.onBuildComplete();
        reject(e);
      });
    });
  }
  async build(opts) {
    this.isBuilding = true;
    const onBuildComplete = () => {
      this.isBuilding = false;
      this.completeFns.forEach((fn) => fn());
      this.completeFns = [];
    };
    try {
      const buildOpts = {
        ...opts,
        onBuildComplete
      };
      if (this.opts.mfsu.opts.strategy === "eager" && opts.useWorker) {
        await this.buildWithWorker(buildOpts);
        return;
      }
      await this.writeMFFiles({ deps: opts.deps });
      if (this.opts.mfsu.opts.buildDepWithESBuild) {
        await this.buildWithESBuild(buildOpts);
      } else {
        await this.buildWithWebpack(buildOpts);
      }
    } catch (e) {
      onBuildComplete();
      throw e;
    }
  }
  onBuildComplete(fn) {
    if (this.isBuilding) {
      this.completeFns.push(fn);
    } else {
      fn();
    }
  }
  async writeMFFiles(opts) {
    const tmpBase = this.opts.mfsu.opts.tmpBase;
    import_utils.fsExtra.mkdirpSync(tmpBase);
    for (const dep of opts.deps) {
      const content = await dep.buildExposeContent();
      (0, import_fs.writeFileSync)((0, import_path.join)(tmpBase, dep.filePath), content, "utf-8");
    }
    (0, import_fs.writeFileSync)((0, import_path.join)(tmpBase, MF_ENTRY), '"😛"', "utf-8");
  }
  getWebpackConfig(opts) {
    var _a, _b;
    const mfName = this.opts.mfsu.opts.mfName;
    const depConfig = import_utils.lodash.cloneDeep(this.opts.mfsu.depConfig);
    depConfig.entry = (0, import_path.join)(this.opts.mfsu.opts.tmpBase, MF_ENTRY);
    depConfig.output.path = this.opts.mfsu.opts.tmpBase;
    depConfig.output.publicPath = "auto";
    depConfig.devtool = false;
    if ((_a = depConfig.output) == null ? void 0 : _a.library)
      delete depConfig.output.library;
    if ((_b = depConfig.output) == null ? void 0 : _b.libraryTarget)
      delete depConfig.output.libraryTarget;
    depConfig.optimization || (depConfig.optimization = {});
    depConfig.optimization.splitChunks = {
      chunks: (chunk) => {
        const hasShared = chunk.getModules().some((m) => {
          return m.type === "consume-shared-module" || m.type === "provide-module" || m.type === "provide-shared-module";
        });
        return !hasShared;
      },
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /.+/,
          name(_module, _chunks, cacheGroupKey) {
            return `${import_constants.MF_DEP_PREFIX}___${cacheGroupKey}`;
          }
        }
      }
    };
    depConfig.plugins = depConfig.plugins || [];
    depConfig.plugins.push(new import_depChunkIdPrefixPlugin.DepChunkIdPrefixPlugin());
    depConfig.plugins.push(
      new import_stripSourceMapUrlPlugin.StripSourceMapUrlPlugin({
        webpack: this.opts.mfsu.opts.implementor
      })
    );
    depConfig.plugins.push(
      new this.opts.mfsu.opts.implementor.ProgressPlugin((percent, msg) => {
        this.opts.mfsu.onProgress({ percent, status: msg });
      })
    );
    const exposes = opts.deps.reduce((memo, dep) => {
      memo[`./${dep.file}`] = (0, import_path.join)(this.opts.mfsu.opts.tmpBase, dep.filePath);
      return memo;
    }, {});
    depConfig.plugins.push(
      new this.opts.mfsu.opts.implementor.container.ModuleFederationPlugin({
        library: {
          type: "global",
          name: mfName
        },
        name: mfName,
        filename: import_constants.REMOTE_FILE_FULL,
        exposes,
        shared: this.opts.mfsu.opts.shared || {}
      })
    );
    return depConfig;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DepBuilder
});
