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

const normalizeOptions = (rawOptions?: boolean | AddEventListenerOptions): AddEventListenerOptions => {
  if (typeof rawOptions === 'object') {
    return rawOptions ?? DEFAULT_OPTIONS;
  }
  return { capture: !!rawOptions, once: false, passive: false };
};

const findListenerIndex = (
  listeners: ListenerMapObject[],
  rawListener: EventListenerOrEventListenerObject,
  options: AddEventListenerOptions,
): number =>
  listeners.findIndex((item) => item.rawListener === rawListener && item.options.capture === options.capture);

const removeCacheListener = (
  listenerMap: Map<string, ListenerMapObject[]>,
  type: string,
  rawListener: EventListenerOrEventListenerObject,
  rawOptions?: boolean | AddEventListenerOptions,
): ListenerMapObject => {
  const options = normalizeOptions(rawOptions);
  const cachedTypeListeners = listenerMap.get(type) || [];

  const findIndex = findListenerIndex(cachedTypeListeners, rawListener, options);
  if (findIndex > -1) {
    return cachedTypeListeners.splice(findIndex, 1)[0];
  }

  return { listener: rawListener, rawListener, options };
};

const addCacheListener = (
  listenerMap: Map<string, ListenerMapObject[]>,
  type: string,
  rawListener: EventListenerOrEventListenerObject,
  rawOptions?: boolean | AddEventListenerOptions,
): ListenerMapObject | undefined => {
  const options = normalizeOptions(rawOptions);
  const cachedTypeListeners = listenerMap.get(type) || [];

  const findIndex = findListenerIndex(cachedTypeListeners, rawListener, options);
  // avoid duplicated listener in the listener list
  if (findIndex > -1) return;

  let listener: EventListenerOrEventListenerObject = rawListener;
  if (options.once) {
    listener = (event: Event) => {
      (rawListener as EventListener)(event);
      removeCacheListener(listenerMap, type, rawListener, options);
    };
  }

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
    const addListener = addCacheListener(listenerMap, type, rawListener, rawOptions);

    if (!addListener) return;
    return rawAddEventListener.call(global, type, addListener.listener, addListener.options);
  };

  global.removeEventListener = (
    type: string,
    rawListener: EventListenerOrEventListenerObject,
    rawOptions?: boolean | AddEventListenerOptions,
  ) => {
    const { listener, options } = removeCacheListener(listenerMap, type, rawListener, rawOptions);
    return rawRemoveEventListener.call(global, type, listener, options);
  };

  return function free() {
    listenerMap.forEach((listeners, type) => {
      listeners.forEach(({ rawListener, options }) => {
        global.removeEventListener(type, rawListener, options);
      });
    });
    listenerMap.clear();
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;
    return noop;
  };
}
