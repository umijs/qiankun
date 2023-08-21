"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = () => {
  let cwd = process.cwd();

  if (process.env.APP_ROOT) {
    // avoid repeat cwd path
    if (!(0, _path().isAbsolute)(process.env.APP_ROOT)) {
      return (0, _path().join)(cwd, process.env.APP_ROOT);
    }

    return process.env.APP_ROOT;
  }

  return cwd;
};

exports.default = _default;