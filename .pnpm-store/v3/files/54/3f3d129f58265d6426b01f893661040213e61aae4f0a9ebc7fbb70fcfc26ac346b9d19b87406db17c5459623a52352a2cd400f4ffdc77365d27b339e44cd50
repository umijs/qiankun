"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getMenuFromRoutes = require("./getMenuFromRoutes");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var _default = (routes, opts, userCustomNavs) => {
  const localeNavs = {};
  let customNavs = userCustomNavs || {};
  if (opts.mode !== 'site') {
    return {};
  }
  // group navs by locale
  routes.forEach(route => {
    var _route$meta;
    if ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.nav) {
      var _localeNavs$locale;
      const locale = route.meta.locale || opts.locales[0][0];
      const navPath = (0, _getMenuFromRoutes.addHtmlSuffix)(route.meta.nav.path);
      localeNavs[locale] = _objectSpread(_objectSpread({}, localeNavs[locale] || {}), {}, {
        [navPath]: _objectSpread(_objectSpread(_objectSpread({}, ((_localeNavs$locale = localeNavs[locale]) === null || _localeNavs$locale === void 0 ? void 0 : _localeNavs$locale[navPath]) || {}), route.meta.nav || {}), {}, {
          path: navPath
        })
      });
    }
  });
  // deconstruct locale navs from mapping to array
  Object.keys(localeNavs).forEach(key => {
    localeNavs[key] = Object.values(localeNavs[key]).sort((prev, next) => {
      const prevOrder = typeof prev.order === 'number' ? prev.order : Infinity;
      const nextOrder = typeof next.order === 'number' ? next.order : Infinity;
      // compare order meta config first
      const metaOrder = prevOrder === nextOrder ? 0 : prevOrder - nextOrder;
      // last compare path length
      const pathOrder = prev.path.length - next.path.length;
      // then compare title ASCII
      // eslint-disable-next-line
      const ascOrder = prev.title > next.title ? 1 : prev.title < next.title ? -1 : 0;
      return metaOrder || pathOrder || ascOrder;
    });
  });
  // merge user's navs & generated navs
  if (Array.isArray(customNavs)) {
    customNavs = Object.keys(localeNavs).reduce((result, locale) => {
      result[locale] = customNavs;
      return result;
    }, {});
  }
  Object.keys(localeNavs).forEach(locale => {
    if (customNavs[locale]) {
      localeNavs[locale] = customNavs[locale].reduce(
      // concat original navs if navs has empty item from user
      (result, nav) => result.concat(nav || localeNavs[locale]), []);
    }
  });
  return localeNavs;
};
exports.default = _default;