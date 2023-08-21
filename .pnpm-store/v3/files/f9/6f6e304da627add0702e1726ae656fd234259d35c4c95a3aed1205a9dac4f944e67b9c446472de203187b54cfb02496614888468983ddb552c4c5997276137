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

// src/server/ws.ts
var ws_exports = {};
__export(ws_exports, {
  createWebSocketServer: () => createWebSocketServer
});
module.exports = __toCommonJS(ws_exports);
var import_utils = require("@umijs/utils");
var import_ws = __toESM(require("../../compiled/ws"));
function createWebSocketServer(server) {
  const wss = new import_ws.default.Server({
    noServer: true
  });
  server.on("upgrade", (req, socket, head) => {
    if (req.headers["sec-websocket-protocol"] === "webpack-hmr") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });
  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "connected" }));
  });
  wss.on("error", (e) => {
    if (e.code !== "EADDRINUSE") {
      console.error(
        import_utils.chalk.red(`WebSocket server error:
${e.stack || e.message}`)
      );
    }
  });
  return {
    send(message) {
      wss.clients.forEach((client) => {
        if (client.readyState === import_ws.default.OPEN) {
          client.send(message);
        }
      });
    },
    wss,
    close() {
      wss.close();
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createWebSocketServer
});
