import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateRegressionBudget } from '../src/regression.mjs';

test('regression budget accepts a paired median regression of at most 5%', () => {
  assert.deepEqual(evaluateRegressionBudget({ confidenceInterval95: [3, 6], relativeDeltaPercent: 5 }), {
    failures: [],
    maxIntervalWidthPercentPoints: 10,
    maxRegressionPercent: 5,
    passed: true,
  });
});

test('regression budget rejects a paired median regression above 5%', () => {
  const evaluation = evaluateRegressionBudget({ confidenceInterval95: [4, 6], relativeDeltaPercent: 5.01 });
  assert.equal(evaluation.passed, false);
  assert.match(evaluation.failures[0], /paired median regression \+5\.01% exceeds the \+5\.00% regression budget/u);
});

test('regression budget rejects an inconclusive run whose confidence interval is too wide', () => {
  const evaluation = evaluateRegressionBudget({ confidenceInterval95: [-20, 30], relativeDeltaPercent: 4 });
  assert.equal(evaluation.passed, false);
  assert.match(evaluation.failures[0], /inconclusive: 95% confidence interval width 50\.00pp exceeds 10\.00pp/u);
});

test('regression budget rejects a comparison without a usable confidence interval', () => {
  const evaluation = evaluateRegressionBudget({ relativeDeltaPercent: 1 });
  assert.equal(evaluation.passed, false);
  assert.match(evaluation.failures[0], /lacks a finite 95% confidence interval/u);
});

test('regression budget allows explicitly disabling the resolution guard', () => {
  const evaluation = evaluateRegressionBudget({ relativeDeltaPercent: 1 }, { maxIntervalWidthPercentPoints: null });
  assert.deepEqual(evaluation, {
    failures: [],
    maxIntervalWidthPercentPoints: null,
    maxRegressionPercent: 5,
    passed: true,
  });
});

test('regression budget validates its inputs', () => {
  assert.throws(() => evaluateRegressionBudget({ relativeDeltaPercent: Number.NaN }), /finite relative delta/u);
  assert.throws(
    () => evaluateRegressionBudget({ relativeDeltaPercent: 1 }, { maxRegressionPercent: -1 }),
    /non-negative finite number/u,
  );
  assert.throws(
    () => evaluateRegressionBudget({ relativeDeltaPercent: 1 }, { maxIntervalWidthPercentPoints: 0 }),
    /positive finite number or null/u,
  );
});
