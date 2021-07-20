/* eslint-disable no-param-reassign */
/**
 * @author tang-haibo
 * @since 2021-06-30
 */
import { noop } from 'lodash';

const createKey = (prefix: string) => {
  return (key: string) => {
    return `[${prefix}]${key}`;
  };
};

const proxyStorage = (fn: 'localStorage' | 'sessionStorage') => {
  return (global: Window, appName: string) => {
    const getKey = createKey(appName);
    const { setItem } = window[fn];
    const { getItem } = window[fn];
    const { removeItem } = window[fn];
    const { clear } = window[fn];

    global[fn].setItem = (key: string, value: string) => {
      return setItem.call(window[fn], getKey(key), value);
    };
    global[fn].getItem = (key: string) => {
      return getItem.call(window[fn], getKey(key));
    };
    global[fn].removeItem = (key: string) => {
      return removeItem.call(window[fn], getKey(key));
    };
    global[fn].clear = () => {
      const prefix = getKey('');
      for (let i = 0; i < window[fn].length; i++) {
        const key = window[fn].key(i);
        if (key !== null && prefix === key.substring(0, prefix.length)) {
          removeItem.call(window[fn], key);
        }
        i--;
      }
    };

    return () => {
      global[fn].setItem = setItem;
      global[fn].getItem = getItem;
      global[fn].clear = clear;
      global[fn].removeItem = removeItem;
    };
  };
};

export default function patch(global: Window, appName: string) {
  const SessionStorage = proxyStorage('sessionStorage');
  const LocalStorage = proxyStorage('localStorage');
  const cancelSessionStorage = SessionStorage(global, appName);
  const cancelLocalStorage = LocalStorage(global, appName);
  return function free() {
    cancelSessionStorage();
    cancelLocalStorage();
    return noop;
  };
}
