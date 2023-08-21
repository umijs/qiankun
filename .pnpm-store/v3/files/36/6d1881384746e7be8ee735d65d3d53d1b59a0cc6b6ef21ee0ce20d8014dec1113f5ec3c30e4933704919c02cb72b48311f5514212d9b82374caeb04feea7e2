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

var _default = (routes, opts) => {
  const validLocales = new Set();
  const locales = []; // collect valid locales set

  routes.forEach(route => {
    var _route$meta, _opts$locales$;

    const localeName = ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.locale) || ((_opts$locales$ = opts.locales[0]) === null || _opts$locales$ === void 0 ? void 0 : _opts$locales$[0]);
    const locale = opts.locales.find(([name]) => name === localeName);

    if (locale) {
      validLocales.add(locale[0]);
    }
  }); // filter valid locales from locale options

  locales.push(...opts.locales.filter(([name]) => validLocales.has(name)).map(([name, label]) => ({
    name,
    label
  }))); // discard unique locale

  if (locales.length === 1) {
    locales.splice(0, 1);
  }

  return locales;
};

exports.default = _default;