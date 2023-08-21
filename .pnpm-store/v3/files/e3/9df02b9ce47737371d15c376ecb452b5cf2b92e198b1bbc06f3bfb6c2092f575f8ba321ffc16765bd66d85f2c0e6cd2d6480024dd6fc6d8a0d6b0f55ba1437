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

// src/babelPlugins/awaitImport/checkMatch.ts
var checkMatch_exports = {};
__export(checkMatch_exports, {
  checkMatch: () => checkMatch,
  getPath: () => getPath
});
module.exports = __toCommonJS(checkMatch_exports);
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_path = require("path");
var import_isExternals = require("./isExternals");
var RE_NODE_MODULES = /node_modules/;
function isUmiLocalDev(path) {
  const rootPath = (0, import_utils.isLocalDev)();
  if (rootPath) {
    const winP = (0, import_utils.winPath)(path);
    const pkgP = (0, import_utils.winPath)((0, import_path.join)(rootPath, "./packages"));
    const libP = (0, import_utils.winPath)((0, import_path.join)(rootPath, "./libs"));
    return winP.startsWith(pkgP) || winP.startsWith(libP);
  } else {
    return false;
  }
}
function genUnMatchLibsRegex(libs) {
  if (!libs) {
    return null;
  }
  const deps = libs.map((lib) => {
    if (typeof lib === "string") {
      return `^${lib}$`;
    } else if (lib instanceof RegExp) {
      return lib.source;
    }
  });
  return deps.length ? new RegExp(deps.join("|")) : null;
}
function checkMatch({
  value,
  path,
  opts,
  isExportAll,
  depth,
  cache,
  filename
}) {
  var _a;
  let isMatch;
  let replaceValue = "";
  depth = depth || 1;
  (0, import_assert.default)(
    depth <= 10,
    `endless loop detected in checkMatch, please check your alias config.`
  );
  opts = opts || {};
  const remoteName = opts.remoteName || "mf";
  value = value.replace(/^@fs\//, "/");
  const unMatchLibsRegex = genUnMatchLibsRegex(opts.unMatchLibs);
  const mfPathInitial = `${remoteName}/`;
  if (
    // unMatch specified libs
    (unMatchLibsRegex == null ? void 0 : unMatchLibsRegex.test(value)) || // do not match bundler-webpack/client/client/client.js
    value.includes("client/client/client.js") || // don't match dynamic path
    // e.g. @umijs/deps/compiled/babel/svgr-webpack.js?-svgo,+titleProp,+ref!./umi.svg
    (0, import_utils.winPath)(value).includes("babel/svgr-webpack") || // don't match webpack loader
    // e.g. !!dumi-raw-code-loader!/path/to/VerticalProgress/index.module.less?dumi-raw-code
    value.startsWith("!!") || // don't match externals
    (0, import_isExternals.isExternals)({ value, externals: opts.externals }) || // relative import
    value.startsWith(".")
  ) {
    isMatch = false;
  } else if (value.startsWith(mfPathInitial)) {
    isMatch = true;
  } else if ((0, import_path.isAbsolute)(value)) {
    isMatch = RE_NODE_MODULES.test(value) || isUmiLocalDev(value);
  } else {
    const aliasedPath = import_utils.aliasUtils.getAliasValue({
      imported: value,
      alias: opts.alias || {}
    });
    if (aliasedPath) {
      return checkMatch({
        value: aliasedPath,
        path,
        opts,
        isExportAll,
        depth: depth + 1,
        cache,
        filename
      });
    } else {
      isMatch = true;
    }
  }
  if (isMatch && isExportAll) {
    isMatch = !!(opts.exportAllMembers && value in opts.exportAllMembers);
  }
  if (isMatch) {
    if (value.startsWith(mfPathInitial)) {
      replaceValue = value;
      value = value.replace(mfPathInitial, "");
    } else {
      replaceValue = `${remoteName}/${(0, import_utils.winPath)(value)}`;
    }
  }
  const file = (path == null ? void 0 : path.hub.file.opts.filename) || filename;
  (_a = opts.onTransformDeps) == null ? void 0 : _a.call(opts, {
    sourceValue: value,
    replaceValue,
    isMatch,
    file
  });
  if (cache) {
    let mod;
    if (cache.has(file)) {
      mod = cache.get(file);
    } else {
      mod = {
        matched: /* @__PURE__ */ new Set(),
        unMatched: /* @__PURE__ */ new Set()
      };
      cache.set(file, mod);
    }
    mod[isMatch ? "matched" : "unMatched"].add({
      sourceValue: value,
      replaceValue,
      file
    });
  }
  return {
    isMatch,
    replaceValue,
    value
  };
}
function getPath({ value, opts }) {
  const alias = opts.alias || {};
  for (const key of Object.keys(alias)) {
    if (value.startsWith(key)) {
      return value.replace(key, alias[key]);
    }
  }
  return value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkMatch,
  getPath
});
