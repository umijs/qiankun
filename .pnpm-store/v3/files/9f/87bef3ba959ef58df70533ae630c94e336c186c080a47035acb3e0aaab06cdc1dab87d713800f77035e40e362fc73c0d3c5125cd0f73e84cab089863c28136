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

var _default = api => {
  api.addHTMLHeadScripts(() => [{
    content: `//! umi version: ${process.env.UMI_VERSION}`
  }]);
  api.addEntryCode(() => `
    window.g_umi = {
      version: '${process.env.UMI_VERSION}',
    };
  `);
};

exports.default = _default;