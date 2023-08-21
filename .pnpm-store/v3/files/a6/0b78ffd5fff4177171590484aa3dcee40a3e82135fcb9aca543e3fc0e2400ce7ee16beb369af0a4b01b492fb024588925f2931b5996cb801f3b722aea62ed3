"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const INTEGRATE_PLUGINS = ['@umijs/plugin-analytics'];
/**
 * plugin for integrate other umi plugins
 */
var _default = api => {
  const plugins = INTEGRATE_PLUGINS.filter(key => !api.hasPlugins([key]) &&
  // search plugins of other presets
  api.service._extraPlugins.every(({
    id
  }) => id !== key));
  api.registerPlugins(plugins.map(key => require.resolve(key)));
};
exports.default = _default;