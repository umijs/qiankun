function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { useCopy } from 'dumi/theme';
import 'prismjs/themes/prism.css';
import './SourceCode.less';
export default (function (_ref) {
  var code = _ref.code,
      lang = _ref.lang,
      _ref$showCopy = _ref.showCopy,
      showCopy = _ref$showCopy === void 0 ? true : _ref$showCopy;

  var _useCopy = useCopy(),
      _useCopy2 = _slicedToArray(_useCopy, 2),
      copyCode = _useCopy2[0],
      copyStatus = _useCopy2[1];

  return /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-code-block"
  }, /*#__PURE__*/React.createElement(Highlight, _extends({}, defaultProps, {
    code: code,
    language: lang,
    theme: undefined
  }), function (_ref2) {
    var className = _ref2.className,
        style = _ref2.style,
        tokens = _ref2.tokens,
        getLineProps = _ref2.getLineProps,
        getTokenProps = _ref2.getTokenProps;
    return /*#__PURE__*/React.createElement("pre", {
      className: className,
      style: style
    }, showCopy && /*#__PURE__*/React.createElement("button", {
      className: "__dumi-default-icon __dumi-default-code-block-copy-btn",
      "data-status": copyStatus,
      onClick: function onClick() {
        return copyCode(code);
      }
    }), tokens.map(function (line, i) {
      return /*#__PURE__*/React.createElement("div", getLineProps({
        line: line,
        key: i
      }), line.map(function (token, key) {
        return /*#__PURE__*/React.createElement("span", getTokenProps({
          token: token,
          key: key
        }));
      }));
    }));
  }));
});