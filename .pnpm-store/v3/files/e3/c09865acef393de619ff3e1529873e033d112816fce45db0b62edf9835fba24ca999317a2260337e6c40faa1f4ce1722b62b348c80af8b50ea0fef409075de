"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = require("../../context");
/**
 * plugin for generate apis.json into .umi temp directory
 */
var _default = api => {
  const apis = {};
  const generateApisFile = () => {
    api.writeTmpFile({
      path: 'dumi/apis.json',
      content: JSON.stringify(apis, null, 2)
    });
  };
  // write all apis into .umi dir
  api.onGenerateFiles(() => {
    generateApisFile();
  });
  // register demo detections
  api.register({
    key: 'dumi.detectApi',
    fn({
      identifier,
      data
    }) {
      const isUpdated = Boolean(apis[identifier]);
      apis[identifier] = data;
      if (isUpdated) {
        generateApisFile();
      }
    }
  });
  api.describe({
    key: 'apiParser',
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
    (0, _context.setOptions)('apiParser', memo.apiParser);
    return memo;
  });
};
exports.default = _default;