function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useRef, useEffect, useState } from 'react';
import './Example.less';
export default (function (props) {
  var elm = useRef();

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      height = _useState2[0],
      setHeight = _useState2[1];

  useEffect(function () {
    setHeight(elm.current.contentWindow.document.documentElement.scrollHeight);
  }, [elm]);
  return props.route.meta.examplePath && /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-example-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-example-wrapper-toolbar"
  }, props.route.meta.description || props.route.meta.title, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("button", {
    className: "__dumi-default-icon",
    onClick: function onClick() {
      return elm.current.contentWindow.location.reload();
    }
  }), /*#__PURE__*/React.createElement("a", {
    target: "_blank",
    rel: "noopener noreferrer",
    href: props.route.meta.examplePath,
    className: "__dumi-default-icon"
  }))), /*#__PURE__*/React.createElement("iframe", {
    src: props.route.meta.examplePath,
    ref: elm,
    style: {
      height: height
    },
    title: "dumi"
  }));
});