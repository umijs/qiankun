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
function _slash() {
  const data = _interopRequireDefault(require("slash2"));
  _slash = function _slash() {
    return data;
  };
  return data;
}
var _locale = require("./locale");
var _nav = require("./nav");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * generate route group & update route path by group path
 */
var group = function group(routes) {
  const userCustomGroupTitles = {};
  routes.map(route => {
    var _route$meta$group, _route$meta$group2, _route$meta$nav, _route$meta$nav3, _route$meta$group3;
    const defaultLocale = this.options.locales[0][0];
    let groupPath = (_route$meta$group = route.meta.group) === null || _route$meta$group === void 0 ? void 0 : _route$meta$group.path;
    const groupTitle = (_route$meta$group2 = route.meta.group) === null || _route$meta$group2 === void 0 ? void 0 : _route$meta$group2.title;
    let clearPath = route.path;
    if ((_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.path) {
      // discard nav prefix (include locale prefix)
      clearPath = clearPath.replace(route.meta.nav.path, '');
    }
    if (route.meta.locale) {
      // discard locale prefix
      clearPath = (0, _locale.discardLocalePrefix)(clearPath, route.meta.locale);
    }
    // generate group if user did not customized group via frontmatter
    if (!groupPath) {
      const parsed = _path().default.parse(_path().default.relative(this.umi.paths.cwd, route.component));
      const isEntryMd = new RegExp(`^(index|readme)(\\.(${this.options.locales.map(([name]) => name).join('|')}))?$`, 'i').test(parsed.name);
      // only process nested route
      if (
      // at least 2-level path
      clearPath && clearPath.lastIndexOf('/') !== 0 ||
      // or component filename is the default entry
      parsed && clearPath.length > 1 && isEntryMd) {
        groupPath = clearPath.match(/^([^]+?)(\/[^/]+)?$/)[1];
        clearPath = clearPath.replace(groupPath, '');
      }
      // add fallback flag for menu generator
      // for support group different 1-level md by group.title, without group.path
      if ((!clearPath || !clearPath.lastIndexOf('/') && !isEntryMd) && groupTitle) {
        route.meta.group.__fallback = true;
      }
    }
    // set group path
    if (groupPath) {
      var _route$meta$nav2;
      route.meta.group = route.meta.group || {};
      // restore locale prefix or nav path
      if (((_route$meta$nav2 = route.meta.nav) === null || _route$meta$nav2 === void 0 ? void 0 : _route$meta$nav2.path) && !groupPath.startsWith(route.meta.nav.path)) {
        groupPath = `${route.meta.nav.path}${groupPath}`;
      } else if (route.meta.locale && route.meta.locale !== defaultLocale && !(0, _locale.isPrefixLocalePath)(groupPath, route.meta.locale)) {
        groupPath = (0, _locale.addLocalePrefix)(groupPath, route.meta.locale);
      }
      // save user cusomize group title, then will use for other route
      if (groupTitle) {
        userCustomGroupTitles[groupPath] = groupTitle;
      }
      route.meta.group.path = groupPath;
    } else if (groupTitle && (((_route$meta$nav3 = route.meta.nav) === null || _route$meta$nav3 === void 0 ? void 0 : _route$meta$nav3.path) || route.meta.locale)) {
      var _route$meta$nav4;
      // fallback group path if there only has group title (non-path type group)
      route.meta.group.path = ((_route$meta$nav4 = route.meta.nav) === null || _route$meta$nav4 === void 0 ? void 0 : _route$meta$nav4.path) || `/${route.meta.locale}`;
    }
    // correct route path by new group path
    if (((_route$meta$group3 = route.meta.group) === null || _route$meta$group3 === void 0 ? void 0 : _route$meta$group3.path) && route.path !== route.meta.group.path) {
      route.path = (0, _slash().default)(_path().default.join(route.meta.group.path, clearPath.match(/([^/]*)$/)[1]));
    }
    return route;
  });
  // fallback groups title
  routes.forEach(route => {
    var _route$meta$group4;
    if (((_route$meta$group4 = route.meta.group) === null || _route$meta$group4 === void 0 ? void 0 : _route$meta$group4.path) && !route.meta.group.title) {
      // use other same group path title first
      route.meta.group.title = userCustomGroupTitles[route.meta.group.path];
      // fallback use directory name
      if (!route.meta.group.title) {
        var _dirs$shift, _route$meta$nav5, _route$meta$nav6;
        // discard first level dir if there has nav title
        const dirs = (0, _nav.getRouteComponentDirs)(route.component, this).slice(route.meta.nav ? 1 : 0);
        route.meta.group.title =
        // use second dir as group title
        ((_dirs$shift = dirs.shift()) === null || _dirs$shift === void 0 ? void 0 : _dirs$shift.replace(/^[a-z]/, s => s.toUpperCase())) || ( // then use nav title
        (_route$meta$nav5 = route.meta.nav) === null || _route$meta$nav5 === void 0 ? void 0 : _route$meta$nav5.title) ||
        // fallback group title if there only has group path
        route.meta.group.path
        // discard nav prefix path or locale prefix path
        .replace(((_route$meta$nav6 = route.meta.nav) === null || _route$meta$nav6 === void 0 ? void 0 : _route$meta$nav6.path) || `/${route.meta.locale || ''}`, '')
        // discard start slash
        .replace(/^\//g, '')
        // upper case the first english letter
        .replace(/^[a-z]/, s => s.toUpperCase());
      }
    }
  });
  return routes;
};
exports.default = group;