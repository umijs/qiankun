"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useRaf;
exports.useRafState = useRafState;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _raf = _interopRequireDefault(require("rc-util/lib/raf"));

function useRaf(callback) {
  var rafRef = (0, _react.useRef)();
  var removedRef = (0, _react.useRef)(false);

  function trigger() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!removedRef.current) {
      _raf.default.cancel(rafRef.current);

      rafRef.current = (0, _raf.default)(function () {
        callback.apply(void 0, args);
      });
    }
  }

  (0, _react.useEffect)(function () {
    //be compatible with react 18 StrictMode in dev
    removedRef.current = false;
    return function () {
      removedRef.current = true;

      _raf.default.cancel(rafRef.current);
    };
  }, []);
  return trigger;
}

function useRafState(defaultState) {
  var batchRef = (0, _react.useRef)([]);

  var _useState = (0, _react.useState)({}),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      forceUpdate = _useState2[1];

  var state = (0, _react.useRef)(typeof defaultState === 'function' ? defaultState() : defaultState);
  var flushUpdate = useRaf(function () {
    var current = state.current;
    batchRef.current.forEach(function (callback) {
      current = callback(current);
    });
    batchRef.current = [];
    state.current = current;
    forceUpdate({});
  });

  function updater(callback) {
    batchRef.current.push(callback);
    flushUpdate();
  }

  return [state.current, updater];
}