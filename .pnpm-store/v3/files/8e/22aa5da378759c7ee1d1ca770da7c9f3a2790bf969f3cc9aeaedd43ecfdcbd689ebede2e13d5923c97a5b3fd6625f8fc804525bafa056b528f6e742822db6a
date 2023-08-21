"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBabelPresetOpts = getBabelPresetOpts;
exports.getBabelOpts = getBabelOpts;
exports.getBabelDepsOpts = getBabelDepsOpts;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
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

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getBasicBabelLoaderOpts({
  cwd
}) {
  const prefix = (0, _fs().existsSync)((0, _path().join)(cwd, 'src')) ? (0, _path().join)(cwd, 'src') : cwd;
  return {
    // Tell babel to guess the type, instead assuming all files are modules
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: 'unambiguous',
    babelrc: false,
    cacheDirectory: process.env.BABEL_CACHE !== 'none' ? (0, _utils().winPath)(`${prefix}/.umi/.cache/babel-loader`) : false
  };
}

function getBabelPresetOpts(opts) {
  const config = opts.config;
  return {
    // @ts-ignore
    nodeEnv: opts.env,
    dynamicImportNode: !config.dynamicImport && !config.dynamicImportSyntax,
    autoCSSModules: true,
    svgr: true,
    env: {
      targets: opts.targets
    },
    import: []
  };
}

function getBabelOpts({
  cwd,
  config,
  presetOpts
}) {
  return _objectSpread(_objectSpread({}, getBasicBabelLoaderOpts({
    cwd
  })), {}, {
    presets: [[require.resolve('@umijs/babel-preset-umi/app'), presetOpts], ...(config.extraBabelPresets || [])],
    plugins: [...(config.extraBabelPlugins || [])].filter(Boolean)
  });
}

function getBabelDepsOpts({
  env,
  cwd,
  config
}) {
  return _objectSpread(_objectSpread({}, getBasicBabelLoaderOpts({
    cwd
  })), {}, {
    presets: [[require.resolve('@umijs/babel-preset-umi/dependency'), {
      nodeEnv: env,
      dynamicImportNode: !config.dynamicImport && !config.dynamicImportSyntax
    }]]
  });
}