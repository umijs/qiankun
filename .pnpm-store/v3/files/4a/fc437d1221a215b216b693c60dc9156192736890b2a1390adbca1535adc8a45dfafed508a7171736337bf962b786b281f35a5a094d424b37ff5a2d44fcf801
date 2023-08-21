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

// src/service/hook.ts
var hook_exports = {};
__export(hook_exports, {
  Hook: () => Hook
});
module.exports = __toCommonJS(hook_exports);
var import_assert = __toESM(require("assert"));
var Hook = class {
  constructor(opts) {
    (0, import_assert.default)(
      opts.key && opts.fn,
      `Invalid hook ${opts}, key and fn must supplied.`
    );
    this.plugin = opts.plugin;
    this.key = opts.key;
    this.fn = opts.fn;
    this.before = opts.before;
    this.stage = opts.stage || 0;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Hook
});
