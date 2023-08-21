"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
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
function _deepmerge() {
  const data = _interopRequireDefault(require("deepmerge"));
  _deepmerge = function _deepmerge() {
    return data;
  };
  return data;
}
var _locale = require("./locale");
var _getFrontMatter = _interopRequireDefault(require("../getFrontMatter"));
const _excluded = ["path"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function replaceLocaleForPath(pathname, prevLocale, nextLocale) {
  const oPath = prevLocale ? (0, _locale.discardLocalePrefix)(pathname, prevLocale) : pathname;
  return (0, _locale.addLocalePrefix)(oPath, nextLocale).replace(/\/$/, '');
}
/**
 * generate fallback routes for missing locales
 */
var fallback = function fallback(routes) {
  const defaultLocale = this.options.locales[0][0];
  const fallbacks = [];
  // for missing locale routes
  this.data.locales.forEach(locale => {
    const localePrefix = locale === defaultLocale ? '/' : `/${locale}`;
    // fallback root route path to README.md for each locale
    if (!routes.some(route => route.path === localePrefix)) {
      const localeFileAddon = locale === defaultLocale ? '' : `.${locale}`;
      const readmePath = (0, _slash().default)(_path().default.join(this.umi.paths.cwd, `README${localeFileAddon}.md`));
      if (_fs().default.existsSync(readmePath)) {
        const component = `./README${localeFileAddon}.md`;
        const frontMatter = (0, _getFrontMatter.default)(readmePath);
        routes.unshift({
          path: localePrefix,
          component,
          exact: true,
          meta: _objectSpread({
            locale,
            order: -Infinity
          }, frontMatter),
          title: frontMatter.title
        });
      }
    }
    // do not deal with default locale for remaining non-default-locale routes
    if (localePrefix !== '/') {
      routes.forEach(_ref => {
        let routePath = _ref.path,
          routeProps = _objectWithoutProperties(_ref, _excluded);
        const currentLocalePath = replaceLocaleForPath(routePath, routeProps.meta.locale, locale);
        // deal with every default route (without locale prefix)
        if (!(0, _locale.isPrefixLocalePath)(routePath, locale) && !routes.some(route => route.path === currentLocalePath)) {
          var _fallbackRoute$meta$g, _fallbackRoute$meta$n;
          const fallbackRoute = (0, _deepmerge().default)({
            path: currentLocalePath
          }, routeProps);
          fallbackRoute.meta.locale = locale;
          // replace locale prefix for group path
          if ((_fallbackRoute$meta$g = fallbackRoute.meta.group) === null || _fallbackRoute$meta$g === void 0 ? void 0 : _fallbackRoute$meta$g.path) {
            var _fallbackRoute$meta$g2;
            fallbackRoute.meta.group.path = replaceLocaleForPath(fallbackRoute.meta.group.path, routeProps.meta.locale, locale);
            // correct group title from brother group route
            if ((_fallbackRoute$meta$g2 = fallbackRoute.meta.group) === null || _fallbackRoute$meta$g2 === void 0 ? void 0 : _fallbackRoute$meta$g2.title) {
              const brotherRoute = routes.find(route => {
                var _route$meta$group;
                return ((_route$meta$group = route.meta.group) === null || _route$meta$group === void 0 ? void 0 : _route$meta$group.path) === fallbackRoute.meta.group.path && route.meta.locale === fallbackRoute.meta.locale;
              });
              if (brotherRoute) {
                fallbackRoute.meta.group.title = brotherRoute.meta.group.title;
              }
            }
          }
          // replace locale prefix for nav path
          if ((_fallbackRoute$meta$n = fallbackRoute.meta.nav) === null || _fallbackRoute$meta$n === void 0 ? void 0 : _fallbackRoute$meta$n.path) {
            var _fallbackRoute$meta$n2;
            fallbackRoute.meta.nav.path = replaceLocaleForPath(fallbackRoute.meta.nav.path, routeProps.meta.locale, locale);
            // correct group title from brother group route
            if ((_fallbackRoute$meta$n2 = fallbackRoute.meta.nav) === null || _fallbackRoute$meta$n2 === void 0 ? void 0 : _fallbackRoute$meta$n2.title) {
              const brotherRoute = routes.find(route => {
                var _route$meta$nav;
                return ((_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.path) === fallbackRoute.meta.nav.path && route.meta.locale === fallbackRoute.meta.locale;
              });
              if (brotherRoute) {
                fallbackRoute.meta.nav.title = brotherRoute.meta.nav.title;
              }
            }
          }
          fallbacks.push(fallbackRoute);
        }
      });
    }
  });
  return routes.concat(fallbacks);
};
exports.default = fallback;