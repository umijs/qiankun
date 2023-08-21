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

// src/config/svgRules.ts
var svgRules_exports = {};
__export(svgRules_exports, {
  addSVGRules: () => addSVGRules
});
module.exports = __toCommonJS(svgRules_exports);
async function addSVGRules(opts) {
  const { config, userConfig } = opts;
  const { svgr, svgo = {} } = userConfig;
  if (svgr) {
    const svgrRule = config.module.rule("svgr");
    svgrRule.test(/\.svg$/).issuer(/\.[jt]sx?$/).type("javascript/auto").use("svgr-loader").loader(require.resolve("../loader/svgr")).options({
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeTitle: false
              }
            }
          },
          "prefixIds"
        ],
        ...svgo
      },
      ...svgr,
      svgo: !!svgo
    }).end().use("url-loader").loader(require.resolve("@umijs/bundler-webpack/compiled/url-loader")).options({
      limit: userConfig.inlineLimit,
      fallback: require.resolve("@umijs/bundler-webpack/compiled/file-loader")
    }).end();
  }
  if (svgo !== false) {
    const svgRule = config.module.rule("svg");
    svgRule.test(/\.svg$/).use("svgo-loader").loader(require.resolve("@umijs/bundler-webpack/compiled/svgo-loader")).options({ configFile: false, ...svgo }).end();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addSVGRules
});
