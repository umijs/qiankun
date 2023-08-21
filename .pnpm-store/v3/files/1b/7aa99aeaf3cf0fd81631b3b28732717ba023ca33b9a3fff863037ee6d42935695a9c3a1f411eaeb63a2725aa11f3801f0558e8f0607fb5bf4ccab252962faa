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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var nav = function nav(routes) {
  // only apply for site mode
  if (this.options.mode === 'site') {
    var _this$options$locales;

    const defaultLocale = (_this$options$locales = this.options.locales[0]) === null || _this$options$locales === void 0 ? void 0 : _this$options$locales[0];
    const userCustomNavTitles = {};
    routes.forEach(route => {
      var _route$meta$nav, _route$meta$nav2;

      const navPath = (_route$meta$nav = route.meta.nav) === null || _route$meta$nav === void 0 ? void 0 : _route$meta$nav.path;

      if (!navPath) {
        let clearPath = route.path; // discard locale prefix

        if (route.meta.locale) {
          clearPath = clearPath.replace(`/${route.meta.locale}`, '');
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
        if (route.meta.locale && route.meta.locale !== defaultLocale && !route.meta.nav.path.startsWith(`/${route.meta.locale}`)) {
          route.meta.nav.path = `/${route.meta.locale}${route.meta.nav.path}`;
        } // save user cusomize nav title, then will use for other route


        if (route.meta.nav.title) {
          userCustomNavTitles[route.meta.nav.path] = route.meta.nav.title;
        }
      }
    }); // fallback navs title

    routes.forEach(route => {
      var _route$meta$nav3;

      if (((_route$meta$nav3 = route.meta.nav) === null || _route$meta$nav3 === void 0 ? void 0 : _route$meta$nav3.path) && !route.meta.nav.title) {
        route.meta.nav.title = // use other same nav path title first
        userCustomNavTitles[route.meta.nav.path] || // fallback nav title by nav path
        route.meta.nav.path // discard locale prefix
        .replace(`/${route.meta.locale || ''}`, '') // discard start slash
        .replace(/^\//, '') // upper case the first english letter
        .replace(/^[a-z]/, s => s.toUpperCase());
      }
    });
  }

  return routes;
};

exports.default = nav;