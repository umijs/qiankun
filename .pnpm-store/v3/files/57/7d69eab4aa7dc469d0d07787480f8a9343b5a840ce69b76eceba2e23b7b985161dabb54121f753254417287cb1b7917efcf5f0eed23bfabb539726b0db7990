"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isWindows = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 在windows环境下，很多工具都会把换行符lf自动改成crlf
// 为了测试精准需要将换行符转化一下
// https://github.com/cssmagic/blog/issues/22
const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
/**
 * Convert Windows crlf to lf (\r\n to \n)
 * @param content
 */

exports.isWindows = isWindows;

var _default = content => {
  if (typeof content !== 'string') {
    return content;
  }

  return isWindows ? content.replace(/\r/g, '') : content;
};

exports.default = _default;