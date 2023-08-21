"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regeneratorRuntime2 = _interopRequireDefault(require("@babel/runtime/helpers/regeneratorRuntime"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _raf = _interopRequireDefault(require("rc-util/lib/raf"));

var _useState3 = _interopRequireDefault(require("rc-util/lib/hooks/useState"));

var StatusQueue = ['measure', 'alignPre', 'align', null, 'motion'];

var _default = function _default(visible, doMeasure) {
  var _useState = (0, _useState3.default)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      status = _useState2[0],
      setInternalStatus = _useState2[1];

  var rafRef = (0, _react.useRef)();

  function setStatus(nextStatus) {
    setInternalStatus(nextStatus, true);
  }

  function cancelRaf() {
    _raf.default.cancel(rafRef.current);
  }

  function goNextStatus(callback) {
    cancelRaf();
    rafRef.current = (0, _raf.default)(function () {
      // Only align should be manually trigger
      setStatus(function (prev) {
        switch (status) {
          case 'align':
            return 'motion';

          case 'motion':
            return 'stable';

          default:
        }

        return prev;
      });
      callback === null || callback === void 0 ? void 0 : callback();
    });
  } // Init status


  (0, _react.useEffect)(function () {
    setStatus('measure');
  }, [visible]); // Go next status

  (0, _react.useEffect)(function () {
    switch (status) {
      case 'measure':
        doMeasure();
        break;

      default:
    }

    if (status) {
      rafRef.current = (0, _raf.default)( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/(0, _regeneratorRuntime2.default)().mark(function _callee() {
        var index, nextStatus;
        return (0, _regeneratorRuntime2.default)().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                index = StatusQueue.indexOf(status);
                nextStatus = StatusQueue[index + 1];

                if (nextStatus && index !== -1) {
                  setStatus(nextStatus);
                }

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      })));
    }
  }, [status]);
  (0, _react.useEffect)(function () {
    return function () {
      cancelRaf();
    };
  }, []);
  return [status, goNextStatus];
};

exports.default = _default;