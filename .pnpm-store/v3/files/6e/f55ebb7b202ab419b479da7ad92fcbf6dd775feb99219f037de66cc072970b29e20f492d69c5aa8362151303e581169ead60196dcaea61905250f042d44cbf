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

// src/dev.ts
var dev_exports = {};
__export(dev_exports, {
  dev: () => dev,
  ensureSerializableValue: () => ensureSerializableValue,
  setup: () => setup
});
module.exports = __toCommonJS(dev_exports);
var import_mfsu = require("@umijs/mfsu");
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_path = require("path");
var import_webpack = __toESM(require("../compiled/webpack"));
var import_constants = require("./constants");
var import_server = require("./server/server");
var import_types = require("./types");
var configModule = (0, import_utils.importLazy)(
  require.resolve("./config/config")
);
function ensureSerializableValue(obj) {
  return JSON.parse(
    JSON.stringify(
      obj,
      (_key, value) => {
        if (typeof value === "function") {
          return value.toString();
        }
        return value;
      },
      2
    )
  );
}
async function dev(opts) {
  const { mfsu, webpackConfig } = await setup(opts);
  await (0, import_server.createServer)({
    webpackConfig,
    userConfig: opts.config,
    cwd: opts.cwd,
    beforeMiddlewares: [
      ...(mfsu == null ? void 0 : mfsu.getMiddlewares()) || [],
      ...opts.beforeMiddlewares || []
    ],
    port: opts.port,
    host: opts.host,
    ip: opts.ip,
    afterMiddlewares: [...opts.afterMiddlewares || []],
    onDevCompileDone: opts.onDevCompileDone,
    onProgress: opts.onProgress,
    onBeforeMiddleware: opts.onBeforeMiddleware
  });
}
async function setup(opts) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const cacheDirectoryPath = (0, import_path.resolve)(
    opts.rootDir || opts.cwd,
    opts.config.cacheDirectoryPath || "node_modules/.cache"
  );
  const enableMFSU = opts.config.mfsu !== false;
  let mfsu = null;
  if (enableMFSU) {
    mfsu = new import_mfsu.MFSU({
      strategy: opts.mfsuStrategy,
      include: opts.mfsuInclude || [],
      srcCodeCache: opts.srcCodeCache,
      implementor: import_webpack.default,
      buildDepWithESBuild: (_a = opts.config.mfsu) == null ? void 0 : _a.esbuild,
      depBuildConfig: {
        extraPostCSSPlugins: ((_b = opts.config) == null ? void 0 : _b.extraPostCSSPlugins) || []
      },
      mfName: (_c = opts.config.mfsu) == null ? void 0 : _c.mfName,
      runtimePublicPath: opts.config.runtimePublicPath,
      tmpBase: ((_d = opts.config.mfsu) == null ? void 0 : _d.cacheDirectory) || (0, import_path.join)(cacheDirectoryPath, "mfsu"),
      onMFSUProgress: opts.onMFSUProgress,
      unMatchLibs: (_e = opts.config.mfsu) == null ? void 0 : _e.exclude,
      shared: (_f = opts.config.mfsu) == null ? void 0 : _f.shared,
      remoteAliases: (_g = opts.config.mfsu) == null ? void 0 : _g.remoteAliases,
      remoteName: (_h = opts.config.mfsu) == null ? void 0 : _h.remoteName,
      getCacheDependency() {
        return ensureSerializableValue({
          version: require("../package.json").version,
          mfsu: opts.config.mfsu,
          alias: opts.config.alias,
          externals: opts.config.externals,
          theme: opts.config.theme,
          runtimePublicPath: opts.config.runtimePublicPath,
          publicPath: opts.config.publicPath,
          define: opts.config.define
        });
      },
      startBuildWorker: opts.startBuildWorker,
      cwd: opts.cwd
    });
  }
  const webpackConfig = await configModule.getConfig({
    cwd: opts.cwd,
    rootDir: opts.rootDir,
    env: import_types.Env.development,
    entry: opts.entry,
    userConfig: opts.config,
    babelPreset: opts.babelPreset,
    extraBabelPlugins: [
      ...opts.beforeBabelPlugins || [],
      ...(mfsu == null ? void 0 : mfsu.getBabelPlugins()) || [],
      ...opts.extraBabelPlugins || []
    ],
    extraBabelPresets: [
      ...opts.beforeBabelPresets || [],
      ...opts.extraBabelPresets || []
    ],
    extraBabelIncludes: opts.config.extraBabelIncludes,
    extraEsbuildLoaderHandler: (mfsu == null ? void 0 : mfsu.getEsbuildLoaderHandler()) || [],
    chainWebpack: opts.chainWebpack,
    modifyWebpackConfig: opts.modifyWebpackConfig,
    hmr: process.env.HMR !== "none",
    analyze: process.env.ANALYZE,
    cache: opts.cache ? {
      ...opts.cache,
      cacheDirectory: (0, import_path.join)(
        cacheDirectoryPath,
        opts.mfsuStrategy === "eager" ? "bundler-webpack-eager" : "bundler-webpack"
      )
    } : void 0,
    pkg: opts.pkg,
    disableCopy: opts.disableCopy
  });
  const depConfig = await configModule.getConfig({
    cwd: opts.cwd,
    rootDir: opts.rootDir,
    env: import_types.Env.development,
    entry: opts.entry,
    userConfig: { ...opts.config, forkTSChecker: false },
    disableCopy: true,
    hash: true,
    staticPathPrefix: import_mfsu.MF_DEP_PREFIX,
    name: import_constants.MFSU_NAME,
    chainWebpack: (_i = opts.config.mfsu) == null ? void 0 : _i.chainWebpack,
    extraBabelIncludes: opts.config.extraBabelIncludes,
    cache: {
      buildDependencies: (_j = opts.cache) == null ? void 0 : _j.buildDependencies,
      cacheDirectory: (0, import_path.join)(cacheDirectoryPath, "mfsu-deps")
    },
    pkg: opts.pkg
  });
  (_k = webpackConfig.resolve).alias || (_k.alias = {});
  ["@umijs/utils/compiled/strip-ansi", "react-error-overlay"].forEach((dep) => {
    webpackConfig.resolve.alias[dep] = require.resolve(dep);
  });
  await (mfsu == null ? void 0 : mfsu.setWebpackConfig({
    config: webpackConfig,
    depConfig
  }));
  if (mfsu && webpackConfig.cache && typeof webpackConfig.cache === "object" && webpackConfig.cache.type === "filesystem") {
    const webpackCachePath = (0, import_path.join)(
      webpackConfig.cache.cacheDirectory,
      `default-development`,
      "index.pack"
    );
    const mfsuCacheExists = (0, import_fs.existsSync)(mfsu.getCacheFilePath());
    const webpackCacheExists = (0, import_fs.existsSync)(webpackCachePath);
    if (webpackCacheExists && !mfsuCacheExists) {
      import_utils.logger.warn(`Invalidate webpack cache since mfsu cache is missing`);
      import_utils.rimraf.sync(webpackConfig.cache.cacheDirectory);
    }
  }
  return {
    mfsu,
    webpackConfig
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  dev,
  ensureSerializableValue,
  setup
});
