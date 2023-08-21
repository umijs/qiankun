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

// src/route/routesConfig.ts
var routesConfig_exports = {};
__export(routesConfig_exports, {
  getConfigRoutes: () => getConfigRoutes
});
module.exports = __toCommonJS(routesConfig_exports);
var import_assert = __toESM(require("assert"));
function getConfigRoutes(opts) {
  const memo = { ret: {}, id: 1 };
  transformRoutes({
    routes: opts.routes,
    parentId: void 0,
    memo,
    onResolveComponent: opts.onResolveComponent
  });
  return memo.ret;
}
function transformRoutes(opts) {
  opts.routes.forEach((route) => {
    transformRoute({
      route,
      parentId: opts.parentId,
      memo: opts.memo,
      onResolveComponent: opts.onResolveComponent
    });
  });
}
function transformRoute(opts) {
  (0, import_assert.default)(
    !opts.route.children,
    "children is not allowed in route props, use routes instead."
  );
  const id = String(opts.memo.id++);
  const { routes, component, wrappers, ...routeProps } = opts.route;
  let absPath = opts.route.path;
  if ((absPath == null ? void 0 : absPath.charAt(0)) !== "/") {
    const parentAbsPath = opts.parentId ? opts.memo.ret[opts.parentId].absPath.replace(/\/+$/, "/") : "/";
    absPath = endsWithStar(parentAbsPath) ? parentAbsPath : ensureWithSlash(parentAbsPath, absPath);
  }
  opts.memo.ret[id] = {
    ...routeProps,
    path: opts.route.path,
    ...component ? {
      file: opts.onResolveComponent ? opts.onResolveComponent(component) : component
    } : {},
    parentId: opts.parentId,
    id
  };
  if (absPath) {
    opts.memo.ret[id].absPath = absPath;
  }
  if (wrappers == null ? void 0 : wrappers.length) {
    let parentId = opts.parentId;
    let path = opts.route.path;
    let layout = opts.route.layout;
    wrappers.forEach((wrapper) => {
      const { id: id2 } = transformRoute({
        route: {
          path,
          component: wrapper,
          isWrapper: true,
          ...layout === false ? { layout: false } : {}
        },
        parentId,
        memo: opts.memo,
        onResolveComponent: opts.onResolveComponent
      });
      parentId = id2;
      path = endsWithStar(path) ? "*" : "";
    });
    opts.memo.ret[id].parentId = parentId;
    opts.memo.ret[id].path = path;
    opts.memo.ret[id].originPath = opts.route.path;
  }
  if (opts.route.routes) {
    transformRoutes({
      routes: opts.route.routes,
      parentId: id,
      memo: opts.memo,
      onResolveComponent: opts.onResolveComponent
    });
  }
  return { id };
}
function endsWithStar(str) {
  return str.endsWith("*");
}
function ensureWithSlash(left, right) {
  if (!(right == null ? void 0 : right.length) || right === "/") {
    return left;
  }
  return `${left.replace(/\/+$/, "")}/${right.replace(/^\/+/, "")}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getConfigRoutes
});
