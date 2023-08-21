"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderReactPath = exports.runtimePath = void 0;

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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const runtimePath = (0, _utils().winPath)((0, _path().dirname)(require.resolve('@umijs/runtime/package.json')));
exports.runtimePath = runtimePath;
const renderReactPath = (0, _utils().winPath)((0, _path().dirname)(require.resolve('@umijs/renderer-react/package.json')));
exports.renderReactPath = renderReactPath;