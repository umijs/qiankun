import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
var _excluded = ["visible", "mobile"];
import * as React from 'react';
import { useState, useEffect } from 'react';
import isMobile from "rc-util/es/isMobile";
import Mask from "./Mask";
import PopupInner from "./PopupInner";
import MobilePopupInner from "./MobilePopupInner";
var Popup = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var visible = _ref.visible,
      mobile = _ref.mobile,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useState = useState(visible),
      _useState2 = _slicedToArray(_useState, 2),
      innerVisible = _useState2[0],
      serInnerVisible = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      inMobile = _useState4[0],
      setInMobile = _useState4[1];

  var cloneProps = _objectSpread(_objectSpread({}, props), {}, {
    visible: innerVisible
  }); // We check mobile in visible changed here.
  // And this also delay set `innerVisible` to avoid popup component render flash


  useEffect(function () {
    serInnerVisible(visible);

    if (visible && mobile) {
      setInMobile(isMobile());
    }
  }, [visible, mobile]);
  var popupNode = inMobile ? /*#__PURE__*/React.createElement(MobilePopupInner, _extends({}, cloneProps, {
    mobile: mobile,
    ref: ref
  })) : /*#__PURE__*/React.createElement(PopupInner, _extends({}, cloneProps, {
    ref: ref
  })); // We can use fragment directly but this may failed some selector usage. Keep as origin logic

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Mask, cloneProps), popupNode);
});
Popup.displayName = 'Popup';
export default Popup;