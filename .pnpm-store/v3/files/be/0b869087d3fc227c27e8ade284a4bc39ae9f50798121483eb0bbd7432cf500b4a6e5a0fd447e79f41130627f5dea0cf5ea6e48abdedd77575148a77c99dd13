"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.init = init;
exports.setOptions = setOptions;
const context = {};
/**
 * initialize context
 * @param umi   umi api
 * @param opts  dumi config
 */
function init(umi, opts) {
  context.umi = umi;
  context.opts = opts;
}
/**
 * set dumi options in context
 * @param key   config key
 * @param value config value
 */
function setOptions(key, value) {
  context.opts[key] = value;
}
var _default = context;
exports.default = _default;