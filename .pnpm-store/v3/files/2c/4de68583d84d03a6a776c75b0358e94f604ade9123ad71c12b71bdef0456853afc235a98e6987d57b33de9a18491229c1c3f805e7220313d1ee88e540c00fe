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
  api.describe({
    key: 'copy',
    config: {
      schema(joi) {
        return joi.array().items(joi.alternatives(joi.object({
          from: joi.string(),
          to: joi.string()
        }), joi.string()));
      }

    }
  });
};

exports.default = _default;