import _regeneratorRuntime from "@babel/runtime/helpers/esm/regeneratorRuntime";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect, useRef } from 'react';
import raf from "rc-util/es/raf";
import useState from "rc-util/es/hooks/useState";
/**
 * Popup should follow the steps for each component work correctly:
 * measure - check for the current stretch size
 * align - let component align the position
 * aligned - re-align again in case additional className changed the size
 * afterAlign - choice next step is trigger motion or finished
 * beforeMotion - should reset motion to invisible so that CSSMotion can do normal motion
 * motion - play the motion
 * stable - everything is done
 */

var StatusQueue = ['measure', 'alignPre', 'align', null, 'motion'];
export default (function (visible, doMeasure) {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      status = _useState2[0],
      setInternalStatus = _useState2[1];

  var rafRef = useRef();

  function setStatus(nextStatus) {
    setInternalStatus(nextStatus, true);
  }

  function cancelRaf() {
    raf.cancel(rafRef.current);
  }

  function goNextStatus(callback) {
    cancelRaf();
    rafRef.current = raf(function () {
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


  useEffect(function () {
    setStatus('measure');
  }, [visible]); // Go next status

  useEffect(function () {
    switch (status) {
      case 'measure':
        doMeasure();
        break;

      default:
    }

    if (status) {
      rafRef.current = raf( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var index, nextStatus;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
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
  useEffect(function () {
    return function () {
      cancelRaf();
    };
  }, []);
  return [status, goNextStatus];
});