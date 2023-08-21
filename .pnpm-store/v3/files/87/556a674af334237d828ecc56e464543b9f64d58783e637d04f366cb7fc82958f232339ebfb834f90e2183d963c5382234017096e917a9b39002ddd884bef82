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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/types.ts
var types_exports = {};
__export(types_exports, {
  ApplyPluginsType: () => ApplyPluginsType,
  ConfigChangeType: () => ConfigChangeType,
  EnableBy: () => EnableBy,
  Env: () => Env,
  PluginType: () => PluginType,
  ServiceStage: () => ServiceStage
});
module.exports = __toCommonJS(types_exports);
var Env = /* @__PURE__ */ ((Env2) => {
  Env2["development"] = "development";
  Env2["production"] = "production";
  Env2["test"] = "test";
  return Env2;
})(Env || {});
var PluginType = /* @__PURE__ */ ((PluginType2) => {
  PluginType2["preset"] = "preset";
  PluginType2["plugin"] = "plugin";
  return PluginType2;
})(PluginType || {});
var ServiceStage = /* @__PURE__ */ ((ServiceStage2) => {
  ServiceStage2[ServiceStage2["uninitialized"] = 0] = "uninitialized";
  ServiceStage2[ServiceStage2["init"] = 1] = "init";
  ServiceStage2[ServiceStage2["initPresets"] = 2] = "initPresets";
  ServiceStage2[ServiceStage2["initPlugins"] = 3] = "initPlugins";
  ServiceStage2[ServiceStage2["resolveConfig"] = 4] = "resolveConfig";
  ServiceStage2[ServiceStage2["collectAppData"] = 5] = "collectAppData";
  ServiceStage2[ServiceStage2["onCheck"] = 6] = "onCheck";
  ServiceStage2[ServiceStage2["onStart"] = 7] = "onStart";
  ServiceStage2[ServiceStage2["runCommand"] = 8] = "runCommand";
  return ServiceStage2;
})(ServiceStage || {});
var ConfigChangeType = /* @__PURE__ */ ((ConfigChangeType2) => {
  ConfigChangeType2["reload"] = "reload";
  ConfigChangeType2["regenerateTmpFiles"] = "regenerateTmpFiles";
  return ConfigChangeType2;
})(ConfigChangeType || {});
var ApplyPluginsType = /* @__PURE__ */ ((ApplyPluginsType2) => {
  ApplyPluginsType2["add"] = "add";
  ApplyPluginsType2["modify"] = "modify";
  ApplyPluginsType2["event"] = "event";
  return ApplyPluginsType2;
})(ApplyPluginsType || {});
var EnableBy = /* @__PURE__ */ ((EnableBy2) => {
  EnableBy2["register"] = "register";
  EnableBy2["config"] = "config";
  return EnableBy2;
})(EnableBy || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApplyPluginsType,
  ConfigChangeType,
  EnableBy,
  Env,
  PluginType,
  ServiceStage
});
