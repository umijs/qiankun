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

// src/staticDepInfo/simulations/babel-plugin-import.ts
var babel_plugin_import_exports = {};
__export(babel_plugin_import_exports, {
  default: () => createHandle
});
module.exports = __toCommonJS(babel_plugin_import_exports);
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_getAliasedPath = require("../../babelPlugins/awaitImport/getAliasedPath");
var import_importParser = __toESM(require("../importParser"));
function createHandle(importOptions) {
  const { libraryName, libraryDirectory } = importOptions;
  const useUnderline = importOptions.camel2UnderlineComponentName;
  const useDash = importOptions.camel2DashComponentName ?? true;
  const transformName = useUnderline ? (n) => transCamel(n, "_") : useDash ? (n) => transCamel(n, "-") : (n) => n;
  const stylePathFromCompPath = importOptions.style === "css" ? (compFsPath) => (0, import_utils.winPath)((0, import_path.join)(compFsPath, "style/css")) : (compFsPath) => (0, import_utils.winPath)((0, import_path.join)(compFsPath, "style"));
  return function handleImports(opts) {
    const { imports, rawCode } = opts;
    if ((imports == null ? void 0 : imports.length) > 0) {
      let addToMatches = function(moduleFsPath) {
        const unAliasedModulePath = (0, import_getAliasedPath.getAliasedPathWithLoopDetect)({
          value: (0, import_utils.winPath)(moduleFsPath),
          alias: opts.alias
        });
        retMatched.push({
          isMatch: true,
          value: unAliasedModulePath,
          replaceValue: `${mfName}/${(0, import_utils.winPath)(unAliasedModulePath)}`,
          version
        });
        const unAliasedStylePath = (0, import_getAliasedPath.getAliasedPathWithLoopDetect)({
          value: stylePathFromCompPath(moduleFsPath),
          alias: opts.alias
        });
        retMatched.push({
          isMatch: true,
          value: unAliasedStylePath,
          replaceValue: `${mfName}/${(0, import_utils.winPath)(unAliasedStylePath)}`,
          version
        });
      };
      const version = opts.pathToVersion(libraryName);
      const importSnippets = imports.map(({ ss, se }) => {
        return rawCode.slice(ss, se + 1);
      }).join("\n");
      const retMatched = [];
      const parsedImports = (0, import_importParser.default)(importSnippets);
      const importedVariable = /* @__PURE__ */ new Set();
      for (const i of parsedImports) {
        i.imports.forEach((v) => {
          if (v === "*") {
            errorLogForSpaceImport(libraryName);
          }
          importedVariable.add(v);
        });
      }
      const mfName = opts.mfName;
      for (const v of importedVariable.entries()) {
        const importVariableName = v[0];
        if (importVariableName === "default") {
          addToMatches((0, import_path.join)(libraryName, libraryDirectory));
          continue;
        }
        const transformedName = transformName(importVariableName);
        const importFsPath = (0, import_path.join)(
          libraryName,
          libraryDirectory,
          transformedName
        );
        addToMatches(importFsPath);
      }
      return retMatched;
    }
    return [];
  };
}
function transCamel(_str, symbol) {
  const str = _str[0].toLowerCase() + _str.substr(1);
  return str.replace(/([A-Z])/g, ($1) => `${symbol}${$1.toLowerCase()}`);
}
function errorLogForSpaceImport(libraryName) {
  import_utils.logger.error(
    `"import * as ant from 'antd'" or "export * from '${libraryName}'" are not allowed in mfsu#strategy='eager'`
  );
  import_utils.logger.error(`solutions:`);
  import_utils.logger.error(`  change to "import { Xxx } from '${libraryName}'" or`);
  import_utils.logger.error(`            "export { Xxx } from '${libraryName}'" syntax`);
  import_utils.logger.error(`  or use mfsu#strategy='normal' configuration`);
  throw Error(`"import * as ant from 'antd'" not allowed in mfsu#version=4`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
