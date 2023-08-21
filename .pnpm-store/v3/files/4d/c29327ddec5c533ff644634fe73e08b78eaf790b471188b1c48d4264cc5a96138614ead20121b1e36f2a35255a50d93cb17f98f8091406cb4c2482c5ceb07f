"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(api) {
  api.describe({
    key: 'favicon',
    config: {
      schema(joi) {
        return joi.string();
      },

      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  api.addHTMLLinks(() => {
    return api.config.favicon ? [{
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: api.config.favicon
    }] : [];
  });
}