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

// src/server/server.ts
var server_exports = {};
__export(server_exports, {
  createServer: () => createServer
});
module.exports = __toCommonJS(server_exports);
var import_bundler_utils = require("@umijs/bundler-utils");
var import_express = __toESM(require("@umijs/bundler-utils/compiled/express"));
var import_webpack = __toESM(require("@umijs/bundler-webpack/compiled/webpack"));
var import_utils = require("@umijs/utils");
var import_cors = __toESM(require("cors"));
var import_fs = require("fs");
var import_http = __toESM(require("http"));
var import_path = require("path");
var import_constants = require("../constants");
var import_ws = require("./ws");
async function createServer(opts) {
  const { webpackConfig, userConfig } = opts;
  const { proxy } = userConfig;
  const app = (0, import_express.default)();
  let ws;
  app.use(
    (0, import_cors.default)({
      origin: true,
      methods: ["GET", "HEAD", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
      credentials: true
    })
  );
  app.use(require("@umijs/bundler-webpack/compiled/compression")());
  app.use((req, res, next) => {
    const file = req.path;
    const filePath = (0, import_path.join)(opts.cwd, file);
    const ext = (0, import_path.extname)(filePath);
    if (ext === ".js" && (0, import_fs.existsSync)(filePath)) {
      import_utils.logger.info(
        "[dev]",
        `${file} is responded with ${filePath}, remove it to use original file`
      );
      res.sendFile(filePath);
    } else {
      next();
    }
  });
  if (opts.onBeforeMiddleware) {
    opts.onBeforeMiddleware(app);
  }
  (opts.beforeMiddlewares || []).forEach((m) => app.use(m));
  const configs = Array.isArray(webpackConfig) ? webpackConfig : [webpackConfig];
  const progresses = [];
  if (opts.onProgress) {
    configs.forEach((config) => {
      const progress = {
        percent: 0,
        status: "waiting",
        details: []
      };
      progresses.push(progress);
      config.plugins.push(
        new import_webpack.default.ProgressPlugin((percent, msg, ...details) => {
          progress.percent = percent;
          progress.status = msg;
          progress.details = details;
          opts.onProgress({ progresses });
        })
      );
    });
  }
  const compiler = (0, import_webpack.default)(configs);
  const webpackDevMiddleware = require("@umijs/bundler-webpack/compiled/webpack-dev-middleware");
  const compilerMiddleware = webpackDevMiddleware(compiler, {
    publicPath: userConfig.publicPath || "/",
    writeToDisk: userConfig.writeToDisk,
    stats: "none"
    // watchOptions: { ignored }
  });
  app.use(compilerMiddleware);
  let stats;
  let isFirstCompile = true;
  compiler.compilers.forEach(addHooks);
  function addHooks(compiler2) {
    compiler2.hooks.invalid.tap("server", () => {
      sendMessage(import_constants.MESSAGE_TYPE.invalid);
    });
    compiler2.hooks.done.tap("server", (_stats) => {
      var _a;
      stats = _stats;
      sendStats(getStats(stats));
      (_a = opts.onDevCompileDone) == null ? void 0 : _a.call(opts, {
        stats,
        isFirstCompile,
        ws,
        time: stats.endTime - stats.startTime
      });
      isFirstCompile = false;
    });
  }
  function sendStats(stats2, force, sender) {
    const shouldEmit = !force && stats2 && (!stats2.errors || stats2.errors.length === 0) && (!stats2.warnings || stats2.warnings.length === 0) && stats2.assets && stats2.assets.every((asset) => !asset.emitted);
    if (shouldEmit) {
      sendMessage(import_constants.MESSAGE_TYPE.stillOk, null, sender);
      return;
    }
    sendMessage(import_constants.MESSAGE_TYPE.hash, stats2.hash, sender);
    if (stats2.errors && stats2.errors.length > 0 || stats2.warnings && stats2.warnings.length > 0) {
      if (stats2.warnings && stats2.warnings.length > 0) {
        sendMessage(import_constants.MESSAGE_TYPE.warnings, stats2.warnings, sender);
      }
      if (stats2.errors && stats2.errors.length > 0) {
        sendMessage(import_constants.MESSAGE_TYPE.errors, stats2.errors, sender);
      }
    } else {
      sendMessage(import_constants.MESSAGE_TYPE.ok, null, sender);
    }
  }
  function getStats(stats2) {
    return stats2.toJson({
      all: false,
      hash: true,
      assets: true,
      warnings: true,
      errors: true,
      errorDetails: false
    });
  }
  function sendMessage(type, data, sender) {
    var _a;
    (_a = sender || ws) == null ? void 0 : _a.send(JSON.stringify({ type, data }));
  }
  if (proxy) {
    (0, import_bundler_utils.createProxy)(proxy, app);
  }
  (opts.afterMiddlewares || []).forEach((m) => {
    app.use(m.toString().includes(`{ compiler }`) ? m({ compiler }) : m);
  });
  app.use(
    require("@umijs/bundler-webpack/compiled/connect-history-api-fallback")({
      index: "/"
    })
  );
  app.use("/__umi_ping", (_, res) => {
    res.end("pong");
  });
  app.get("/", (_req, res, next) => {
    res.set("Content-Type", "text/html");
    const htmlPath = (0, import_path.join)(opts.cwd, "index.html");
    if ((0, import_fs.existsSync)(htmlPath)) {
      (0, import_fs.createReadStream)(htmlPath).on("error", next).pipe(res);
    } else {
      next();
    }
  });
  let server;
  if (userConfig.https) {
    const httpsOpts = userConfig.https;
    if (!httpsOpts.hosts) {
      httpsOpts.hosts = import_utils.lodash.uniq(
        [
          ...httpsOpts.hosts || [],
          // always add localhost, 127.0.0.1, ip and host
          "127.0.0.1",
          "localhost",
          opts.ip,
          opts.host !== "0.0.0.0" && opts.host
        ].filter(Boolean)
      );
    }
    server = await (0, import_bundler_utils.createHttpsServer)(app, httpsOpts);
  } else {
    server = import_http.default.createServer(app);
  }
  if (!server) {
    return null;
  }
  ws = (0, import_ws.createWebSocketServer)(server);
  ws.wss.on("connection", (socket) => {
    if (stats) {
      sendStats(getStats(stats), false, socket);
    }
  });
  const protocol = userConfig.https ? "https:" : "http:";
  const port = opts.port || 8e3;
  server.listen(port, () => {
    const banner = (0, import_utils.getDevBanner)(protocol, opts.host, port);
    console.log(banner.before);
    import_utils.logger.ready(banner.main);
    console.log(banner.after);
  });
  return server;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createServer
});
