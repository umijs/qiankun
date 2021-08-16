/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';

const rawWindowAddEventListener = window.addEventListener;
const rawWindowRemoveEventListener = window.removeEventListener;
const rawDocAddEventListener = document.addEventListener;
const rawDocRemoveEventListener = document.removeEventListener;

export default function patch(global: WindowProxy) {
  const windowListenerMap = new Map<string, EventListenerOrEventListenerObject[]>();
  const docListenerMap = new Map<string, EventListenerOrEventListenerObject[]>();

  global.addEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    const listeners = windowListenerMap.get(type) || [];
    windowListenerMap.set(type, [...listeners, listener]);
    return rawWindowAddEventListener.call(window, type, listener, options);
  };
  global.removeEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    const storedTypeListeners = windowListenerMap.get(type);
    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }
    return rawWindowRemoveEventListener.call(window, type, listener, options);
  };

  document.addEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    const listeners = docListenerMap.get(type) || [];
    docListenerMap.set(type, [...listeners, listener]);
    return rawDocAddEventListener.call(document, type, listener, options);
  };
  document.removeEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    const storedTypeListeners = docListenerMap.get(type);
    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }
    return rawDocRemoveEventListener.call(document, type, listener, options);
  };

  return function free() {
    windowListenerMap.forEach((listeners, type) =>
      [...listeners].forEach((listener) => global.removeEventListener(type, listener)),
    );
    docListenerMap.forEach((listeners, type) =>
      [...listeners].forEach((listener) => document.removeEventListener(type, listener)),
    );

    global.addEventListener = rawWindowAddEventListener;
    global.removeEventListener = rawWindowRemoveEventListener;
    document.addEventListener = rawDocAddEventListener;
    document.removeEventListener = rawDocRemoveEventListener;

    return noop;
  };
}
