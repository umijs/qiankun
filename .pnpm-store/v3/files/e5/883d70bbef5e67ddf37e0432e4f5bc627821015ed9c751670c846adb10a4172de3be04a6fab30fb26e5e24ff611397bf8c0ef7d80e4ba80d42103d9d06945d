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

// src/route/routesConvention.ts
var routesConvention_exports = {};
__export(routesConvention_exports, {
  getConventionRoutes: () => getConventionRoutes
});
module.exports = __toCommonJS(routesConvention_exports);
var import_utils = require("@umijs/utils");
var import_fs = require("fs");
var import_path = require("path");
var import_defineRoutes = require("./defineRoutes");
var import_utils2 = require("./utils");
function getConventionRoutes(opts) {
  const files = {};
  if (!((0, import_fs.existsSync)(opts.base) && (0, import_fs.statSync)(opts.base).isDirectory())) {
    return {};
  }
  visitFiles({
    dir: opts.base,
    visitor: (file) => {
      const routeId = (0, import_utils2.createRouteId)(file);
      if ((0, import_utils2.isRouteModuleFile)({ file: (0, import_utils.winPath)(file), exclude: opts.exclude })) {
        files[routeId] = (0, import_utils.winPath)(file);
      }
    }
  });
  const routeIds = Object.keys(files).sort(import_utils2.byLongestFirst);
  function defineNestedRoutes(defineRoute, parentId) {
    const childRouteIds = routeIds.filter(
      (id) => (0, import_utils2.findParentRouteId)(routeIds, id) === parentId
    );
    for (let routeId of childRouteIds) {
      let routePath = createRoutePath(
        parentId ? routeId.slice(parentId.length + 1) : routeId
      );
      defineRoute({
        path: routePath,
        file: `${opts.prefix || ""}${files[routeId]}`,
        children() {
          defineNestedRoutes(defineRoute, routeId);
        }
      });
    }
  }
  return (0, import_defineRoutes.defineRoutes)(defineNestedRoutes);
}
function visitFiles(opts) {
  opts.baseDir = opts.baseDir || opts.dir;
  for (let filename of (0, import_fs.readdirSync)(opts.dir)) {
    let file = (0, import_path.resolve)(opts.dir, filename);
    let stat = (0, import_fs.lstatSync)(file);
    if (stat.isDirectory()) {
      visitFiles({ ...opts, dir: file });
    } else if (stat.isFile() && [".tsx", ".ts", ".js", ".jsx", ".md", ".mdx", ".vue"].includes(
      (0, import_path.extname)(file)
    )) {
      opts.visitor((0, import_path.relative)(opts.baseDir, file));
    }
  }
}
function createRoutePath(routeId) {
  let path = routeId.replace(/^\$$/, "*").replace(/(\/|\.)\$$/, "/*").replace(/\$/g, ":").replace(/\./g, "/");
  path = /(^|\/)index\/index$/.test(path) ? path.replace(/\/index$/, "") : path;
  path = /\b\/?(?<!:)index$/.test(path) ? path.replace(/\/?index$/, "") : path;
  path = /\b\/?README$/.test(path) ? path.replace(/\/?README$/, "") : path;
  return path;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getConventionRoutes
});
