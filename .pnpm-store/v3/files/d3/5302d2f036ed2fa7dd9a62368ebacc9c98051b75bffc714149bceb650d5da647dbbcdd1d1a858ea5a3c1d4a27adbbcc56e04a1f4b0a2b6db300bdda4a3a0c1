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

// src/https.ts
var https_exports = {};
__export(https_exports, {
  createHttpsServer: () => createHttpsServer,
  resolveHttpsConfig: () => resolveHttpsConfig
});
module.exports = __toCommonJS(https_exports);
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_https = __toESM(require("https"));
var import_path = require("path");
var import_spdy = __toESM(require("spdy"));
var defaultHttpsHosts = [
  "localhost",
  "127.0.0.1"
];
async function resolveHttpsConfig(httpsConfig) {
  let { key, cert, hosts } = httpsConfig;
  if (key && cert) {
    return {
      key,
      cert
    };
  }
  try {
    await import_utils.execa.execa("mkcert", ["-help"]);
  } catch (e) {
    import_utils.logger.error("[HTTPS] The mkcert has not been installed.");
    import_utils.logger.info("[HTTPS] Please follow the guide to install manually.");
    switch (process.platform) {
      case "darwin":
        console.log(import_utils.chalk.green("$ brew install mkcert"));
        console.log(import_utils.chalk.gray("# If you use firefox, please install nss."));
        console.log(import_utils.chalk.green("$ brew install nss"));
        console.log(import_utils.chalk.green("$ mkcert -install"));
        break;
      case "win32":
        console.log(
          import_utils.chalk.green("Checkout https://github.com/FiloSottile/mkcert#windows")
        );
        break;
      case "linux":
        console.log(
          import_utils.chalk.green("Checkout https://github.com/FiloSottile/mkcert#linux")
        );
        break;
      default:
        break;
    }
    throw new Error(`[HTTPS] mkcert not found.`, { cause: e });
  }
  hosts = hosts || defaultHttpsHosts;
  key = (0, import_path.join)(__dirname, "umi.https.key.pem");
  cert = (0, import_path.join)(__dirname, "umi.https.pem");
  const json = (0, import_path.join)(__dirname, "umi.https.json");
  if (!(0, import_fs.existsSync)(key) || !(0, import_fs.existsSync)(cert) || !(0, import_fs.existsSync)(json) || !hasHostsChanged(json, hosts)) {
    import_utils.logger.wait("[HTTPS] Generating cert and key files...");
    await import_utils.execa.execa("mkcert", [
      "-cert-file",
      cert,
      "-key-file",
      key,
      ...hosts
    ]);
    (0, import_fs.writeFileSync)(json, JSON.stringify({ hosts }), "utf-8");
  }
  return {
    key,
    cert
  };
}
function hasHostsChanged(jsonFile, hosts) {
  try {
    const json = JSON.parse((0, import_fs.readFileSync)(jsonFile, "utf-8"));
    return json.hosts.join(",") === hosts.join(",");
  } catch (e) {
    return true;
  }
}
async function createHttpsServer(app, httpsConfig) {
  import_utils.logger.wait("[HTTPS] Starting service in https mode...");
  const { key, cert } = await resolveHttpsConfig(httpsConfig);
  const createServer = httpsConfig.http2 === false ? import_https.default.createServer : import_spdy.default.createServer;
  return createServer(
    {
      key: (0, import_fs.readFileSync)(key, "utf-8"),
      cert: (0, import_fs.readFileSync)(cert, "utf-8")
    },
    app
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createHttpsServer,
  resolveHttpsConfig
});
