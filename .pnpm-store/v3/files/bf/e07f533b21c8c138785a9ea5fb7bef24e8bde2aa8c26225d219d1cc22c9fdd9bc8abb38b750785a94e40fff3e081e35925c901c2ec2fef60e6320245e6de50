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

// src/plugins/dynamicImportNode.ts
var dynamicImportNode_exports = {};
__export(dynamicImportNode_exports, {
  default: () => dynamicImportNode_default
});
module.exports = __toCommonJS(dynamicImportNode_exports);
var import_template = __toESM(require("@umijs/bundler-utils/compiled/babel/template"));
var t = __toESM(require("@umijs/bundler-utils/compiled/babel/types"));
function getImportSource(callNode) {
  const importArguments = callNode.arguments;
  const [importPath] = importArguments;
  const isString2 = t.isStringLiteral(importPath) || t.isTemplateLiteral(importPath);
  if (isString2) {
    t.removeComments(importPath);
    return importPath;
  }
  return t.templateLiteral(
    [
      t.templateElement({ raw: "", cooked: "" }),
      t.templateElement({ raw: "", cooked: "" }, true)
    ],
    importArguments
  );
}
var builders = {
  static: (0, import_template.default)("Promise.resolve().then(() => INTEROP(require(SOURCE)))"),
  dynamic: (0, import_template.default)("Promise.resolve(SOURCE).then(s => INTEROP(require(s)))")
};
function isString(node) {
  return t.isStringLiteral(node) || t.isTemplateLiteral(node) && node.expressions.length === 0;
}
var dynamicImportNode_default = () => {
  const visited = /* @__PURE__ */ new WeakSet();
  return {
    visitor: {
      Import(path) {
        if (visited) {
          if (visited.has(path)) {
            return;
          }
          visited.add(path);
        }
        const SOURCE = getImportSource(path.parent);
        const builder = isString(SOURCE) ? builders.static : builders.dynamic;
        const newImport = builder({
          SOURCE,
          INTEROP: path.hub.addHelper("interopRequireWildcard")
        });
        path.parentPath.replaceWith(newImport);
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
