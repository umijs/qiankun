/**
 * Companion of broken-asset.html: mounts fine even though a preceding external script 404s.
 */
(function (global) {
  global['sub-classic-broken-asset'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function (props) {
      var root = (props && props.container ? props.container : document).querySelector('#broken-asset-root');
      root.innerHTML = '<p data-testid="broken-asset-mounted">mounted despite 404 vendor</p>';
      return Promise.resolve();
    },
    unmount: function () {
      return Promise.resolve();
    },
  };
})(window);
