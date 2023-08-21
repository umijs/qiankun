"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpinSize = getSpinSize;
var MIN_SIZE = 20;
function getSpinSize() {
  var containerSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var scrollRange = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var baseSize = containerSize / scrollRange * 100;
  if (isNaN(baseSize)) {
    baseSize = 0;
  }
  baseSize = Math.max(baseSize, MIN_SIZE);
  baseSize = Math.min(baseSize, containerSize / 2);
  return Math.floor(baseSize);
}