(function (global) {
  var bootstrapCount = 0;
  var mountCount = 0;
  var updateCount = 0;
  var unmountCount = 0;
  var clicks = 0;

  function render(root, props) {
    if (!root) return;
    var title = (props && props.appLabel) || 'binding-a';
    var label = (props && props.label) || 'none';
    root.innerHTML =
      '<div style="position: relative; padding: 12px; min-height: 120px;">' +
      '<h2 data-testid="binding-title">' +
      title +
      '</h2>' +
      '<p data-testid="binding-props">label:' +
      label +
      '</p>' +
      '<p data-testid="binding-counters">bootstrap:' +
      bootstrapCount +
      ',mount:' +
      mountCount +
      ',update:' +
      updateCount +
      ',unmount:' +
      unmountCount +
      '</p>' +
      '<button type="button" data-testid="binding-action-btn" style="position: relative; width: 180px; height: 48px;">Action (<span data-testid="binding-clicks">' +
      clicks +
      '</span>)</button>' +
      '</div>';

    var btn = root.querySelector('[data-testid="binding-action-btn"]');
    if (btn) {
      btn.addEventListener('click', function () {
        clicks += 1;
        var countNode = root.querySelector('[data-testid="binding-clicks"]');
        if (countNode) countNode.textContent = String(clicks);
      });
    }
  }

  function findRoot(props) {
    return (props && props.container ? props.container : document).querySelector('#binding-target-root');
  }

  global['sub-binding-a'] = {
    bootstrap: function () {
      bootstrapCount += 1;
      return Promise.resolve();
    },
    mount: async function (props) {
      mountCount += 1;
      if (props && typeof props.onEvent === 'function') {
        props.onEvent('mount:a');
      }
      render(findRoot(props), props);
      if (props && typeof props.mountGate === 'function') {
        await props.mountGate();
      }
      if (props && typeof props.onEvent === 'function') {
        props.onEvent('mount-done:a');
      }
    },
    update: function (props) {
      updateCount += 1;
      if (props && typeof props.onEvent === 'function') {
        props.onEvent('update:a');
      }
      render(findRoot(props), props);
      return Promise.resolve();
    },
    unmount: function (props) {
      unmountCount += 1;
      var root = findRoot(props);
      if (root) root.innerHTML = '';
      document.documentElement.setAttribute('data-binding-a-unmounts', String(unmountCount));
      if (props && typeof props.onEvent === 'function') {
        props.onEvent('unmount:a');
      }
      return Promise.resolve();
    },
  };
})(window);
