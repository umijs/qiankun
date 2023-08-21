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

// src/utils/resolveUtils.ts
var resolveUtils_exports = {};
__export(resolveUtils_exports, {
  resolveFromContexts: () => resolveFromContexts
});
module.exports = __toCommonJS(resolveUtils_exports);
var import_enhanced_resolve = __toESM(require("enhanced-resolve"));
var ORDERED_MAIN_FIELDS = ["browser", "module", "main"];
var SUPPORTED_EXTS = [".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"];
var EXPORTS_FIELDS = ["exports"];
var browserResolver = import_enhanced_resolve.default.create({
  mainFields: ORDERED_MAIN_FIELDS,
  extensions: SUPPORTED_EXTS,
  exportsFields: EXPORTS_FIELDS,
  conditionNames: ["browser", "import"],
  symlinks: false
});
var esmResolver = import_enhanced_resolve.default.create({
  mainFields: ORDERED_MAIN_FIELDS,
  extensions: SUPPORTED_EXTS,
  exportsFields: EXPORTS_FIELDS,
  conditionNames: ["module"],
  symlinks: false
});
var cjsResolver = import_enhanced_resolve.default.create({
  mainFields: ORDERED_MAIN_FIELDS,
  extensions: SUPPORTED_EXTS,
  exportsFields: EXPORTS_FIELDS,
  conditionNames: ["require", "node"],
  symlinks: false
});
async function resolveWith(resolver, context, path) {
  return new Promise((resolve2, reject) => {
    resolver(
      context,
      path,
      (err, result) => err ? reject(err) : resolve2(result)
    );
  });
}
async function tryResolvers(rs, context, path) {
  let result = "";
  let lastError = null;
  for (const r of rs) {
    try {
      result = await resolveWith(r, context, path);
      return result;
    } catch (e) {
      lastError = e;
    }
  }
  if (!result) {
    throw lastError || Error(`can't resolve ${path} from ${context}`);
  }
  return result;
}
async function resolve(context, path) {
  return await tryResolvers(
    [browserResolver, esmResolver, cjsResolver],
    context,
    path
  );
}
async function resolveFromContexts(contexts, path) {
  for (const context of contexts) {
    try {
      return await resolve(context, path);
    } catch (e) {
    }
  }
  throw new Error(`Can't resolve ${path} from ${contexts.join(", ")}`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  resolveFromContexts
});
