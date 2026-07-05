/**
 * Zero-dependency static file server for e2e fixtures.
 * Serves a directory with permissive CORS so the main app (different origin/port)
 * can fetch sub-app entries and assets, mimicking real cross-origin deployments.
 *
 * Usage: node servers/serve.mjs <dir> <port>
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const [, , dir, portArg] = process.argv;
if (!dir || !portArg) {
  console.error('Usage: node servers/serve.mjs <dir> <port>');
  process.exit(1);
}

const root = resolve(process.cwd(), dir);
const port = Number(portArg);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
    res.end();
    return;
  }

  // malformed percent-encoding must yield a 400, not an unhandled rejection killing the server
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
  } catch {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }
  let filePath = normalize(join(root, urlPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  if (urlPath.endsWith('/')) {
    filePath = join(filePath, 'index.html');
  }

  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`[e2e-server] serving ${root} at http://localhost:${port}`);
});
