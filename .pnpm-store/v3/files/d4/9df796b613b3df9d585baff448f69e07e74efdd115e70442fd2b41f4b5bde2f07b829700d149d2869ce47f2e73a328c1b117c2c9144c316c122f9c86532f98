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

var _getCwd = _interopRequireDefault(require("./getCwd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = dir => {
  try {
    return require((0, _path().join)((0, _getCwd.default)(), 'package.json'));
  } catch (error) {
    try {
      return require((0, _path().join)(dir, 'package.json'));
    } catch (error) {
      return null;
    }
  }
};

exports.default = _default;