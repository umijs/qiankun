"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

var _getMenuFromRoutes = require("../getMenuFromRoutes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
          resGroupMeta = _objectWithoutProperties(_item$meta$group2, ["title", "path"]);

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
 * generate redirects for missing group index routes & legacy route paths
 */


var _default = routes => {
  const redirects = [];
  routes.forEach(route => {
    var _route$meta$group, _route$meta$nav;

    // add index route redirect for group which has no index route
    if (((_route$meta$group = route.meta.group) === null || _route$meta$group === void 0 ? void 0 : _route$meta$group.path) && !redirects[route.meta.group.path] && !routes.some(item => item.path === route.meta.group.path)) {
      const _route$meta$group2 = route.meta.group,
            title = _route$meta$group2.title,
            path = _route$meta$group2.path,
            resGroupMeta = _objectWithoutProperties(_route$meta$group2, ["title", "path"]);

      redirects[path] = {
        path,
        meta: _objectSpread({}, resGroupMeta),
        exact: true,
        redirect: routes.filter(item => {
          var _item$meta$group3;

          return ((_item$meta$group3 = item.meta.group) === null || _item$meta$group3 === void 0 ? void 0 : _item$meta$group3.path) === route.meta.group.path;
        }).sort(_getMenuFromRoutes.menuSorter)[0].path
      };
    } // add index route redirect for nav which has no index route


    if (((_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.path) && !redirects[route.meta.nav.path] && !routes.some(item => item.path === route.meta.nav.path)) {
      const _route$meta$nav2 = route.meta.nav,
            title = _route$meta$nav2.title,
            path = _route$meta$nav2.path,
            resNavMeta = _objectWithoutProperties(_route$meta$nav2, ["title", "path"]);

      const validRoutes = routes.filter(item => {
        var _item$meta$nav;

        return ((_item$meta$nav = item.meta.nav) === null || _item$meta$nav === void 0 ? void 0 : _item$meta$nav.path) === route.meta.nav.path;
      }); // concat valid groups to find redirect to ensure the redirect order same as menu order

      const validGroups = genValidGroups(validRoutes);
      redirects[path] = {
        path,
        meta: _objectSpread({}, resNavMeta),
        exact: true,
        redirect: validRoutes.concat(validGroups).sort(_getMenuFromRoutes.menuSorter)[0].path
      };
    } // append redirect for legacy path


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

exports.default = _default;