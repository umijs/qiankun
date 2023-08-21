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

// src/service/env.ts
var env_exports = {};
__export(env_exports, {
  loadEnv: () => loadEnv
});
module.exports = __toCommonJS(env_exports);
var import_fs = require("fs");
var import_path = require("path");
var import_dotenv = require("../../compiled/dotenv");
var import_dotenv_expand = require("../../compiled/dotenv-expand");
function loadEnv(opts) {
  const files = [
    (0, import_path.join)(opts.cwd, opts.envFile),
    (0, import_path.join)(opts.cwd, `${opts.envFile}.local`)
  ];
  for (const file of files) {
    if (!(0, import_fs.existsSync)(file))
      continue;
    const parsed = (0, import_dotenv.parse)((0, import_fs.readFileSync)(file)) || {};
    (0, import_dotenv_expand.expand)({ parsed, ignoreProcessEnv: true });
    for (const key of Object.keys(parsed)) {
      process.env[key] = parsed[key];
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadEnv
});
