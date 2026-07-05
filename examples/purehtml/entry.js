/**
 * The no-build qiankun micro app: lifecycles registered on window, UI rendered with
 * jQuery. It implements the same layout contract as the framework examples
 * (see ../DESIGN.md) so the shell reads as one system.
 */
(function (global) {
  var timerId = null;

  function render($) {
    var poweredByQiankun = !!global.__POWERED_BY_QIANKUN__;
    var mode = poweredByQiankun ? 'inside qiankun' : 'standalone';
    var modeClass = poweredByQiankun ? 'badge mode-qiankun' : 'badge';

    $('#purehtml-container').html(
      [
        '<div class="purehtml-app">',
        '  <header class="app-header">',
        '    <span class="accent-dot"></span>',
        '    <h1>Pure HTML micro app</h1>',
        '    <span class="badge">jquery ' + ($.fn.jquery || '?') + '</span>',
        '    <span class="badge">no build · classic</span>',
        '    <span class="' + modeClass + '">' + mode + '</span>',
        '  </header>',
        '  <section class="card">',
        '    <h2>Isolation lab</h2>',
        '    <div class="probe">',
        '      <button type="button" id="ph-window-probe">Write window probe</button>',
        '      <span>',
        '        <span class="probe-result" id="ph-window-result">window.__SANDBOX_PROBE__ = undefined</span>',
        '        <span class="probe-note">Globals written here stay inside this app’s membrane.</span>',
        '      </span>',
        '    </div>',
        '    <div class="probe">',
        '      <button type="button" id="ph-timer-probe">Leak an interval</button>',
        '      <span>',
        '        <span class="probe-result" id="ph-timer-result">no interval running</span>',
        '        <span class="probe-note">The interval is never cleared; qiankun reclaims it on unmount.</span>',
        '      </span>',
        '    </div>',
        '    <div class="probe">',
        '      <button type="button" id="ph-style-probe">Inject a body tint</button>',
        '      <span>',
        '        <span class="probe-result" id="ph-style-result">no style injected</span>',
        '        <span class="probe-note">Style isolation keeps the tint inside this app.</span>',
        '      </span>',
        '    </div>',
        '  </section>',
        '  <section class="card">',
        '    <h2>Local state</h2>',
        '    <div class="counter-row">',
        '      <button type="button" id="ph-count-down">−</button>',
        '      <span class="counter-value" id="ph-count">0</span>',
        '      <button type="button" id="ph-count-up">+</button>',
        '    </div>',
        '  </section>',
        '  <footer class="app-footer">entry //localhost:7104 · lifecycle: entry.js</footer>',
        '</div>',
      ].join('\n'),
    );

    $('#ph-window-probe').on('click', function () {
      global.__SANDBOX_PROBE__ = 'purehtml:' + Date.now();
      $('#ph-window-result').text('window.__SANDBOX_PROBE__ = "' + global.__SANDBOX_PROBE__ + '"');
    });

    var ticks = 0;
    $('#ph-timer-probe').on('click', function () {
      if (timerId !== null) return;
      timerId = global.setInterval(function () {
        ticks += 1;
        $('#ph-timer-result').text('ticking every 1s · ' + ticks + ' ticks, never cleared');
      }, 1000);
      $('#ph-timer-result').text('interval started');
    });

    $('#ph-style-probe').on('click', function () {
      if ($('style[data-probe="purehtml"]').length) return;
      // body tints the whole page when standalone; under style isolation only the app root tints
      $('<style data-probe="purehtml">body, .purehtml-app { background: #b8860b14 !important; }</style>').appendTo(
        document.head,
      );
      $('#ph-style-result').text('<style> appended to document.head');
    });

    var count = 0;
    function paint() {
      $('#ph-count').text(String(count));
    }
    $('#ph-count-up').on('click', function () {
      count += 1;
      paint();
    });
    $('#ph-count-down').on('click', function () {
      count -= 1;
      paint();
    });

    return Promise.resolve();
  }

  global['purehtml'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function () {
      return render($);
    },
    unmount: function () {
      timerId = null;
      $('#purehtml-container').empty();
      return Promise.resolve();
    },
  };

  if (!global.__POWERED_BY_QIANKUN__) {
    render($);
  }
})(window);
