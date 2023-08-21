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

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Common {
  formatTiming(timing) {
    return timing < 60 * 1000 ? `${Math.round(timing / 10) / 100}s` : `${Math.round(timing / 600) / 100}m`;
  }

  constructor(namespace) {
    this.debug = void 0;
    this.namespace = void 0;
    this.profilers = void 0;

    // TODO: get namespace filename accounding caller function
    if (!namespace) {
      throw new Error(`logger needs namespace`);
    }

    this.namespace = namespace;
    this.profilers = {};
    this.debug = (0, _utils().createDebug)(this.namespace);
  }

}

var _default = Common;
exports.default = _default;