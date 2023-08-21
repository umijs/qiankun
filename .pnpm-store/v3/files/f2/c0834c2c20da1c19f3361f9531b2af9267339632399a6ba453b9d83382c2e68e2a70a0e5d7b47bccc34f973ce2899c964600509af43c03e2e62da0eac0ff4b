"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = require("../../context");
var _default = api => {
  api.describe({
    key: 'mode',
    config: {
      default: 'doc',
      schema(joi) {
        return joi.equal('doc', 'site');
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  // share config with other source module via context
  api.modifyConfig(memo => {
    (0, _context.setOptions)('mode', memo.mode);
    return memo;
  });
};
exports.default = _default;