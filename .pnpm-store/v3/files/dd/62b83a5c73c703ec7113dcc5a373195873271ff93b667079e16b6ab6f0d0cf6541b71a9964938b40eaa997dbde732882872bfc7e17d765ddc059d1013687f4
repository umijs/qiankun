"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var React = _interopRequireWildcard(require("react"));

var _isMobile = _interopRequireDefault(require("rc-util/lib/isMobile"));

var _Mask = _interopRequireDefault(require("./Mask"));

var _PopupInner = _interopRequireDefault(require("./PopupInner"));

var _MobilePopupInner = _interopRequireDefault(require("./MobilePopupInner"));

var _excluded = ["visible", "mobile"];
var Popup = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var visible = _ref.visible,
      mobile = _ref.mobile,
      props = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var _useState = (0, React.useState)(visible),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      innerVisible = _useState2[0],
      serInnerVisible = _useState2[1];

  var _useState3 = (0, React.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      inMobile = _useState4[0],
      setInMobile = _useState4[1];

  var cloneProps = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    visible: innerVisible
  }); // We check mobile in visible changed here.
  // And this also delay set `innerVisible` to avoid popup component render flash

  (0, React.useEffect)(function () {
    serInnerVisible(visible);

    if (visible && mobile) {
      setInMobile((0, _isMobile.default)());
    }
  }, [visible, mobile]);
  var popupNode = inMobile ? /*#__PURE__*/React.createElement(_MobilePopupInner.default, (0, _extends2.default)({}, cloneProps, {
    mobile: mobile,
    ref: ref
  })) : /*#__PURE__*/React.createElement(_PopupInner.default, (0, _extends2.default)({}, cloneProps, {
    ref: ref
  })); // We can use fragment directly but this may failed some selector usage. Keep as origin logic

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_Mask.default, cloneProps), popupNode);
});
Popup.displayName = 'Popup';
var _default = Popup;
exports.default = _default;