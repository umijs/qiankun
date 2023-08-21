function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useState, useEffect, useRef } from 'react';
import { useSearch, AnchorLink } from 'dumi/theme';
import './SearchBar.less';
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
  } : {})), /*#__PURE__*/React.createElement("ul", null, items.map(function (meta) {
    var _meta$parent;

    return /*#__PURE__*/React.createElement("li", {
      key: meta.path,
      onClick: function onClick() {
        return setKeywords('');
      }
    }, /*#__PURE__*/React.createElement(AnchorLink, {
      to: meta.path
    }, ((_meta$parent = meta.parent) === null || _meta$parent === void 0 ? void 0 : _meta$parent.title) && /*#__PURE__*/React.createElement("span", null, meta.parent.title), meta.title));
  })));
});