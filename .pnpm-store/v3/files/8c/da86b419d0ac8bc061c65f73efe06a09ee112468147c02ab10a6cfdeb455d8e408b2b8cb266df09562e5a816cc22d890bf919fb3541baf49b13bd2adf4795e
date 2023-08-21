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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * set locale for route
 */
var locale = function locale(routes) {
  var _this$options$locales;

  this.data.locales = new Set([(_this$options$locales = this.options.locales[0]) === null || _this$options$locales === void 0 ? void 0 : _this$options$locales[0]]);
  return routes.map(route => {
    var _path$parse$name$matc;

    // guess filename has locale suffix, eg: index.zh-CN
    const pathLocale = (_path$parse$name$matc = _path().default.parse(route.component).name.match(/[^.]+$/)) === null || _path$parse$name$matc === void 0 ? void 0 : _path$parse$name$matc[0]; // valid locale

    if (pathLocale && this.options.locales.find(([name]) => name === pathLocale)) {
      route.meta.locale = pathLocale; // share locale list for other processor

      this.data.locales.add(pathLocale);
    }

    return route;
  });
};

exports.default = locale;