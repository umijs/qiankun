"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAddOn;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
/**
 * @author Kuitos
 * @since 2020-05-15
 */
function getAddOn(global) {
  return {
    beforeLoad: function beforeLoad() {
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              // eslint-disable-next-line no-param-reassign
              global.__POWERED_BY_QIANKUN__ = true;
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    beforeMount: function beforeMount() {
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              // eslint-disable-next-line no-param-reassign
              global.__POWERED_BY_QIANKUN__ = true;
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    },
    beforeUnmount: function beforeUnmount() {
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              // eslint-disable-next-line no-param-reassign
              delete global.__POWERED_BY_QIANKUN__;
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }))();
    }
  };
}