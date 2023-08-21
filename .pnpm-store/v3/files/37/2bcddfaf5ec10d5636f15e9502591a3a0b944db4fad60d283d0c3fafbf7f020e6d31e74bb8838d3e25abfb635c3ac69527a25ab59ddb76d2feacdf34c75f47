"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = require("../../context");
var _default = api => {
  api.describe({
    key: 'locales',
    config: {
      default: [['en-US', 'English'], ['zh-CN', '中文']],
      schema(joi) {
        return joi.array().min(1).items(joi.array().length(2).items(joi.string()));
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  // share config with other source module via context
  api.modifyConfig(memo => {
    (0, _context.setOptions)('locales', memo.locales);
    return memo;
  });
};
exports.default = _default;