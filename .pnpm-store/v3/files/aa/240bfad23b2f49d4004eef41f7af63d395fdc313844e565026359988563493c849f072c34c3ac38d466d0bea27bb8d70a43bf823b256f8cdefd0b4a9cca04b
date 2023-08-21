"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDemoUrl = exports.getDemoRouteName = exports.default = void 0;
function _react() {
  const data = require("react");
  _react = function _react() {
    return data;
  };
  return data;
}
var _context = _interopRequireDefault(require("../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// functional for testing
function isBMW() {
  return process.env.PLATFORM_TYPE === 'BASEMENT';
}
/**
 * get demo route name
 * @note  also use this function in CLI, do not use BOM inside
 */
const getDemoRouteName = () => {
  return isBMW() ? `_demos` : `~demos`;
};
/**
 * get single demo url
 * @param demoId  demo identifier
 * @param htmlSuffix true when `exportStatic: { htmlSuffix: true }`
 */
exports.getDemoRouteName = getDemoRouteName;
const getDemoUrl = (demoId, htmlSuffix) => {
  var _window2;
  const _window = window,
    _window$location = _window.location,
    href = _window$location.href,
    origin = _window$location.origin;
  const _href$split = href.split(/#\//),
    _href$split2 = _slicedToArray(_href$split, 2),
    base = _href$split2[0],
    hashRoute = _href$split2[1];
  const isHashRoute = typeof hashRoute === 'string';
  return [isHashRoute ? `${base}#` : origin,
  // compatible with (empty), /base & /base/
  `${((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.routerBase) || ''}/`.replace(/\/\/$/, '/'), getDemoRouteName(), '/', demoId, `${htmlSuffix ? '.html' : ''}`].join('');
};
/**
 * hooks for get single demo url
 */
exports.getDemoUrl = getDemoUrl;
var _default = demoId => {
  const _useContext = (0, _react().useContext)(_context.default),
    config = _useContext.config;
  const _useState = (0, _react().useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    url = _useState2[0],
    setUrl = _useState2[1];
  (0, _react().useEffect)(() => {
    setUrl(demoId ? getDemoUrl(demoId, config.exportStatic && config.exportStatic.htmlSuffix) : null);
  }, [demoId, config]);
  return url;
};
exports.default = _default;