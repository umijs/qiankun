"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReactComponent = isReactComponent;

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

var _parse = require("../utils/parse");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isReactComponent(code) {
  const ast = (0, _parse.parse)(code);
  let hasJSXElement = false;

  _utils().traverse.default(ast, {
    JSXElement(path) {
      hasJSXElement = true;
      path.stop();
    },

    JSXFragment(path) {
      hasJSXElement = true;
      path.stop();
    }

  });

  return hasJSXElement;
}