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
    key: 'title',
    config: {
      schema(joi) {
        return joi.string();
      }

    }
  });
  api.modifyHTML(($, {
    route
  }) => {
    const title = route.title || api.config.title;

    if (title && (api.config.exportStatic || api.config.ssr)) {
      const titleEl = $('head > title');

      if (titleEl.length) {
        titleEl.html(title);
      } else {
        $('head').append(`<title>${title}</title>`);
      }
    }

    return $;
  });
};

exports.default = _default;