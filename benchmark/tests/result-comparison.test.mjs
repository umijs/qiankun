import assert from 'node:assert/strict';
import test from 'node:test';

import { createHarnessFingerprint } from '../src/fingerprint.mjs';
import { compareBenchmarkResults } from '../src/result-comparison.mjs';

function createResult(descriptor, median) {
  return {
    metadata: {
      harness: { descriptor, fingerprint: createHarnessFingerprint(descriptor) },
    },
    product: {
      report: {
        variants: {
          native: { label: 'Native iframe', summary: { median } },
        },
      },
    },
  };
}

test('compareBenchmarkResults permits only matching harnesses', () => {
  const descriptor = { browser: { args: ['--site-per-process'] }, suite: 'core' };
  const rows = compareBenchmarkResults(createResult(descriptor, 40), createResult(descriptor, 44));
  assert.equal(rows[0].candidateMedian, 44);
  assert.equal(rows[0].id, 'native');
  assert.equal(rows[0].label, 'Native iframe');
  assert.equal(rows[0].referenceMedian, 40);
  assert.ok(Math.abs(rows[0].relativeDeltaPercent - 10) < 1e-10);

  assert.throws(
    () =>
      compareBenchmarkResults(createResult(descriptor, 40), createResult({ browser: { args: [] }, suite: 'core' }, 44)),
    /benchmark harnesses are not comparable; changed fields: browser\.args/u,
  );
});
