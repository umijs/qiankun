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

// src/babelPlugins/awaitImport/parseSpecifiers.ts
var parseSpecifiers_exports = {};
__export(parseSpecifiers_exports, {
  parseSpecifiers: () => parseSpecifiers
});
module.exports = __toCommonJS(parseSpecifiers_exports);
var t = __toESM(require("@umijs/bundler-utils/compiled/babel/types"));
var DEFAULT = "default";
function parseSpecifiers(specifiers) {
  return specifiers.reduce(
    (memo, s) => {
      if (t.isImportDefaultSpecifier(s)) {
        memo.properties.push(t.objectProperty(t.identifier(DEFAULT), s.local));
      } else if (t.isExportDefaultSpecifier(s)) {
        memo.properties.push(
          t.objectProperty(t.identifier(DEFAULT), s.exported)
        );
      } else if (t.isExportSpecifier(s)) {
        if (t.isIdentifier(s.exported, { name: DEFAULT })) {
          memo.defaultIdentifier = s.local.name;
          memo.properties.push(t.objectProperty(s.local, s.local));
        } else {
          memo.properties.push(t.objectProperty(s.local, s.exported));
        }
      } else if (t.isImportNamespaceSpecifier(s)) {
        memo.namespaceIdentifier = s.local;
      } else {
        memo.properties.push(t.objectProperty(s.imported, s.local));
      }
      return memo;
    },
    { properties: [], namespaceIdentifier: null, defaultIdentifier: null }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseSpecifiers
});
