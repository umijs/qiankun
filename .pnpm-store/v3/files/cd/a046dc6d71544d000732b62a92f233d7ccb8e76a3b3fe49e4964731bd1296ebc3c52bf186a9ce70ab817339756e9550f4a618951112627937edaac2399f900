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

// src/config/javaScriptRules.ts
var javaScriptRules_exports = {};
__export(javaScriptRules_exports, {
  addJavaScriptRules: () => addJavaScriptRules
});
module.exports = __toCommonJS(javaScriptRules_exports);
var import_mfsu = require("@umijs/mfsu");
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_webpack = require("../../compiled/webpack");
var import_constants = require("../constants");
var import_types = require("../types");
var import_depMatch = require("../utils/depMatch");
async function addJavaScriptRules(opts) {
  var _a, _b;
  const { config, userConfig, cwd, name } = opts;
  const isDev = opts.env === import_types.Env.development;
  const useFastRefresh = isDev && userConfig.fastRefresh !== false && name !== import_constants.MFSU_NAME;
  const depPkgs = Object.assign({}, (0, import_depMatch.es5ImcompatibleVersionsToPkg)());
  const srcRules = [
    config.module.rule("src").test(/\.(js|mjs|cjs)$/).include.add([
      cwd,
      // import module out of cwd using APP_ROOT
      // issue: https://github.com/umijs/umi/issues/5594
      ...process.env.APP_ROOT ? [process.cwd()] : []
    ]).end().exclude.add(/node_modules/).end(),
    config.module.rule("jsx-ts-tsx").test(/\.(jsx|ts|tsx)$/),
    config.module.rule("extra-src").test(/\.(js|mjs|cjs)$/).include.add([
      // support extraBabelIncludes
      ...opts.extraBabelIncludes.map((p) => {
        if (import_utils.lodash.isRegExp(p)) {
          return p;
        }
        if ((0, import_path.isAbsolute)(p)) {
          return p;
        }
        try {
          if (p.startsWith("./")) {
            return require.resolve(p, { paths: [cwd] });
          }
          return (0, import_path.dirname)(
            import_utils.resolve.sync(`${p}/package.json`, {
              basedir: cwd,
              // same behavior as webpack, to ensure `include` paths matched
              // ref: https://webpack.js.org/configuration/resolve/#resolvesymlinks
              preserveSymlinks: false
            })
          );
        } catch (e) {
          if (e.code === "MODULE_NOT_FOUND") {
            throw new Error("Cannot resolve extraBabelIncludes: " + p, {
              cause: e
            });
          }
          throw e;
        }
      }),
      // support es5ImcompatibleVersions
      (path) => {
        try {
          if (path.includes("client/client/client"))
            return true;
          return (0, import_depMatch.isMatch)({ path, pkgs: depPkgs });
        } catch (e) {
          console.error(import_utils.chalk.red(e));
          throw e;
        }
      }
    ]).end()
  ];
  if (userConfig.mdx) {
    srcRules.push(config.module.rule("markdown").test(/\.mdx?$/));
  }
  const depRules = [
    config.module.rule("dep").test(/\.(js|mjs|cjs)$/).include.add(/node_modules/).end().exclude.add((path) => {
      try {
        return (0, import_depMatch.isMatch)({ path, pkgs: depPkgs });
      } catch (e) {
        console.error(import_utils.chalk.red(e));
        throw e;
      }
    }).end()
  ];
  srcRules.concat(depRules).forEach((rule) => rule.resolve.set("fullySpecified", false));
  const srcTranspiler = userConfig.srcTranspiler || import_types.Transpiler.babel;
  srcRules.forEach((rule) => {
    var _a2, _b2;
    if (srcTranspiler === import_types.Transpiler.babel) {
      rule.use("babel-loader").loader(require.resolve("../../compiled/babel-loader")).options({
        // Tell babel to guess the type, instead assuming all files are modules
        // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
        sourceType: "unambiguous",
        babelrc: false,
        configFile: false,
        cacheDirectory: false,
        browserslistConfigFile: false,
        // process.env.BABEL_CACHE !== 'none'
        //   ? join(cwd, `.umi/.cache/babel-loader`)
        //   : false,
        targets: userConfig.targets,
        // 解决 vue MFSU 解析 需要
        customize: userConfig.babelLoaderCustomize,
        presets: [
          opts.babelPreset || [
            require.resolve("@umijs/babel-preset-umi"),
            {
              presetEnv: {},
              presetReact: {},
              presetTypeScript: {},
              pluginTransformRuntime: {},
              pluginLockCoreJS: {},
              pluginDynamicImportNode: false,
              pluginAutoCSSModules: userConfig.autoCSSModules
            }
          ],
          ...opts.extraBabelPresets,
          ...(userConfig.extraBabelPresets || []).filter(Boolean)
        ],
        plugins: [
          useFastRefresh && require.resolve("react-refresh/babel"),
          ...opts.extraBabelPlugins,
          ...userConfig.extraBabelPlugins || []
        ].filter(Boolean)
      });
    } else if (srcTranspiler === import_types.Transpiler.swc) {
      rule.use("swc-loader").loader(require.resolve("../loader/swc")).options({
        excludeFiles: [
          // exclude MFSU virtual entry files, because swc not support top level await
          new RegExp(`/${import_mfsu.VIRTUAL_ENTRY_DIR}/[^\\/]+\\.js$`)
        ],
        enableAutoCssModulesPlugin: userConfig.autoCSSModules,
        mergeConfigs: (_a2 = userConfig.srcTranspilerOptions) == null ? void 0 : _a2.swc
      });
    } else if (srcTranspiler === import_types.Transpiler.esbuild) {
      rule.use("esbuild-loader").loader(import_mfsu.esbuildLoader).options({
        target: isDev ? "esnext" : "es2015",
        handler: [import_mfsu.autoCssModulesHandler, ...opts.extraEsbuildLoaderHandler],
        ...(_b2 = userConfig.srcTranspilerOptions) == null ? void 0 : _b2.esbuild
      });
      config.plugin("react-provide-plugin").use(import_webpack.ProvidePlugin, [
        {
          React: "react"
        }
      ]);
    } else {
      throw new Error(`Unsupported srcTranspiler ${srcTranspiler}.`);
    }
  });
  if (userConfig.mdx) {
    config.module.rule("mdx").test(/\.mdx?$/).use("mdx-loader").loader((_a = userConfig.mdx) == null ? void 0 : _a.loader).options((_b = userConfig.mdx) == null ? void 0 : _b.loaderOptions);
  }
  const depTranspiler = userConfig.depTranspiler || import_types.Transpiler.none;
  depRules.forEach((_rule) => {
    if (depTranspiler === import_types.Transpiler.none) {
    } else {
      throw new Error(`Unsupported depTranspiler ${depTranspiler}.`);
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addJavaScriptRules
});
