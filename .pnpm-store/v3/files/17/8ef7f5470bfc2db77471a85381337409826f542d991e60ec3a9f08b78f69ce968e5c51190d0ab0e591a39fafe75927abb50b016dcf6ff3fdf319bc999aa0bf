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

// src/plugins/stripExports.ts
var stripExports_exports = {};
__export(stripExports_exports, {
  default: () => stripExports_default
});
module.exports = __toCommonJS(stripExports_exports);
var t = __toESM(require("@umijs/bundler-utils/compiled/babel/types"));
var stripExports_default = () => {
  return {
    visitor: {
      Program: {
        enter(path, { opts }) {
          const expressions = path.get("body");
          const exports = (opts == null ? void 0 : opts.exports) || [];
          expressions.forEach((exp) => {
            if (!(t.isExportNamedDeclaration(exp) || t.isExportDefaultDeclaration(exp)))
              return;
            handleExportsIndividual(exp);
            handleExportsList(exp);
            handleExportsDefault(exp);
          });
          function handleExportsIndividual(path2) {
            if (!path2.node)
              return;
            if (!t.isExportNamedDeclaration(path2))
              return;
            if (!path2.get("declaration").node)
              return;
            const declaration = path2.get("declaration");
            if (t.isVariableDeclaration(declaration)) {
              const variables = declaration.get("declarations");
              variables.forEach((variable) => {
                exports.includes(variable.get("id.name").node) && variable.remove();
              });
            } else {
              exports.includes(declaration.get("id.name").node) && declaration.remove();
            }
          }
          function handleExportsList(path2) {
            if (!path2.node)
              return;
            if (!t.isExportNamedDeclaration(path2))
              return;
            const specifiers = path2.get("specifiers");
            if (!specifiers || specifiers.length === 0)
              return;
            specifiers.forEach((specifier) => {
              if (exports.includes(specifier.get("exported.name").node))
                specifier.remove();
            });
            if (path2.get("specifiers").length === 0)
              path2.remove();
          }
          function handleExportsDefault(path2) {
            if (!path2.node)
              return;
            if (!t.isExportDefaultDeclaration(path2))
              return;
            const declaration = path2.get("declaration");
            if (!declaration.node)
              return;
            if (exports.includes(declaration.get("name").node))
              declaration.remove();
          }
        },
        exit(path) {
          path.scope.crawl();
          const expressions = path.get("body");
          expressions.forEach((exp) => {
            if (!t.isImportDeclaration(exp))
              return;
            const specifiers = exp.get("specifiers");
            specifiers.forEach((s) => {
              const name = s.get("local.name").node;
              if (!s.scope.getBinding(name).referenced)
                s.remove();
            });
            if (exp.get("specifiers").length === 0)
              exp.remove();
          });
        }
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
