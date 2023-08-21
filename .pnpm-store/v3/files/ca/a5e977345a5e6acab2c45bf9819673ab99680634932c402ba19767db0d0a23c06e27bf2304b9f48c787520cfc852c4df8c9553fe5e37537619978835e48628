"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _jsYaml() {
  const data = _interopRequireDefault(require("js-yaml"));
  _jsYaml = function _jsYaml() {
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
var _default = source => {
  let parsed;
  try {
    parsed = _jsYaml().default.safeLoad(source);
  } catch (err) {/* nothing */}
  const data = typeof parsed === 'object' ? parsed : {};
  // specialize for uuid, to avoid parse as number, error cases: 001, 1e10
  if (data.uuid !== undefined) {
    data.uuid = (0, _utils().winEOL)(source).match(/(?:^|\n)\s*uuid:\s*([^\n]+)/)[1];
  }
  return data;
};
exports.default = _default;