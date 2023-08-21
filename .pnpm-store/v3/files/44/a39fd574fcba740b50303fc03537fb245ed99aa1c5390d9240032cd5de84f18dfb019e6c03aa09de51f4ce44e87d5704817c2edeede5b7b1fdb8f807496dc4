"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileRangeLines = exports.getFileContentByRegExp = void 0;
var _context = _interopRequireDefault(require("../context"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * get range lines of markdown file
 */
const getFileRangeLines = (content, range) => {
  const _ref = (range === null || range === void 0 ? void 0 : range.match(/^L(\d+)(?:-L(\d+))?$/)) || [],
    _ref2 = _slicedToArray(_ref, 3),
    start = _ref2[1],
    end = _ref2[2];
  if (start) {
    const lineStart = parseInt(start, 10) - 1;
    const lineEnd = end ? parseInt(end, 10) : lineStart + 1;
    content = content.split(/\r\n|\n/g).slice(lineStart, lineEnd).join('\n');
  }
  return content;
};
/**
 * get file content by regular expression
 * @param content   source file content
 * @param regexp    regular expression string
 * @param filePath  source file path
 */
exports.getFileRangeLines = getFileRangeLines;
const getFileContentByRegExp = (content, regexp, filePath) => {
  try {
    // eslint-disable-next-line no-eval
    return content.match(eval(regexp))[0];
  } catch (err) {
    var _ctx$umi;
    (_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : _ctx$umi.logger.error(`[dumi]: extract content failed, use the full content.
RegExp: ${regexp}
File: ${filePath}
Error: ${err}`);
    return content;
  }
};
exports.getFileContentByRegExp = getFileContentByRegExp;