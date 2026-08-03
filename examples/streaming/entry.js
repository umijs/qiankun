/**
 * The streamed qiankun micro app's lifecycle script. By design it is the LAST thing the server
 * flushes: every section above it was parsed, transpiled and painted by qiankun's streaming
 * pipeline while this file had not even been requested yet. All it has left to do is read the
 * arrival record the inline marks kept (`__QK_STREAM__`, set up in the first chunk) and draw
 * the waterfall of what the user already saw.
 */
(function (global) {
  var stream = global.__QK_STREAM__;
  // captured at evaluation time, not at mount: this is the honest "entry arrived" moment
  var entryAt = stream ? stream.now() : 0;
  var locale = 'en';

  /**
   * This app's own copy. The host hands `locale` over through qiankun's props channel and
   * re-delivers it on `update` — no build step here, so it is a plain object literal.
   */
  var MESSAGES = {
    en: {
      insideQiankun: 'inside qiankun',
      standalone: 'standalone',
      rows: {
        critical: 'critical content',
        orders: 'orders ledger',
        activity: 'activity feed',
        entry: 'entry script',
      },
      verdictCold: function (lead) {
        return (
          'First paint led the entry script by <strong>' +
          lead +
          'ms</strong>. A loader that buffers the entry shows a veil for that whole window; qiankun streams, so the page was already readable.'
        );
      },
      verdictWarm:
        'This mount replayed from qiankun’s warm cache — the whole document rendered at once. Reload the page to watch the cold, chunk-by-chunk stream again.',
    },
    zh: {
      insideQiankun: '运行在 qiankun 中',
      standalone: '独立运行',
      rows: {
        critical: '关键首屏',
        orders: '订单流水',
        activity: '动态',
        entry: 'entry 脚本',
      },
      verdictCold: function (lead) {
        return (
          '首屏比 entry 脚本早了 <strong>' +
          lead +
          'ms</strong> 上屏。缓冲整个入口的加载器这段时间只能显示 loading；qiankun 是流式的，页面早已可读。'
        );
      },
      verdictWarm:
        '这次挂载命中了 qiankun 的缓存回放——整份文档一次成型。刷新页面可重看冷启动的逐块推流。',
    },
  };

  function t() {
    return MESSAGES[locale] || MESSAGES.en;
  }

  function render() {
    var root = document.querySelector('.streaming-app');
    if (!root) return Promise.resolve();

    var m = t();
    // the streamed markup carries both languages; the active one is just a root attribute
    root.setAttribute('data-locale', locale);

    var modeBadge = root.querySelector('[data-mode-badge]');
    if (modeBadge) {
      var poweredByQiankun = !!global.__POWERED_BY_QIANKUN__;
      modeBadge.textContent = poweredByQiankun ? m.insideQiankun : m.standalone;
      modeBadge.className = poweredByQiankun ? 'badge mode-qiankun' : 'badge';
      modeBadge.removeAttribute('hidden');
    }

    var entryBadge = root.querySelector('[data-mark="entry"]');
    if (entryBadge) entryBadge.textContent = '+' + entryAt + 'ms';

    // backstop for the chunk badges: by mount time every node is live, so any stamp the
    // in-stream retries could not place yet lands here
    (stream ? stream.marks : []).forEach(function (arrival) {
      var badge = root.querySelector('[data-mark="' + arrival.id + '"]');
      if (badge) badge.textContent = '+' + arrival.at + 'ms';
    });

    var arrivals = (stream ? stream.marks : []).concat([{ id: 'entry', at: entryAt }]);
    var total = Math.max(
      arrivals.reduce(function (max, arrival) {
        return Math.max(max, arrival.at);
      }, 0),
      1,
    );

    var timeline = root.querySelector('[data-timeline]');
    if (timeline) {
      timeline.innerHTML = arrivals
        .map(function (arrival) {
          var width = Math.max((arrival.at / total) * 100, 2);
          return [
            '<div class="timeline-row' + (arrival.id === 'entry' ? ' entry-row' : '') + '">',
            '  <span>' + (m.rows[arrival.id] || arrival.id) + '</span>',
            '  <span class="bar"><i style="width: ' + width.toFixed(1) + '%"></i></span>',
            '  <span class="at">+' + arrival.at + 'ms</span>',
            '</div>',
          ].join('\n');
        })
        .join('\n');
    }

    var verdict = root.querySelector('[data-verdict]');
    if (verdict) {
      var firstPaintAt = arrivals[0] ? arrivals[0].at : 0;
      var lead = entryAt - firstPaintAt;
      // A warm remount restores the streamed DOM in one go and re-runs no scripts, so the marks
      // above are the cold run's — claiming their lead for THIS mount would be a lie. Mounting
      // long after the stream ended is what tells the two apart.
      // 1500ms splits the two cleanly: a cold mount follows the entry within a few hundred ms
      var isWarmReplay = stream && stream.now() - entryAt > 1500;
      verdict.innerHTML = isWarmReplay ? m.verdictWarm : m.verdictCold(lead);
    }

    return Promise.resolve();
  }

  global['streaming'] = {
    bootstrap: function () {
      return Promise.resolve();
    },
    mount: function (props) {
      if (props && (props.locale === 'en' || props.locale === 'zh')) locale = props.locale;
      return render();
    },
    /**
     * The host re-delivers its props here whenever they change — that is how switching the
     * shell's language reaches this app. The streamed sections re-label themselves through the
     * `data-locale` attribute; only the waterfall is repainted.
     */
    update: function (props) {
      if (props && (props.locale === 'en' || props.locale === 'zh') && props.locale !== locale) {
        locale = props.locale;
        render();
      }
      return Promise.resolve();
    },
    unmount: function () {
      return Promise.resolve();
    },
  };

  if (!global.__POWERED_BY_QIANKUN__) {
    render();
  }
})(window);
