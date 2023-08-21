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
  api.describe({
    key: 'algolia',
    config: {
      schema(joi) {
        return joi.object({
          apiKey: joi.string().required(),
          indexName: joi.string().required(),
          debug: joi.boolean()
        });
      },

      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  const algolia = api.userConfig.algolia;

  if (algolia) {
    api.addHTMLLinks(() => [{
      href: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css',
      rel: 'stylesheet'
    }]);
    api.addHTMLScripts(() => [{
      src: 'https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js'
    }]);
  }
};

exports.default = _default;