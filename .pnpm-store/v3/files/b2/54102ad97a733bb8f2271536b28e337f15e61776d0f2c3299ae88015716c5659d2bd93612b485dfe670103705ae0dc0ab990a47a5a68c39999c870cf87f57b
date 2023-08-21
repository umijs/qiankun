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

// src/printHelp.ts
var printHelp_exports = {};
__export(printHelp_exports, {
  exit: () => exit,
  runtime: () => runtime
});
module.exports = __toCommonJS(printHelp_exports);
var logger = __toESM(require("./logger"));
var FEEDBACK_MESSAGE = "如果你需要进交流群，请访问 https://fb.umijs.org 。";
function exit() {
  const loggerPath = logger.getLatestLogFilePath();
  if (loggerPath) {
    logger.fatal("A complete log of this run can be found in:");
    logger.fatal(loggerPath);
  }
  logger.fatal(
    "Consider reporting a GitHub issue on https://github.com/umijs/umi/issues"
  );
  const binFile = process.argv[1];
  const isUmi = binFile.endsWith("bin/umi.js");
  const isMax = binFile.endsWith("bin/max.js");
  if (process.env.FATAL_GUIDE_MESSAGE !== "none" && (isUmi || isMax)) {
    logger.fatal(FEEDBACK_MESSAGE);
  }
  if (process.env.FATAL_GUIDE_MESSAGE && process.env.FATAL_GUIDE_MESSAGE !== "none") {
    logger.fatal(process.env.FATAL_GUIDE_MESSAGE);
  }
}
function runtime(e) {
  logger.error(e);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  exit,
  runtime
});
