import assert from 'node:assert/strict';
import test from 'node:test';

import {
  RFC_PERFORMANCE_METRICS,
  RFC_REGRESSION_BUDGET_PERCENT,
  parseRfcPerformanceOptions,
} from '../src/rfc-performance.mjs';

test('RFC performance acceptance freezes the required metrics and 5% budget', () => {
  assert.equal(RFC_REGRESSION_BUDGET_PERCENT, 5);
  assert.deepEqual(
    RFC_PERFORMANCE_METRICS.map(({ id }) => id),
    ['membrane-get', 'membrane-set', 'module-rewrite', 'load-chain'],
  );
});

test('RFC performance options use formal defaults and accept plumbing overrides', () => {
  assert.deepEqual(parseRfcPerformanceOptions([]), {
    baselineDir: 'artifacts/baseline',
    samples: 100,
    seed: 20260718,
    timeoutMs: 10_000,
    warmup: 5,
  });
  assert.deepEqual(
    parseRfcPerformanceOptions([
      '--baseline-dir=artifacts/rfc-baseline',
      '--samples=7',
      '--warmup=2',
      '--seed=11',
      '--timeout=20000',
    ]),
    {
      baselineDir: 'artifacts/rfc-baseline',
      samples: 7,
      seed: 11,
      timeoutMs: 20_000,
      warmup: 2,
    },
  );
});

test('RFC performance options reject unknown or non-positive values', () => {
  assert.throws(() => parseRfcPerformanceOptions(['--budget=10']), /unknown option: --budget/u);
  assert.throws(() => parseRfcPerformanceOptions(['--samples=0']), /samples must be a positive integer/u);
});
