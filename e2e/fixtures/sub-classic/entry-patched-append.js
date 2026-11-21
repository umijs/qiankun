(function (global) {
  var mounted = false;
  var observed = [];

  // The business monkey-patch shape: wrap the appendChild you can see, remember the original,
  // delegate to it. Apps (and SDKs they ship) do this to observe or decorate DOM insertions;
  // the sandbox pipeline must keep such a wrapper effective instead of bypassing it.
  function wrapAppendChild(target, label) {
    var original = target.appendChild;
    target.appendChild = function (node) {
      observed.push(label + ':' + (node.tagName || '').toLowerCase());
      return original.call(this, node);
    };
  }

  function appendStyle(targetElement, testId, cssText) {
    var style = document.createElement('style');
    style.setAttribute('data-testid', testId);
    style.textContent = cssText;
    targetElement.appendChild(style);
  }

  global['sub-classic-patched-append'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function (props) {
      if (!mounted) {
        wrapAppendChild(document.head, 'head');
        wrapAppendChild(document.body, 'body');

        appendStyle(
          document.head,
          'patched-append-head-style',
          '.patched-append-head-target { color: rgb(61, 62, 63) }',
        );
        appendStyle(
          document.body,
          'patched-append-body-style',
          '.patched-append-body-target { color: rgb(71, 72, 73) }',
        );
        mounted = true;
      }

      if (props && typeof props.onRetainedHelpers === 'function') {
        props.onRetainedHelpers({
          readDocHead: function () {
            return document.head;
          },
          appendViaDoc: function (testId, cssText) {
            appendStyle(document.head, testId, cssText);
          },
        });
      }

      var report = document.querySelector('[data-testid="patched-append-observed"]');
      if (report) report.textContent = observed.join(',');

      var lateBtn = document.querySelector('[data-testid="patched-append-late-btn"]');
      if (lateBtn) {
        lateBtn.onclick = function () {
          appendStyle(
            document.head,
            'patched-append-late-style',
            'h1 { color: rgb(255, 0, 0); } .patched-append-late-target { color: rgb(81, 82, 83); }',
          );
          if (report) report.textContent = observed.join(',');
        };
      }

      return Promise.resolve();
    },
    unmount: function () {
      return Promise.resolve();
    },
  };
})(window);
