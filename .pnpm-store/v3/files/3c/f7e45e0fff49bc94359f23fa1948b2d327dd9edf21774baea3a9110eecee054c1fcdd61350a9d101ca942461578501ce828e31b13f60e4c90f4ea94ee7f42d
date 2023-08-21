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

function _color() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/color"));

  _color = function _color() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-ignore
const ratio = 0.618033988749895;
let hue = Math.random();

function _default(saturation = 0.5, value = 0.95) {
  hue += ratio;
  hue %= 1;
  return (0, _color().default)({
    h: hue * 360,
    s: saturation * 100,
    v: value * 100
  });
}