"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnableBy = exports.ApplyPluginsType = exports.ConfigChangeType = exports.ServiceStage = exports.PluginType = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PluginType;
exports.PluginType = PluginType;

(function (PluginType) {
  PluginType["preset"] = "preset";
  PluginType["plugin"] = "plugin";
})(PluginType || (exports.PluginType = PluginType = {}));

var ServiceStage;
exports.ServiceStage = ServiceStage;

(function (ServiceStage) {
  ServiceStage[ServiceStage["uninitialized"] = 0] = "uninitialized";
  ServiceStage[ServiceStage["constructor"] = 1] = "constructor";
  ServiceStage[ServiceStage["init"] = 2] = "init";
  ServiceStage[ServiceStage["initPresets"] = 3] = "initPresets";
  ServiceStage[ServiceStage["initPlugins"] = 4] = "initPlugins";
  ServiceStage[ServiceStage["initHooks"] = 5] = "initHooks";
  ServiceStage[ServiceStage["pluginReady"] = 6] = "pluginReady";
  ServiceStage[ServiceStage["getConfig"] = 7] = "getConfig";
  ServiceStage[ServiceStage["getPaths"] = 8] = "getPaths";
  ServiceStage[ServiceStage["run"] = 9] = "run";
})(ServiceStage || (exports.ServiceStage = ServiceStage = {}));

var ConfigChangeType;
exports.ConfigChangeType = ConfigChangeType;

(function (ConfigChangeType) {
  ConfigChangeType["reload"] = "reload";
  ConfigChangeType["regenerateTmpFiles"] = "regenerateTmpFiles";
})(ConfigChangeType || (exports.ConfigChangeType = ConfigChangeType = {}));

var ApplyPluginsType;
exports.ApplyPluginsType = ApplyPluginsType;

(function (ApplyPluginsType) {
  ApplyPluginsType["add"] = "add";
  ApplyPluginsType["modify"] = "modify";
  ApplyPluginsType["event"] = "event";
})(ApplyPluginsType || (exports.ApplyPluginsType = ApplyPluginsType = {}));

var EnableBy;
exports.EnableBy = EnableBy;

(function (EnableBy) {
  EnableBy["register"] = "register";
  EnableBy["config"] = "config";
})(EnableBy || (exports.EnableBy = EnableBy = {}));