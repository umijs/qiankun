"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var React = _interopRequireWildcard(require("react"));
var _rcResizeObserver = _interopRequireDefault(require("rc-resize-observer"));
var _classnames = _interopRequireDefault(require("classnames"));
/**
 * Fill component to provided the scroll content real height.
 */
var Filler = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var height = _ref.height,
    offsetY = _ref.offsetY,
    offsetX = _ref.offsetX,
    children = _ref.children,
    prefixCls = _ref.prefixCls,
    onInnerResize = _ref.onInnerResize,
    innerProps = _ref.innerProps,
    rtl = _ref.rtl,
    extra = _ref.extra;
  var outerStyle = {};
  var innerStyle = {
    display: 'flex',
    flexDirection: 'column'
  };
  if (offsetY !== undefined) {
    var _objectSpread2;
    // Not set `width` since this will break `sticky: right`
    outerStyle = {
      height: height,
      position: 'relative',
      overflow: 'hidden'
    };
    innerStyle = (0, _objectSpread3.default)((0, _objectSpread3.default)({}, innerStyle), {}, (_objectSpread2 = {
      transform: "translateY(".concat(offsetY, "px)")
    }, (0, _defineProperty2.default)(_objectSpread2, rtl ? 'marginRight' : 'marginLeft', -offsetX), (0, _defineProperty2.default)(_objectSpread2, "position", 'absolute'), (0, _defineProperty2.default)(_objectSpread2, "left", 0), (0, _defineProperty2.default)(_objectSpread2, "right", 0), (0, _defineProperty2.default)(_objectSpread2, "top", 0), _objectSpread2));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: outerStyle
  }, /*#__PURE__*/React.createElement(_rcResizeObserver.default, {
    onResize: function onResize(_ref2) {
      var offsetHeight = _ref2.offsetHeight;
      if (offsetHeight && onInnerResize) {
        onInnerResize();
      }
    }
  }, /*#__PURE__*/React.createElement("div", (0, _extends2.default)({
    style: innerStyle,
    className: (0, _classnames.default)((0, _defineProperty2.default)({}, "".concat(prefixCls, "-holder-inner"), prefixCls)),
    ref: ref
  }, innerProps), children, extra)));
});
Filler.displayName = 'Filler';
var _default = Filler;
exports.default = _default;