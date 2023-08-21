import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useRef, useState, useEffect } from 'react';
import raf from "rc-util/es/raf";
export default function useRaf(callback) {
  var rafRef = useRef();
  var removedRef = useRef(false);

  function trigger() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!removedRef.current) {
      raf.cancel(rafRef.current);
      rafRef.current = raf(function () {
        callback.apply(void 0, args);
      });
    }
  }

  useEffect(function () {
    //be compatible with react 18 StrictMode in dev
    removedRef.current = false;
    return function () {
      removedRef.current = true;
      raf.cancel(rafRef.current);
    };
  }, []);
  return trigger;
}
export function useRafState(defaultState) {
  var batchRef = useRef([]);

  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      forceUpdate = _useState2[1];

  var state = useRef(typeof defaultState === 'function' ? defaultState() : defaultState);
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