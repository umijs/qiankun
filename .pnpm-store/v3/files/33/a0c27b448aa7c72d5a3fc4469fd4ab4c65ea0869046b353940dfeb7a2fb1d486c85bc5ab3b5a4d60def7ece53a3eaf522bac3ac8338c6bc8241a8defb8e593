"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadDotEnv;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _dotenv() {
  const data = require("@umijs/deps/compiled/dotenv");

  _dotenv = function _dotenv() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * dotenv wrapper
 * @param envPath string
 */
function loadDotEnv(envPath) {
  if ((0, _fs().existsSync)(envPath)) {
    const parsed = (0, _dotenv().parse)((0, _fs().readFileSync)(envPath, 'utf-8')) || {};
    Object.keys(parsed).forEach(key => {
      // eslint-disable-next-line no-prototype-builtins
      if (!process.env.hasOwnProperty(key)) {
        process.env[key] = parsed[key];
      }
    });
  }
}