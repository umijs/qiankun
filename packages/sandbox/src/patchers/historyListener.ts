/**
 * @author Kuitos
 * @since 2019-04-11
 */

import { isFunction, noop } from 'lodash';

declare global {
  interface Window {
    g_history?: {
      listen: (listener: typeof noop) => () => void;
    };
  }
}

export default function patch() {
  // FIXME umi unmount feature request
  let rawHistoryListen = (_: unknown) => noop;
  const historyListeners: Array<typeof noop> = [];
  const historyUnListens: Array<typeof noop> = [];

  if (window.g_history && isFunction(window.g_history.listen)) {
    rawHistoryListen = window.g_history.listen.bind(window.g_history) as typeof rawHistoryListen;

    window.g_history.listen = (listener: typeof noop) => {
      historyListeners.push(listener);

      const unListen = rawHistoryListen(listener);
      historyUnListens.push(unListen);

      return () => {
        unListen();
        historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
        historyListeners.splice(historyListeners.indexOf(listener), 1);
      };
    };
  }

  return function free() {
    let rebuild = () => Promise.resolve();

    /*
     还存在余量 listener 表明未被卸载，存在两种情况
     1. 应用在 unmount 时未正确卸载 listener
     2. listener 是应用 mount 之前绑定的，
     第二种情况下应用在下次 mount 之前需重新绑定该 listener
     */
    if (historyListeners.length) {
      rebuild = async () => {
        // 必须使用 window.g_history.listen 的方式重新绑定 listener，从而能保证 rebuild 这部分也能被捕获到，否则在应用卸载后无法正确的移除这部分副作用
        historyListeners.forEach((listener) => window.g_history?.listen(listener));
      };
    }

    // 卸载余下的 listener
    historyUnListens.forEach((unListen) => unListen());

    // restore
    if (window.g_history && isFunction(window.g_history.listen)) {
      window.g_history.listen = rawHistoryListen;
    }

    return rebuild;
  };
}
