/**
 * The no-build qiankun micro app: lifecycles registered on window, UI rendered with
 * jQuery. It implements the same layout contract as the framework examples
 * (see ../DESIGN.md) so the shell reads as one system.
 */
(function (global) {
  var timerId = null;
  var ticks = 0;
  var count = 0;
  var tinted = false;
  var locale = 'en';

  /**
   * This app's own copy. The host hands `locale` over through qiankun's props channel and
   * re-delivers it on `update` — no build step here, so it is a plain object literal.
   */
  var MESSAGES = {
    en: {
      title: 'Pure HTML micro app',
      noBuild: 'no build · classic',
      insideQiankun: 'inside qiankun',
      standalone: 'standalone',
      isolationLab: 'Isolation lab',
      writeProbe: 'Write window probe',
      globalUndefined: 'window.__SANDBOX_PROBE__ = undefined',
      globalNote: 'Globals written here stay inside this app\u2019s membrane.',
      leakInterval: 'Leak an interval',
      noInterval: 'no interval running',
      intervalStarted: 'interval started',
      ticking: function (n) {
        return 'ticking every 1s \u00b7 ' + n + ' ticks, never cleared';
      },
      intervalNote: 'The interval is never cleared; qiankun reclaims it on unmount.',
      injectTint: 'Inject a body tint',
      noStyle: 'no style injected',
      styleInjected: '<style> appended to document.head',
      styleNote: 'Style isolation keeps the tint inside this app.',
      localState: 'Local state',
      entryLine: 'entry index.html \u00b7 lifecycle: entry.js',
    },
    zh: {
      title: '\u7eaf HTML \u5fae\u5e94\u7528',
      noBuild: '\u65e0\u9700\u6784\u5efa \u00b7 classic',
      insideQiankun: '\u8fd0\u884c\u5728 qiankun \u4e2d',
      standalone: '\u72ec\u7acb\u8fd0\u884c',
      isolationLab: '\u9694\u79bb\u5b9e\u9a8c\u53f0',
      writeProbe: '\u5199\u5165 window \u63a2\u9488',
      globalUndefined: 'window.__SANDBOX_PROBE__ = undefined',
      globalNote: '\u5728\u8fd9\u91cc\u5199\u5165\u7684\u5168\u5c40\u53d8\u91cf\u4f1a\u7559\u5728\u672c\u5e94\u7528\u7684\u9694\u79bb\u819c\u5185\u3002',
      leakInterval: '\u6cc4\u6f0f\u4e00\u4e2a\u5b9a\u65f6\u5668',
      noInterval: '\u6ca1\u6709\u5b9a\u65f6\u5668\u5728\u8dd1',
      intervalStarted: '\u5b9a\u65f6\u5668\u5df2\u542f\u52a8',
      ticking: function (n) {
        return '\u6bcf\u79d2\u89e6\u53d1\u4e00\u6b21 \u00b7 \u5df2 ' + n + ' \u6b21\uff0c\u4ece\u4e0d\u6e05\u7406';
      },
      intervalNote: '\u8fd9\u4e2a\u5b9a\u65f6\u5668\u4ece\u4e0d\u6e05\u7406\uff1bqiankun \u4f1a\u5728\u5378\u8f7d\u65f6\u56de\u6536\u5b83\u3002',
      injectTint: '\u7ed9 body \u67d3\u8272',
      noStyle: '\u5c1a\u672a\u6ce8\u5165\u6837\u5f0f',
      styleInjected: '<style> \u5df2\u63d2\u5165 document.head',
      styleNote: '\u6837\u5f0f\u9694\u79bb\u628a\u67d3\u8272\u5173\u5728\u4e86\u8fd9\u4e2a\u5e94\u7528\u5185\u90e8\u3002',
      localState: '\u672c\u5730\u72b6\u6001',
      entryLine: '\u5165\u53e3 index.html \u00b7 \u751f\u547d\u5468\u671f\uff1aentry.js',
    },
  };

  function t() {
    return MESSAGES[locale] || MESSAGES.en;
  }

  function render($) {
    var m = t();
    var poweredByQiankun = !!global.__POWERED_BY_QIANKUN__;
    var mode = poweredByQiankun ? m.insideQiankun : m.standalone;
    var modeClass = poweredByQiankun ? 'badge mode-qiankun' : 'badge';

    $('#purehtml-container').html(
      [
        '<div class="purehtml-app">',
        '  <header class="app-header">',
        '    <span class="accent-dot"></span>',
        '    <h1>' + m.title + '</h1>',
        '    <span class="badge">jquery ' + ($.fn.jquery || '?') + '</span>',
        '    <span class="badge">' + m.noBuild + '</span>',
        '    <span class="' + modeClass + '">' + mode + '</span>',
        '  </header>',
        '  <section class="card">',
        '    <h2>' + m.isolationLab + '</h2>',
        '    <div class="probe">',
        '      <button type="button" id="ph-window-probe">' + m.writeProbe + '</button>',
        '      <span>',
        '        <span class="probe-result" id="ph-window-result">' +
          (global.__SANDBOX_PROBE__ ? 'window.__SANDBOX_PROBE__ = "' + global.__SANDBOX_PROBE__ + '"' : m.globalUndefined) +
          '</span>',
        '        <span class="probe-note">' + m.globalNote + '</span>',
        '      </span>',
        '    </div>',
        '    <div class="probe">',
        '      <button type="button" id="ph-timer-probe">' + m.leakInterval + '</button>',
        '      <span>',
        '        <span class="probe-result" id="ph-timer-result">' + (timerId === null ? m.noInterval : m.ticking(ticks)) + '</span>',
        '        <span class="probe-note">' + m.intervalNote + '</span>',
        '      </span>',
        '    </div>',
        '    <div class="probe">',
        '      <button type="button" id="ph-style-probe">' + m.injectTint + '</button>',
        '      <span>',
        '        <span class="probe-result" id="ph-style-result">' + (tinted ? m.styleInjected : m.noStyle) + '</span>',
        '        <span class="probe-note">' + m.styleNote + '</span>',
        '      </span>',
        '    </div>',
        '  </section>',
        '  <section class="card">',
        '    <h2>' + m.localState + '</h2>',
        '    <div class="counter-row">',
        '      <button type="button" id="ph-count-down">−</button>',
        '      <span class="counter-value" id="ph-count">' + count + '</span>',
        '      <button type="button" id="ph-count-up">+</button>',
        '    </div>',
        '  </section>',
        // no build step here, so nothing can stamp the deployed path in: name the entry document
        // instead, which is true wherever this app is served from
        '  <footer class="app-footer">' + m.entryLine + '</footer>',
        '</div>',
      ].join('\n'),
    );

    $('#ph-window-probe').on('click', function () {
      global.__SANDBOX_PROBE__ = 'purehtml:' + Date.now();
      $('#ph-window-result').text('window.__SANDBOX_PROBE__ = "' + global.__SANDBOX_PROBE__ + '"');
    });

    $('#ph-timer-probe').on('click', function () {
      if (timerId !== null) return;
      timerId = global.setInterval(function () {
        ticks += 1;
        $('#ph-timer-result').text(t().ticking(ticks));
      }, 1000);
      $('#ph-timer-result').text(m.intervalStarted);
    });

    $('#ph-style-probe').on('click', function () {
      if ($('style[data-probe="purehtml"]').length) return;
      // body tints the whole page when standalone; under style isolation only the app root tints
      $('<style data-probe="purehtml">body, .purehtml-app { background: #b8860b14 !important; }</style>').appendTo(
        document.head,
      );
      tinted = true;
      $('#ph-style-result').text(m.styleInjected);
    });

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
    mount: function (props) {
      if (props && (props.locale === 'en' || props.locale === 'zh')) locale = props.locale;
      return render($);
    },
    /**
     * The host re-delivers its props here whenever they change — that is how switching the
     * shell's language reaches this app. No framework to diff with, so it repaints wholesale.
     */
    update: function (props) {
      if (props && (props.locale === 'en' || props.locale === 'zh') && props.locale !== locale) {
        locale = props.locale;
        render($);
      }
      return Promise.resolve();
    },
    unmount: function () {
      timerId = null;
      ticks = 0;
      count = 0;
      tinted = false;
      $('#purehtml-container').empty();
      return Promise.resolve();
    },
  };

  if (!global.__POWERED_BY_QIANKUN__) {
    render($);
  }
})(window);
