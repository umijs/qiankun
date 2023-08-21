"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
/**
 * get API data
 * @param identifier      component name
 * @param locale          current locale
 */
function getApiData(apis, identifier, locale) {
  return Object.entries(apis[identifier]).reduce((expts, [expt, rows]) => {
    expts[expt] = rows.map(props => {
      // default description cover miss locale
      const result = {
        description: props.description
      };
      Object.keys(props).forEach(prop => {
        // get locale description data
        if (prop.startsWith('description.')) {
          const _prop$match = prop.match(/^description\.(.*)$/),
            _prop$match2 = _slicedToArray(_prop$match, 2),
            propLocale = _prop$match2[1];
          if (propLocale && propLocale === locale) {
            result.description = props[prop];
          }
        } else {
          // copy original property
          result[prop] = props[prop];
        }
      });
      return result;
    });
    return expts;
  }, {});
}
/**
 * use api data by identifier
 * @note  identifier is component name or component path
 */
var _default = identifier => {
  const _useContext = (0, _react().useContext)(_context.default),
    locale = _useContext.locale,
    apis = _useContext.apis;
  const _useState = (0, _react().useState)(getApiData(apis, identifier, locale)),
    _useState2 = _slicedToArray(_useState, 2),
    data = _useState2[0],
    setData = _useState2[1];
  (0, _react().useEffect)(() => {
    setData(getApiData(apis, identifier, locale));
  }, [apis, identifier, locale]);
  return data;
};
exports.default = _default;