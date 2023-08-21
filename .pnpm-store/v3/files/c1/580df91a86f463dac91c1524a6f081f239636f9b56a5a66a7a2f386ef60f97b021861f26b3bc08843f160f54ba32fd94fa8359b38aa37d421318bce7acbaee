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

// src/babelPlugins/awaitImport/MFImport.ts
var MFImport_exports = {};
__export(MFImport_exports, {
  default: () => MFImport_default
});
module.exports = __toCommonJS(MFImport_exports);
var t = __toESM(require("@umijs/bundler-utils/compiled/babel/types"));
function MFImport_default() {
  return {
    visitor: {
      Program: {
        exit(path, { opts }) {
          let index = path.node.body.length - 1;
          while (index >= 0) {
            const node = path.node.body[index];
            if (t.isImportDeclaration(node)) {
              node.source.value = opts.resolveImportSource(node.source.value);
            } else if (t.isExportAllDeclaration(node)) {
              node.source.value = opts.resolveImportSource(node.source.value);
            } else if (t.isExportNamedDeclaration(node) && node.source) {
              node.source.value = opts.resolveImportSource(node.source.value);
            }
            index -= 1;
          }
        }
      },
      CallExpression: {
        exit(path, { opts }) {
          const { node } = path;
          if (t.isImport(node.callee) && node.arguments.length === 1 && t.isStringLiteral(node.arguments[0])) {
            const newValue = opts.resolveImportSource(node.arguments[0].value);
            node.arguments[0].value = newValue;
          }
        }
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
