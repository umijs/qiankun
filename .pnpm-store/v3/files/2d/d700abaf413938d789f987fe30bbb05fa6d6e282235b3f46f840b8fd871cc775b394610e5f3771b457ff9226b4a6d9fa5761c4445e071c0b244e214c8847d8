"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _react() {
  const data = require("react");
  _react = function _react() {
    return data;
  };
  return data;
}
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * execute motions
 * @param wrapper element wrapper
 * @param motions motion data
 * @param cb      callback
 * @param index   current motion index
 */
function runner(wrapper, motions, cb, index = 0) {
  var _container$querySelec;
  if (index < motions.length) {
    const current = motions[index];
    const next = () => runner(wrapper, motions, cb, index + 1);
    const _ref = current.match(/^([^:]+):?(.*)$/) || [],
      _ref2 = _slicedToArray(_ref, 3),
      type = _ref2[1],
      value = _ref2[2];
    switch (type) {
      // controls
      case 'autoplay':
        next();
        break;
      // actions
      case 'click':
        // eslint-disable-next-line no-case-declarations
        const _ref3 = value.match(/^(global\()?(.+?)\)?$/) || [],
          _ref4 = _slicedToArray(_ref3, 3),
          isGlobal = _ref4[1],
          selector = _ref4[2];
        // eslint-disable-next-line no-case-declarations
        const container = isGlobal ? document : wrapper;
        // @ts-ignore
        (_container$querySelec = container.querySelector(selector)) === null || _container$querySelec === void 0 ? void 0 : _container$querySelec.click();
        next();
        break;
      case 'timeout':
        setTimeout(next, Number(value));
        break;
      // boardcasts
      case 'capture':
        window.postMessage({
          type: 'dumi:capture-element',
          value
        }, '*');
        next();
        break;
      default:
        console.warn(`[dumi: motion] unknown motion '${current}', skip.`);
        next();
    }
  } else {
    cb();
  }
}
/**
 * hook for execute dumi motions
 */
var _default = (motions, wrapper) => {
  const _useState = (0, _react().useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isRunning = _useState2[0],
    setIsRunning = _useState2[1];
  const handler = (0, _react().useCallback)(() => {
    if (!isRunning) {
      runner(wrapper, motions, () => {
        setIsRunning(false);
      });
      setIsRunning(true);
    }
  }, [motions, wrapper, isRunning]);
  (0, _react().useEffect)(() => {
    if (motions[0] === 'autoplay' && wrapper) {
      handler();
    }
  }, [motions, wrapper]);
  return [handler, isRunning];
};
exports.default = _default;