"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.prefix = prefix;
/**
 * global route prefix in integrate mode
 */
const INTEGRATE_ROUTE_PREFIX = '/~docs';
function prefix(oPath) {
  return `${INTEGRATE_ROUTE_PREFIX}${oPath}`.replace(/\/$/, '');
}
/**
 * add route prefix when integrate dumi in a Umi project
 */
var integrate = function integrate(routes) {
  if (this.options.isIntegrate) {
    routes.forEach(route => {
      var _route$meta, _route$meta2;
      route.path = prefix(route.path);
      if (this.options.mode === 'site' && ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.nav)) {
        route.meta.nav.path = prefix(route.meta.nav.path);
      }
      if ((_route$meta2 = route.meta) === null || _route$meta2 === void 0 ? void 0 : _route$meta2.group) {
        route.meta.group.path = prefix(route.meta.group.path);
      }
    });
  }
  return routes;
};
exports.default = integrate;