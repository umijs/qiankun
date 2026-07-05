/**
 * A deliberately badly-behaved sub app for the failure-path and cleanup suites.
 * Behaviors are selected via props so one fixture covers several scenarios:
 * - props.behavior === 'mount-error': mount rejects
 * - otherwise: mounts fine but leaks an interval (never cleared in unmount),
 *   which the sandbox is expected to reclaim on unmount
 */
(function (global) {
  var ticks = 0;

  global['sub-misbehaving'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function (props) {
      if (props && props.behavior === 'mount-error') {
        return Promise.reject(new Error('deliberate mount failure'));
      }

      var root = (props && props.container ? props.container : document).querySelector('#misbehaving-root');
      root.innerHTML = '<p data-testid="misbehaving-content">misbehaving mounted</p>';

      // leak on purpose: the tick marker lands on the shared <html> element so the
      // main realm can observe whether the interval is still alive after unmount
      setInterval(function () {
        ticks++;
        document.documentElement.setAttribute('data-leak-ticks', String(ticks));
      }, 50);

      return Promise.resolve();
    },
    unmount: function () {
      // deliberately does NOT clear the interval
      return Promise.resolve();
    },
  };
})(window);
