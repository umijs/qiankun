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
  const deepmerge = api.utils.deepmerge;
  api.describe({
    key: 'forkTSChecker',
    config: {
      schema(joi) {
        return joi.object({
          async: joi.boolean(),
          typescript: joi.alternatives(joi.boolean(), joi.object()),
          eslint: joi.object(),
          issue: joi.object(),
          formatter: joi.alternatives(joi.string(), joi.object()),
          logger: joi.object()
        }).unknown().description('fork-ts-checker-webpack-plugin options see https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#options');
      }

    },
    enableBy: () => {
      var _api$config;

      return process.env.FORK_TS_CHECKER || !!((_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.forkTSChecker);
    }
  });
  api.chainWebpack(webpackConfig => {
    var _api$config2;

    webpackConfig.plugin('fork-ts-checker').use(require('@umijs/deps/compiled/fork-ts-checker-webpack-plugin'), [deepmerge({
      formatter: 'codeframe',
      async: false
    }, ((_api$config2 = api.config) === null || _api$config2 === void 0 ? void 0 : _api$config2.forkTSChecker) || {})]);
    return webpackConfig;
  });
};

exports.default = _default;