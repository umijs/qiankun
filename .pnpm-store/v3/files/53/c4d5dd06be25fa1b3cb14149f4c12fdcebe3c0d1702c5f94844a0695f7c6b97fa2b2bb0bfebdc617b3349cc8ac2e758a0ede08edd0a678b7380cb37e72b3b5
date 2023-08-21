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
  api.chainWebpack(memo => {
    if (process.env.UMI_DIR) {
      memo.resolve.alias.set('umi', process.env.UMI_DIR);
    }

    return memo;
  });
};

exports.default = _default;