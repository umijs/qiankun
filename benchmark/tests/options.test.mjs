import assert from 'node:assert/strict';
import test from 'node:test';

import { parseRunnerOptions } from '../src/options.mjs';

test('parseRunnerOptions provides the formal smoke defaults', () => {
  assert.deepEqual(parseRunnerOptions([]), {
    baselineDir: null,
    calibrationGate: true,
    calibrationSamples: 50,
    chunkIntervalMs: 50,
    comparisonGate: true,
    mode: 'framework',
    samples: 100,
    seed: 20260711,
    timeoutMs: 10_000,
    warmup: 5,
  });
});

test('parseRunnerOptions accepts explicit check-run overrides', () => {
  assert.deepEqual(
    parseRunnerOptions([
      '--samples=5',
      '--warmup=2',
      '--calibration-samples=5',
      '--calibration-gate=false',
      '--seed=9',
      '--chunk-interval=10',
      '--timeout=2000',
    ]),
    {
      baselineDir: null,
      calibrationGate: false,
      calibrationSamples: 5,
      chunkIntervalMs: 10,
      comparisonGate: true,
      mode: 'framework',
      samples: 5,
      seed: 9,
      timeoutMs: 2_000,
      warmup: 2,
    },
  );
});

test('parseRunnerOptions accepts revision comparison options', () => {
  assert.deepEqual(
    parseRunnerOptions([
      '--mode=revision',
      '--baseline-dir=artifacts/baseline',
      '--comparison-gate=false',
      '--samples=5',
    ]),
    {
      baselineDir: 'artifacts/baseline',
      calibrationGate: true,
      calibrationSamples: 50,
      chunkIntervalMs: 50,
      comparisonGate: false,
      mode: 'revision',
      samples: 5,
      seed: 20260711,
      timeoutMs: 10_000,
      warmup: 5,
    },
  );
});

test('parseRunnerOptions rejects unknown, non-integer, and non-positive values', () => {
  assert.throws(() => parseRunnerOptions(['--wat=1']), /unknown option/);
  assert.throws(() => parseRunnerOptions(['--samples=1.5']), /samples must be a positive integer/);
  assert.throws(() => parseRunnerOptions(['--timeout=0']), /timeout must be a positive integer/);
  assert.throws(() => parseRunnerOptions(['--calibration-gate=maybe']), /calibration-gate must be true or false/);
  assert.throws(() => parseRunnerOptions(['--mode=revision']), /baseline-dir is required/u);
  assert.throws(() => parseRunnerOptions(['--mode=unknown']), /mode must be framework or revision/u);
});
