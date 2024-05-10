"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAddOns;
var _concat2 = _interopRequireDefault(require("lodash/concat"));
var _mergeWith2 = _interopRequireDefault(require("lodash/mergeWith"));
var _engineFlag = _interopRequireDefault(require("./engineFlag"));
var _runtimePublicPath = _interopRequireDefault(require("./runtimePublicPath"));
/**
 * @author Kuitos
 * @since 2020-03-02
 */

function getAddOns(global, publicPath) {
  return (0, _mergeWith2.default)({}, (0, _engineFlag.default)(global), (0, _runtimePublicPath.default)(global, publicPath), function (v1, v2) {
    return (0, _concat2.default)(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
  });
}