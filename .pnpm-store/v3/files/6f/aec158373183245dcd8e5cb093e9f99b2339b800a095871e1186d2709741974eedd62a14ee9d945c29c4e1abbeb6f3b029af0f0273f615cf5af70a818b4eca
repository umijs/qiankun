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
    key: 'proxy',
    config: {
      onChange: () => {
        const server = api.getServer();

        if (server) {
          // refrest proxy service
          server.setupProxy(api.config.proxy, true);
        }
      },

      schema(joi) {
        return joi.object();
      }

    }
  });
};

exports.default = _default;