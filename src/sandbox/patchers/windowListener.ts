/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';

const rawAddEventListener = window.addEventListener;
const rawRemoveEventListener = window.removeEventListener;

type ListenerMapObject = {
  listener: EventListenerOrEventListenerObject;
  options: AddEventListenerOptions;
  rawListener: EventListenerOrEventListenerObject;
};

const DEFAULT_OPTIONS: AddEventListenerOptions = { capture: false, once: false, passive: false };

// 移除cacheListener
const removeCacheListener = (
  listenerMap: Map<string, ListenerMapObject[]>,
  type: string,
  rawListener: EventListenerOrEventListenerObject,
  rawOptions?: boolean | AddEventListenerOptions
): ListenerMapObject => {
  // 处理 options，确保它是一个对象
  let options = typeof rawOptions === 'object' ? rawOptions : { capture: !!rawOptions };
  // 如果 options 为 null，使用默认值
  options = options ?? DEFAULT_OPTIONS;

  const cachedTypeListeners = listenerMap.get(type) || [];
  // listener和capture/useCapture都相同，认为是同一个监听
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
  const findIndex = cachedTypeListeners.findIndex(
    item => item.rawListener === rawListener && item.options.capture == options.capture
  );
  if (findIndex > -1) {
    const cacheListener = cachedTypeListeners[findIndex];
    cachedTypeListeners.splice(findIndex, 1);
    return cacheListener;
  }

  // 返回原始listener和options
  return { listener: rawListener, rawListener, options };
};

// 添加监听构造一个cacheListener对象，考虑到多次添加同一个监听和once的情况
const addCacheListener = (
  listenerMap: Map<string, ListenerMapObject[]>,
  type: string,
  rawListener: EventListenerOrEventListenerObject,
  rawOptions?: boolean | AddEventListenerOptions
): ListenerMapObject => {
  // 处理 options，确保它是一个对象
  let options = typeof rawOptions === 'object' ? rawOptions : { capture: !!rawOptions };
  // 如果 options 为 null，使用默认值
  options = options ?? DEFAULT_OPTIONS;

  const cachedTypeListeners = listenerMap.get(type) || [];
  // listener和capture/useCapture都相同，认为是同一个监听
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
  const findIndex = cachedTypeListeners.findIndex(
    item => item.rawListener === rawListener && item.options.capture == options.capture
  );
  if (findIndex > -1) {
    const { listener: findListener, options: findOptions } = cachedTypeListeners[findIndex];
    // 如果存在相同的监听，先移除之前的监听，在添加新的监听
    rawRemoveEventListener.call(window, type, findListener, findOptions);
    cachedTypeListeners.splice(findIndex, 1);
  }
  let listener: EventListenerOrEventListenerObject = rawListener;

  if (options.once) listener = (event: Event) => {
    (rawListener as EventListener)(event);
    removeCacheListener(listenerMap, type, rawListener, options);
  };
  const cacheListener = { listener, options, rawListener };
  listenerMap.set(type, [...cachedTypeListeners, cacheListener]);
  return cacheListener;
};

export default function patch(global: WindowProxy) {
  const listenerMap = new Map<string, ListenerMapObject[]>();

  global.addEventListener = (
    type: string,
    rawListener: EventListenerOrEventListenerObject,
    rawOptions?: boolean | AddEventListenerOptions,
  ) => {
    const { listener, options } = addCacheListener(listenerMap, type, rawListener, rawOptions);
    return rawAddEventListener.call(window, type, listener, options);
  };

  global.removeEventListener = (
    type: string,
    rawListener: EventListenerOrEventListenerObject,
    rawOptions?: boolean | AddEventListenerOptions,
  ) => {
    const { listener, options } = removeCacheListener(listenerMap, type, rawListener, rawOptions);
    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach((listeners, type) =>
      [...listeners].forEach(({ rawListener, options }) => 
        global.removeEventListener(type, rawListener, options)
    ));
    // 清空listenerMap，避免listenerMap中还存有listener导致内存泄漏
    listenerMap.clear();
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;

    return noop;
  };
}
