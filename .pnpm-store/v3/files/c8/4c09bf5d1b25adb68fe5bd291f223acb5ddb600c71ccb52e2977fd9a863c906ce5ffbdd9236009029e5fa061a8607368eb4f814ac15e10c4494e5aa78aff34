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
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/npmClient.ts
var npmClient_exports = {};
__export(npmClient_exports, {
  NpmClientEnum: () => NpmClientEnum,
  getNpmClient: () => getNpmClient,
  installWithNpmClient: () => installWithNpmClient,
  npmClients: () => npmClients
});
module.exports = __toCommonJS(npmClient_exports);
var import_fs = require("fs");
var import_path = require("path");
var npmClients = ["pnpm", "tnpm", "cnpm", "yarn", "npm"];
var NpmClientEnum = /* @__PURE__ */ ((NpmClientEnum2) => {
  NpmClientEnum2["pnpm"] = "pnpm";
  NpmClientEnum2["tnpm"] = "tnpm";
  NpmClientEnum2["cnpm"] = "cnpm";
  NpmClientEnum2["yarn"] = "yarn";
  NpmClientEnum2["npm"] = "npm";
  return NpmClientEnum2;
})(NpmClientEnum || {});
var getNpmClient = (opts) => {
  const chokidarPkg = require("chokidar/package.json");
  if (chokidarPkg.__npminstall_done) {
    return chokidarPkg._resolved.includes("registry.npm.alibaba-inc.com") ? "tnpm" : "cnpm";
  }
  const chokidarPath = require.resolve("chokidar");
  if (chokidarPath.includes(".pnpm") || (0, import_fs.existsSync)((0, import_path.join)(opts.cwd, "node_modules", ".pnpm"))) {
    return "pnpm";
  }
  if ((0, import_fs.existsSync)((0, import_path.join)(opts.cwd, "yarn.lock")) || (0, import_fs.existsSync)((0, import_path.join)(opts.cwd, "node_modules", ".yarn-integrity"))) {
    return "yarn";
  }
  return "npm";
};
var installWithNpmClient = ({
  npmClient,
  cwd
}) => {
  const { sync } = require("../compiled/cross-spawn");
  const { NODE_ENV: _, ...env } = process.env;
  const npm = sync(npmClient, [npmClient === "yarn" ? "" : "install"], {
    stdio: "inherit",
    cwd,
    env
  });
  if (npm.error) {
    throw npm.error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NpmClientEnum,
  getNpmClient,
  installWithNpmClient,
  npmClients
});
