var preparedReceiver = this === window;
var preparedArguments = arguments.length;
var preparedSource = document.currentScript.src;
(function () {
  'use strict';
  window.__PREPARED_ORDER__.push('entry');
  var count = 0;
  window['sub-classic-prepared'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function () {
      count++;
      document.querySelector('#prepared-root').textContent = JSON.stringify({
        receiver: preparedReceiver,
        args: preparedArguments,
        src: preparedSource,
        inline: window.__PREPARED_INLINE__,
        order: window.__PREPARED_ORDER__.join(','),
        bridgeVisible: Object.getOwnPropertyNames(window).some(function (key) {
          return key.indexOf('__qk_classic_') === 0;
        }),
        count: count,
      });
      return Promise.resolve();
    },
    unmount: function () {
      return Promise.resolve();
    },
  };
})();
