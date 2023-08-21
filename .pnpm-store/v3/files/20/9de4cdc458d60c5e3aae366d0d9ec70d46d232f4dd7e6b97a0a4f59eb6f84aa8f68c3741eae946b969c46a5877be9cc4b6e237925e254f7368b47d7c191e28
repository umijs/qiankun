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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CORE_JS_PATH = (0, _path().dirname)(require.resolve('core-js/package.json'));

function _default() {
  return {
    post({
      path,
      opts
    }) {
      path.node.body.forEach(node => {
        if (_utils().t.isImportDeclaration(node)) {
          if (node.source.value.startsWith('core-js/')) {
            node.source.value = node.source.value.replace(/^core-js\//, `${CORE_JS_PATH}/`);
          }
        }
      });
    }

  };
}