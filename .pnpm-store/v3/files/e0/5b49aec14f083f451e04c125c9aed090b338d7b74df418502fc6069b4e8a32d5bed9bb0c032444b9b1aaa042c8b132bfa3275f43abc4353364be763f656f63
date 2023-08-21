"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addLocalePrefix = addLocalePrefix;
exports.default = void 0;
exports.discardLocalePrefix = discardLocalePrefix;
exports.isPrefixLocalePath = isPrefixLocalePath;
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * check route path wether prefix locale path
 * @param routePath   route path
 * @param localeName  locale prefix name
 */
function isPrefixLocalePath(routePath, localeName) {
  return routePath === `/${localeName}` || routePath.startsWith(`/${(0, _slash().default)(_path().default.join(localeName))}/`);
}
/**
 * discard locale prefix path from route path
 * @param routePath   route path
 * @param localeName  locale prefix name
 */
function discardLocalePrefix(routePath, localeName) {
  return localeName && isPrefixLocalePath(routePath, localeName) ? routePath.replace(`/${(0, _slash().default)(_path().default.join(localeName))}`, '') : routePath;
}
/**
 * add locale prefix for route path
 * @param routePath   route path
 * @param localeName  locale prefix name
 */
function addLocalePrefix(routePath, localeName) {
  return `/${localeName}${routePath}`;
}
/**
 * set locale for route
 */
var locale = function locale(routes) {
  this.data.locales = new Set([this.options.locales[0][0]]);
  return routes.map(route => {
    var _path$parse$name$matc;
    // guess filename has locale suffix, eg: index.zh-CN
    const pathLocale = (_path$parse$name$matc = _path().default.parse(route.component).name.match(/[^.]+$/)) === null || _path$parse$name$matc === void 0 ? void 0 : _path$parse$name$matc[0];
    // valid locale
    if (pathLocale && this.options.locales.find(([name]) => name === pathLocale)) {
      route.meta.locale = pathLocale;
      // share locale list for other processor
      this.data.locales.add(pathLocale);
    }
    return route;
  });
};
exports.default = locale;