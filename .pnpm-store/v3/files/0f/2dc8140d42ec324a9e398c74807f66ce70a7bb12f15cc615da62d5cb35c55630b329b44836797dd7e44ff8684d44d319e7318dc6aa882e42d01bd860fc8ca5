function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useState, useEffect, useRef } from 'react';
import { useSearch, AnchorLink } from 'dumi/theme';
import './SearchBar.less';
export var highlight = function highlight(key, title) {
  var index = title.toLowerCase().indexOf(key.toLowerCase());
  var l = key.length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, title.substring(0, index), /*#__PURE__*/React.createElement("span", {
    className: "__dumi-default-search-highlight"
  }, title.substring(index, index + l)), title.substring(index + l, title.length));
};
export default (function () {
  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      keywords = _useState2[0],
      setKeywords = _useState2[1];

  var _useState3 = useState([]),
      _useState4 = _slicedToArray(_useState3, 2),
      items = _useState4[0],
      setItems = _useState4[1];

  var input = useRef();
  var result = useSearch(keywords);
  var emptySvg = /*#__PURE__*/React.createElement("svg", {
    className: "__dumi-default-search-empty",
    viewBox: "0 0 1024 1024",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    "p-id": "2347",
    width: "32",
    height: "32"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z"
  }));
  useEffect(function () {
    if (Array.isArray(result)) {
      setItems(result);
    } else if (typeof result === 'function') {
      result(".".concat(input.current.className));
    }
  }, [result]);
  return /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-search"
  }, /*#__PURE__*/React.createElement("input", _extends({
    className: "__dumi-default-search-input",
    type: "search",
    ref: input
  }, Array.isArray(result) ? {
    value: keywords,
    onChange: function onChange(ev) {
      return setKeywords(ev.target.value);
    }
  } : {})), /*#__PURE__*/React.createElement("ul", null, items.length > 0 && items.map(function (meta) {
    var _meta$parent;

    return /*#__PURE__*/React.createElement("li", {
      key: meta.path,
      onClick: function onClick() {
        return setKeywords('');
      }
    }, /*#__PURE__*/React.createElement(AnchorLink, {
      to: meta.path
    }, ((_meta$parent = meta.parent) === null || _meta$parent === void 0 ? void 0 : _meta$parent.title) && /*#__PURE__*/React.createElement("span", null, meta.parent.title), highlight(keywords, meta.title)));
  }), items.length === 0 && keywords && /*#__PURE__*/React.createElement("li", {
    style: {
      textAlign: 'center'
    }
  }, emptySvg)));
});