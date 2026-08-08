import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateComparisonGates, renderComparisonGateSummary } from '../src/comparison-gates.mjs';

const gates = [
  { comparison: 'sandbox-cost', maxUpperBoundPercent: 10 },
  { comparison: 'sandbox-native', maxUpperBoundPercent: 10 },
  { comparison: 'streaming-gain', maxUpperBoundPercent: -30 },
];

test('comparison gates accept confidence-interval upper bounds at their inclusive thresholds', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': { confidenceInterval95: [-4, 10], label: 'sandbox cost' },
      'sandbox-native': { confidenceInterval95: [-2, 10], label: 'sandbox vs native' },
      'streaming-gain': { confidenceInterval95: [-70, -30], label: 'streaming gain' },
    },
    gates,
  );

  assert.equal(evaluation.passed, true);
  assert.deepEqual(evaluation.failures, []);
  assert.deepEqual(evaluation.evaluations['streaming-gain'], {
    absoluteUpperBoundMs: undefined,
    comparison: 'streaming-gain',
    failures: [],
    label: 'streaming gain',
    maxUpperBoundMs: undefined,
    maxUpperBoundPercent: -30,
    passed: true,
    upperBound: -30,
  });
});

test('comparison gates judge absolute millisecond bounds alongside percentages', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': {
        absoluteDeltaConfidenceInterval95Ms: [0.2, 5],
        confidenceInterval95: [-4, 8],
        label: 'sandbox cost',
      },
      'sandbox-native': {
        absoluteDeltaConfidenceInterval95Ms: [1.4, 10.5],
        confidenceInterval95: [-2, 9],
        label: 'sandbox vs native',
      },
    },
    [
      { comparison: 'sandbox-cost', maxUpperBoundMs: 5, maxUpperBoundPercent: 10 },
      { comparison: 'sandbox-native', maxUpperBoundMs: 10, maxUpperBoundPercent: 15 },
    ],
  );

  assert.equal(evaluation.passed, false);
  assert.deepEqual(evaluation.failures, [
    'sandbox-native: absolute 95% confidence interval upper bound +10.50ms exceeds +10.00ms',
  ]);
  assert.equal(evaluation.evaluations['sandbox-cost'].passed, true);
  assert.equal(evaluation.evaluations['sandbox-cost'].absoluteUpperBoundMs, 5);
});

test('comparison gates require at least one bound and a matching absolute interval', () => {
  assert.throws(
    () =>
      evaluateComparisonGates({ comparison: { confidenceInterval95: [0, 1], label: 'c' } }, [
        { comparison: 'comparison' },
      ]),
    /defines no upper-bound threshold: comparison/u,
  );
  assert.throws(
    () =>
      evaluateComparisonGates({ comparison: { confidenceInterval95: [0, 1], label: 'c' } }, [
        { comparison: 'comparison', maxUpperBoundMs: 5 },
      ]),
    /invalid absolute confidence interval: comparison/u,
  );
});

test('comparison gates report every upper bound that exceeds its threshold', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': { confidenceInterval95: [-4, 10.01], label: 'sandbox cost' },
      'sandbox-native': { confidenceInterval95: [-2, 11], label: 'sandbox vs native' },
      'streaming-gain': { confidenceInterval95: [-70, -29.5], label: 'streaming gain' },
    },
    gates,
  );

  assert.equal(evaluation.passed, false);
  assert.deepEqual(evaluation.failures, [
    'sandbox-cost: 95% confidence interval upper bound +10.01% exceeds +10.00%',
    'sandbox-native: 95% confidence interval upper bound +11.00% exceeds +10.00%',
    'streaming-gain: 95% confidence interval upper bound -29.50% exceeds -30.00%',
  ]);
});

test('comparison gate summary shows every label, id, measured upper bound, budget, and verdict', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': { confidenceInterval95: [-4, 5.2], label: 'sandbox cost' },
      'sandbox-native': { confidenceInterval95: [-2, 11], label: 'sandbox vs native' },
      'streaming-gain': { confidenceInterval95: [-70, -65], label: 'streaming gain' },
    },
    gates,
  );
  const summary = renderComparisonGateSummary(evaluation);

  assert.match(summary, /^## Performance budgets$/mu);
  assert.match(summary, /sandbox cost \(`sandbox-cost`\) \| \+5\.20% \| ≤ \+10\.00% \| — \| — \| passed/u);
  assert.match(summary, /sandbox vs native \(`sandbox-native`\) \| \+11\.00% \| ≤ \+10\.00% \| — \| — \| FAILED/u);
  assert.match(summary, /streaming gain \(`streaming-gain`\) \| -65\.00% \| ≤ -30\.00% \| — \| — \| passed/u);
});

test('comparison gate summary renders configured absolute bounds', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': {
        absoluteDeltaConfidenceInterval95Ms: [0.2, 2.4],
        confidenceInterval95: [-4, 5.2],
        label: 'sandbox cost',
      },
    },
    [{ comparison: 'sandbox-cost', maxUpperBoundMs: 5, maxUpperBoundPercent: 10 }],
  );
  const summary = renderComparisonGateSummary(evaluation);

  assert.match(
    summary,
    /sandbox cost \(`sandbox-cost`\) \| \+5\.20% \| ≤ \+10\.00% \| \+2\.40ms \| ≤ \+5\.00ms \| passed/u,
  );
});

test('comparison gates reject missing comparisons, invalid thresholds, and duplicate gate ids', () => {
  assert.throws(
    () => evaluateComparisonGates({}, [{ comparison: 'missing', maxUpperBoundPercent: 10 }]),
    /unknown comparison: missing/u,
  );
  assert.throws(
    () =>
      evaluateComparisonGates({ comparison: { confidenceInterval95: [0, 1] } }, [
        { comparison: 'comparison', maxUpperBoundPercent: Number.NaN },
      ]),
    /invalid upper-bound threshold: comparison/u,
  );
  assert.throws(
    () =>
      evaluateComparisonGates({ comparison: { confidenceInterval95: [0, 1] } }, [
        { comparison: 'comparison', maxUpperBoundPercent: 10 },
        { comparison: 'comparison', maxUpperBoundPercent: 20 },
      ]),
    /duplicate comparison gate: comparison/u,
  );
});
