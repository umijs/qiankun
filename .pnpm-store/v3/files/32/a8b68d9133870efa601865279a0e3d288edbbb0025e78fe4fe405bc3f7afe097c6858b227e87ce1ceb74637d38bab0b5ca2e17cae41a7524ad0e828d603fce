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

// src/plugins/autoCSSModules.ts
var autoCSSModules_exports = {};
__export(autoCSSModules_exports, {
  default: () => autoCSSModules_default
});
module.exports = __toCommonJS(autoCSSModules_exports);
var t = __toESM(require("@umijs/bundler-utils/compiled/babel/types"));
var import_path = require("path");
var CSS_EXT_NAMES = [".css", ".less", ".sass", ".scss", ".stylus", ".styl"];
function autoCSSModules_default() {
  return {
    visitor: {
      ImportDeclaration(path) {
        const {
          specifiers,
          source,
          source: { value }
        } = path.node;
        if (specifiers.length && CSS_EXT_NAMES.includes((0, import_path.extname)(value))) {
          source.value = `${value}?modules`;
        }
      },
      // e.g.
      // const styles = await import('./index.less');
      VariableDeclarator(path) {
        const { node } = path;
        if (t.isAwaitExpression(node.init) && t.isCallExpression(node.init.argument) && t.isImport(node.init.argument.callee) && node.init.argument.arguments.length === 1 && t.isStringLiteral(node.init.argument.arguments[0]) && CSS_EXT_NAMES.includes((0, import_path.extname)(node.init.argument.arguments[0].value))) {
          node.init.argument.arguments[0].value = `${node.init.argument.arguments[0].value}?modules`;
        }
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
