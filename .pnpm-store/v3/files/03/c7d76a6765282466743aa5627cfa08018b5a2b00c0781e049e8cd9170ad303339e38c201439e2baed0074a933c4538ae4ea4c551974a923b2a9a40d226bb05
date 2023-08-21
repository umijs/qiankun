"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = _interopRequireDefault(require("../../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * plugin for disable all dumi plugins
 */
var _default = api => {
  // disable dumi in interate mode and non-development mode
  const isDisableDumi = _context.default.opts.isIntegrate && api.env !== 'development';
  if (isDisableDumi) {
    const dumiPlugins = Object.values(api.service.plugins).filter(({
      id
    }) => /preset-dumi\/(lib|src)\/plugins/.test(id)).map(({
      id
    }) => id);
    api.skipPlugins(dumiPlugins);
  }
};
exports.default = _default;