"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * hide specific doc in production mode
 */
var hide = function hide(routes) {
  if (this.umi.env === 'production') {
    return routes.filter(route => route.meta.hide !== true);
  }
  return routes;
};
exports.default = hide;