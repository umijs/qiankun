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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = api => {
  const createDebug = api.utils.createDebug;
  const debug = createDebug('umi:preset-build-in:fastRefresh');
  /**
   * enable by default, back up using view rerender
   * ssr can't work with fastRefresh
   */

  api.describe({
    key: 'fastRefresh',
    config: {
      schema(joi) {
        return joi.object();
      }

    },
    enableBy: api.EnableBy.config
  });
  api.chainWebpack((memo, {
    type,
    mfsu
  }) => {
    // must add api.env, test env needed.
    if (!mfsu && api.env === 'development' && type === _types().BundlerConfigType.csr) {
      memo.plugin('fastRefresh').after('hmr').use(require('../../../bundled/@pmmmwh/react-refresh-webpack-plugin/lib'), [{
        overlay: false
      }]);
      debug('FastRefresh webpack loaded');
    }

    return memo;
  }); // enable no-anonymous-default-export

  api.modifyBabelPresetOpts((opts, {
    type,
    mfsu
  }) => {
    if (!mfsu && api.env === 'development' && type === _types().BundlerConfigType.csr) {
      return _objectSpread(_objectSpread({}, opts), {}, {
        noAnonymousDefaultExport: true
      });
    }

    return opts;
  });
  api.modifyBabelOpts({
    fn: (babelOpts, {
      type,
      mfsu
    }) => {
      if (!mfsu && api.env === 'development' && type === _types().BundlerConfigType.csr) {
        babelOpts.plugins.push([require.resolve('react-refresh/babel')]);
        debug('FastRefresh babel loaded');
      }

      return babelOpts;
    },
    stage: Infinity
  });
};

exports.default = _default;