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
    key: 'devServer',
    config: {
      default: {},

      schema(joi) {
        return joi.object({
          port: joi.number().description('devServer port, default 8000'),
          host: joi.string(),
          https: joi.alternatives(joi.object({
            key: joi.string(),
            cert: joi.string(),
            http2: joi.boolean()
          }).unknown(), joi.boolean()),
          headers: joi.object(),
          writeToDisk: joi.alternatives(joi.boolean(), joi.function())
        }).description('devServer configs').unknown(true);
      }

    }
  });
};

exports.default = _default;