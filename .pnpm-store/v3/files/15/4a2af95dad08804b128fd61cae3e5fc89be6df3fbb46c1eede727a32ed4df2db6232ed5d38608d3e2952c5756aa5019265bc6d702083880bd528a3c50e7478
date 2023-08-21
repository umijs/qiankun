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

// src/build.ts
var build_exports = {};
__export(build_exports, {
  build: () => build
});
module.exports = __toCommonJS(build_exports);
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_webpack = __toESM(require("../compiled/webpack"));
var import_types = require("./types");
var configModule = (0, import_utils.importLazy)(
  require.resolve("./config/config")
);
async function build(opts) {
  const cacheDirectoryPath = (0, import_path.resolve)(
    opts.rootDir || opts.cwd,
    opts.config.cacheDirectoryPath || "node_modules/.cache"
  );
  const webpackConfig = await configModule.getConfig({
    cwd: opts.cwd,
    rootDir: opts.rootDir,
    env: import_types.Env.production,
    entry: opts.entry,
    userConfig: opts.config,
    analyze: process.env.ANALYZE,
    babelPreset: opts.babelPreset,
    extraBabelPlugins: [
      ...opts.beforeBabelPlugins || [],
      ...opts.extraBabelPlugins || []
    ],
    extraBabelPresets: [
      ...opts.beforeBabelPresets || [],
      ...opts.extraBabelPresets || []
    ],
    extraBabelIncludes: opts.config.extraBabelIncludes,
    chainWebpack: opts.chainWebpack,
    modifyWebpackConfig: opts.modifyWebpackConfig,
    cache: opts.cache ? {
      ...opts.cache,
      cacheDirectory: (0, import_path.join)(cacheDirectoryPath, "bundler-webpack")
    } : void 0,
    pkg: opts.pkg,
    disableCopy: opts.disableCopy
  });
  let isFirstCompile = true;
  return new Promise((resolve2, reject) => {
    if (opts.clean) {
      import_utils.rimraf.sync(webpackConfig.output.path);
    }
    const compiler = (0, import_webpack.default)(webpackConfig);
    let closeWatching;
    const handler = async (err, stats) => {
      var _a;
      const validErr = err || ((stats == null ? void 0 : stats.hasErrors()) ? new Error(stats.toString("errors-only")) : null);
      await ((_a = opts.onBuildComplete) == null ? void 0 : _a.call(opts, {
        err: validErr,
        stats,
        isFirstCompile,
        time: stats ? stats.endTime - stats.startTime : null,
        // pass close function to close watching
        ...opts.watch ? { close: closeWatching } : {}
      }));
      isFirstCompile = false;
      if (validErr) {
        (stats == null ? void 0 : stats.hasErrors()) && esbuildCompressErrorHelper(validErr.toString());
        reject(validErr);
      } else {
        resolve2(stats);
      }
      if (!opts.watch)
        compiler.close(() => {
        });
    };
    if (opts.watch) {
      const watching = compiler.watch(
        webpackConfig.watchOptions || {},
        handler
      );
      closeWatching = watching.close.bind(watching);
    } else {
      compiler.run(handler);
    }
  });
}
function esbuildCompressErrorHelper(errorMsg) {
  if (typeof errorMsg !== "string")
    return;
  if (
    // https://github.com/evanw/esbuild/blob/a5f781ecd5edeb3fb6ae8d1045507ab850462614/internal/js_parser/js_parser_lower.go#L18
    errorMsg.includes("configured target environment") && errorMsg.includes("es2015")
  ) {
    const terserRecommend = {
      label: import_utils.chalk.green("change jsMinifier"),
      details: import_utils.chalk.cyan(`  jsMinifier: 'terser'`)
    };
    const upgradeTargetRecommend = {
      label: import_utils.chalk.green("upgrade target"),
      details: import_utils.chalk.cyan(`  jsMinifierOptions: {
    target: ['chrome80', 'es2020']
  }`)
    };
    const ieRecommend = {
      details: `P.S. compatible with legacy browsers: https://umijs.org/blog/legacy-browser`
    };
    console.log();
    console.log(import_utils.chalk.bgRed(" COMPRESSION ERROR "));
    console.log(
      import_utils.chalk.yellow(
        `esbuild minify failed, please ${terserRecommend.label} or ${upgradeTargetRecommend.label}:`
      )
    );
    console.log("e.g. ");
    console.log(terserRecommend.details);
    console.log("   or");
    console.log(upgradeTargetRecommend.details);
    console.log(ieRecommend.details);
    console.log();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  build
});
