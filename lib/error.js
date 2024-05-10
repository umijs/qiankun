"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QiankunError = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _createSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/createSuper"));
var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));
var QiankunError = exports.QiankunError = /*#__PURE__*/function (_Error) {
  (0, _inherits2.default)(QiankunError, _Error);
  var _super = (0, _createSuper2.default)(QiankunError);
  function QiankunError(message) {
    (0, _classCallCheck2.default)(this, QiankunError);
    return _super.call(this, "[qiankun]: ".concat(message));
  }
  return (0, _createClass2.default)(QiankunError);
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(Error));