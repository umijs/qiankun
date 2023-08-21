"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCSSRule = createCSSRule;
exports.default = _default;

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

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _postcssSafeParser() {
  const data = _interopRequireDefault(require("postcss-safe-parser"));

  _postcssSafeParser = function _postcssSafeParser() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createCSSRule({
  webpackConfig,
  type,
  config,
  lang,
  test,
  isDev,
  loader,
  options,
  browserslist,
  miniCSSExtractPluginLoaderPath
}) {
  const rule = webpackConfig.module.rule(lang).test(test);
  applyLoaders(rule.oneOf('css-modules').resourceQuery(/modules/), true);
  applyLoaders(rule.oneOf('css'), false);

  function applyLoaders(rule, isCSSModules) {
    if (config.styleLoader) {
      rule.use('style-loader').loader(require.resolve('@umijs/deps/compiled/style-loader')).options((0, _utils().deepmerge)({
        base: 0
      }, config.styleLoader));
    } else {
      if (type === _types().BundlerConfigType.csr && !config.styleLoader) {
        rule.use('extract-css-loader').loader(miniCSSExtractPluginLoaderPath || require('../webpack/plugins/mini-css-extract-plugin').loader).options({
          publicPath: './',
          hmr: isDev
        });
      }
    }

    if (isDev && isCSSModules && config.cssModulesTypescriptLoader) {
      rule.use('css-modules-typescript-loader').loader(require.resolve('@umijs/deps/compiled/css-modules-typescript-loader')).options(config.cssModulesTypescriptLoader);
    }

    rule.use('css-loader').loader(require.resolve('@umijs/deps/compiled/css-loader')).options((0, _utils().deepmerge)(_objectSpread(_objectSpread({
      importLoaders: 1
    }, type === _types().BundlerConfigType.ssr ? {
      onlyLocals: true
    } : {}), isCSSModules ? {
      modules: {
        localIdentName: '[local]___[hash:base64:5]'
      }
    } : {}), config.cssLoader || {}));
    rule.use('postcss-loader').loader(require.resolve('postcss-loader')).options((0, _utils().deepmerge)({
      // Necessary for external CSS imports to work
      // https://github.com/facebookincubator/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [// https://github.com/luisrudge/postcss-flexbugs-fixes
      require('postcss-flexbugs-fixes'), // https://github.com/csstools/postcss-preset-env
      require('postcss-preset-env')({
        // TODO: set browsers
        autoprefixer: type === _types().BundlerConfigType.ssr ? false : _objectSpread(_objectSpread({}, config.autoprefixer), {}, {
          overrideBrowserslist: browserslist
        }),
        // https://cssdb.org/
        stage: 3
      }), ...(config.extraPostCSSPlugins ? config.extraPostCSSPlugins : [])]
    }, config.postcssLoader || {}));

    if (loader) {
      rule.use(loader).loader(require.resolve(loader)).options(options || {});
    }
  }
}

function _default({
  type,
  mfsu,
  config,
  webpackConfig,
  isDev,
  disableCompress,
  browserslist,
  miniCSSExtractPluginPath,
  miniCSSExtractPluginLoaderPath
}) {
  // css
  createCSSRule({
    type,
    webpackConfig,
    config,
    isDev,
    lang: 'css',
    test: /\.(css)(\?.*)?$/,
    browserslist,
    miniCSSExtractPluginLoaderPath
  }); // less

  const theme = config.theme;
  createCSSRule({
    type,
    webpackConfig,
    config,
    isDev,
    lang: 'less',
    test: /\.(less)(\?.*)?$/,
    loader: require.resolve('@umijs/deps/compiled/less-loader'),
    options: (0, _utils().deepmerge)({
      modifyVars: theme,
      javascriptEnabled: true
    }, config.lessLoader || {}),
    browserslist,
    miniCSSExtractPluginLoaderPath
  }); // extract css

  if (!config.styleLoader) {
    const hash = !isDev && config.hash ? '.[contenthash:8]' : ''; // only csr generator css files

    if (type === _types().BundlerConfigType.csr) {
      webpackConfig.plugin('extract-css').use(miniCSSExtractPluginPath || require.resolve('../webpack/plugins/mini-css-extract-plugin'), [{
        filename: `[name]${hash}.css`,
        chunkFilename: `[name]${hash}.chunk.css`,
        ignoreOrder: true
      }]);
    }
  }

  if (!isDev && !disableCompress) {
    webpackConfig.plugin('optimize-css').use(require.resolve('@umijs/deps/compiled/optimize-css-assets-webpack-plugin'), [{
      cssProcessorOptions: {
        // https://github.com/postcss/postcss-safe-parser
        // TODO: 待验证功能
        parser: _postcssSafeParser().default
      },
      cssProcessorPluginOptions: {
        preset: ['default', config.cssnano]
      }
    }]);
  }
}