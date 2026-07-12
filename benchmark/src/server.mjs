import { createServer } from 'node:http';

const FIXTURE_STYLE = `
#benchmark-core {
  --benchmark-style-ready: 1;
  box-sizing: border-box;
  display: block;
  min-height: 240px;
  width: 640px;
  padding: 16px;
  color: rgb(17, 34, 51);
  background: rgb(245, 247, 250);
}

#benchmark-core .benchmark-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 8px;
  min-height: 20px;
}
`.trim();

const ENTRY = `
(function (global) {
  function mountedRoot() {
    var core = document.querySelector('#benchmark-core');
    if (core) core.setAttribute('data-mounted', 'true');
  }

  function unmount() {
    var core = document.querySelector('#benchmark-core');
    if (core) core.setAttribute('data-mounted', 'false');
    return Promise.resolve();
  }

  global.mount = mountedRoot;
  global.unmount = unmount;

  global['benchmark-app'] = {
    bootstrap: function () { return Promise.resolve(); },
    mount: function () { mountedRoot(); return Promise.resolve(); },
    unmount: unmount,
  };
  global.__WUJIE_MOUNT = mountedRoot;
  global.__WUJIE_UNMOUNT = unmount;

  if (typeof __GARFISH_EXPORTS__ !== 'undefined') {
    __GARFISH_EXPORTS__.provider = function () {
      return {
        destroy: unmount,
        render: mountedRoot,
      };
    };
  }

  if (global.location.search.indexOf('benchmark=native-iframe') !== -1) {
    var benchmarkParams = new URLSearchParams(global.location.search);
    var parentOrigin = benchmarkParams.get('benchmark-parent-origin');
    var token = benchmarkParams.get('benchmark-token');
    if (parentOrigin && token) {
      mountedRoot();
      global.parent.postMessage({ type: 'native-app-mounted', version: 1, token: token }, parentOrigin);
    }
  }
})(window);
`.trim();

const HTML_CHUNKS = [
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>benchmark-app</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <main id="benchmark-root"></main>`,
  `<script>
      (function () {
        var root = document.querySelector('#benchmark-root');
        var rows = '';
        for (var index = 0; index < 100; index++) {
          rows += '<div class="benchmark-row"><b>' + index + '</b><span>deterministic benchmark row</span></div>';
        }
        root.innerHTML = '<section id="benchmark-core" data-mounted="false"><h1 data-benchmark-critical>micro app core</h1>' + rows + '</section>';

        if (window.location.search.indexOf('benchmark=native-iframe') !== -1) {
          var benchmarkParams = new URLSearchParams(window.location.search);
          var parentOrigin = benchmarkParams.get('benchmark-parent-origin');
          var token = benchmarkParams.get('benchmark-token');
          if (parentOrigin && token) {
            var isPaintable = function isPaintable(element) {
              var rect = element.getBoundingClientRect();
              var style = getComputedStyle(element);
              return rect.width > 0 &&
                rect.height > 0 &&
                element.querySelector('[data-benchmark-critical]') !== null &&
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0' &&
                style.getPropertyValue('--benchmark-style-ready').trim() === '1';
            };

            var waitForPaint = function waitForPaint() {
              var core = document.querySelector('#benchmark-core');
              if (!core || !isPaintable(core)) {
                requestAnimationFrame(waitForPaint);
                return;
              }

              requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                  var paintedCore = document.querySelector('#benchmark-core');
                  if (!paintedCore || !isPaintable(paintedCore)) {
                    requestAnimationFrame(waitForPaint);
                    return;
                  }
                  window.parent.postMessage({
                    paintedAt: performance.timeOrigin + performance.now(),
                    token: token,
                    type: 'native-core-painted',
                    version: 1
                  }, parentOrigin);
                });
              });
            };

            requestAnimationFrame(waitForPaint);
          }
        }
      })();
    </script>`,
  `<script src="./entry.js" entry></script>
  </body>
</html>`,
];

const FULL_HTML = HTML_CHUNKS.join('');

function renderSsrRows(start, count, label) {
  return Array.from(
    { length: count },
    (_, offset) => `<div class="benchmark-row"><b>${start + offset}</b><span>${label} ${start + offset}</span></div>`,
  ).join('');
}

const SSR_NATIVE_PAINT_REPORTER = `<script>
  (function () {
    if (window.location.search.indexOf('benchmark=native-iframe') === -1) return;
    var benchmarkParams = new URLSearchParams(window.location.search);
    var parentOrigin = benchmarkParams.get('benchmark-parent-origin');
    var token = benchmarkParams.get('benchmark-token');
    if (!parentOrigin || !token) return;

    var isPaintable = function isPaintable(element) {
      var rect = element.getBoundingClientRect();
      var style = getComputedStyle(element);
      return rect.width > 0 &&
        rect.height > 0 &&
        element.querySelector('[data-benchmark-critical]') !== null &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        style.getPropertyValue('--benchmark-style-ready').trim() === '1';
    };

    var waitForPaint = function waitForPaint() {
      var core = document.querySelector('#benchmark-core');
      if (!core || !isPaintable(core)) {
        requestAnimationFrame(waitForPaint);
        return;
      }
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var paintedCore = document.querySelector('#benchmark-core');
          if (!paintedCore || !isPaintable(paintedCore)) {
            requestAnimationFrame(waitForPaint);
            return;
          }
          window.parent.postMessage({
            paintedAt: performance.timeOrigin + performance.now(),
            token: token,
            type: 'native-core-painted',
            version: 1
          }, parentOrigin);
        });
      });
    };

    requestAnimationFrame(waitForPaint);
  })();
</script>`;

const SSR_HTML_CHUNKS = [
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>benchmark SSR dashboard</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <main id="benchmark-root">
      <section id="benchmark-core" data-mounted="false">
        <header class="benchmark-hero">
          <h1 data-benchmark-critical>Account overview</h1>
          <p>Server-rendered critical account content</p>
        </header>
        ${renderSsrRows(0, 12, 'critical transaction')}
      </section>
      ${SSR_NATIVE_PAINT_REPORTER}`,
  `<section data-ssr-boundary="recommendations">
        <h2>Recommended actions</h2>
        ${renderSsrRows(12, 44, 'deferred recommendation')}
      </section>`,
  `<section data-ssr-boundary="activity">
        <h2>Recent activity</h2>
        ${renderSsrRows(56, 44, 'deferred activity')}
      </section>
      <div id="benchmark-stream-tail" data-stream-complete="true"></div>
    </main>
    <script type="application/json" id="__SSR_DATA__">{"stream":"complete"}</script>
    <script src="./entry.js" entry></script>
  </body>
</html>`,
];

const SSR_FULL_HTML = SSR_HTML_CHUNKS.join('');
const ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const HTML_CACHE_CONTROL = 'no-store';

function setSharedHeaders(response, cacheControl = HTML_CACHE_CONTROL) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Cache-Control', cacheControl);
  response.setHeader('Timing-Allow-Origin', '*');
}

function sendText(response, statusCode, contentType, body, cacheControl = HTML_CACHE_CONTROL) {
  setSharedHeaders(response, cacheControl);
  response.writeHead(statusCode, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': contentType,
  });
  response.end(body);
}

function listen(server, port, host) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.off('error', reject);
      resolve();
    });
  });
}

function close(server) {
  if (!server.listening) return Promise.resolve();
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

export function createFixtureServer({ chunkIntervalMs = 50, host = '127.0.0.1', port = 7601 } = {}) {
  let origin;
  const requestCounts = new Map();
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? '/', origin ?? `http://${host}:${port}`);
    if (request.method !== 'OPTIONS') {
      requestCounts.set(url.pathname, (requestCounts.get(url.pathname) ?? 0) + 1);
    }

    if (request.method === 'OPTIONS') {
      setSharedHeaders(response);
      response.writeHead(204, {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      });
      response.end();
      return;
    }

    if (url.pathname === '/app/style.css') {
      sendText(response, 200, 'text/css; charset=utf-8', FIXTURE_STYLE, ASSET_CACHE_CONTROL);
      return;
    }
    if (url.pathname === '/app/entry.js') {
      sendText(response, 200, 'text/javascript; charset=utf-8', ENTRY, ASSET_CACHE_CONTROL);
      return;
    }
    if (url.pathname !== '/app/index.html') {
      sendText(response, 404, 'text/plain; charset=utf-8', 'Not Found');
      return;
    }

    const fixtureName = url.searchParams.get('fixture') ?? 'client-rendered';
    const chunks = fixtureName === 'ssr' ? SSR_HTML_CHUNKS : fixtureName === 'client-rendered' ? HTML_CHUNKS : null;
    if (!chunks) {
      sendText(response, 400, 'text/plain; charset=utf-8', 'Unknown HTML fixture');
      return;
    }

    const fullHtml = fixtureName === 'ssr' ? SSR_FULL_HTML : FULL_HTML;
    const delivery = url.searchParams.get('delivery') ?? 'buffered';
    if (delivery === 'buffered') {
      sendText(response, 200, 'text/html; charset=utf-8', fullHtml);
      return;
    }
    if (delivery === 'delayed-buffered') {
      const delay = chunkIntervalMs * (chunks.length - 1);
      const timer = setTimeout(() => sendText(response, 200, 'text/html; charset=utf-8', fullHtml), delay);
      response.once('close', () => clearTimeout(timer));
      return;
    }
    if (delivery !== 'streamed') {
      sendText(response, 400, 'text/plain; charset=utf-8', 'Unknown delivery mode');
      return;
    }

    setSharedHeaders(response);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write(chunks[0]);
    const timers = chunks
      .slice(1)
      .map((chunk, index) =>
        setTimeout(
          () => (index === chunks.length - 2 ? response.end(chunk) : response.write(chunk)),
          chunkIntervalMs * (index + 1),
        ),
      );
    response.once('close', () => {
      timers.forEach((timer) => clearTimeout(timer));
    });
  });

  return {
    async close() {
      await close(server);
    },
    get origin() {
      if (!origin) throw new Error('fixture server has not started');
      return origin;
    },
    getRequestCount(pathname) {
      return requestCounts.get(pathname) ?? 0;
    },
    resetRequestCounts() {
      requestCounts.clear();
    },
    async start() {
      await listen(server, port, host);
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('fixture server did not expose a TCP port');
      origin = `http://${host}:${address.port}`;
    },
  };
}
