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

// src/utils/postcssProcess.ts
var postcssProcess_exports = {};
__export(postcssProcess_exports, {
  postcssProcess: () => postcssProcess
});
module.exports = __toCommonJS(postcssProcess_exports);
var import_postcss = __toESM(require("postcss"));
var import_getBrowserlist = require("./getBrowserlist");
async function postcssProcess(config, css, path) {
  return await (0, import_postcss.default)(
    [
      require("postcss-flexbugs-fixes"),
      require("postcss-preset-env")({
        browsers: (0, import_getBrowserlist.getBrowserlist)((config == null ? void 0 : config.targets) || {}),
        autoprefixer: {
          flexbox: "no-2009",
          ...config == null ? void 0 : config.autoprefixer
        },
        stage: 3
      })
    ].concat((config == null ? void 0 : config.extraPostCSSPlugins) || [])
  ).process(css, {
    from: path,
    to: path
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  postcssProcess
});
