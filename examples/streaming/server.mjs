/**
 * The dev server for the streamed micro app — the one example whose server is the demo.
 *
 * It plays a server-side renderer that emits HTML as its data becomes ready: `index.html` is
 * split on `<!--#flush:<ms>-->` markers and written chunk by chunk over one chunked-transfer
 * response, pausing `<ms>` before each flush. qiankun's loader pipes the response body through
 * its streaming parser, so every chunk paints as it lands — watching this app load IS the demo.
 *
 * Deployed, `pages-function.mjs` replays the same markers as a Cloudflare Pages Function.
 * Zero dependencies; `node server.mjs` is the whole dev story.
 */
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = dirname(fileURLToPath(import.meta.url));
const PORT = 7106;
const FLUSH_MARKER = /<!--#flush:(\d+)-->/;

/** `[chunk, pauseMs, chunk, pauseMs, …, chunk]` — the pacing lives in the HTML, next to the content it delays. */
function chunkedHtml() {
  // read per request: this is a dev server, edits to index.html should show up on reload
  return readFileSync(join(appDir, 'index.html'), 'utf8').split(new RegExp(FLUSH_MARKER.source, 'g'));
}

function baseHeaders(contentType) {
  return {
    // qiankun fetches the entry cross-origin from the shells on 7099/7105
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Type': contentType,
    'Timing-Allow-Origin': '*',
  };
}

const server = createServer((request, response) => {
  const { pathname } = new URL(request.url ?? '/', `http://localhost:${PORT}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    });
    response.end();
    return;
  }

  if (pathname === '/entry.js') {
    response.writeHead(200, baseHeaders('text/javascript; charset=utf-8'));
    response.end(readFileSync(join(appDir, 'entry.js')));
    return;
  }

  if (pathname !== '/' && pathname !== '/index.html') {
    response.writeHead(404, baseHeaders('text/plain; charset=utf-8'));
    response.end('Not Found');
    return;
  }

  // no Content-Length → Node switches to chunked transfer, and each write() is a flush
  response.writeHead(200, baseHeaders('text/html; charset=utf-8'));
  const parts = chunkedHtml();
  response.write(parts[0]);

  let elapsed = 0;
  const timers = [];
  for (let index = 1; index < parts.length; index += 2) {
    elapsed += Number(parts[index]);
    const chunk = parts[index + 1];
    const last = index + 2 >= parts.length;
    timers.push(setTimeout(() => (last ? response.end(chunk) : response.write(chunk)), elapsed));
  }
  response.once('close', () => timers.forEach(clearTimeout));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`streaming micro app ready at http://localhost:${PORT} — each reload re-streams the document`);
});
