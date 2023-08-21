var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Env: () => import_types.Env,
  Generator: () => import_generator.Generator,
  GeneratorType: () => import_generator.GeneratorType,
  IAdd: () => import_types.IAdd,
  IEvent: () => import_types.IEvent,
  IModify: () => import_types.IModify,
  IRoute: () => import_types.IRoute
});
module.exports = __toCommonJS(src_exports);
__reExport(src_exports, require("./config/config"), module.exports);
__reExport(src_exports, require("./route/route"), module.exports);
var import_generator = require("./service/generator");
__reExport(src_exports, require("./service/pluginAPI"), module.exports);
__reExport(src_exports, require("./service/service"), module.exports);
var import_types = require("./types");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Env,
  Generator,
  GeneratorType,
  IAdd,
  IEvent,
  IModify,
  IRoute
});
