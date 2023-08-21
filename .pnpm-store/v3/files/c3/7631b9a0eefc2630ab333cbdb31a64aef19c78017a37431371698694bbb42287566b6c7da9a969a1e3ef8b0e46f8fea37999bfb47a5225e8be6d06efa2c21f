"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addHtmlSuffix = addHtmlSuffix;
exports.default = getMenuFromRoutes;
exports.menuSorter = menuSorter;
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
var _context = _interopRequireDefault(require("../context"));
var _locale = require("./decorator/locale");
const _excluded = ["title", "path"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function isValidMenuRoutes(route) {
  return Boolean(route.path) && !route.redirect;
}
function isSameRouteComponent(fragment, component, includes, paths) {
  return includes.some(dir => {
    const cwdRelativeComponentPath = (0, _slash().default)(_path().default.relative(paths.cwd, _path().default.join(paths.absTmpPath, 'core', component)));
    return cwdRelativeComponentPath.indexOf((0, _slash().default)(_path().default.join(dir, fragment))) > -1;
  });
}
function convertUserMenuChilds(menus, routes, locale, isDefaultLocale, includes, paths) {
  return menus.map(menu => {
    // copy menu config to avoid modify user config
    const menuItem = Object.assign({}, menu);
    if (menuItem.path && locale && !isDefaultLocale && !(0, _locale.isPrefixLocalePath)(menuItem.path, locale)) {
      menuItem.path = (0, _locale.addLocalePrefix)(menu.path, locale);
    }
    if (menuItem.children) {
      menuItem.children = menu.children.map(child => {
        let childItem = child;
        if (typeof child === 'string') {
          var _route$meta;
          const route = routes.find(routeItem => {
            var _routeItem$meta, _routeItem$meta2;
            if (routeItem.component && isSameRouteComponent(child, routeItem.component, includes, paths) && (((_routeItem$meta = routeItem.meta) === null || _routeItem$meta === void 0 ? void 0 : _routeItem$meta.locale) === locale || !((_routeItem$meta2 = routeItem.meta) === null || _routeItem$meta2 === void 0 ? void 0 : _routeItem$meta2.locale) && isDefaultLocale)) {
              return true;
            }
          });
          if (!route) {
            throw new Error(`[dumi]: cannot find ${child} from menu config, please make sure file exist!`);
          }
          childItem = {
            path: route.path,
            title: route.meta.title
          };
          route.meta = route.meta || {};
          // update original route group
          route.meta.group = _objectSpread(_objectSpread({
            title: menu.title
          }, menu.path ? {
            path: menu.path
          } : {}), ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.group) || {});
        }
        return childItem;
      });
    }
    return menuItem;
  });
}
function addHtmlSuffix(oPath) {
  var _ctx$umi, _ctx$umi$config;
  if (oPath && ((_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : (_ctx$umi$config = _ctx$umi.config) === null || _ctx$umi$config === void 0 ? void 0 : _ctx$umi$config.exportStatic) && _context.default.umi.config.exportStatic.htmlSuffix) {
    return `${oPath}.html`;
  }
  return oPath;
}
function menuSorter(prev, next) {
  var _prev$meta, _next$meta;
  const prevOrder = typeof ((_prev$meta = prev.meta) === null || _prev$meta === void 0 ? void 0 : _prev$meta.order) === 'number' ? prev.meta.order : Infinity;
  const nextOrder = typeof ((_next$meta = next.meta) === null || _next$meta === void 0 ? void 0 : _next$meta.order) === 'number' ? next.meta.order : Infinity;
  // compare order meta config first
  const metaOrder = prevOrder === nextOrder ? 0 : prevOrder - nextOrder;
  // last compare path ASCII
  const pathOrder = prev.path > next.path ? 1 : -1;
  return metaOrder || pathOrder;
}
function getMenuFromRoutes(routes, opts, paths) {
  // temporary menus mapping
  const localeMenusMapping = {};
  const _opts$menus = opts.menus,
    userMenus = _opts$menus === void 0 ? {} : _opts$menus;
  const localeMenus = {};
  routes.forEach(route => {
    if (isValidMenuRoutes(route)) {
      var _route$meta$nav, _route$meta2;
      const group = route.meta.group;
      const nav = addHtmlSuffix((_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.path) || '*';
      const locale = route.meta.locale || opts.locales[0][0];
      const menuItem = {
        path: route.path,
        title: route.meta.title,
        meta: {}
      };
      if (typeof ((_route$meta2 = route.meta) === null || _route$meta2 === void 0 ? void 0 : _route$meta2.order) === 'number') {
        menuItem.meta.order = route.meta.order;
      }
      if (group === null || group === void 0 ? void 0 : group.path) {
        var _localeMenusMapping$l, _localeMenusMapping$l2, _localeMenusMapping$l3, _localeMenusMapping$l4, _localeMenusMapping$l5, _localeMenusMapping$l6, _localeMenusMapping$l7, _localeMenusMapping$l8, _localeMenusMapping$l9, _localeMenusMapping$l10;
        const title = group.title,
          groupPath = group.path,
          meta = _objectWithoutProperties(group, _excluded);
        const groupKey = !group.__fallback && addHtmlSuffix(groupPath) || title;
        const isGroupPathValid = !(group.__fallback && opts.mode === 'site');
        // group route items by group path & locale
        localeMenusMapping[locale] = _objectSpread(_objectSpread({}, localeMenusMapping[locale] || {}), {}, {
          [nav]: _objectSpread(_objectSpread({}, ((_localeMenusMapping$l = localeMenusMapping[locale]) === null || _localeMenusMapping$l === void 0 ? void 0 : _localeMenusMapping$l[nav]) || {}), {}, {
            [groupKey]: _objectSpread(_objectSpread({
              title
            }, isGroupPathValid ? {
              path: ((_localeMenusMapping$l2 = localeMenusMapping[locale]) === null || _localeMenusMapping$l2 === void 0 ? void 0 : (_localeMenusMapping$l3 = _localeMenusMapping$l2[nav]) === null || _localeMenusMapping$l3 === void 0 ? void 0 : (_localeMenusMapping$l4 = _localeMenusMapping$l3[groupKey]) === null || _localeMenusMapping$l4 === void 0 ? void 0 : _localeMenusMapping$l4.path) || groupPath
            } : {}), {}, {
              meta: _objectSpread(_objectSpread({}, ((_localeMenusMapping$l5 = localeMenusMapping[locale]) === null || _localeMenusMapping$l5 === void 0 ? void 0 : (_localeMenusMapping$l6 = _localeMenusMapping$l5[nav]) === null || _localeMenusMapping$l6 === void 0 ? void 0 : (_localeMenusMapping$l7 = _localeMenusMapping$l6[groupKey]) === null || _localeMenusMapping$l7 === void 0 ? void 0 : _localeMenusMapping$l7.meta) || {}), meta),
              children: (((_localeMenusMapping$l8 = localeMenusMapping[locale]) === null || _localeMenusMapping$l8 === void 0 ? void 0 : (_localeMenusMapping$l9 = _localeMenusMapping$l8[nav]) === null || _localeMenusMapping$l9 === void 0 ? void 0 : (_localeMenusMapping$l10 = _localeMenusMapping$l9[groupKey]) === null || _localeMenusMapping$l10 === void 0 ? void 0 : _localeMenusMapping$l10.children) || []).concat(menuItem)
            })
          })
        });
      } else {
        var _localeMenusMapping$l11;
        // push route to top-level if it has not group
        localeMenusMapping[locale] = _objectSpread(_objectSpread({}, localeMenusMapping[locale] || {}), {}, {
          [nav]: _objectSpread(_objectSpread({}, ((_localeMenusMapping$l11 = localeMenusMapping[locale]) === null || _localeMenusMapping$l11 === void 0 ? void 0 : _localeMenusMapping$l11[nav]) || {}), {}, {
            [menuItem.path]: menuItem
          })
        });
      }
    }
  });
  // deconstruct locale menus from mapping to array
  Object.keys(localeMenusMapping).forEach(locale => {
    Object.keys(localeMenusMapping[locale]).forEach(nav => {
      const menus = Object.values(localeMenusMapping[locale][nav]).map(menu => {
        var _menu$children, _menu$children2;
        // discard children if current menu only has 1 children
        if (((_menu$children = menu.children) === null || _menu$children === void 0 ? void 0 : _menu$children.length) === 1 && menu.title === menu.children[0].title) {
          var _menu$children$0$meta;
          if (typeof ((_menu$children$0$meta = menu.children[0].meta) === null || _menu$children$0$meta === void 0 ? void 0 : _menu$children$0$meta.order) === 'number') {
            menu.meta.order = menu.children[0].meta.order;
          }
          // fallback to child path if menu has not path
          menu.path = menu.path || menu.children[0].path;
          menu.children = [];
        }
        // sort child menu items
        (_menu$children2 = menu.children) === null || _menu$children2 === void 0 ? void 0 : _menu$children2.sort(menuSorter);
        return menu;
      });
      // discard empty locale
      if (menus.length) {
        localeMenus[locale] = _objectSpread(_objectSpread({}, localeMenus[locale] || {}), {}, {
          // sort top-level menu items
          [nav]: menus.sort(menuSorter)
        });
      }
    });
  });
  // merge user menus
  Object.keys(userMenus).forEach(navPath => {
    [...opts.locales].reverse().some(locale => {
      const isDefaultLocale = locale[0] === opts.locales[0][0];
      const localePrefix = isDefaultLocale ? '/' : `/${locale[0]}`;
      if (localePrefix === '/' || (0, _locale.isPrefixLocalePath)(navPath, locale[0])) {
        const convertedMenus = convertUserMenuChilds(userMenus[navPath], routes, locale[0], isDefaultLocale, opts.resolve.includes, paths);
        localeMenus[locale[0]][navPath] = convertedMenus;
        // update original nav index page
        routes.forEach(route => {
          if (route.path === (0, _slash().default)(_path().default.join(localePrefix, navPath)) && route.redirect && (convertedMenus[0].path || convertedMenus[0].children)) {
            route.redirect = convertedMenus[0].path || convertedMenus[0].children[0].path;
          }
        });
        return true;
      }
    });
  });
  return localeMenus;
}