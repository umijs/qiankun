import _noop from "lodash/noop";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2019-04-11
 */
var rawWindowInterval = window.setInterval;
var rawWindowClearInterval = window.clearInterval;
export default function patch(global) {
  var intervals = [];
  global.clearInterval = function (intervalId) {
    intervals = intervals.filter(function (id) {
      return id !== intervalId;
    });
    return rawWindowClearInterval.call(window, intervalId);
  };
  global.setInterval = function (handler, timeout) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var intervalId = rawWindowInterval.apply(void 0, [handler, timeout].concat(args));
    intervals = [].concat(_toConsumableArray(intervals), [intervalId]);
    return intervalId;
  };
  return function free() {
    intervals.forEach(function (id) {
      return global.clearInterval(id);
    });
    global.setInterval = rawWindowInterval;
    global.clearInterval = rawWindowClearInterval;
    return _noop;
  };
}