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

// src/route/routeUtils.ts
var routeUtils_exports = {};
__export(routeUtils_exports, {
  addParentRoute: () => addParentRoute
});
module.exports = __toCommonJS(routeUtils_exports);
function addParentRoute(opts) {
  if (opts.addToAll) {
    for (const id of Object.keys(opts.routes)) {
      if (opts.routes[id].parentId === void 0 && (!opts.test || opts.test(opts.routes[id]))) {
        opts.routes[id].parentId = opts.target.id;
      }
    }
  } else if (opts.id) {
    if (!opts.test || opts.test(opts.routes[opts.id])) {
      opts.routes[opts.id].parentId = opts.target.id;
    }
  } else {
    throw new Error(
      `addParentRoute failed, opts.addToAll or opts.id must be supplied.`
    );
  }
  opts.routes[opts.target.id] = opts.target;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addParentRoute
});
