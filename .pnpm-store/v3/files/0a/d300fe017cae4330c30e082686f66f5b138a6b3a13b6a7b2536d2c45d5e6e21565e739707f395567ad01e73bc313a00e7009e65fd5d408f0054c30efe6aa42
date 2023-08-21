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

function _types() {
  const data = require("@umijs/types");

  _types = function _types() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default({
  config,
  type
}) {
  let targets = config.targets || {};
  targets = Object.keys(targets).filter(key => {
    // filter false and 0 targets
    if (targets[key] === false) return false;
    if (type === _types().BundlerConfigType.ssr) return key === 'node';else return key !== 'node';
  }).reduce((memo, key) => {
    memo[key] = targets[key];
    return memo;
  }, {});
  const browserslist = targets.browsers || Object.keys(targets).map(key => {
    return `${key} >= ${targets[key] === true ? '0' : targets[key]}`;
  });
  return {
    targets,
    browserslist
  };
}