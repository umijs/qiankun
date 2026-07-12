import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { createRevisionHarnessRecord } from '../src/harness.mjs';

const benchmarkRoot = fileURLToPath(new URL('..', import.meta.url));

test('revision harness compatibility record is stable and covers source inputs', async () => {
  const first = await createRevisionHarnessRecord(benchmarkRoot);
  const second = await createRevisionHarnessRecord(benchmarkRoot);

  assert.deepEqual(second, first);
  assert.match(first.fingerprint, /^[a-f\d]{64}$/u);
  assert.match(first.descriptor.sourceHash, /^[a-f\d]{64}$/u);
  assert.equal(first.descriptor.measurement.version, 4);
  assert.deepEqual(first.descriptor.measurement.diagnostics, [
    'framework settlement',
    'HTML response end',
    'paint lead before response end',
  ]);
});
