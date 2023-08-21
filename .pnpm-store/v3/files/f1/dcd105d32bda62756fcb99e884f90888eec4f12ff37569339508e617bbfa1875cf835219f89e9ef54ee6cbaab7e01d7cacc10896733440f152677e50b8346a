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

// src/config/cssRules.ts
var cssRules_exports = {};
__export(cssRules_exports, {
  addCSSRules: () => addCSSRules
});
module.exports = __toCommonJS(cssRules_exports);
var import_utils = require("@umijs/utils");
async function addCSSRules(opts) {
  const { config, userConfig } = opts;
  const rulesConfig = [
    { name: "css", test: /\.css(\?.*)?$/ },
    {
      name: "less",
      test: /\.less(\?.*)?$/,
      loader: require.resolve("@umijs/bundler-webpack/compiled/less-loader"),
      loaderOptions: {
        implementation: require.resolve("@umijs/bundler-utils/compiled/less"),
        lessOptions: {
          modifyVars: userConfig.theme,
          javascriptEnabled: true,
          ...userConfig.lessLoader
        }
      }
    },
    {
      name: "sass",
      test: /\.(sass|scss)(\?.*)?$/,
      loader: require.resolve("@umijs/bundler-webpack/compiled/sass-loader"),
      loaderOptions: userConfig.sassLoader || {}
    }
  ];
  for (const { name, test, loader, loaderOptions } of rulesConfig) {
    const rule = config.module.rule(name);
    const nestRulesConfig = [
      userConfig.autoCSSModules && {
        rule: rule.test(test).oneOf("css-modules").resourceQuery(/modules/),
        isAutoCSSModuleRule: true
      },
      {
        rule: rule.test(test).oneOf("css").sideEffects(true),
        isAutoCSSModuleRule: false
      }
    ].filter(Boolean);
    for (const { rule: rule2, isAutoCSSModuleRule } of nestRulesConfig) {
      if (userConfig.styleLoader) {
        rule2.use("style-loader").loader(
          require.resolve("@umijs/bundler-webpack/compiled/style-loader")
        ).options({ base: 0, esModule: true, ...userConfig.styleLoader });
      } else {
        rule2.use("mini-css-extract-plugin").loader(
          require.resolve("@umijs/bundler-webpack/compiled/mini-css-extract-plugin/loader")
        ).options({
          publicPath: "./",
          emit: true,
          esModule: true
        });
      }
      const getLocalIdent = userConfig.ssr && getLocalIdentForSSR;
      const localIdentName = "[local]___[hash:base64:5]";
      let cssLoaderModulesConfig;
      if (isAutoCSSModuleRule) {
        cssLoaderModulesConfig = {
          localIdentName,
          ...userConfig.cssLoaderModules,
          getLocalIdent
        };
      } else if (userConfig.normalCSSLoaderModules) {
        cssLoaderModulesConfig = {
          localIdentName,
          auto: true,
          ...userConfig.normalCSSLoaderModules,
          getLocalIdent
        };
      }
      rule2.use("css-loader").loader(require.resolve("css-loader")).options({
        importLoaders: 1,
        esModule: true,
        url: {
          filter: (url) => {
            if (url.startsWith("/"))
              return false;
            return true;
          }
        },
        import: true,
        modules: cssLoaderModulesConfig,
        ...userConfig.cssLoader
      });
      rule2.use("postcss-loader").loader(
        require.resolve("@umijs/bundler-webpack/compiled/postcss-loader")
      ).options({
        postcssOptions: {
          ident: "postcss",
          plugins: [
            require("@umijs/bundler-webpack/compiled/postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              browsers: opts.browsers,
              autoprefixer: {
                flexbox: "no-2009",
                ...userConfig.autoprefixer
              },
              stage: 3
            })
          ].concat(userConfig.extraPostCSSPlugins || []),
          ...userConfig.postcssLoader
        }
      });
      if (loader) {
        rule2.use(loader).loader(typeof loader === "string" ? require.resolve(loader) : loader).options(loaderOptions || {});
      }
    }
  }
}
function ensureLastSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function getLocalIdentForSSR(context, localIdentName, localName, opt) {
  const classIdent = ((0, import_utils.winPath)(context.resourcePath).replace(
    (0, import_utils.winPath)(ensureLastSlash(opt.context)),
    ""
  ) + "@" + localName).trim();
  let hash = Buffer.from(classIdent).toString("base64").replace(/=/g, "");
  hash = hash.substring(hash.length - 5);
  const result = localIdentName.replace(/\[local]/g, localName).replace(/\[hash[^\[]*?]/g, hash);
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addCSSRules
});
