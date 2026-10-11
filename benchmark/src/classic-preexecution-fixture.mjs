import { createHash } from 'node:crypto';
import { createServer } from 'node:http';

export const CLASSIC_FIXTURE_SIZES = Object.freeze({ '100k': 100 * 1024, '1m': 1024 * 1024, '5m': 5 * 1024 * 1024 });

function describeModule(index, revisionSeed) {
  return {
    left: index - 1,
    right: Math.floor(index / 2),
    seed: ((index + 1) * 7919 + revisionSeed * 101) >>> 0,
    multiplier: 33 + (index % 13) * 2,
    rounds: 3 + (index % 7),
    mask: (1 << (1 + (index % 3))) - 1,
    shift: 3 + (index % 11),
    rotation: 1 + (index % 17),
    finalShift: 1 + (index % 5),
  };
}

function renderModule(index, spec, revisionSeed) {
  const left = index === 0 ? String(revisionSeed) : `require(${spec.left})`;
  const right = index === 0 ? String(revisionSeed * 3) : `require(${spec.right})`;
  return `function module_${index}(module, exports, require) {
  var left = ${left};
  var right = ${right};
  var value = (left ^ right ^ ${spec.seed}) >>> 0;
  for (var round = 0; round < ${spec.rounds}; round++) {
    if (((value + round) & ${spec.mask}) === 0) {
      value = (Math.imul(value ^ left, ${spec.multiplier}) + round + ${spec.seed}) >>> 0;
    } else {
      value = (Math.imul(value + right, ${spec.multiplier}) ^ (value >>> ${spec.shift})) >>> 0;
    }
    value = ((value << ${spec.rotation}) | (value >>> ${32 - spec.rotation})) >>> 0;
  }
  module.exports = (value ^ left ^ (right >>> ${spec.finalShift})) >>> 0;
}`;
}

function evaluateModule(spec, left, right) {
  let value = (left ^ right ^ spec.seed) >>> 0;
  for (let round = 0; round < spec.rounds; round++) {
    if (((value + round) & spec.mask) === 0) {
      value = (Math.imul(value ^ left, spec.multiplier) + round + spec.seed) >>> 0;
    } else {
      value = (Math.imul(value + right, spec.multiplier) ^ (value >>> spec.shift)) >>> 0;
    }
    value = ((value << spec.rotation) | (value >>> (32 - spec.rotation))) >>> 0;
  }
  return (value ^ left ^ (right >>> spec.finalShift)) >>> 0;
}

/** Synthetic module initialization workload, not a production framework bundle. */
export function generateClassicBundle(size, revision = 'a') {
  if (!Object.hasOwn(CLASSIC_FIXTURE_SIZES, size)) throw new Error(`unknown classic fixture size: ${size}`);
  if (revision !== 'a' && revision !== 'b') throw new Error(`unknown classic fixture revision: ${revision}`);
  const targetBytes = CLASSIC_FIXTURE_SIZES[size];
  const revisionSeed = revision === 'a' ? 17 : 97;
  const prefix = `(function (root, factory) {
  root['classic-experiment-app'] = factory(root);
})(window, function (global) {
  global.__experimentExecutions = (global.__experimentExecutions || 0) + 1;
  global.__experimentCurrentScriptSrc = document.currentScript ? document.currentScript.src : null;
  var moduleExecutions = 0;
  var modules = [
`;
  const suffix = `
  ];
  var installedModules = Object.create(null);
  function require(id) {
    if (installedModules[id]) return installedModules[id].exports;
    var module = { exports: {} };
    installedModules[id] = module;
    moduleExecutions++;
    modules[id](module, module.exports, require);
    return module.exports;
  }
  var checksum = ${revisionSeed};
  for (var id = 0; id < modules.length; id++) {
    checksum = (Math.imul(checksum ^ require(id), 16777619) + id) >>> 0;
  }
  global.__experimentChecksum = checksum;
  global.__experimentModulesExecuted = moduleExecutions;
  return {
    bootstrap: function () { return Promise.resolve(); },
    mount: function (props) {
      props.container.innerHTML = '<section id="experiment-core" data-mounted="true" data-checksum="' + checksum + '" style="--benchmark-style-ready:1;display:block;min-height:120px;width:480px"><h1 data-benchmark-critical>Classic experiment ${revision}</h1><p>' + checksum + '</p></section>';
      return Promise.resolve();
    },
    unmount: function (props) {
      props.container.innerHTML = '';
      return Promise.resolve();
    }
  };
});
`;
  const moduleSources = [];
  const values = [];
  let expectedChecksum = revisionSeed;
  let byteLength = Buffer.byteLength(prefix + suffix);
  while (byteLength < targetBytes) {
    const index = moduleSources.length;
    const spec = describeModule(index, revisionSeed);
    const source = renderModule(index, spec, revisionSeed);
    byteLength += Buffer.byteLength(source) + (index === 0 ? 0 : 2);
    moduleSources.push(source);
    const left = index === 0 ? revisionSeed : values[spec.left];
    const right = index === 0 ? revisionSeed * 3 : values[spec.right];
    const value = evaluateModule(spec, left, right);
    values.push(value);
    expectedChecksum = (Math.imul(expectedChecksum ^ value, 16777619) + index) >>> 0;
  }
  const source = prefix + moduleSources.join(',\n') + suffix;
  const basePath = `/app/${size}/${revision}`;
  return {
    source,
    metadata: {
      size,
      revision,
      targetBytes,
      byteLength,
      sha256: createHash('sha256').update(source).digest('hex'),
      moduleCount: moduleSources.length,
      expectedChecksum,
      entryPath: `${basePath}/index.html`,
      scriptPath: `${basePath}/entry.js`,
    },
  };
}

function sharedHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Timing-Allow-Origin', '*');
  response.setHeader('Cache-Control', 'public, max-age=600');
}

export function createClassicExperimentServer({ port = 0, host = '127.0.0.1', latencyMs = 20 } = {}) {
  if (!Number.isFinite(latencyMs) || latencyMs < 0) throw new Error('latencyMs must be a non-negative number');
  const assets = new Map();
  const fixtures = [];
  // Generate and encode before listening: requests must not include generator CPU time.
  for (const size of Object.keys(CLASSIC_FIXTURE_SIZES)) {
    for (const revision of ['a', 'b']) {
      const { source, metadata } = generateClassicBundle(size, revision);
      fixtures.push(metadata);
      assets.set(metadata.scriptPath, { body: Buffer.from(source), contentType: 'text/javascript; charset=utf-8' });
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Classic experiment ${size} ${revision}</title></head><body><script src="./entry.js" entry></script></body></html>`;
      assets.set(metadata.entryPath, { body: Buffer.from(html), contentType: 'text/html; charset=utf-8' });
    }
  }
  let origin;
  const requestCounts = new Map();
  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? '/', origin ?? `http://${host}:${port}`).pathname;
    if (request.method !== 'OPTIONS') {
      requestCounts.set(pathname, (requestCounts.get(pathname) ?? 0) + 1);
    }
    const send = () => {
      sharedHeaders(response);
      if (request.method === 'OPTIONS') {
        response.writeHead(204, {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        });
        response.end();
        return;
      }
      const asset = assets.get(pathname);
      const allowedMethod = request.method === 'GET' || request.method === 'HEAD';
      const body =
        allowedMethod && asset ? asset.body : Buffer.from(allowedMethod ? 'Not Found' : 'Method Not Allowed');
      response.writeHead(allowedMethod ? (asset ? 200 : 404) : 405, {
        'Content-Type': allowedMethod && asset ? asset.contentType : 'text/plain; charset=utf-8',
        'Content-Length': body.length,
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    };
    if (latencyMs === 0) {
      send();
      return;
    }
    const timer = setTimeout(send, latencyMs);
    response.once('close', () => clearTimeout(timer));
  });
  return {
    fixtures,
    async start() {
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, host, () => {
          server.off('error', reject);
          resolve();
        });
      });
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('classic fixture server has no TCP port');
      origin = `http://${host}:${address.port}`;
    },
    async close() {
      if (!server.listening) return;
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeIdleConnections();
      });
    },
    get origin() {
      if (!origin) throw new Error('classic fixture server has not started');
      return origin;
    },
    getRequestCount(pathname) {
      if (pathname !== undefined) return requestCounts.get(pathname) ?? 0;
      return Array.from(requestCounts.values()).reduce((total, count) => total + count, 0);
    },
    resetRequestCounts() {
      requestCounts.clear();
    },
  };
}
