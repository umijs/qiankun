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

function _requireHook() {
  const data = require("@umijs/bundler-webpack/lib/requireHook");

  _requireHook = function _requireHook() {
    return data;
  };

  return data;
}

function _webpack() {
  const data = require("@umijs/deps/compiled/webpack");

  _webpack = function _webpack() {
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

const debug = (0, _utils().createDebug)('umi:cli:initWebpack');
const DEFAULT_CONFIG_FILES = ['.umirc.ts', '.umirc.js', 'config/config.ts', 'config/config.js'];

function getConfigFile(opts) {
  const configFile = DEFAULT_CONFIG_FILES.filter(file => {
    return (0, _fs().existsSync)((0, _path().join)(opts.cwd, file));
  })[0];
  return configFile ? (0, _path().join)(opts.cwd, configFile) : null;
}

var _default = () => {
  // 1. read user config
  // 2. if have webpack5:
  // 3. init webpack with webpack5 flag
  let cwd = process.cwd();

  if (process.env.APP_ROOT) {
    cwd = (0, _path().join)(cwd, process.env.APP_ROOT);
  }

  const configFile = getConfigFile({
    cwd
  });
  const configContent = configFile ? (0, _fs().readFileSync)(configFile, 'utf-8') : ''; // TODO: detect with ast

  const haveWebpack5 = configContent.includes('webpack5:') && !configContent.includes('// webpack5:') && !configContent.includes('//webpack5:') || configContent.includes('mfsu:') && !configContent.includes('// mfsu:') && !configContent.includes('//mfsu:');
  debug(`haveWebpack5: ${haveWebpack5}`);
  debug(`process.env.USE_WEBPACK_5: ${process.env.USE_WEBPACK_5}`);

  if (haveWebpack5 || process.env.USE_WEBPACK_5) {
    process.env.USE_WEBPACK_5 = '1';
    (0, _webpack().init)(true);
  } else {
    (0, _webpack().init)();
  }

  (0, _requireHook().init)();
};

exports.default = _default;