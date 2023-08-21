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

// src/babelPlugins/awaitImport/awaitImport.ts
var awaitImport_exports = {};
__export(awaitImport_exports, {
  default: () => awaitImport_default
});
module.exports = __toCommonJS(awaitImport_exports);
var t = __toESM(require("@umijs/bundler-utils/compiled/babel/types"));
var import_checkMatch = require("./checkMatch");
function awaitImport_default() {
  return {
    pre() {
      this.cache = /* @__PURE__ */ new Map();
    },
    post(state) {
      var _a, _b;
      const { cache } = this;
      if (cache.has(state.opts.filename)) {
        (_b = (_a = this.opts).onCollect) == null ? void 0 : _b.call(_a, {
          file: state.opts.filename,
          data: cache.get(state.opts.filename)
        });
      }
    },
    visitor: {
      Program: {
        exit(path, { opts }) {
          let index = path.node.body.length - 1;
          while (index >= 0) {
            const node = path.node.body[index];
            if (t.isImportDeclaration(node)) {
              const { isMatch, replaceValue } = (0, import_checkMatch.checkMatch)({
                // @ts-ignore
                cache: this.cache,
                value: node.source.value,
                opts,
                path
              });
              if (isMatch) {
                node.source.value = replaceValue;
              }
            } else if (t.isExportAllDeclaration(node)) {
              const { isMatch, replaceValue } = (0, import_checkMatch.checkMatch)({
                // @ts-ignore
                cache: this.cache,
                value: node.source.value,
                opts,
                path
              });
              if (isMatch) {
                node.source.value = replaceValue;
              }
            } else if (t.isExportNamedDeclaration(node) && node.source) {
              const { isMatch, replaceValue } = (0, import_checkMatch.checkMatch)({
                // @ts-ignore
                cache: this.cache,
                value: node.source.value,
                opts,
                path
              });
              if (isMatch) {
                node.source.value = replaceValue;
              }
            }
            index -= 1;
          }
        }
      },
      CallExpression: {
        exit(path, { opts }) {
          const { node } = path;
          if (t.isImport(node.callee) && node.arguments.length === 1 && node.arguments[0].type === "StringLiteral") {
            const { isMatch, replaceValue } = (0, import_checkMatch.checkMatch)({
              // @ts-ignore
              cache: this.cache,
              value: node.arguments[0].value,
              opts,
              path
            });
            if (isMatch) {
              node.arguments[0] = t.stringLiteral(replaceValue);
            }
          }
        }
      }
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
