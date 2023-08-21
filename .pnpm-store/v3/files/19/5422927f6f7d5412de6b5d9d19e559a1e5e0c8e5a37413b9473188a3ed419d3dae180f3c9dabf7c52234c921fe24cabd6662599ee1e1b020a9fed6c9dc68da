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
    key: 'manifest',
    config: {
      schema(joi) {
        return joi.object({
          fileName: joi.string(),
          // eggjs need
          publicPath: joi.string().allow(''),
          basePath: joi.string(),
          writeToFileEmit: joi.boolean()
        });
      }

    }
  });
};

exports.default = _default;