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

// src/proxy.ts
var proxy_exports = {};
__export(proxy_exports, {
  createProxy: () => createProxy
});
module.exports = __toCommonJS(proxy_exports);
var import_http_proxy_middleware = require("../compiled/http-proxy-middleware");
var import_assert = __toESM(require("assert"));
function createProxy(proxy, app) {
  const proxyArr = Array.isArray(proxy) ? proxy : proxy.target ? [proxy] : Object.keys(proxy).map((key) => {
    return {
      ...proxy[key],
      context: key
    };
  });
  proxyArr.forEach((proxy2) => {
    let middleware;
    if (proxy2.target) {
      (0, import_assert.default)(typeof proxy2.target === "string", "proxy.target must be string");
      (0, import_assert.default)(proxy2.context, "proxy.context must be supplied");
      middleware = (0, import_http_proxy_middleware.createProxyMiddleware)(proxy2.context, {
        ...proxy2,
        onProxyReq(proxyReq, req, res) {
          var _a, _b;
          if (proxyReq.getHeader("origin")) {
            proxyReq.setHeader("origin", ((_a = new URL(proxy2.target)) == null ? void 0 : _a.href) || "");
          }
          (_b = proxy2.onProxyReq) == null ? void 0 : _b.call(proxy2, proxyReq, req, res, proxy2);
        },
        // Add x-real-url in response header
        onProxyRes(proxyRes, req, res) {
          var _a, _b;
          proxyRes.headers["x-real-url"] = ((_a = new URL(req.url || "", proxy2.target)) == null ? void 0 : _a.href) || "";
          (_b = proxy2.onProxyRes) == null ? void 0 : _b.call(proxy2, proxyRes, req, res);
        }
      });
    }
    app.use((req, res, next) => {
      const bypassUrl = typeof proxy2.bypass === "function" ? proxy2.bypass(req, res, proxy2) : null;
      if (typeof bypassUrl === "string") {
        req.url = bypassUrl;
        return next();
      } else if (bypassUrl === false) {
        return res.end(404);
      } else if ((bypassUrl === null || bypassUrl === void 0) && middleware) {
        return middleware(req, res, next);
      } else {
        next();
      }
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createProxy
});
