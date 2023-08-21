import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _typeof from "@babel/runtime/helpers/esm/typeof";

/**
 * Removed props:
 *  - childrenProps
 */
import { alignElement, alignPoint } from 'dom-align';
import isEqual from "rc-util/es/isEqual";
import addEventListener from "rc-util/es/Dom/addEventListener";
import isVisible from "rc-util/es/Dom/isVisible";
import useLayoutEffect from "rc-util/es/hooks/useLayoutEffect";
import { composeRef } from "rc-util/es/ref";
import React from 'react';
import useBuffer from "./hooks/useBuffer";
import { isSamePoint, monitorResize, restoreFocus } from "./util";

function getElement(func) {
  if (typeof func !== 'function') return null;
  return func();
}

function getPoint(point) {
  if (_typeof(point) !== 'object' || !point) return null;
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
  var cacheRef = React.useRef({});
  /** Popup node ref */

  var nodeRef = React.useRef();
  var childNode = React.Children.only(children); // ===================== Align ======================
  // We save the props here to avoid closure makes props ood

  var forceAlignPropsRef = React.useRef({});
  forceAlignPropsRef.current.disabled = disabled;
  forceAlignPropsRef.current.target = target;
  forceAlignPropsRef.current.align = align;
  forceAlignPropsRef.current.onAlign = onAlign;

  var _useBuffer = useBuffer(function () {
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

      if (_element && isVisible(_element)) {
        _result = alignElement(source, _element, latestAlign);
      } else if (_point) {
        _result = alignPoint(source, _point, latestAlign);
      }

      restoreFocus(activeElement, source);

      if (latestOnAlign && _result) {
        latestOnAlign(source, _result);
      }

      return true;
    }

    return false;
  }, monitorBufferTime),
      _useBuffer2 = _slicedToArray(_useBuffer, 2),
      _forceAlign = _useBuffer2[0],
      cancelForceAlign = _useBuffer2[1]; // ===================== Effect =====================
  // Handle props change


  var _React$useState = React.useState(),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      element = _React$useState2[0],
      setElement = _React$useState2[1];

  var _React$useState3 = React.useState(),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      point = _React$useState4[0],
      setPoint = _React$useState4[1];

  useLayoutEffect(function () {
    setElement(getElement(target));
    setPoint(getPoint(target));
  });
  React.useEffect(function () {
    if (cacheRef.current.element !== element || !isSamePoint(cacheRef.current.point, point) || !isEqual(cacheRef.current.align, align)) {
      _forceAlign();
    }
  }); // Watch popup element resize

  React.useEffect(function () {
    var cancelFn = monitorResize(nodeRef.current, _forceAlign);
    return cancelFn;
  }, [nodeRef.current]); // Watch target element resize

  React.useEffect(function () {
    var cancelFn = monitorResize(element, _forceAlign);
    return cancelFn;
  }, [element]); // Listen for disabled change

  React.useEffect(function () {
    if (!disabled) {
      _forceAlign();
    } else {
      cancelForceAlign();
    }
  }, [disabled]); // Listen for window resize

  React.useEffect(function () {
    if (monitorWindowResize) {
      var cancelFn = addEventListener(window, 'resize', _forceAlign);
      return cancelFn.remove;
    }
  }, [monitorWindowResize]); // Clear all if unmount

  React.useEffect(function () {
    return function () {
      cancelForceAlign();
    };
  }, []); // ====================== Ref =======================

  React.useImperativeHandle(ref, function () {
    return {
      forceAlign: function forceAlign() {
        return _forceAlign(true);
      }
    };
  }); // ===================== Render =====================

  if ( /*#__PURE__*/React.isValidElement(childNode)) {
    childNode = /*#__PURE__*/React.cloneElement(childNode, {
      ref: composeRef(childNode.ref, nodeRef)
    });
  }

  return childNode;
};

var RcAlign = /*#__PURE__*/React.forwardRef(Align);
RcAlign.displayName = 'Align';
export default RcAlign;