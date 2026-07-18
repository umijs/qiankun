import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateComparisonGates, renderComparisonGateSummary } from '../src/comparison-gates.mjs';

const gates = [
  { comparison: 'sandbox-cost', maxUpperBoundPercent: 25 },
  { comparison: 'sandbox-native', maxUpperBoundPercent: 30 },
  { comparison: 'streaming-gain', maxUpperBoundPercent: -30 },
];

test('comparison gates accept confidence-interval upper bounds at their inclusive thresholds', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': { confidenceInterval95: [-4, 25], label: 'sandbox cost' },
      'sandbox-native': { confidenceInterval95: [-2, 30], label: 'sandbox vs native' },
      'streaming-gain': { confidenceInterval95: [-70, -30], label: 'streaming gain' },
    },
    gates,
  );

  assert.equal(evaluation.passed, true);
  assert.deepEqual(evaluation.failures, []);
  assert.deepEqual(evaluation.evaluations['streaming-gain'], {
    comparison: 'streaming-gain',
    failures: [],
    label: 'streaming gain',
    maxUpperBoundPercent: -30,
    passed: true,
    upperBound: -30,
  });
});

test('comparison gates report every upper bound that exceeds its threshold', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': { confidenceInterval95: [-4, 25.01], label: 'sandbox cost' },
      'sandbox-native': { confidenceInterval95: [-2, 31], label: 'sandbox vs native' },
      'streaming-gain': { confidenceInterval95: [-70, -29.5], label: 'streaming gain' },
    },
    gates,
  );

  assert.equal(evaluation.passed, false);
  assert.deepEqual(evaluation.failures, [
    'sandbox-cost: 95% confidence interval upper bound +25.01% exceeds +25.00%',
    'sandbox-native: 95% confidence interval upper bound +31.00% exceeds +30.00%',
    'streaming-gain: 95% confidence interval upper bound -29.50% exceeds -30.00%',
  ]);
});

test('comparison gate summary shows every label, id, measured upper bound, budget, and verdict', () => {
  const evaluation = evaluateComparisonGates(
    {
      'sandbox-cost': { confidenceInterval95: [-4, 5.2], label: 'sandbox cost' },
      'sandbox-native': { confidenceInterval95: [-2, 31], label: 'sandbox vs native' },
      'streaming-gain': { confidenceInterval95: [-70, -65], label: 'streaming gain' },
    },
    gates,
  );
  const summary = renderComparisonGateSummary(evaluation);

  assert.match(summary, /^## Performance budgets$/mu);
  assert.match(summary, /sandbox cost \(`sandbox-cost`\) \| \+5\.20% \| ≤ \+25\.00% \| passed/u);
  assert.match(summary, /sandbox vs native \(`sandbox-native`\) \| \+31\.00% \| ≤ \+30\.00% \| FAILED/u);
  assert.match(summary, /streaming gain \(`streaming-gain`\) \| -65\.00% \| ≤ -30\.00% \| passed/u);
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
