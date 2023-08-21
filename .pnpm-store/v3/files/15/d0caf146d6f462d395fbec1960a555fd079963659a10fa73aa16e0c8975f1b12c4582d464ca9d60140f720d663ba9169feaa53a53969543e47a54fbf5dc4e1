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

// src/swcPlugins/autoCSSModules.ts
var autoCSSModules_exports = {};
__export(autoCSSModules_exports, {
  default: () => autoCSSModules_default
});
module.exports = __toCommonJS(autoCSSModules_exports);
var import_Visitor = __toESM(require("@swc/core/Visitor"));
var import_utils = require("@umijs/utils");
var import_changeImportFromString = require("./changeImportFromString");
var AutoCSSModule = class extends import_Visitor.default {
  visitTsType(expression) {
    return expression;
  }
  /**
   * call path:
   *   visitProgram -> visitModule -> visitModuleItems -> visitModuleItem -> visitImportDeclaration
   * @see https://github.com/swc-project/swc/blob/main/node-swc/src/Visitor.ts#L189
   */
  visitModuleItem(n) {
    if (n.type === "ImportDeclaration") {
      return this.visitImportDeclaration(n);
    }
    return n;
  }
  visitImportDeclaration(expression) {
    const { specifiers, source } = expression;
    const { value } = source;
    if (specifiers.length && (0, import_utils.isStyleFile)({ filename: value })) {
      const newImportFrom = `${value}?modules`;
      (0, import_changeImportFromString.changeImportFromString)(expression, newImportFrom);
    }
    return expression;
  }
};
var autoCSSModules_default = AutoCSSModule;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
