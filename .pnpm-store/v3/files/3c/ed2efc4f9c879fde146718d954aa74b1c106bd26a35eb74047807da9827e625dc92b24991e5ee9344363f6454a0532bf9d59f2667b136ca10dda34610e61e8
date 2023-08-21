"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * set title for route
 */
var title = function title(routes) {
  return routes.map(route => {
    // generate title if user did not configured
    if (!route.meta.title && typeof route.component === 'string') {
      var _route$meta$group, _route$meta$nav;
      let clearFilename = _path().default.parse(route.component).name;
      // discard locale for component filename
      if (route.meta.locale) {
        clearFilename = clearFilename.replace(`.${route.meta.locale}`, '');
      }
      // button => Button
      route.meta.title = clearFilename.replace(/^[a-z]/, s => s.toUpperCase());
      // use nav or group name for index route
      if (clearFilename === 'index' && (((_route$meta$group = route.meta.group) === null || _route$meta$group === void 0 ? void 0 : _route$meta$group.title) || ((_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.title))) {
        var _route$meta$group2, _route$meta$nav2;
        route.meta.title = ((_route$meta$group2 = route.meta.group) === null || _route$meta$group2 === void 0 ? void 0 : _route$meta$group2.title) || ((_route$meta$nav2 = route.meta.nav) === null || _route$meta$nav2 === void 0 ? void 0 : _route$meta$nav2.title);
      }
    }
    // apply meta title for umi routes
    route.title = this.options.title ? `${route.meta.title} - ${this.options.title}` : route.meta.title;
    return route;
  });
};
exports.default = title;