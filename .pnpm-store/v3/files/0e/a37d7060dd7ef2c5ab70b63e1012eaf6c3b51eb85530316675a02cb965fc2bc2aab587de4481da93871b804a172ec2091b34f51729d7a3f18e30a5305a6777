"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LinkWrapper = void 0;
var _react = _interopRequireDefault(require("react"));
var _runtime = require("@umijs/runtime");
var _excluded = ["to"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * Link component wrapper for render external link
 * @param Component   original Link component
 */
var LinkWrapper = function LinkWrapper(Component) {
  return function (_ref) {
    var to = _ref.to,
      props = _objectWithoutProperties(_ref, _excluded);
    var isExternal = /^(\w+:)?\/\/|^(mailto|tel):/.test(to) || !to;
    var hasComplexChildren = /*#__PURE__*/_react.default.isValidElement(props.children);
    return /*#__PURE__*/_react.default.createElement(Component, _extends({
      to: to || '',
      component: isExternal ? function () {
        return /*#__PURE__*/_react.default.createElement("a", {
          target: "_blank",
          rel: "noopener noreferrer",
          href: to
        }, props.children, to && !hasComplexChildren && /*#__PURE__*/_react.default.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          "aria-hidden": "true",
          x: "0px",
          y: "0px",
          viewBox: "0 0 100 100",
          width: "15",
          height: "15",
          className: "__dumi-default-external-link-icon"
        }, /*#__PURE__*/_react.default.createElement("path", {
          fill: "currentColor",
          d: "M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
        }), /*#__PURE__*/_react.default.createElement("polygon", {
          fill: "currentColor",
          points: "45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
        })));
      } : undefined
    }, props, isExternal ? {} : {
      // scroll to top while change url
      onClick: function onClick() {
        var _props$onClick;
        window.scrollTo({
          top: 0
        });
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        (_props$onClick = props.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.apply(this, args);
      }
    }));
  };
};
exports.LinkWrapper = LinkWrapper;
var _default = LinkWrapper(_runtime.Link);
exports.default = _default;