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

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = ({
  defaultConfig,
  config
}) => {
  if (_utils().lodash.isPlainObject(defaultConfig) && _utils().lodash.isPlainObject(config)) {
    return (0, _utils().deepmerge)(defaultConfig, config);
  }

  return typeof config !== 'undefined' ? config : defaultConfig;
};

exports.default = _default;