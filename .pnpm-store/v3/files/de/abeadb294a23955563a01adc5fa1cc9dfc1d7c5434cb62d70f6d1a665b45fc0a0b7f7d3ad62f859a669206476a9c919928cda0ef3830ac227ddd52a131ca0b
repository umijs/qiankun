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

// src/config/config.ts
var config_exports = {};
__export(config_exports, {
  getConfig: () => getConfig
});
module.exports = __toCommonJS(config_exports);
var import_case_sensitive_paths_webpack_plugin = __toESM(require("@umijs/case-sensitive-paths-webpack-plugin"));
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_webpack = __toESM(require("../../compiled/webpack"));
var import_webpack_5_chain = __toESM(require("../../compiled/webpack-5-chain"));
var import_constants = require("../constants");
var import_RuntimePublicPathPlugin = require("../plugins/RuntimePublicPathPlugin");
var import_types = require("../types");
var import_browsersList = require("../utils/browsersList");
var import_assetRules = require("./assetRules");
var import_bundleAnalyzerPlugin = require("./bundleAnalyzerPlugin");
var import_compressPlugin = require("./compressPlugin");
var import_copyPlugin = require("./copyPlugin");
var import_cssRules = require("./cssRules");
var import_definePlugin = require("./definePlugin");
var import_detectCssModulesInDependence = require("./detectCssModulesInDependence");
var import_detectDeadCodePlugin = require("./detectDeadCodePlugin");
var import_fastRefreshPlugin = require("./fastRefreshPlugin");
var import_forkTSCheckerPlugin = require("./forkTSCheckerPlugin");
var import_harmonyLinkingErrorPlugin = require("./harmonyLinkingErrorPlugin");
var import_ignorePlugin = require("./ignorePlugin");
var import_javaScriptRules = require("./javaScriptRules");
var import_manifestPlugin = require("./manifestPlugin");
var import_miniCSSExtractPlugin = require("./miniCSSExtractPlugin");
var import_nodePolyfill = require("./nodePolyfill");
var import_progressPlugin = require("./progressPlugin");
var import_speedMeasureWebpackPlugin = require("./speedMeasureWebpackPlugin");
var import_ssrPlugin = __toESM(require("./ssrPlugin"));
var import_svgRules = require("./svgRules");
async function getConfig(opts) {
  var _a, _b, _c;
  const { userConfig } = opts;
  const isDev = opts.env === import_types.Env.development;
  const config = new import_webpack_5_chain.default();
  userConfig.targets || (userConfig.targets = import_constants.DEFAULT_BROWSER_TARGETS);
  userConfig.inlineLimit = parseInt(userConfig.inlineLimit || "10000", 10);
  const useHash = !!(opts.hash || userConfig.hash && !isDev);
  const applyOpts = {
    name: opts.name,
    config,
    userConfig,
    cwd: opts.cwd,
    env: opts.env,
    babelPreset: opts.babelPreset,
    extraBabelPlugins: opts.extraBabelPlugins || [],
    extraBabelPresets: opts.extraBabelPresets || [],
    extraBabelIncludes: opts.extraBabelIncludes || [],
    extraEsbuildLoaderHandler: opts.extraEsbuildLoaderHandler || [],
    browsers: (0, import_browsersList.getBrowsersList)({
      targets: userConfig.targets
    }),
    useHash,
    staticPathPrefix: opts.staticPathPrefix !== void 0 ? opts.staticPathPrefix : "static/"
  };
  config.name(opts.name);
  config.mode(opts.env);
  config.stats("none");
  Object.keys(opts.entry).forEach((key) => {
    const entry = config.entry(key);
    if (isDev && opts.hmr) {
      entry.add(require.resolve("../../client/client/client"));
    }
    entry.add(opts.entry[key]);
  });
  config.devtool(
    isDev ? userConfig.devtool === false ? false : userConfig.devtool || import_constants.DEFAULT_DEVTOOL : userConfig.devtool
  );
  const absOutputPath = (0, import_path.resolve)(
    opts.cwd,
    userConfig.outputPath || import_constants.DEFAULT_OUTPUT_PATH
  );
  const disableCompress = process.env.COMPRESS === "none";
  config.output.path(absOutputPath).filename(useHash ? `[name].[contenthash:8].js` : `[name].js`).chunkFilename(
    useHash ? `[name].[contenthash:8].async.js` : `[name].async.js`
  ).publicPath(userConfig.publicPath || "auto").pathinfo(isDev || disableCompress).set(
    "assetModuleFilename",
    `${applyOpts.staticPathPrefix}[name].[hash:8][ext]`
  ).set("hashFunction", "xxhash64");
  config.resolve.set("symlinks", true).modules.add("node_modules").end().alias.merge(userConfig.alias || {}).end().extensions.merge([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".wasm"
  ]).end();
  config.externals(userConfig.externals || []);
  config.target(["web", "es5"]);
  config.experiments({
    topLevelAwait: true,
    outputModule: !!userConfig.esm
  });
  await (0, import_nodePolyfill.addNodePolyfill)(applyOpts);
  await (0, import_javaScriptRules.addJavaScriptRules)(applyOpts);
  await (0, import_cssRules.addCSSRules)(applyOpts);
  await (0, import_assetRules.addAssetRules)(applyOpts);
  await (0, import_svgRules.addSVGRules)(applyOpts);
  await (0, import_miniCSSExtractPlugin.addMiniCSSExtractPlugin)(applyOpts);
  await (0, import_ignorePlugin.addIgnorePlugin)(applyOpts);
  await (0, import_definePlugin.addDefinePlugin)(applyOpts);
  await (0, import_fastRefreshPlugin.addFastRefreshPlugin)(applyOpts);
  await (0, import_progressPlugin.addProgressPlugin)(applyOpts);
  await (0, import_detectDeadCodePlugin.addDetectDeadCodePlugin)(applyOpts);
  await (0, import_forkTSCheckerPlugin.addForkTSCheckerPlugin)(applyOpts);
  if (!opts.disableCopy) {
    await (0, import_copyPlugin.addCopyPlugin)(applyOpts);
  }
  await (0, import_manifestPlugin.addManifestPlugin)(applyOpts);
  if (isDev && opts.hmr) {
    config.plugin("hmr").use(import_webpack.default.HotModuleReplacementPlugin);
  }
  await (0, import_ssrPlugin.default)(applyOpts);
  await (0, import_compressPlugin.addCompressPlugin)(applyOpts);
  await (0, import_harmonyLinkingErrorPlugin.addHarmonyLinkingErrorPlugin)(applyOpts);
  await (0, import_detectCssModulesInDependence.addDependenceCssModulesDetector)(applyOpts);
  if (userConfig.runtimePublicPath) {
    config.plugin("runtimePublicPath").use(import_RuntimePublicPathPlugin.RuntimePublicPathPlugin);
  }
  config.plugin("case-sensitive-paths").use(import_case_sensitive_paths_webpack_plugin.default);
  if (opts.cache) {
    config.cache({
      type: "filesystem",
      version: require("../../package.json").version,
      buildDependencies: {
        config: opts.cache.buildDependencies || []
      },
      cacheDirectory: opts.cache.cacheDirectory || // 使用 rootDir 是在有 APP_ROOT 时，把 cache 目录放在根目录下
      (0, import_path.join)(
        opts.rootDir || opts.cwd,
        "node_modules",
        ".cache",
        "bundler-webpack"
      )
    });
    if (
      /*isTnpm*/
      require("@umijs/utils/package").__npminstall_done
    ) {
      const nodeModulesPath = opts.cache.absNodeModulesPath || (0, import_path.join)(opts.rootDir || opts.cwd, "node_modules");
      const localLinkedNodeModules = Object.keys(
        Object.assign(
          {},
          (_a = opts.pkg) == null ? void 0 : _a.dependencies,
          (_b = opts.pkg) == null ? void 0 : _b.peerDependencies,
          (_c = opts.pkg) == null ? void 0 : _c.devDependencies
        )
      ).map((pkg) => {
        try {
          return (0, import_path.resolve)(
            import_utils.resolve.sync(`${pkg}/package.json`, {
              basedir: opts.rootDir || opts.cwd,
              preserveSymlinks: false
            }),
            "../node_modules"
          );
        } catch {
          return opts.rootDir || opts.cwd;
        }
      }).filter((pkg) => !pkg.startsWith(opts.rootDir || opts.cwd));
      if (localLinkedNodeModules.length) {
        import_utils.logger.info(
          `Detected local linked tnpm node_modules, to avoid oom, they will be treated as immutablePaths & managedPaths in webpack snapshot:`
        );
        localLinkedNodeModules.forEach((p) => import_utils.logger.info(`  ${p}`));
      }
      config.snapshot({
        immutablePaths: [nodeModulesPath, ...localLinkedNodeModules],
        managedPaths: [nodeModulesPath, ...localLinkedNodeModules]
      });
    }
    config.infrastructureLogging({
      level: "error",
      ...process.env.WEBPACK_FS_CACHE_DEBUG ? {
        debug: /webpack\.cache/
      } : {}
    });
  }
  if (opts.analyze) {
    await (0, import_bundleAnalyzerPlugin.addBundleAnalyzerPlugin)(applyOpts);
  }
  if (opts.chainWebpack) {
    await opts.chainWebpack(config, {
      env: opts.env,
      webpack: import_webpack.default
    });
  }
  if (userConfig.chainWebpack) {
    await userConfig.chainWebpack(config, {
      env: opts.env,
      webpack: import_webpack.default
    });
  }
  let webpackConfig = config.toConfig();
  webpackConfig = await (0, import_speedMeasureWebpackPlugin.addSpeedMeasureWebpackPlugin)({
    webpackConfig
  });
  if (opts.modifyWebpackConfig) {
    webpackConfig = await opts.modifyWebpackConfig(webpackConfig, {
      env: opts.env,
      webpack: import_webpack.default
    });
  }
  return webpackConfig;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getConfig
});
