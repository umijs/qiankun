"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.feedback = feedback;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

var _index = require("../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function feedback() {
  // don't print feedback in bigfish framework
  if (process.env.BIGFISH_VERSION) return;
  if (process.env.FB_TIPS === 'none') return;
  console.info(_index.chalk.black.bgGreen.bold(' info '), _index.chalk.green.bold('如果你需要进交流群，请访问 https://fb.umijs.org'));
}