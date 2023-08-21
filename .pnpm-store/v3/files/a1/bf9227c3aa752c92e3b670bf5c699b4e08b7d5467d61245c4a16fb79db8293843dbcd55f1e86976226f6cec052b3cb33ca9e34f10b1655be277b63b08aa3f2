"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = (routes, opts) => {
  const validLocales = new Set();
  const locales = [];
  // collect valid locales set
  routes.forEach(route => {
    var _route$meta;
    const localeName = ((_route$meta = route.meta) === null || _route$meta === void 0 ? void 0 : _route$meta.locale) || opts.locales[0][0];
    const locale = opts.locales.find(([name]) => name === localeName);
    if (locale) {
      validLocales.add(locale[0]);
    }
  });
  // filter valid locales from locale options
  locales.push(...opts.locales.filter(([name]) => validLocales.has(name)).map(([name, label]) => ({
    name,
    label
  })));
  // fallback to default locale if there has no valid locales
  if (!locales.length) {
    locales.push({
      name: opts.locales[0][0],
      label: opts.locales[0][1]
    });
  }
  return locales;
};
exports.default = _default;