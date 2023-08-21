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

// src/loader/swc.ts
var swc_exports = {};
__export(swc_exports, {
  default: () => swc_default
});
module.exports = __toCommonJS(swc_exports);
var import_core = require("@swc/core");
var import_types = require("../types");
var import_utils = require("@umijs/utils");
function getBaseOpts({ filename }) {
  const isTSFile = filename.endsWith(".ts");
  const isTypeScript = isTSFile || filename.endsWith(".tsx");
  const isDev = process.env.NODE_ENV === import_types.Env.development;
  const swcOpts = {
    module: {
      // @ts-ignore
      type: "es6",
      ignoreDynamic: true
    },
    jsc: {
      parser: {
        syntax: isTypeScript ? "typescript" : "ecmascript",
        [isTypeScript ? "tsx" : "jsx"]: !isTSFile,
        dynamicImport: isTypeScript
      },
      target: "es2015",
      transform: {
        react: {
          runtime: "automatic",
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
          throwIfNamespace: true,
          development: isDev,
          useBuiltins: true
        }
      }
    }
  };
  return swcOpts;
}
function swcLoader(contents, inputSourceMap) {
  const callback = this.async();
  const loaderOpts = this.getOptions();
  if (inputSourceMap && typeof inputSourceMap === "object") {
    inputSourceMap = JSON.stringify(inputSourceMap);
  }
  const {
    sync = false,
    parseMap = false,
    excludeFiles = [],
    enableAutoCssModulesPlugin = false,
    mergeConfigs,
    ...otherOpts
  } = loaderOpts;
  const filename = this.resourcePath;
  const isSkip = excludeFiles.some((pattern) => {
    if (typeof pattern === "string") {
      return filename == pattern;
    }
    return pattern.test(filename);
  });
  if (isSkip) {
    return callback(
      null,
      contents,
      parseMap ? JSON.parse(inputSourceMap) : inputSourceMap
    );
  }
  let swcOpts = {
    ...getBaseOpts({
      filename
    }),
    // filename
    filename,
    sourceFileName: filename,
    // source map
    sourceMaps: this.sourceMap,
    ...inputSourceMap ? {
      inputSourceMap
    } : {},
    ...otherOpts
  };
  if (enableAutoCssModulesPlugin) {
    swcOpts = (0, import_utils.deepmerge)(swcOpts, {
      jsc: {
        experimental: {
          plugins: [[require.resolve("swc-plugin-auto-css-modules"), {}]]
        }
      }
    });
  }
  if (mergeConfigs) {
    swcOpts = (0, import_utils.deepmerge)(swcOpts, mergeConfigs);
  }
  try {
    if (sync) {
      const output = (0, import_core.transformSync)(contents, swcOpts);
      callback(
        null,
        output.code,
        parseMap ? JSON.parse(output.map) : output.map
      );
    } else {
      (0, import_core.transform)(contents, swcOpts).then(
        (output) => {
          callback(
            null,
            output.code,
            parseMap ? JSON.parse(output.map) : output.map
          );
        },
        (err) => {
          callback(err);
        }
      );
    }
  } catch (e) {
    callback(e);
  }
}
var swc_default = swcLoader;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
