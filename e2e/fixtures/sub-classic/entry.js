/**
 * Classic (non-ESM) sub app: exposes lifecycles on the global, the way UMD builds do.
 * Counters live in the closure — scripts are NOT re-executed on remount, so they let
 * tests assert qiankun's lifecycle caching behavior precisely.
 */
(function (global) {
  var bootstrapCount = 0;
  var mountCount = 0;
  var unmountCount = 0;

  // pollute the sandboxed window; must never be visible from the main realm
  global.__CLASSIC_POLLUTION__ = 'from-sub-classic';

  global['sub-classic'] = {
    bootstrap: function () {
      bootstrapCount++;
      return Promise.resolve();
    },
    mount: function (props) {
      mountCount++;
      var root = (props && props.container ? props.container : document).querySelector('#classic-root');
      root.innerHTML =
        '<h1 data-testid="classic-title">classic mounted</h1>' +
        '<p data-testid="classic-counters">bootstrap:' +
        bootstrapCount +
        ',mount:' +
        mountCount +
        ',unmount:' +
        unmountCount +
        '</p>' +
        // read a main-realm global through the sandbox: must be visible inside it
        '<p data-testid="classic-main-global">' +
        String(global.__MAIN_GLOBAL__) +
        '</p>';
      return Promise.resolve();
    },
    unmount: function () {
      unmountCount++;
      return Promise.resolve();
    },
  };
})(window);
