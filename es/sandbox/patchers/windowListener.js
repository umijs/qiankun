import _noop from "lodash/noop";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _typeof from "@babel/runtime/helpers/esm/typeof";
/**
 * @author Kuitos
 * @since 2019-04-11
 */
var rawAddEventListener = window.addEventListener;
var rawRemoveEventListener = window.removeEventListener;
var DEFAULT_OPTIONS = {
  capture: false,
  once: false,
  passive: false
};
var normalizeOptions = function normalizeOptions(rawOptions) {
  if (_typeof(rawOptions) === 'object') {
    return rawOptions !== null && rawOptions !== void 0 ? rawOptions : DEFAULT_OPTIONS;
  }
  return {
    capture: !!rawOptions,
    once: false,
    passive: false
  };
};
var findListenerIndex = function findListenerIndex(listeners, rawListener, options) {
  return listeners.findIndex(function (item) {
    return item.rawListener === rawListener && item.options.capture === options.capture;
  });
};
var removeCacheListener = function removeCacheListener(listenerMap, type, rawListener, rawOptions) {
  var options = normalizeOptions(rawOptions);
  var cachedTypeListeners = listenerMap.get(type) || [];
  var findIndex = findListenerIndex(cachedTypeListeners, rawListener, options);
  if (findIndex > -1) {
    return cachedTypeListeners.splice(findIndex, 1)[0];
  }
  return {
    listener: rawListener,
    rawListener: rawListener,
    options: options
  };
};
var addCacheListener = function addCacheListener(listenerMap, type, rawListener, rawOptions) {
  var options = normalizeOptions(rawOptions);
  var cachedTypeListeners = listenerMap.get(type) || [];
  var findIndex = findListenerIndex(cachedTypeListeners, rawListener, options);
  // avoid duplicated listener in the listener list
  if (findIndex > -1) return;
  var listener = rawListener;
  if (options.once) {
    listener = function listener(event) {
      rawListener(event);
      removeCacheListener(listenerMap, type, rawListener, options);
    };
  }
  var cacheListener = {
    listener: listener,
    options: options,
    rawListener: rawListener
  };
  listenerMap.set(type, [].concat(_toConsumableArray(cachedTypeListeners), [cacheListener]));
  return cacheListener;
};
export default function patch(global) {
  var listenerMap = new Map();
  global.addEventListener = function (type, rawListener, rawOptions) {
    var addListener = addCacheListener(listenerMap, type, rawListener, rawOptions);
    if (!addListener) return;
    return rawAddEventListener.call(global, type, addListener.listener, addListener.options);
  };
  global.removeEventListener = function (type, rawListener, rawOptions) {
    var _removeCacheListener = removeCacheListener(listenerMap, type, rawListener, rawOptions),
      listener = _removeCacheListener.listener,
      options = _removeCacheListener.options;
    return rawRemoveEventListener.call(global, type, listener, options);
  };
  return function free() {
    listenerMap.forEach(function (listeners, type) {
      listeners.forEach(function (_ref) {
        var rawListener = _ref.rawListener,
          options = _ref.options;
        global.removeEventListener(type, rawListener, options);
      });
    });
    listenerMap.clear();
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;
    return _noop;
  };
}