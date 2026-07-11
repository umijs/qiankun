import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative, resolve } from 'node:path';

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function listen(server, port, host) {
  return new Promise((resolveListening, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.off('error', reject);
      resolveListening();
    });
  });
}

function close(server) {
  if (!server.listening) return Promise.resolve();
  return new Promise((resolveClosing, reject) => {
    server.close((error) => (error ? reject(error) : resolveClosing()));
  });
}

export function createStaticServer({ host = '127.0.0.1', port = 7600, root }) {
  const absoluteRoot = resolve(root);
  let origin;
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    const url = new URL(request.url ?? '/', origin ?? `http://${host}:${port}`);
    const requestedPath = url.pathname === '/' ? '/qiankun.html' : decodeURIComponent(url.pathname);
    const filePath = resolve(join(absoluteRoot, requestedPath));
    const relativePath = relative(absoluteRoot, filePath);
    if (relativePath.startsWith('..') || relativePath === '') {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }

    try {
      const content = await readFile(filePath);
      response.writeHead(200, {
        'Content-Length': content.byteLength,
        'Content-Type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream',
      });
      response.end(content);
    } catch {
      response.writeHead(404);
      response.end('Not Found');
    }
  });

  return {
    async close() {
      await close(server);
    },
    get origin() {
      if (!origin) throw new Error('static server has not started');
      return origin;
    },
    async start() {
      await listen(server, port, host);
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('static server did not expose a TCP port');
      origin = `http://${host}:${address.port}`;
    },
  };
}
