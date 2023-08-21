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

// src/utils/depMatch.ts
var depMatch_exports = {};
__export(depMatch_exports, {
  cleanCache: () => cleanCache,
  es5ImcompatibleVersionsToPkg: () => es5ImcompatibleVersionsToPkg,
  isMatch: () => isMatch
});
module.exports = __toCommonJS(depMatch_exports);
var import_utils = require("@umijs/utils");
var import_path = require("path");
var import_pkgUpContainsName = require("./pkgUpContainsName");
var cache = /* @__PURE__ */ new Map();
function cleanCache() {
  cache.clear();
}
function isMatch(opts) {
  const dir = (0, import_utils.winPath)((0, import_path.dirname)(opts.path));
  if (cache.has(dir)) {
    return !!cache.get(dir);
  } else {
    const pkgPath = (0, import_pkgUpContainsName.pkgUpContainsName)(opts.path);
    let ret;
    if (!pkgPath) {
      ret = false;
    } else {
      const { name, version } = require(pkgPath);
      if (opts.pkgs[name]) {
        ret = opts.pkgs[name].some((v) => {
          return import_utils.semver.satisfies(version, v);
        });
      } else {
        ret = false;
      }
    }
    cache.set(dir, ret);
    return ret;
  }
}
function es5ImcompatibleVersionsToPkg() {
  const {
    config: { "es5-imcompatible-versions": config }
  } = require("es5-imcompatible-versions/package.json");
  return Object.keys(config).reduce((memo, key) => {
    memo[key] = /* versions */
    Object.keys(config[key]);
    return memo;
  }, {});
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cleanCache,
  es5ImcompatibleVersionsToPkg,
  isMatch
});
