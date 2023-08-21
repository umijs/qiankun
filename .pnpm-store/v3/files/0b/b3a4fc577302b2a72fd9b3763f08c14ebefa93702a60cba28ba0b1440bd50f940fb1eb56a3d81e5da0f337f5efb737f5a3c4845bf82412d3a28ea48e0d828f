"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserConfigWithKey = updateUserConfigWithKey;
exports.getUserConfigWithKey = getUserConfigWithKey;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _setValue() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/set-value"));

  _setValue = function _setValue() {
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

function updateUserConfigWithKey({
  key,
  value,
  userConfig
}) {
  (0, _setValue().default)(userConfig, key, value);
}

function getUserConfigWithKey({
  key,
  userConfig
}) {
  return _utils().lodash.get(userConfig, key);
}