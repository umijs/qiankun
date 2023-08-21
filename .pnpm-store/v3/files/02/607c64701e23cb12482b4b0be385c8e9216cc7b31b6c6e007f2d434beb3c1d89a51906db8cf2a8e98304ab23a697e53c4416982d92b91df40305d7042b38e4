"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function funcToStr(obj) {
  if (typeof obj === 'function') return obj.toString();

  if (_utils().lodash.isPlainObject(obj)) {
    return Object.keys(obj).reduce((memo, key) => {
      memo[key] = funcToStr(obj[key]);
      return memo;
    }, {});
  } else {
    return obj;
  }
}

function _default(a, b) {
  return _utils().lodash.isEqual(funcToStr(a), funcToStr(b));
}