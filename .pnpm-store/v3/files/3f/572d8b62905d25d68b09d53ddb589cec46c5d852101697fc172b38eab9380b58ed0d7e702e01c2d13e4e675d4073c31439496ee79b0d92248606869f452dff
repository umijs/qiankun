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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  parse: {
    ecma: 8
  },
  compress: {
    ecma: 5,
    warnings: false,
    // turn off flags with small gains to speed up minification
    arrows: false,
    collapse_vars: false,
    comparisons: false,
    computed_props: false,
    hoist_funs: false,
    hoist_props: false,
    hoist_vars: false,
    inline: false,
    loops: false,
    negate_iife: false,
    properties: false,
    reduce_funcs: false,
    reduce_vars: false,
    switches: false,
    toplevel: false,
    typeofs: false,
    // a few flags with noticable gains/speed ratio
    // numbers based on out of the box vendor bundle
    booleans: true,
    if_return: true,
    sequences: true,
    unused: true,
    // required features to drop conditional branches
    conditionals: true,
    dead_code: true,
    evaluate: true
  },
  mangle: {
    safari10: true
  },
  output: {
    ecma: 5,
    comments: false,
    ascii_only: true
  }
};
exports.default = _default;