"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBabelOptions = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

var _context = _interopRequireDefault(require("../../context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getBabelOptions = ({
  isTSX,
  fileAbsPath,
  transformRuntime
}) => {
  var _ctx$umi, _ctx$umi$config, _ctx$umi2, _ctx$umi2$config;

  return {
    // rename filename.md to filename.tsx to prevent babel transform failed
    filename: isTSX ? fileAbsPath.replace(/\.\w+$/, '.tsx') : fileAbsPath,
    presets: [[require.resolve('@umijs/babel-preset-umi/app'), _objectSpread({
      reactRequire: false,
      typescript: isTSX
    }, transformRuntime === undefined ? {} : {
      transformRuntime
    })], ...(((_ctx$umi = _context.default.umi) === null || _ctx$umi === void 0 ? void 0 : (_ctx$umi$config = _ctx$umi.config) === null || _ctx$umi$config === void 0 ? void 0 : _ctx$umi$config.extraBabelPresets) || [])],
    plugins: [[require.resolve('@babel/plugin-transform-modules-commonjs'), {
      strict: true
    }], ...(((_ctx$umi2 = _context.default.umi) === null || _ctx$umi2 === void 0 ? void 0 : (_ctx$umi2$config = _ctx$umi2.config) === null || _ctx$umi2$config === void 0 ? void 0 : _ctx$umi2$config.extraBabelPlugins) || [])],
    ast: true,
    babelrc: false,
    configFile: false
  };
};

exports.getBabelOptions = getBabelOptions;