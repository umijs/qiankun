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
    const buffered = await request(`${fixture.origin}/app?delivery=buffered`);
    const streamed = await request(`${fixture.origin}/app?delivery=streamed`);

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

test('fixture assets are deterministic and missing paths return 404', async () => {
  const fixture = createFixtureServer({ chunkIntervalMs: 1, port: 0 });
  await fixture.start();

  try {
    const style = await request(`${fixture.origin}/style.css`);
    const entry = await request(`${fixture.origin}/entry.js`);
    const missing = await request(`${fixture.origin}/missing.js`);

    assert.equal(style.statusCode, 200);
    assert.match(style.body, /--benchmark-style-ready:\s*1/);
    assert.equal(entry.statusCode, 200);
    assert.match(entry.body, /__WUJIE_MOUNT/);
    assert.equal(missing.statusCode, 404);
  } finally {
    await fixture.close();
  }
});
