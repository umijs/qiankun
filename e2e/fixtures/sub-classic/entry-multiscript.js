/**
 * Multi-script classic app: asserts the loader preserves native execution order across
 * an external vendor script, an inline script and the entry script (vendor -> inline -> entry).
 */
(function (global) {
  // captured at evaluation time: both must already be defined if ordering is native-correct
  var vendorAtEntry = String(global.__CLASSIC_VENDOR__);
  var inlineObservedVendor = String(global.__ORDER_AT_INLINE__);

  // loading-phase dynamic style (script eval time, the style-loader dev pattern): when this app
  // replaces another one in a shared container, the previous app's unmount wipes the DOM streamed
  // during loading — the sandbox must re-attach this recorded stylesheet at mount
  var loadPhaseStyle = document.createElement('style');
  loadPhaseStyle.setAttribute('data-testid', 'load-phase-style');
  loadPhaseStyle.textContent = '.multiscript-load-marker { color: rgb(7, 8, 9) }';
  document.head.appendChild(loadPhaseStyle);

  global['sub-classic-multiscript'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function (props) {
      var root = (props && props.container ? props.container : document).querySelector('#multiscript-root');
      root.innerHTML =
        '<p data-testid="script-order">inline-saw:' +
        inlineObservedVendor +
        ',entry-saw:' +
        vendorAtEntry +
        '</p>' +
        '<p data-testid="load-marker" class="multiscript-load-marker">styled by the load-phase stylesheet</p>';

      // jQuery-style dynamic style injection: the element is parsed via innerHTML (so it never
      // went through the sandboxed createElement) and arrives wrapped in a DocumentFragment —
      // under styleIsolation the body rule must still be scoped away from the main realm
      var wrapper = document.createElement('div');
      wrapper.innerHTML = '<style data-testid="fragment-style">body { background-color: rgb(1, 2, 3) }</style>';
      var fragment = document.createDocumentFragment();
      fragment.appendChild(wrapper.firstChild);
      document.head.appendChild(fragment);

      return Promise.resolve();
    },
    unmount: function () {
      return Promise.resolve();
    },
  };
})(window);
