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

  global['benchmark-app'] = {
    bootstrap: function () { return Promise.resolve(); },
    mount: function () { mountedRoot(); return Promise.resolve(); },
    unmount: unmount,
  };
  global.__WUJIE_MOUNT = mountedRoot;
  global.__WUJIE_UNMOUNT = unmount;
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
        root.innerHTML = '<section id="benchmark-core" data-mounted="false"><h1>micro app core</h1>' + rows + '</section>';
      })();
    </script>`,
  `<script src="./entry.js" entry></script>
  </body>
</html>`,
];

const FULL_HTML = HTML_CHUNKS.join('');

function setSharedHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Cache-Control', 'no-store');
}

function sendText(response, statusCode, contentType, body) {
  setSharedHeaders(response);
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
  const server = createServer((request, response) => {
    setSharedHeaders(response);
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      });
      response.end();
      return;
    }

    const url = new URL(request.url ?? '/', origin ?? `http://${host}:${port}`);
    if (url.pathname === '/style.css') {
      sendText(response, 200, 'text/css; charset=utf-8', FIXTURE_STYLE);
      return;
    }
    if (url.pathname === '/entry.js') {
      sendText(response, 200, 'text/javascript; charset=utf-8', ENTRY);
      return;
    }
    if (url.pathname !== '/app') {
      sendText(response, 404, 'text/plain; charset=utf-8', 'Not Found');
      return;
    }

    const delivery = url.searchParams.get('delivery') ?? 'buffered';
    if (delivery === 'buffered') {
      sendText(response, 200, 'text/html; charset=utf-8', FULL_HTML);
      return;
    }
    if (delivery !== 'streamed') {
      sendText(response, 400, 'text/plain; charset=utf-8', 'Unknown delivery mode');
      return;
    }

    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.write(HTML_CHUNKS[0]);
    const secondTimer = setTimeout(() => response.write(HTML_CHUNKS[1]), chunkIntervalMs);
    const finalTimer = setTimeout(() => response.end(HTML_CHUNKS[2]), chunkIntervalMs * 2);
    response.once('close', () => {
      clearTimeout(secondTimer);
      clearTimeout(finalTimer);
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
    async start() {
      await listen(server, port, host);
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('fixture server did not expose a TCP port');
      origin = `http://${host}:${address.port}`;
    },
  };
}
