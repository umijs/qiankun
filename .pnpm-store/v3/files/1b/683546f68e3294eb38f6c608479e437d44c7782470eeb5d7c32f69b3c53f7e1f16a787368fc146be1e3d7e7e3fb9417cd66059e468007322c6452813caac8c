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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = api => {
  api.describe({
    key: 'mpa',
    config: {
      schema(joi) {
        return joi.object();
      }

    },
    enableBy: api.EnableBy.config
  });
  api.modifyRendererPath(() => {
    return (0, _path().dirname)(require.resolve('@umijs/renderer-mpa/package.json'));
  });
  api.modifyDefaultConfig(memo => {
    // 默认导出 html，并且用 htmlSuffix
    memo.exportStatic = {
      htmlSuffix: true
    }; // 禁用 history 功能
    // @ts-ignore

    memo.history = false;
    return memo;
  });
  api.modifyHTML((memo, {
    route
  }) => {
    memo('head').append(`<script>window.g_path = '${route.path}';</script>`);
    return memo;
  });
};

exports.default = _default;