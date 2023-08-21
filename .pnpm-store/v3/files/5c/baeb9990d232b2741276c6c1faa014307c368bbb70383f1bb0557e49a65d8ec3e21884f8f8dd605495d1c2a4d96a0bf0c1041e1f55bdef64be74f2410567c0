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

// src/logger.ts
var logger_exports = {};
__export(logger_exports, {
  debug: () => debug,
  error: () => error,
  event: () => event,
  fatal: () => fatal,
  getLatestLogFilePath: () => getLatestLogFilePath,
  info: () => info,
  prefixes: () => prefixes,
  profile: () => profile,
  ready: () => ready,
  wait: () => wait,
  warn: () => warn
});
module.exports = __toCommonJS(logger_exports);
var import_path = require("path");
var import_chalk = __toESM(require("../compiled/chalk"));
var import_fs_extra = __toESM(require("../compiled/fs-extra"));
var import_pkg_up = require("../compiled/pkg-up");
var import_importLazy = require("./importLazy");
var enableFSLogger = process.env.FS_LOGGER !== "none" && !process.versions.webcontainer;
var profilers = {};
var loggerDir = findLoggerDir();
var loggerPath = (0, import_path.join)(loggerDir, "umi.log");
var prefixes = {
  wait: import_chalk.default.cyan("wait") + "  -",
  error: import_chalk.default.red("error") + " -",
  fatal: import_chalk.default.red("fatal") + " -",
  warn: import_chalk.default.yellow("warn") + "  -",
  ready: import_chalk.default.green("ready") + " -",
  info: import_chalk.default.cyan("info") + "  -",
  event: import_chalk.default.magenta("event") + " -",
  debug: import_chalk.default.gray("debug") + " -",
  profile: import_chalk.default.blue("profile") + " -"
};
var pinoModule = (0, import_importLazy.importLazy)(require.resolve("pino"));
var logger;
if (enableFSLogger) {
  const pino = pinoModule.default;
  import_fs_extra.default.mkdirpSync(loggerDir);
  const customLevels = {
    ready: 31,
    event: 32,
    wait: 55,
    // 虽然这里设置了 debug 为 30，但日志中还是 20，符合预期
    // 这里不加会不生成到 umi.log，transport 的 level 配置没有生效，原因不明
    debug: 30
  };
  logger = pino(
    {
      customLevels
    },
    pino.transport({
      targets: [
        {
          target: require.resolve("pino/file"),
          options: {
            destination: loggerPath
          },
          level: "trace"
        }
      ]
    })
  );
} else {
  logger = {};
  Object.keys(prefixes).forEach((key) => {
    logger[key] = () => {
    };
  });
}
function wait(...message) {
  console.log(prefixes.wait, ...message);
  logger.wait(message[0]);
}
function error(...message) {
  console.error(prefixes.error, ...message);
  logger.error(message[0]);
}
function warn(...message) {
  console.warn(prefixes.warn, ...message);
  logger.warn(message[0]);
}
function ready(...message) {
  console.log(prefixes.ready, ...message);
  logger.ready(message[0]);
}
function info(...message) {
  console.log(prefixes.info, ...message);
  logger.info(message[0]);
}
function event(...message) {
  console.log(prefixes.event, ...message);
  logger.event(message[0]);
}
function debug(...message) {
  if (process.env.DEBUG) {
    console.log(prefixes.debug, ...message);
  }
  logger.debug(message[0]);
}
function fatal(...message) {
  console.error(prefixes.fatal, ...message);
  logger.fatal(message[0]);
}
function profile(id, ...message) {
  if (process.env.IS_UMI_BUILD_WORKER && !process.env.DEBUG) {
    return;
  }
  if (!profilers[id]) {
    profilers[id] = {
      startTime: Date.now()
    };
    console.log(prefixes.profile, import_chalk.default.green(id), ...message);
    return;
  }
  const endTime = Date.now();
  const { startTime } = profilers[id];
  console.log(
    prefixes.profile,
    import_chalk.default.green(id),
    `Completed in ${import_chalk.default.cyan(`${endTime - startTime}ms`)}`,
    ...message
  );
  delete profilers[id];
}
function getLatestLogFilePath() {
  return enableFSLogger ? loggerPath : null;
}
function findLoggerDir() {
  let baseDir = process.cwd();
  const pkg = (0, import_pkg_up.pkgUpSync)({ cwd: baseDir });
  if (pkg) {
    baseDir = (0, import_path.dirname)(pkg);
  }
  return (0, import_path.join)(baseDir, "node_modules/.cache/logger");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  debug,
  error,
  event,
  fatal,
  getLatestLogFilePath,
  info,
  prefixes,
  profile,
  ready,
  wait,
  warn
});
