import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
export default function getAddOn(global) {
  var publicPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
  var hasMountedOnce = false;
  return {
    beforeLoad: function beforeLoad() {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              // eslint-disable-next-line no-param-reassign
              global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
            case 1:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    },
    beforeMount: function beforeMount() {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (hasMountedOnce) {
                // eslint-disable-next-line no-param-reassign
                global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
              }
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }))();
    },
    beforeUnmount: function beforeUnmount() {
      return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (rawPublicPath === undefined) {
                // eslint-disable-next-line no-param-reassign
                delete global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
              } else {
                // eslint-disable-next-line no-param-reassign
                global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
              }
              hasMountedOnce = true;
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }))();
    }
  };
}