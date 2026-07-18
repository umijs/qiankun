import assert from 'node:assert/strict';
import test from 'node:test';

import { parseRunnerOptions } from '../src/options.mjs';

test('parseRunnerOptions provides the formal smoke defaults', () => {
  assert.deepEqual(parseRunnerOptions([]), {
    baselineDir: null,
    calibrationGate: true,
    calibrationSamples: 100,
    chunkIntervalMs: 50,
    comparisonGate: true,
    mode: 'framework',
    samples: 100,
    scenario: null,
    seed: 20260711,
    suite: 'core',
    timeoutMs: 10_000,
    trials: 3,
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
      '--suite=core',
      '--chunk-interval=10',
      '--timeout=2000',
      '--trials=4',
    ]),
    {
      baselineDir: null,
      calibrationGate: false,
      calibrationSamples: 5,
      chunkIntervalMs: 10,
      comparisonGate: true,
      mode: 'framework',
      samples: 5,
      scenario: null,
      seed: 9,
      suite: 'core',
      timeoutMs: 2_000,
      trials: 4,
      warmup: 2,
    },
  );
});

test('parseRunnerOptions accepts the dedicated SSR streaming suite', () => {
  assert.equal(parseRunnerOptions(['--suite=ssr-streaming']).suite, 'ssr-streaming');
});

test('parseRunnerOptions defaults revision comparisons to the streaming scenario', () => {
  assert.equal(parseRunnerOptions(['--mode=revision', '--baseline-dir=artifacts/baseline']).scenario, 'streaming');
});

test('parseRunnerOptions accepts revision comparison options', () => {
  assert.deepEqual(
    parseRunnerOptions([
      '--mode=revision',
      '--baseline-dir=artifacts/baseline',
      '--comparison-gate=false',
      '--scenario=sandbox',
      '--samples=5',
    ]),
    {
      baselineDir: 'artifacts/baseline',
      calibrationGate: true,
      calibrationSamples: 100,
      chunkIntervalMs: 50,
      comparisonGate: false,
      mode: 'revision',
      samples: 5,
      scenario: 'sandbox',
      seed: 20260711,
      suite: 'core',
      timeoutMs: 10_000,
      trials: 1,
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
  assert.throws(
    () => parseRunnerOptions(['--mode=revision', '--baseline-dir=artifacts/baseline', '--scenario=unknown']),
    /scenario must be streaming or sandbox/u,
  );
  assert.throws(() => parseRunnerOptions(['--scenario=sandbox']), /scenario requires revision mode/u);
  assert.throws(
    () => parseRunnerOptions(['--mode=revision', '--baseline-dir=artifacts/baseline', '--trials=2']),
    /revision mode requires trials=1/u,
  );
  assert.throws(
    () => parseRunnerOptions(['--mode=revision', '--baseline-dir=artifacts/baseline', '--suite=ecosystem-html']),
    /revision mode requires the core suite/u,
  );
});
