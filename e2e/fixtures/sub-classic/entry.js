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

  if (global.__E2E_STORAGE_PROBE__) {
    var storageProbe = String(global.__E2E_STORAGE_PROBE__);
    localStorage.setItem('probe', storageProbe);
    localStorage.namedProbe = storageProbe + '-named';
    localStorage.deleteProbe = 'remove-me';
    var namedDescriptor = Object.getOwnPropertyDescriptor(localStorage, 'namedProbe');
    var deleteSucceeded = delete localStorage.deleteProbe;

    global.__E2E_STORAGE_RESULT__ = localStorage.getItem('probe');
    global.__E2E_STORAGE_NAMED_RESULT__ = localStorage.namedProbe;
    global.__E2E_STORAGE_META_RESULT__ = [
      'has:' + String('namedProbe' in localStorage),
      'keys:' + Object.keys(localStorage).sort().join(','),
      'descriptor:' + String(namedDescriptor && namedDescriptor.value),
      'length:' + String(localStorage.length),
      'indexed:' +
        Array.from({ length: localStorage.length }, function (_, index) {
          return localStorage.key(index);
        })
          .sort()
          .join(','),
      'deleted:' + String(deleteSucceeded && !('deleteProbe' in localStorage)),
    ].join('|');
  }

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
        '</p>' +
        '<p data-testid="classic-extra-global">' +
        String(global.__E2E_CLASSIC_EXTRA__ ?? 'missing') +
        '</p>' +
        '<p data-testid="storage-plugin-result">' +
        String(global.__E2E_STORAGE_RESULT__ ?? 'missing') +
        '</p>' +
        '<p data-testid="storage-plugin-named-result">' +
        String(global.__E2E_STORAGE_NAMED_RESULT__ ?? 'missing') +
        '</p>' +
        '<p data-testid="storage-plugin-meta-result">' +
        String(global.__E2E_STORAGE_META_RESULT__ ?? 'missing') +
        '</p>';
      return Promise.resolve();
    },
    unmount: function () {
      unmountCount++;
      return Promise.resolve();
    },
  };
})(window);
