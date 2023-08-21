"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _terser() {
  const data = require("terser");
  _terser = function _terser() {
    return data;
  };
  return data;
}
var _loader = _interopRequireDefault(require("../../theme/loader"));
var _context = require("../../context");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// initialize data-prefers-color attr for HTML tag
const COLOR_HEAD_SCP = `
(function () {
  var cache = navigator.cookieEnabled && typeof window.localStorage !== 'undefined' ? localStorage.getItem('dumi:prefers-color') : 'auto';
  var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var enums = ['light', 'dark', 'auto'];

  document.documentElement.setAttribute(
    'data-prefers-color',
    cache === enums[2]
      ? (isDark ? enums[1] : enums[0])
      : (enums.indexOf(cache) > -1 ? cache : enums[0])
  );
})();
`;
/**
 * plugin for alias dumi/theme module for export theme API
 */
var _default = api => {
  api.describe({
    key: 'themeConfig',
    config: {
      schema(joi) {
        return joi.object();
      },
      default: {},
      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  // share config with other source module via context
  api.modifyConfig(memo => {
    (0, _context.setOptions)('theme', memo.themeConfig);
    // set alias for builtin default theme
    memo.alias['dumi-theme-default'] = _path().default.dirname(require.resolve('dumi-theme-default/package.json'));
    return memo;
  });
  api.chainWebpack( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (memo) {
      const theme = yield (0, _loader.default)();
      // set alias for dumi theme api
      memo.resolve.alias.set('dumi/theme', _path().default.join(__dirname, '../../theme'));
      // compile theme path for npm linked theme
      if (_fs().default.existsSync(theme.modulePath)) {
        memo.module.rule('js').include.add(_fs().default.realpathSync((yield (0, _loader.default)()).modulePath));
      }
      return memo;
    });
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  // add head script to initialize prefers-color-schema for HTML tag
  api.addHTMLHeadScripts( /*#__PURE__*/_asyncToGenerator(function* () {
    return [{
      content: (yield (0, _terser().minify)(COLOR_HEAD_SCP, {
        ecma: 5
      })).code
    }];
  }));
  // write outer layout to tmp dir
  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'dumi/layout.tsx',
      content: `import React from 'react';
import config from '@@/dumi/config';
import demos from '@@/dumi/demos';
import apis from '@@/dumi/apis';
import Layout from '${api.utils.winPath(_path().default.join(__dirname, '../../theme/layout'))}';

export default (props) => <Layout {...props} config={config} demos={demos} apis={apis} />;
`
    });
  });
};
exports.default = _default;