import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import http from 'node:http';
import test from 'node:test';
import vm from 'node:vm';

import {
  CLASSIC_FIXTURE_SIZES,
  createClassicExperimentServer,
  generateClassicBundle,
} from '../src/classic-preexecution-fixture.mjs';

function request(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const started = performance.now();
    const req = http.request(url, { method }, (response) => {
      const headersAfterMs = performance.now() - started;
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () =>
        resolve({
          body: Buffer.concat(chunks).toString('utf8'),
          headers: response.headers,
          statusCode: response.statusCode,
          headersAfterMs,
        }),
      );
    });
    req.on('error', reject);
    req.end();
  });
}

for (const [size, targetBytes] of Object.entries(CLASSIC_FIXTURE_SIZES)) {
  for (const revision of ['a', 'b']) {
    test(`${size}/${revision} compiles without effects and executes its complete module graph once`, async () => {
      const { source, metadata } = generateClassicBundle(size, revision);
      assert.equal(Buffer.byteLength(source), metadata.byteLength);
      assert.ok(metadata.byteLength >= targetBytes);
      assert.ok(metadata.byteLength < targetBytes + 1024);
      assert.equal(createHash('sha256').update(source).digest('hex'), metadata.sha256);
      assert.ok(metadata.moduleCount > 100);
      assert.equal([...source.matchAll(/function module_\d+\(/gu)].length, metadata.moduleCount);
      const window = {};
      const scriptSrc = `http://fixture.test${metadata.scriptPath}`;
      const context = vm.createContext({ window, document: { currentScript: { src: scriptSrc } } });
      const compiledFactory = new vm.Script(`(function () {\n${source}\n})`).runInContext(context);
      assert.deepEqual(window, {});
      compiledFactory();
      assert.equal(window.__experimentExecutions, 1);
      assert.equal(window.__experimentCurrentScriptSrc, scriptSrc);
      assert.equal(window.__experimentModulesExecuted, metadata.moduleCount);
      assert.equal(window.__experimentChecksum, metadata.expectedChecksum);
      assert.ok(metadata.expectedChecksum > 0);
      const lifecycle = window['classic-experiment-app'];
      const container = { innerHTML: '' };
      await lifecycle.bootstrap();
      await lifecycle.mount({ container });
      assert.match(container.innerHTML, /id="experiment-core"/u);
      assert.match(container.innerHTML, /data-benchmark-critical/u);
      assert.match(container.innerHTML, /data-mounted="true"/u);
      assert.match(container.innerHTML, /--benchmark-style-ready:1/u);
      assert.ok(container.innerHTML.includes(`data-checksum="${metadata.expectedChecksum}"`));
      await lifecycle.unmount({ container });
      assert.equal(container.innerHTML, '');
      assert.equal(window.__experimentExecutions, 1);
    });
  }
}

test('bundle generation is deterministic and revision changes the executable workload', () => {
  const a = generateClassicBundle('100k', 'a');
  assert.deepEqual(generateClassicBundle('100k', 'a'), a);
  const b = generateClassicBundle('100k', 'b');
  assert.notEqual(a.source, b.source);
  assert.notEqual(a.metadata.sha256, b.metadata.sha256);
  assert.notEqual(a.metadata.expectedChecksum, b.metadata.expectedChecksum);
  assert.ok(Math.abs(a.metadata.byteLength - b.metadata.byteLength) < 1024);
  assert.throws(() => generateClassicBundle('2m'), /unknown classic fixture size/u);
  assert.throws(() => generateClassicBundle('1m', 'c'), /unknown classic fixture revision/u);
});

test('server pre-generates all fixture paths and serves cacheable classic entries', async () => {
  const server = createClassicExperimentServer({ latencyMs: 0 });
  assert.equal(server.fixtures.length, 6);
  assert.throws(() => server.origin, /has not started/u);
  await server.start();
  try {
    for (const metadata of server.fixtures) {
      const html = await request(`${server.origin}${metadata.entryPath}`);
      assert.equal(html.statusCode, 200);
      assert.equal([...html.body.matchAll(/<script\b/gu)].length, 1);
      assert.match(html.body, /<script src="\.\/entry\.js" entry><\/script>/u);
      assert.doesNotMatch(html.body, /type="module"|<link\b/u);
      const entry = await request(`${server.origin}${metadata.scriptPath}`);
      assert.equal(entry.statusCode, 200);
      assert.equal(Buffer.byteLength(entry.body), metadata.byteLength);
      assert.equal(createHash('sha256').update(entry.body).digest('hex'), metadata.sha256);
      for (const response of [html, entry]) {
        assert.equal(response.headers['cache-control'], 'public, max-age=600');
        assert.equal(response.headers['access-control-allow-origin'], '*');
        assert.equal(response.headers['timing-allow-origin'], '*');
      }
      assert.equal(server.getRequestCount(metadata.entryPath), 1);
      assert.equal(server.getRequestCount(metadata.scriptPath), 1);
    }
    assert.equal(server.getRequestCount(), 12);
    const head = await request(`${server.origin}/app/100k/a/entry.js`, 'HEAD');
    assert.equal(head.statusCode, 200);
    assert.equal(head.body, '');
    assert.equal(Number(head.headers['content-length']), server.fixtures[0].byteLength);
    const options = await request(`${server.origin}/app/100k/a/entry.js`, 'OPTIONS');
    assert.equal(options.statusCode, 204);
    assert.equal(server.getRequestCount('/app/100k/a/entry.js'), 2);
    assert.equal((await request(`${server.origin}/app/100k/c/entry.js`)).statusCode, 404);
    assert.equal((await request(`${server.origin}/app/100k/a/entry.js`, 'POST')).statusCode, 405);
    server.resetRequestCounts();
    assert.equal(server.getRequestCount(), 0);
    assert.equal(server.getRequestCount('/app/100k/a/index.html'), 0);
  } finally {
    await server.close();
  }
});

test('configured latency delays headers and response generation is reusable', async () => {
  const server = createClassicExperimentServer({ latencyMs: 30 });
  await server.start();
  try {
    const response = await request(`${server.origin}/app/100k/a/index.html`);
    assert.equal(response.statusCode, 200);
    assert.ok(response.headersAfterMs >= 25);
  } finally {
    await server.close();
  }
  await server.close();
  assert.throws(() => createClassicExperimentServer({ latencyMs: -1 }), /non-negative/u);
});
