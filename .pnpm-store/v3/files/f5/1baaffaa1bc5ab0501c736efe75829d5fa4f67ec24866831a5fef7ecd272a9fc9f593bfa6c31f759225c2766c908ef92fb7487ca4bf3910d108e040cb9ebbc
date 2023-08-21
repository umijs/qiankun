"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _domAlign = require("dom-align");

var _isEqual = _interopRequireDefault(require("rc-util/lib/isEqual"));

var _addEventListener = _interopRequireDefault(require("rc-util/lib/Dom/addEventListener"));

var _isVisible = _interopRequireDefault(require("rc-util/lib/Dom/isVisible"));

var _useLayoutEffect = _interopRequireDefault(require("rc-util/lib/hooks/useLayoutEffect"));

var _ref2 = require("rc-util/lib/ref");

var _react = _interopRequireDefault(require("react"));

var _useBuffer3 = _interopRequireDefault(require("./hooks/useBuffer"));

var _util = require("./util");

/**
 * Removed props:
 *  - childrenProps
 */
function getElement(func) {
  if (typeof func !== 'function') return null;
  return func();
}

function getPoint(point) {
  if ((0, _typeof2.default)(point) !== 'object' || !point) return null;
  return point;
}

var Align = function Align(_ref, ref) {
  var children = _ref.children,
      disabled = _ref.disabled,
      target = _ref.target,
      align = _ref.align,
      onAlign = _ref.onAlign,
      monitorWindowResize = _ref.monitorWindowResize,
      _ref$monitorBufferTim = _ref.monitorBufferTime,
      monitorBufferTime = _ref$monitorBufferTim === void 0 ? 0 : _ref$monitorBufferTim;

  var cacheRef = _react.default.useRef({});
  /** Popup node ref */


  var nodeRef = _react.default.useRef();

  var childNode = _react.default.Children.only(children); // ===================== Align ======================
  // We save the props here to avoid closure makes props ood


  var forceAlignPropsRef = _react.default.useRef({});

  forceAlignPropsRef.current.disabled = disabled;
  forceAlignPropsRef.current.target = target;
  forceAlignPropsRef.current.align = align;
  forceAlignPropsRef.current.onAlign = onAlign;

  var _useBuffer = (0, _useBuffer3.default)(function () {
    var _forceAlignPropsRef$c = forceAlignPropsRef.current,
        latestDisabled = _forceAlignPropsRef$c.disabled,
        latestTarget = _forceAlignPropsRef$c.target,
        latestAlign = _forceAlignPropsRef$c.align,
        latestOnAlign = _forceAlignPropsRef$c.onAlign;
    var source = nodeRef.current;

    if (!latestDisabled && latestTarget && source) {
      var _result;

      var _element = getElement(latestTarget);

      var _point = getPoint(latestTarget);

      cacheRef.current.element = _element;
      cacheRef.current.point = _point;
      cacheRef.current.align = latestAlign; // IE lose focus after element realign
      // We should record activeElement and restore later

      var _document = document,
          activeElement = _document.activeElement; // We only align when element is visible

      if (_element && (0, _isVisible.default)(_element)) {
        _result = (0, _domAlign.alignElement)(source, _element, latestAlign);
      } else if (_point) {
        _result = (0, _domAlign.alignPoint)(source, _point, latestAlign);
      }

      (0, _util.restoreFocus)(activeElement, source);

      if (latestOnAlign && _result) {
        latestOnAlign(source, _result);
      }

      return true;
    }

    return false;
  }, monitorBufferTime),
      _useBuffer2 = (0, _slicedToArray2.default)(_useBuffer, 2),
      _forceAlign = _useBuffer2[0],
      cancelForceAlign = _useBuffer2[1]; // ===================== Effect =====================
  // Handle props change


  var _React$useState = _react.default.useState(),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      element = _React$useState2[0],
      setElement = _React$useState2[1];

  var _React$useState3 = _react.default.useState(),
      _React$useState4 = (0, _slicedToArray2.default)(_React$useState3, 2),
      point = _React$useState4[0],
      setPoint = _React$useState4[1];

  (0, _useLayoutEffect.default)(function () {
    setElement(getElement(target));
    setPoint(getPoint(target));
  });

  _react.default.useEffect(function () {
    if (cacheRef.current.element !== element || !(0, _util.isSamePoint)(cacheRef.current.point, point) || !(0, _isEqual.default)(cacheRef.current.align, align)) {
      _forceAlign();
    }
  }); // Watch popup element resize


  _react.default.useEffect(function () {
    var cancelFn = (0, _util.monitorResize)(nodeRef.current, _forceAlign);
    return cancelFn;
  }, [nodeRef.current]); // Watch target element resize


  _react.default.useEffect(function () {
    var cancelFn = (0, _util.monitorResize)(element, _forceAlign);
    return cancelFn;
  }, [element]); // Listen for disabled change


  _react.default.useEffect(function () {
    if (!disabled) {
      _forceAlign();
    } else {
      cancelForceAlign();
    }
  }, [disabled]); // Listen for window resize


  _react.default.useEffect(function () {
    if (monitorWindowResize) {
      var cancelFn = (0, _addEventListener.default)(window, 'resize', _forceAlign);
      return cancelFn.remove;
    }
  }, [monitorWindowResize]); // Clear all if unmount


  _react.default.useEffect(function () {
    return function () {
      cancelForceAlign();
    };
  }, []); // ====================== Ref =======================


  _react.default.useImperativeHandle(ref, function () {
    return {
      forceAlign: function forceAlign() {
        return _forceAlign(true);
      }
    };
  }); // ===================== Render =====================


  if ( /*#__PURE__*/_react.default.isValidElement(childNode)) {
    childNode = /*#__PURE__*/_react.default.cloneElement(childNode, {
      ref: (0, _ref2.composeRef)(childNode.ref, nodeRef)
    });
  }

  return childNode;
};

var RcAlign = /*#__PURE__*/_react.default.forwardRef(Align);

RcAlign.displayName = 'Align';
var _default = RcAlign;
exports.default = _default;