(function (global) {
  var stylesInjected = false;

  function appendStyle(targetElement, testId, cssText) {
    var style = document.createElement('style');
    style.setAttribute('data-testid', testId);
    style.textContent = cssText;
    targetElement.appendChild(style);
  }

  global['sub-classic-bodyless'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function () {
      if (!stylesInjected) {
        appendStyle(
          document.head,
          'bodyless-dynamic-head-style',
          '.bodyless-dynamic-head-target { color: rgb(21, 22, 23) }',
        );
        appendStyle(
          document.body,
          'bodyless-dynamic-body-style',
          '.bodyless-dynamic-body-target { color: rgb(31, 32, 33) }',
        );
        stylesInjected = true;
      }

      return Promise.resolve();
    },
    unmount: function () {
      return Promise.resolve();
    },
  };
})(window);
