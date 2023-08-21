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

// src/route/defineRoutes.ts
var defineRoutes_exports = {};
__export(defineRoutes_exports, {
  defineRoutes: () => defineRoutes
});
module.exports = __toCommonJS(defineRoutes_exports);
var import_utils = require("./utils");
function defineRoutes(callback) {
  const routes = /* @__PURE__ */ Object.create(null);
  const parentRoutes = [];
  const defineRoute = (opts) => {
    opts.options = opts.options || {};
    const parentRoute = parentRoutes.length > 0 ? parentRoutes[parentRoutes.length - 1] : null;
    const parentId = parentRoute == null ? void 0 : parentRoute.id;
    const parentAbsPath = parentRoute == null ? void 0 : parentRoute.absPath;
    const absPath = [parentAbsPath, opts.path].join("/");
    const route = {
      // 1. root index route path: '/'
      // 2. nested children route path
      //    - dir
      //      - some.ts  -> 'some'
      //      - index.ts -> ''
      //    - dir.tsx    -> '/dir'
      path: absPath === "/" ? "/" : opts.path,
      id: (0, import_utils.createRouteId)(opts.file),
      parentId,
      file: opts.file,
      absPath
    };
    routes[route.id] = route;
    if (opts.children) {
      parentRoutes.push(route);
      opts.children();
      parentRoutes.pop();
    }
  };
  callback(defineRoute);
  return routes;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineRoutes
});
