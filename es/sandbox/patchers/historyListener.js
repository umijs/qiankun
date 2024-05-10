import _isFunction from "lodash/isFunction";
import _noop from "lodash/noop";
/**
 * @author Kuitos
 * @since 2019-04-11
 */
export default function patch() {
  // FIXME umi unmount feature request
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var rawHistoryListen = function rawHistoryListen(_) {
    return _noop;
  };
  var historyListeners = [];
  var historyUnListens = [];
  if (window.g_history && _isFunction(window.g_history.listen)) {
    rawHistoryListen = window.g_history.listen.bind(window.g_history);
    window.g_history.listen = function (listener) {
      historyListeners.push(listener);
      var unListen = rawHistoryListen(listener);
      historyUnListens.push(unListen);
      return function () {
        unListen();
        historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
        historyListeners.splice(historyListeners.indexOf(listener), 1);
      };
    };
  }
  return function free() {
    var rebuild = _noop;
    /*
     还存在余量 listener 表明未被卸载，存在两种情况
     1. 应用在 unmout 时未正确卸载 listener
     2. listener 是应用 mount 之前绑定的，
     第二种情况下应用在下次 mount 之前需重新绑定该 listener
     */
    if (historyListeners.length) {
      rebuild = function rebuild() {
        // 必须使用 window.g_history.listen 的方式重新绑定 listener，从而能保证 rebuild 这部分也能被捕获到，否则在应用卸载后无法正确的移除这部分副作用
        historyListeners.forEach(function (listener) {
          return window.g_history.listen(listener);
        });
      };
    }
    // 卸载余下的 listener
    historyUnListens.forEach(function (unListen) {
      return unListen();
    });
    // restore
    if (window.g_history && _isFunction(window.g_history.listen)) {
      window.g_history.listen = rawHistoryListen;
    }
    return rebuild;
  };
}