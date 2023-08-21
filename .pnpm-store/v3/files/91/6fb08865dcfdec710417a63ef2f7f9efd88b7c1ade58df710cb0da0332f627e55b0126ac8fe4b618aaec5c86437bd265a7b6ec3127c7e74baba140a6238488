function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';
import './Table.less';

var Table = function Table(_ref) {
  var children = _ref.children;
  var container = useRef();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      leftFolded = _useState2[0],
      setLeftFolded = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      rightFolded = _useState4[0],
      setRightFolded = _useState4[1]; // watch content scroll to render folded shadow


  useEffect(function () {
    var elm = container.current;
    var handler = throttle(function () {
      setLeftFolded(elm.scrollLeft > 0);
      setRightFolded(elm.scrollLeft < elm.scrollWidth - elm.offsetWidth);
    }, 100);
    handler();
    elm.addEventListener('scroll', handler);
    window.addEventListener('resize', handler);
    return function () {
      elm.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-table-content",
    ref: container,
    "data-left-folded": leftFolded || undefined,
    "data-right-folded": rightFolded || undefined
  }, /*#__PURE__*/React.createElement("table", null, children)));
};

export default Table;