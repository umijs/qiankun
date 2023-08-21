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

// src/installDeps.ts
var installDeps_exports = {};
__export(installDeps_exports, {
  default: () => installDeps_default
});
module.exports = __toCommonJS(installDeps_exports);
var import_fs = require("fs");
var import_path = require("path");
var execa = __toESM(require("../compiled/execa"));
function installDeps({
  opts,
  cwd = process.cwd()
}) {
  const { dependencies, devDependencies } = opts;
  const useYarn = (0, import_fs.existsSync)((0, import_path.join)(cwd, "yarn.lock")) || (0, import_fs.existsSync)((0, import_path.join)(process.cwd(), "yarn.lock"));
  const usePnpm = (0, import_fs.existsSync)((0, import_path.join)(cwd, "pnpm-workspace.yaml")) || (0, import_fs.existsSync)((0, import_path.join)(process.cwd(), "pnpm-workspace.yaml"));
  const runNpm = useYarn ? "yarn" : usePnpm ? "pnpm" : "npm";
  const install = useYarn || usePnpm ? "add" : "install";
  const devTag = useYarn || usePnpm ? "--D" : "--save-dev";
  const installDependencies = (deps, npmStr, insStr, devStr) => {
    console.log(`${npmStr} install dependencies packages:${deps.join(" ")}`);
    execa.execaCommandSync(
      [npmStr, insStr, devStr].concat(deps).filter((n) => n).join(" "),
      {
        encoding: "utf8",
        cwd,
        env: {
          ...process.env
        },
        stderr: "pipe",
        stdout: "pipe"
      }
    );
    console.log(`install dependencies packages success`);
  };
  if (dependencies) {
    installDependencies(dependencies, runNpm, install);
  }
  if (devDependencies) {
    installDependencies(devDependencies, runNpm, install, devTag);
  }
}
var installDeps_default = installDeps;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
