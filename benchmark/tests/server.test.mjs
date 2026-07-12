import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

import { createFixtureServer } from '../src/server.mjs';

function request(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const arrivals = [];
    const requestStartedAt = performance.now();
    const req = http.get(url, (response) => {
      response.on('data', (chunk) => {
        chunks.push(chunk);
        arrivals.push(performance.now() - requestStartedAt);
      });
      response.on('end', () => {
        resolve({
          arrivals,
          body: Buffer.concat(chunks).toString('utf8'),
          headers: response.headers,
          statusCode: response.statusCode,
        });
      });
    });
    req.on('error', reject);
  });
}

test('streamed and buffered HTML produce identical bytes with observable chunk gaps', async () => {
  const fixture = createFixtureServer({ chunkIntervalMs: 20, port: 0 });
  await fixture.start();

  try {
    const buffered = await request(`${fixture.origin}/app/index.html?delivery=buffered`);
    const streamed = await request(`${fixture.origin}/app/index.html?delivery=streamed`);

    assert.equal(buffered.statusCode, 200);
    assert.equal(streamed.statusCode, 200);
    assert.equal(streamed.body, buffered.body);
    assert.ok(streamed.arrivals.length >= 3);
    assert.ok(streamed.arrivals.at(-1) - streamed.arrivals[0] >= 30);
    assert.equal(streamed.headers['access-control-allow-origin'], '*');
    assert.equal(streamed.headers['cache-control'], 'no-store');
  } finally {
    await fixture.close();
  }
});

test('SSR streaming reveals literal critical content before an identical delayed buffer', async () => {
  const fixture = createFixtureServer({ chunkIntervalMs: 20, port: 0 });
  await fixture.start();

  try {
    const streamed = await request(`${fixture.origin}/app/index.html?fixture=ssr&delivery=streamed`);
    const delayed = await request(`${fixture.origin}/app/index.html?fixture=ssr&delivery=delayed-buffered`);

    assert.equal(streamed.statusCode, 200);
    assert.equal(delayed.statusCode, 200);
    assert.equal(streamed.body, delayed.body);
    assert.ok(streamed.arrivals.length >= 3);
    assert.ok(streamed.arrivals.at(-1) - streamed.arrivals[0] >= 30);
    assert.ok(delayed.arrivals[0] >= 30);
    assert.match(streamed.body, /data-benchmark-critical/u);
    assert.doesNotMatch(streamed.body, /root\.innerHTML/u);
    assert.ok(streamed.body.indexOf('data-benchmark-critical') < streamed.body.indexOf('benchmark-stream-tail'));
    assert.ok(
      streamed.body.indexOf('benchmark-stream-tail') < streamed.body.indexOf('<script src="./entry.js" entry>'),
    );
  } finally {
    await fixture.close();
  }
});

test('fixture assets are deterministic and missing paths return 404', async () => {
  const fixture = createFixtureServer({ chunkIntervalMs: 1, port: 0 });
  await fixture.start();

  try {
    const style = await request(`${fixture.origin}/app/style.css`);
    const entry = await request(`${fixture.origin}/app/entry.js`);
    const app = await request(`${fixture.origin}/app/index.html?delivery=buffered`);
    const missing = await request(`${fixture.origin}/missing.js`);

    assert.equal(style.statusCode, 200);
    assert.equal(style.headers['cache-control'], 'public, max-age=31536000, immutable');
    assert.match(style.body, /--benchmark-style-ready:\s*1/);
    assert.equal(entry.statusCode, 200);
    assert.equal(entry.headers['cache-control'], 'public, max-age=31536000, immutable');
    assert.match(entry.body, /global\.mount = mountedRoot/);
    assert.match(entry.body, /global\.unmount = unmount/);
    assert.match(entry.body, /__WUJIE_MOUNT/);
    assert.match(entry.body, /__GARFISH_EXPORTS__\.provider/);
    assert.match(entry.body, /native-app-mounted/);
    assert.equal(app.statusCode, 200);
    assert.match(app.body, /benchmark=native-iframe/);
    assert.match(app.body, /benchmark-parent-origin/);
    assert.match(app.body, /benchmark-token/);
    assert.match(app.body, /native-core-painted/);
    assert.match(app.body, /paintedAt: performance\.timeOrigin \+ performance\.now\(\)/);
    assert.ok(app.body.indexOf('native-core-painted') < app.body.indexOf('<script src="./entry.js" entry>'));
    assert.equal(app.headers['cache-control'], 'no-store');
    assert.equal(fixture.getRequestCount('/app/index.html'), 1);
    assert.equal(fixture.getRequestCount('/app/style.css'), 1);
    assert.equal(fixture.getRequestCount('/app/entry.js'), 1);
    assert.equal(missing.statusCode, 404);
    fixture.resetRequestCounts();
    assert.equal(fixture.getRequestCount('/app/index.html'), 0);
  } finally {
    await fixture.close();
  }
});
