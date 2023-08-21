"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getMenuFromRoutes = require("../getMenuFromRoutes");
const _excluded = ["title", "path"],
  _excluded2 = ["title", "path"],
  _excluded3 = ["title", "path"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * 获取分组菜单的数组
 * @param validRoutes
 */
const genValidGroups = validRoutes => validRoutes.reduce((result, item) => {
  var _item$meta$group;
  if ((_item$meta$group = item.meta.group) === null || _item$meta$group === void 0 ? void 0 : _item$meta$group.path) {
    const _item$meta$group2 = item.meta.group,
      title = _item$meta$group2.title,
      path = _item$meta$group2.path,
      resGroupMeta = _objectWithoutProperties(_item$meta$group2, _excluded);
    result.push({
      title,
      path,
      meta: _objectSpread(_objectSpread({}, resGroupMeta), {}, {
        nav: item.meta.nav
      })
    });
  }
  return result;
}, []);
/**
 * get first menu route in current nav/menu
 * @param childRoutes   nav/menu child routes
 * @param customMenus   user custom menus
 */
function getFirstMenuInParent(childRoutes, customMenus) {
  var _customMenus$0$childr;
  let firstMenuInParent;
  const firstMenuItem = (customMenus === null || customMenus === void 0 ? void 0 : (_customMenus$0$childr = customMenus[0].children) === null || _customMenus$0$childr === void 0 ? void 0 : _customMenus$0$childr[0]) || (customMenus === null || customMenus === void 0 ? void 0 : customMenus[0]);
  // find first if user configured the first menu item for current nav/menu
  if (typeof firstMenuItem === 'string') {
    // find first menu route by string menu item, like src/Button/index.md
    firstMenuInParent = childRoutes.find(route => {
      var _route$component;
      if ((_route$component = route.component) === null || _route$component === void 0 ? void 0 : _route$component.includes(firstMenuItem)) {
        return route;
      }
    });
  } else if (firstMenuItem === null || firstMenuItem === void 0 ? void 0 : firstMenuItem.path) {
    // use menu item config as first menu route if it is object
    firstMenuInParent = firstMenuItem;
  } else if (!firstMenuInParent) {
    // use first child routes of nav/menu as menu route by default
    firstMenuInParent = childRoutes.sort(_getMenuFromRoutes.menuSorter)[0];
  }
  return firstMenuInParent;
}
/**
 * generate redirects for missing group index routes & legacy route paths
 */
var redirect = function redirect(routes) {
  const redirects = [];
  routes.forEach(route => {
    var _route$meta$group, _route$meta$nav;
    // add index route redirect for group which has no index route
    if (((_route$meta$group = route.meta.group) === null || _route$meta$group === void 0 ? void 0 : _route$meta$group.path) && !redirects[route.meta.group.path] && !routes.some(item => item.path === route.meta.group.path)) {
      var _Object$values$reduce;
      const _route$meta$group2 = route.meta.group,
        title = _route$meta$group2.title,
        path = _route$meta$group2.path,
        resGroupMeta = _objectWithoutProperties(_route$meta$group2, _excluded2);
      const validRoutes = routes.filter(item => {
        var _item$meta$group3;
        return ((_item$meta$group3 = item.meta.group) === null || _item$meta$group3 === void 0 ? void 0 : _item$meta$group3.path) === route.meta.group.path;
      });
      const validItems = (_Object$values$reduce = Object.values(this.options.menus || {}).reduce((r, i) => r.concat(i), []).find(item => item.path === path)) === null || _Object$values$reduce === void 0 ? void 0 : _Object$values$reduce.children;
      redirects[path] = {
        path,
        meta: _objectSpread({}, resGroupMeta),
        exact: true,
        redirect: getFirstMenuInParent(validRoutes, validItems).path
      };
    }
    // add index route redirect for nav which has no index route
    if (((_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.path) && !redirects[route.meta.nav.path] && !routes.some(item => item.path === route.meta.nav.path)) {
      var _this$options$menus;
      const _route$meta$nav2 = route.meta.nav,
        title = _route$meta$nav2.title,
        path = _route$meta$nav2.path,
        resNavMeta = _objectWithoutProperties(_route$meta$nav2, _excluded3);
      const validRoutes = routes.filter(item => {
        var _item$meta$nav;
        return ((_item$meta$nav = item.meta.nav) === null || _item$meta$nav === void 0 ? void 0 : _item$meta$nav.path) === route.meta.nav.path;
      });
      // concat valid groups to find redirect to ensure the redirect order same as menu order
      const validGroups = genValidGroups(validRoutes);
      redirects[path] = {
        path,
        meta: _objectSpread({}, resNavMeta),
        exact: true,
        redirect: getFirstMenuInParent(validRoutes.concat(validGroups), (_this$options$menus = this.options.menus) === null || _this$options$menus === void 0 ? void 0 : _this$options$menus[path]).path
      };
    }
    // append redirect for legacy path
    if (route.meta.legacy) {
      redirects[route.meta.legacy] = {
        path: route.meta.legacy,
        exact: true,
        redirect: route.path
      };
    }
  });
  return routes.concat(Object.values(redirects));
};
exports.default = redirect;