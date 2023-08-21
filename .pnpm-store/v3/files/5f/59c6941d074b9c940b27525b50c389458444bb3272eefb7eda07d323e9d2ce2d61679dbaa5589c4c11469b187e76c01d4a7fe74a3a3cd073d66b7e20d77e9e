"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = require("../../context");
var _default = api => {
  api.describe({
    key: 'logo',
    config: {
      schema(joi) {
        return joi.alternatives(joi.string(), joi.boolean());
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  // share config with other source module via context
  api.modifyConfig(memo => {
    (0, _context.setOptions)('logo', memo.logo);
    return memo;
  });
};
exports.default = _default;