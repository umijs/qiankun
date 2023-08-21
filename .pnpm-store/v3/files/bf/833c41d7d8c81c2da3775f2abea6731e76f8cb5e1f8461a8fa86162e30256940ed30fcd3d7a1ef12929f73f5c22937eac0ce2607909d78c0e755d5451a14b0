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
    key: 'cssLoader',
    config: {
      schema(joi) {
        return joi.object({
          url: joi.alternatives(joi.boolean(), joi.function()),
          import: joi.alternatives(joi.boolean(), joi.function()),
          modules: joi.alternatives(joi.boolean(), joi.string(), joi.object()),
          sourceMap: joi.boolean(),
          importLoaders: joi.number(),
          onlyLocals: joi.boolean(),
          esModule: joi.boolean(),
          localsConvention: joi.string().valid('asIs', 'camelCase', 'camelCaseOnly', 'dashes', 'dashesOnly')
        }).description('more css-loader options see https://webpack.js.org/loaders/css-loader/#options');
      }

    }
  });
};

exports.default = _default;