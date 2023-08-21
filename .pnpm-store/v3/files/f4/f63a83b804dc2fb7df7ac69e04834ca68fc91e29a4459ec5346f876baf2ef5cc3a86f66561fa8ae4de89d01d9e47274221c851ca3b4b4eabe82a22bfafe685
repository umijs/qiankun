var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/cli.ts
var import_esbuild = __toESM(require("@umijs/bundler-utils/compiled/esbuild"));
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_fs = require("fs");
var import_path = require("path");
var import_build = require("./build");
var args = (0, import_utils.yParser)(process.argv.slice(2), {});
var command = args._[0];
var cwd = process.cwd();
var entry = (0, import_utils.tryPaths)([
  (0, import_path.join)(cwd, "src/index.tsx"),
  (0, import_path.join)(cwd, "src/index.ts"),
  (0, import_path.join)(cwd, "index.tsx"),
  (0, import_path.join)(cwd, "index.ts")
]);
var config = {};
var configFile = (0, import_path.join)(cwd, args.config || "config.ts");
import_utils.register.register({
  implementor: import_esbuild.default
});
import_utils.register.clearFiles();
if ((0, import_fs.existsSync)(configFile)) {
  config = require(configFile).default;
}
Object.assign(config, args);
if (command === "build") {
  (async () => {
    process.env.NODE_ENV = "production";
    (0, import_assert.default)(entry, `Build failed: entry not found.`);
    try {
      await (0, import_build.build)({
        config,
        cwd,
        entry: {
          [getEntryKey(entry)]: entry
        }
      });
    } catch (e) {
      console.error(e);
    }
  })();
} else {
  error(`Unsupported command ${command}.`);
}
function error(msg) {
  console.error(import_utils.chalk.red(msg));
}
function getEntryKey(path) {
  return (0, import_path.basename)(path, (0, import_path.extname)(path));
}
