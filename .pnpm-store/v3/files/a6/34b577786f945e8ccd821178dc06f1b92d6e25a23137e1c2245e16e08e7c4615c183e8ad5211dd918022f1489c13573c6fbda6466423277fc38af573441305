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

var _default = api => {
  api.describe({
    key: 'polyfill',
    config: {
      schema(joi) {
        return joi.object().keys({
          imports: joi.array().items(joi.string()).required().unique()
        });
      }

    },
    enableBy: () => {
      return process.env.BABEL_POLYFILL !== 'none';
    }
  });
  api.addPolyfillImports(() => [{
    source: './core/polyfill'
  }]);
  api.onGenerateFiles(() => {
    const polyfill = api.config.polyfill;
    api.writeTmpFile({
      content: api.utils.Mustache.render((0, _fs().readFileSync)((0, _path().join)(__dirname, 'polyfill.tpl'), 'utf-8'), {
        imports: polyfill && (polyfill === null || polyfill === void 0 ? void 0 : polyfill.imports) ? polyfill.imports : []
      }),
      path: 'core/polyfill.ts'
    });
  });
  api.chainWebpack(memo => {
    memo.resolve.alias.set('regenerator-runtime', (0, _path().dirname)(require.resolve('regenerator-runtime/package')));
    return memo;
  });
};

exports.default = _default;