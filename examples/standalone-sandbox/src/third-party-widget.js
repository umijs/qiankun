/* This file intentionally has no imports or exports: it is evaluated as a third-party classic script. */
;(function installPulseboardWidget() {
  var widget = document.createElement('article');
  widget.className = 'third-party-widget';
  widget.innerHTML = [
    '<div class="widget-kicker">Third-party classic script</div>',
    '<div class="widget-reading"><strong data-widget-tick>0</strong><span>live ticks</span></div>',
    '<p class="shared-label">This shared class is coral only inside the sandbox.</p>',
    '<p class="widget-response" data-widget-response>Waiting for a host ping.</p>',
  ].join('');

  var style = document.createElement('style');
  style.textContent = [
    '.shared-label { color: #c8382d; font-style: italic; }',
    '.third-party-widget {',
    '  display: grid;',
    '  gap: 18px;',
    '  min-height: 240px;',
    '  padding: clamp(22px, 5vw, 42px);',
    '  color: #3c1712;',
    '  background: #fff0ed;',
    '  border: 1px solid #f3b8af;',
    '  border-radius: 22px;',
    '  box-shadow: 0 18px 42px rgba(116, 33, 23, 0.12);',
    '}',
    '.widget-kicker {',
    '  font: 700 11px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;',
    '  letter-spacing: 0.14em;',
    '  text-transform: uppercase;',
    '}',
    '.widget-reading { display: flex; align-items: baseline; gap: 12px; }',
    '.widget-reading strong { font: 700 clamp(48px, 9vw, 82px)/0.85 Georgia, serif; letter-spacing: -0.07em; }',
    '.widget-reading span { font: 650 13px/1.2 system-ui, sans-serif; }',
    '.widget-response { margin: 0; font: 600 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }',
  ].join('\n');

  document.head.appendChild(style);
  document.body.appendChild(widget);

  var dynamicScript = document.createElement('script');
  dynamicScript.textContent = "window.__STANDALONE_DYNAMIC_SCRIPT__ = 'contained';";
  document.body.appendChild(dynamicScript);
  widget.dataset.dynamicScript = window.__STANDALONE_DYNAMIC_SCRIPT__;
  widget.dataset.selfReference = String(window === self && self === globalThis);

  var ticks = 0;
  var pingCount = 0;
  var tickNode = widget.querySelector('[data-widget-tick]');
  var responseNode = widget.querySelector('[data-widget-response]');

  window.__STANDALONE_WIDGET__ = {
    name: 'Pulseboard',
    mountedAt: Date.now(),
  };

  window.addEventListener('standalone-widget:ping', function onPing() {
    pingCount += 1;
    responseNode.textContent = 'Ping ' + String(pingCount) + ' handled inside the sandbox.';
    window.dispatchEvent(new CustomEvent('standalone-widget:ack', { detail: { pingCount: pingCount } }));
  });

  window.setInterval(function updateWidget() {
    ticks += 1;
    tickNode.textContent = String(ticks);
    window.dispatchEvent(new CustomEvent('standalone-widget:tick', { detail: { ticks: ticks } }));
  }, 1000);
})();
