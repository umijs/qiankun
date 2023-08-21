"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = require("../../context");
/**
 * plugin for enable algolia search engine
 */
var _default = api => {
  api.describe({
    key: 'algolia',
    config: {
      schema(joi) {
        return joi.object({
          appId: joi.string(),
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
  // share config with other source module via context
  api.modifyConfig(memo => {
    (0, _context.setOptions)('algolia', memo.algolia);
    return memo;
  });
};
exports.default = _default;