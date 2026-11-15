(function (global) {
  var mountCount = 0;
  var unmountCount = 0;
  var pingCount = 0;
  var pingHandler = null;

  global['sub-binding-b'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: async function (props) {
      mountCount += 1;
      if (props && typeof props.onEvent === 'function') {
        props.onEvent('mount:b-start');
      }

      if (pingHandler) {
        window.removeEventListener('binding-b-ping', pingHandler);
      }
      pingHandler = function () {
        pingCount += 1;
        document.documentElement.setAttribute('data-binding-b-pings', String(pingCount));
      };
      window.addEventListener('binding-b-ping', pingHandler);
      document.documentElement.setAttribute('data-binding-b-state', 'mounted');
      document.documentElement.setAttribute('data-binding-b-pings', String(pingCount));

      if (props && typeof props.bMountGate === 'function') {
        await props.bMountGate();
      }

      var root = (props && props.container ? props.container : document).querySelector('#binding-target-b-root');
      if (root) {
        root.innerHTML =
          '<h2 data-testid="binding-b-title">binding-b</h2>' +
          '<p data-testid="binding-b-props">label:' +
          ((props && props.label) || 'none') +
          '</p>' +
          '<p data-testid="binding-b-mounts">' +
          mountCount +
          '</p>';
      }

      if (props && typeof props.onEvent === 'function') {
        props.onEvent('mount:b-done');
      }
    },
    unmount: async function (props) {
      unmountCount += 1;
      if (props && typeof props.onEvent === 'function') {
        props.onEvent('unmount:b-start');
      }
      if (props && typeof props.bUnmountGate === 'function') {
        await props.bUnmountGate();
      }
      if (pingHandler) {
        window.removeEventListener('binding-b-ping', pingHandler);
        pingHandler = null;
      }
      var root = (props && props.container ? props.container : document).querySelector('#binding-target-b-root');
      if (root) root.innerHTML = '';
      document.documentElement.setAttribute('data-binding-b-state', 'unmounted');
      document.documentElement.setAttribute('data-binding-b-unmounts', String(unmountCount));
      if (props && typeof props.onEvent === 'function') {
        props.onEvent('unmount:b-done');
      }
    },
  };
})(window);
