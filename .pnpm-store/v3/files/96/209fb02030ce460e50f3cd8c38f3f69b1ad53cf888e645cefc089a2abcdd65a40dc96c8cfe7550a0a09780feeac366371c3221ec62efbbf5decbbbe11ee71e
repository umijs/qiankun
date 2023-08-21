"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = parse;

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

function parse(code) {
  return _utils().parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'classProperties', 'dynamicImport', 'exportDefaultFrom', 'exportNamespaceFrom', 'functionBind', 'nullishCoalescingOperator', 'objectRestSpread', 'optionalChaining', 'decorators-legacy'],
    allowAwaitOutsideFunction: true
  });
}