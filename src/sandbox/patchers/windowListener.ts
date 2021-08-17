/* eslint-disable no-param-reassign */
/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { noop } from 'lodash';

const rawAddEventListener = window.addEventListener;
const rawRemoveEventListener = window.removeEventListener;

export default function patch(global: WindowProxy) {
  const listenerMap = new Map<string, EventListenerOrEventListenerObject[]>();

  global.addEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    const listeners = listenerMap.get(type) || [];
    listenerMap.set(type, [...listeners, listener]);
    return rawAddEventListener.call(window, type, listener, options);
  };

  global.removeEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) => {
    const storedTypeListeners = listenerMap.get(type);
    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }
    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach((listeners, type) =>
      [...listeners].forEach((listener) => global.removeEventListener(type, listener)),
    );
    global.addEventListener = rawAddEventListener;
    global.removeEventListener = rawRemoveEventListener;

    return noop;
  };
}
