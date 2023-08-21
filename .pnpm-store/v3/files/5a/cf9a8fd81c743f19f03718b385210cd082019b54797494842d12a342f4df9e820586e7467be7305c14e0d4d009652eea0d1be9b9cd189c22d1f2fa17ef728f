"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getRouteComponentDirs = getRouteComponentDirs;
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _utils() {
  const data = require("@umijs/utils");
  _utils = function _utils() {
    return data;
  };
  return data;
}
var _locale = require("./locale");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * get parent directories for route component
 * @param component   route component path
 * @param ctx         processor ctx
 */
function getRouteComponentDirs(component, ctx) {
  // remove ./ for include paths & component path
  const clearIncludes = ctx.options.resolve.includes.map(item => {
    var _ctx$umi;
    const relativePath = _path().default.isAbsolute(item) ? _path().default.relative(((_ctx$umi = ctx.umi) === null || _ctx$umi === void 0 ? void 0 : _ctx$umi.cwd) || process.cwd(), item) : item;
    return `${(0, _utils().winPath)(_path().default.join(relativePath))}/`;
  });
  const clearComponentPath = (0, _utils().winPath)(_path().default.join(component));
  // find include path for current component path
  const entryIncludePath = clearIncludes.find(item => clearComponentPath.startsWith(item));
  // extract component directories and split
  return (0, _utils().winPath)(_path().default.dirname(clearComponentPath.replace(entryIncludePath, '')).replace(/^\./, '')).split('/');
}
var nav = function nav(routes) {
  // only apply for site mode
  if (this.options.mode === 'site') {
    const defaultLocale = this.options.locales[0][0];
    const userCustomNavTitles = {};
    routes.forEach(route => {
      var _route$meta$nav, _route$meta$nav2;
      const navPath = (_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.path;
      if (!navPath) {
        let clearPath = route.path;
        // discard locale prefix
        if (route.meta.locale) {
          clearPath = (0, _locale.discardLocalePrefix)(clearPath, route.meta.locale);
        }
        if (clearPath && clearPath !== '/') {
          route.meta.nav = _objectSpread(_objectSpread({}, route.meta.nav || {}), {}, {
            // use the first sub path as nav path
            path: `/${clearPath.split('/')[1]}`
          });
        }
      }
      if ((_route$meta$nav2 = route.meta.nav) === null || _route$meta$nav2 === void 0 ? void 0 : _route$meta$nav2.path) {
        // add locale prefix for nav path
        if (route.meta.locale && route.meta.locale !== defaultLocale && !(0, _locale.isPrefixLocalePath)(route.meta.nav.path, route.meta.locale)) {
          route.meta.nav.path = (0, _locale.addLocalePrefix)(route.meta.nav.path, route.meta.locale);
        }
        // save user cusomize nav title, then will use for other route
        if (route.meta.nav.title) {
          userCustomNavTitles[route.meta.nav.path] = route.meta.nav.title;
        }
      }
    });
    // fallback navs title
    routes.forEach(route => {
      var _route$meta$nav3;
      if (((_route$meta$nav3 = route.meta.nav) === null || _route$meta$nav3 === void 0 ? void 0 : _route$meta$nav3.path) && !route.meta.nav.title) {
        var _getRouteComponentDir;
        route.meta.nav.title =
        // use other same nav path title first
        userCustomNavTitles[route.meta.nav.path] || ( // then use first directory name
        (_getRouteComponentDir = getRouteComponentDirs(route.component, this).shift()) === null || _getRouteComponentDir === void 0 ? void 0 : _getRouteComponentDir.replace(/^[a-z]/, s => s.toUpperCase())) ||
        // fallback nav title by nav path
        // discard locale prefix
        (0, _locale.discardLocalePrefix)(route.meta.nav.path, route.meta.locale)
        // discard start slash
        .replace(/^\//, '')
        // upper case the first english letter
        .replace(/^[a-z]/, s => s.toUpperCase());
      }
    });
  }
  return routes;
};
exports.default = nav;