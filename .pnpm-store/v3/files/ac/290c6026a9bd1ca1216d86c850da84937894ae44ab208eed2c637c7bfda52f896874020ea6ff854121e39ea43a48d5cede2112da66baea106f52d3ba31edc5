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

// src/mfsu/mfsu.ts
var mfsu_exports = {};
__export(mfsu_exports, {
  MFSU: () => MFSU,
  resolvePublicPath: () => resolvePublicPath
});
module.exports = __toCommonJS(mfsu_exports);
var import_bundler_utils = require("@umijs/bundler-utils");
var import_express = __toESM(require("@umijs/bundler-utils/compiled/express"));
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_fs = require("fs");
var import_path = require("path");
var import_is_absolute_url = __toESM(require("../../compiled/is-absolute-url"));
var import_mrmime = require("../../compiled/mrmime");
var import_webpack_virtual_modules = __toESM(require("../../compiled/webpack-virtual-modules"));
var import_constants = require("../constants");
var import_dep = require("../dep/dep");
var import_depBuilder = require("../depBuilder/depBuilder");
var import_awaitImport = __toESM(require("../esbuildHandlers/awaitImport"));
var import_types = require("../types");
var import_makeArray = require("../utils/makeArray");
var import_webpackUtils = require("../utils/webpackUtils");
var import_buildDepPlugin = require("../webpackPlugins/buildDepPlugin");
var import_strategyCompileTime = require("./strategyCompileTime");
var import_strategyStaticAnalyze = require("./strategyStaticAnalyze");
var MFSU = class {
  constructor(opts) {
    this.alias = {};
    this.externals = [];
    this.depConfig = null;
    this.buildDepsAgain = false;
    this.progress = { done: false };
    this.publicPath = "/";
    this.lastBuildError = null;
    this.opts = opts;
    this.opts.mfName = this.opts.mfName || import_constants.DEFAULT_MF_NAME;
    this.opts.tmpBase = this.opts.tmpBase || (0, import_path.join)(process.cwd(), import_constants.DEFAULT_TMP_DIR_NAME);
    this.opts.mode = this.opts.mode || import_types.Mode.development;
    this.opts.getCacheDependency = this.opts.getCacheDependency || (() => ({}));
    this.onProgress = (progress) => {
      var _a, _b;
      this.progress = {
        ...this.progress,
        ...progress
      };
      (_b = (_a = this.opts).onMFSUProgress) == null ? void 0 : _b.call(_a, this.progress);
    };
    this.opts.cwd = this.opts.cwd || process.cwd();
    if (this.opts.strategy === "eager") {
      if (opts.srcCodeCache) {
        import_utils.logger.info("MFSU eager strategy enabled");
        this.strategy = new import_strategyStaticAnalyze.StaticAnalyzeStrategy({
          mfsu: this,
          srcCodeCache: opts.srcCodeCache
        });
      } else {
        import_utils.logger.warn(
          "fallback to MFSU normal strategy, due to srcCache is not provided"
        );
        this.strategy = new import_strategyCompileTime.StrategyCompileTime({ mfsu: this });
      }
    } else {
      this.strategy = new import_strategyCompileTime.StrategyCompileTime({ mfsu: this });
    }
    this.strategy.loadCache();
    this.depBuilder = new import_depBuilder.DepBuilder({ mfsu: this });
  }
  // swc don't support top-level await
  // ref: https://github.com/vercel/next.js/issues/31054
  asyncImport(content) {
    return `await import('${(0, import_utils.winPath)(content)}');`;
  }
  async setWebpackConfig(opts) {
    var _a;
    const { mfName } = this.opts;
    Object.assign(this.alias, ((_a = opts.config.resolve) == null ? void 0 : _a.alias) || {});
    this.externals.push(...(0, import_makeArray.makeArray)(opts.config.externals || []));
    const entry = {};
    const virtualModules = {};
    const entryObject = import_utils.lodash.isString(opts.config.entry) ? { default: [opts.config.entry] } : opts.config.entry;
    (0, import_assert.default)(
      import_utils.lodash.isPlainObject(entryObject),
      `webpack config 'entry' value must be a string or an object.`
    );
    for (const key of Object.keys(entryObject)) {
      if (key === this.opts.remoteName) {
        entry[key] = entryObject[key];
        continue;
      }
      const virtualPath = `./${import_constants.VIRTUAL_ENTRY_DIR}/${key}.js`;
      const virtualContent = [];
      let index = 1;
      let hasDefaultExport = false;
      const entryFiles = import_utils.lodash.isArray(entryObject[key]) ? entryObject[key] : [entryObject[key]];
      const resolver = (0, import_webpackUtils.getResolver)(opts.config);
      for (let entry2 of entryFiles) {
        const realEntry = resolver(entry2);
        (0, import_assert.default)(
          realEntry,
          `entry file not found (${entry2}), please configure the specific entry path. (e.g. 'src/index.tsx')`
        );
        entry2 = realEntry;
        const content = (0, import_fs.readFileSync)(entry2, "utf-8");
        const [_imports, exports] = await (0, import_bundler_utils.parseModule)({ content, path: entry2 });
        if (exports.length) {
          virtualContent.push(`const k${index} = ${this.asyncImport(entry2)}`);
          for (const exportName of exports) {
            if (exportName === "default") {
              hasDefaultExport = true;
              virtualContent.push(`export default k${index}.${exportName}`);
            } else {
              virtualContent.push(
                `export const ${exportName} = k${index}.${exportName}`
              );
            }
          }
        } else {
          virtualContent.push(this.asyncImport(entry2));
        }
        index += 1;
      }
      if (!hasDefaultExport) {
        virtualContent.push(`export default 1;`);
      }
      virtualModules[virtualPath] = virtualContent.join("\n");
      entry[key] = virtualPath;
    }
    opts.config.entry = entry;
    opts.config.plugins = opts.config.plugins || [];
    let publicPath = resolvePublicPath(opts.config);
    this.publicPath = publicPath;
    opts.config.plugins.push(
      ...[
        new import_webpack_virtual_modules.default(virtualModules),
        new this.opts.implementor.container.ModuleFederationPlugin({
          name: "__",
          shared: this.opts.shared || {},
          remotes: {
            [mfName]: this.opts.runtimePublicPath ? (
              // ref:
              // https://webpack.js.org/concepts/module-federation/#promise-based-dynamic-remotes
              `
promise new Promise(resolve => {
  const remoteUrlWithVersion = (window.publicPath || '/') + '${import_constants.REMOTE_FILE_FULL}';
  const script = document.createElement('script');
  script.src = remoteUrlWithVersion;
  script.onload = () => {
    // the injected script has loaded and is available on window
    // we can now resolve this Promise
    const proxy = {
      get: (request) => window['${mfName}'].get(request),
      init: (arg) => {
        try {
          return window['${mfName}'].init(arg);
        } catch(e) {
          console.log('remote container already initialized');
        }
      }
    }
    resolve(proxy);
  }
  // inject this script with the src set to the versioned remoteEntry.js
  document.head.appendChild(script);
})
                `.trimStart()
            ) : `${mfName}@${publicPath}${import_constants.REMOTE_FILE_FULL}`
            // mfsu 的入口文件如果需要在其他的站点上被引用,需要显示的指定publicPath,以保证入口文件的正确访问
          }
        }),
        new import_buildDepPlugin.BuildDepPlugin(this.strategy.getBuildDepPlugConfig())
        // new WriteCachePlugin({
        //   onWriteCache: lodash.debounce(() => {
        //     this.depInfo.writeCache();
        //   }, 300),
        // }),
      ]
    );
    import_utils.lodash.set(opts.config, "experiments.topLevelAwait", true);
    this.depConfig = opts.depConfig;
    this.strategy.init(opts.config);
  }
  async buildDeps(opts = { useWorker: true }) {
    try {
      const shouldBuild = this.strategy.shouldBuild();
      if (!shouldBuild) {
        import_utils.logger.info("[MFSU] skip buildDeps");
        return;
      }
      this.strategy.refresh();
      const staticDeps = this.strategy.getDepModules();
      const deps = import_dep.Dep.buildDeps({
        deps: staticDeps,
        cwd: this.opts.cwd,
        mfsu: this
      });
      import_utils.logger.info(`[MFSU] buildDeps since ${shouldBuild}`);
      import_utils.logger.debug(deps.map((dep) => dep.file).join(", "));
      await this.depBuilder.build({
        deps,
        useWorker: opts.useWorker
      });
      this.lastBuildError = null;
      this.strategy.writeCache();
      if (this.buildDepsAgain) {
        import_utils.logger.info("[MFSU] buildDepsAgain");
        this.buildDepsAgain = false;
        this.buildDeps().catch((e) => {
          import_utils.printHelp.runtime(e);
        });
      }
    } catch (e) {
      this.lastBuildError = e;
      throw e;
    }
  }
  getMiddlewares() {
    return [
      (req, res, next) => {
        const publicPath = this.publicPath;
        const relativePublicPath = (0, import_is_absolute_url.default)(publicPath) ? new URL(publicPath).pathname : publicPath;
        const isMF = req.path.startsWith(`${relativePublicPath}${import_constants.MF_VA_PREFIX}`) || req.path.startsWith(`${relativePublicPath}${import_constants.MF_DEP_PREFIX}`) || req.path.startsWith(`${relativePublicPath}${import_constants.MF_STATIC_PREFIX}`);
        if (isMF) {
          this.depBuilder.onBuildComplete(() => {
            if (!req.path.includes(import_constants.REMOTE_FILE)) {
              res.setHeader("cache-control", "max-age=31536000,immutable");
            }
            res.setHeader(
              "content-type",
              (0, import_mrmime.lookup)((0, import_path.extname)(req.path)) || "text/plain"
            );
            const relativePath = req.path.replace(
              new RegExp(`^${relativePublicPath}`),
              "/"
            );
            const realFilePath = (0, import_path.join)(this.opts.tmpBase, relativePath);
            if (!(0, import_fs.existsSync)(realFilePath)) {
              import_utils.logger.error(`MFSU dist file: ${realFilePath} not found`);
              if (this.lastBuildError) {
                import_utils.logger.error(`MFSU latest build error: `, this.lastBuildError);
              }
              res.status(404);
              return res.end();
            }
            const content = (0, import_fs.readFileSync)(realFilePath);
            res.send(content);
          });
        } else {
          next();
        }
      },
      // 兜底依赖构建时, 代码中有指定 chunk 名的情况
      // TODO: should respect to publicPath
      import_express.default.static(this.opts.tmpBase)
    ];
  }
  getBabelPlugins() {
    return [this.strategy.getBabelPlugin()];
  }
  getEsbuildLoaderHandler() {
    if (this.opts.strategy === "eager") {
      const opts = this.strategy.getBabelPlugin()[1];
      return [(0, import_awaitImport.getImportHandlerV4)(opts)];
    }
    const cache = /* @__PURE__ */ new Map();
    const checkOpts = this.strategy.getBabelPlugin()[1];
    return [
      (0, import_awaitImport.default)({
        cache,
        opts: checkOpts
      })
    ];
  }
  getCacheFilePath() {
    return this.strategy.getCacheFilePath();
  }
};
function resolvePublicPath(config) {
  var _a;
  let publicPath = ((_a = config.output) == null ? void 0 : _a.publicPath) ?? "auto";
  if (publicPath === "auto") {
    publicPath = "/";
  }
  (0, import_assert.default)(typeof publicPath === "string", "Not support function publicPath now");
  return publicPath;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MFSU,
  resolvePublicPath
});
