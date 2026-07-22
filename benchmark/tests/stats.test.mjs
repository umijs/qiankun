import assert from 'node:assert/strict';
import test from 'node:test';

import { comparePairedSamples, comparePairedTrials, evaluateCalibration, summarize } from '../src/stats.mjs';

test('summarize reports robust and tail statistics without removing samples', () => {
  const summary = summarize([1, 2, 3, 4, 5]);

  assert.equal(summary.count, 5);
  assert.equal(summary.mean, 3);
  assert.equal(summary.median, 3);
  assert.equal(summary.p75, 4);
  assert.equal(summary.p95, 4.8);
  assert.equal(summary.mad, 1);
  assert.ok(Math.abs(summary.standardDeviation - Math.sqrt(2)) < 1e-12);
  assert.ok(Math.abs(summary.cv - Math.sqrt(2) / 3) < 1e-12);
});

test('comparePairedSamples returns an exact zero interval for identical samples', () => {
  const comparison = comparePairedSamples([10, 20, 30, 40], [10, 20, 30, 40], {
    iterations: 500,
    seed: 7,
  });

  assert.equal(comparison.relativeDeltaPercent, 0);
  assert.deepEqual(comparison.confidenceInterval95, [0, 0]);
});

test('comparePairedSamples reports a deterministic 100 percent regression', () => {
  const comparison = comparePairedSamples([10, 20, 30, 40], [20, 40, 60, 80], {
    iterations: 500,
    seed: 7,
  });

  assert.ok(Math.abs(comparison.relativeDeltaPercent - 100) < 1e-10);
  assert.ok(Math.abs(comparison.confidenceInterval95[0] - 100) < 1e-10);
  assert.ok(Math.abs(comparison.confidenceInterval95[1] - 100) < 1e-10);
});

test('comparePairedTrials aggregates independent browser trials with equal trial weight', () => {
  const neutralReference = Array.from({ length: 101 }, () => 10);
  const neutralCandidate = Array.from({ length: 101 }, () => 10);
  const trials = [
    { candidate: [20], reference: [10] },
    { candidate: [20], reference: [10] },
    { candidate: neutralCandidate, reference: neutralReference },
  ];
  const comparison = comparePairedTrials(trials, { iterations: 1_000, seed: 7 });

  assert.equal(comparison.trialCount, 3);
  assert.deepEqual(comparison.trialRelativeDeltas, [100, 100, 0]);
  assert.ok(Math.abs(comparison.relativeDeltaPercent - 100) < 1e-10);
  assert.deepEqual(comparePairedTrials(trials, { iterations: 1_000, seed: 7 }), comparison);
});

test('comparePairedTrials reports the absolute paired delta in milliseconds alongside the ratio', () => {
  const trials = [
    { candidate: [112, 112, 112], reference: [100, 100, 100] },
    { candidate: [112, 112, 112], reference: [100, 100, 100] },
  ];
  const comparison = comparePairedTrials(trials, { iterations: 500, seed: 7 });

  assert.equal(comparison.absoluteDeltaMs, 12);
  assert.deepEqual(comparison.absoluteDeltaConfidenceInterval95Ms, [12, 12]);
  assert.ok(Math.abs(comparison.relativeDeltaPercent - 12) < 1e-10);

  const mixed = comparePairedTrials([{ candidate: [105, 95], reference: [100, 100] }], {
    iterations: 500,
    seed: 7,
  });
  assert.equal(mixed.absoluteDeltaMs, 0);
});

test('evaluateCalibration enforces delta, zero coverage, and interval width', () => {
  assert.deepEqual(evaluateCalibration({ relativeDeltaPercent: 1, confidenceInterval95: [-2, 3] }), {
    passed: true,
    failures: [],
  });

  assert.deepEqual(evaluateCalibration({ relativeDeltaPercent: 4, confidenceInterval95: [1, 12] }), {
    passed: false,
    failures: [
      'absolute median delta 4.00% exceeds 3.00%',
      '95% confidence interval does not include 0%',
      '95% confidence interval width 11.00pp exceeds 10.00pp',
    ],
  });
});

test('statistics reject missing, mismatched, and non-positive samples', () => {
  assert.throws(() => summarize([]), /at least one sample/);
  assert.throws(() => comparePairedSamples([1], [1, 2], { iterations: 10, seed: 1 }), /same length/);
  assert.throws(() => comparePairedSamples([0], [1], { iterations: 10, seed: 1 }), /positive finite numbers/);
});
