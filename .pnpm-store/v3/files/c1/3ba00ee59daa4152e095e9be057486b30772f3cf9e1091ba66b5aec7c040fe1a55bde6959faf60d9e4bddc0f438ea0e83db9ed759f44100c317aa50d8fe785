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

function _types() {
  const data = require("@umijs/types");

  _types = function _types() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = api => {
  api.describe({
    key: 'analyze',
    config: {
      schema(joi) {
        return joi.object({
          analyzerMode: joi.string().valid('server', 'static', 'disabled'),
          analyzerHost: joi.string(),
          analyzerPort: joi.alternatives(joi.number(), 'auto'),
          openAnalyzer: joi.boolean(),
          generateStatsFile: joi.boolean(),
          statsFilename: joi.string(),
          logLevel: joi.string().valid('info', 'warn', 'error', 'silent'),
          defaultSizes: joi.string().valid('stat', 'parsed', 'gzip')
        }).unknown(true);
      },

      default: {
        analyzerMode: process.env.ANALYZE_MODE || 'server',
        analyzerPort: process.env.ANALYZE_PORT || 8888,
        openAnalyzer: process.env.ANALYZE_OPEN !== 'none',
        // generate stats file while ANALYZE_DUMP exist
        generateStatsFile: !!process.env.ANALYZE_DUMP,
        statsFilename: process.env.ANALYZE_DUMP || 'stats.json',
        logLevel: process.env.ANALYZE_LOG_LEVEL || 'info',
        defaultSizes: 'parsed' // stat  // gzip

      }
    },
    enableBy: () => {
      return !!(process.env.ANALYZE || process.env.ANALYZE_SSR);
    }
  });
  api.chainWebpack((webpackConfig, opts) => {
    const type = opts.type,
          mfsu = opts.mfsu;

    if (!mfsu && (type == _types().BundlerConfigType.csr && !process.env.ANALYZE_SSR || type === _types().BundlerConfigType.ssr && !process.env.ANALYZE)) {
      var _api$config;

      webpackConfig.plugin('bundle-analyzer').use(require('@umijs/deps/compiled/umi-webpack-bundle-analyzer').BundleAnalyzerPlugin, [((_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.analyze) || {}]);
    }

    return webpackConfig;
  });
};

exports.default = _default;