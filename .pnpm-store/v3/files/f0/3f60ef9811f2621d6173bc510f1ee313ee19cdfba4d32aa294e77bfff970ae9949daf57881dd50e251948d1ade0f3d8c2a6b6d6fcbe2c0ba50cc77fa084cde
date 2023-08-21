"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = codeBlock;
function _unistUtilVisit() {
  const data = _interopRequireDefault(require("unist-util-visit"));
  _unistUtilVisit = function _unistUtilVisit() {
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
var _ = _interopRequireDefault(require(".."));
var _context = _interopRequireDefault(require("../../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * parser for parse modifier of code block
 * @param meta  meta raw string
 */
function codeBlockModifierParser(meta) {
  return (meta || '').split('|').reduce((result, item) => {
    item = String.prototype.trim.call(item);
    if (item) {
      result[item] = true;
    }
    return result;
  }, {});
}
/**
 * rehype plugin for convert code block to demo compomnent
 */
function codeBlock() {
  return ast => {
    // handle md code block syntax
    (0, _unistUtilVisit().default)(ast, 'code', node => {
      var _ctx$opts;
      const resolve = (_ctx$opts = _context.default.opts) === null || _ctx$opts === void 0 ? void 0 : _ctx$opts.resolve;
      const modifier = codeBlockModifierParser(node.meta);
      if ((resolve === null || resolve === void 0 ? void 0 : resolve.previewLangs.includes(node.lang)) && (!(resolve === null || resolve === void 0 ? void 0 : resolve.passivePreview) || resolve.passivePreview && modifier.preview)) {
        // extract frontmatters for embedded demo
        const _transformer$code = _.default.code((0, _utils().winEOL)(node.value)),
          content = _transformer$code.content,
          meta = _transformer$code.meta;
        if (modifier.pure) {
          // clear useless meta if the lang with pure modifier
          node.meta = node.meta.replace(/ ?\| ?pure/, '') || null;
        } else {
          // customize type (use for rehype demo handler)
          node.type = 'demo';
          node.meta = _objectSpread(_objectSpread({}, modifier), meta);
          node.value = content;
        }
      }
    });
  };
}