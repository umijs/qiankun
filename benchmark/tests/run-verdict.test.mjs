import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateRunVerdict } from '../src/run-verdict.mjs';

function createInput(overrides = {}) {
  return {
    calibrationEvaluation: { passed: true },
    comparisonEvaluation: { passed: true },
    expectedProductSamples: 500,
    fatalError: undefined,
    hasComparisonGates: true,
    hasInvalidProductSample: false,
    options: { calibrationGate: true, comparisonGate: true, mode: 'framework' },
    productSampleCount: 500,
    revisionEvaluation: undefined,
    ...overrides,
  };
}

test('framework runs enforce suite comparison gates when the suite defines them', () => {
  assert.equal(evaluateRunVerdict(createInput()), true);
  assert.equal(evaluateRunVerdict(createInput({ comparisonEvaluation: { passed: false } })), false);
  assert.equal(
    evaluateRunVerdict(
      createInput({
        comparisonEvaluation: { passed: false },
        options: { ...createInput().options, comparisonGate: false },
      }),
    ),
    true,
  );
});

test('framework suites without comparison gates preserve their existing verdict behavior', () => {
  assert.equal(evaluateRunVerdict(createInput({ comparisonEvaluation: undefined, hasComparisonGates: false })), true);
});

test('revision runs continue to use the revision improvement evaluation', () => {
  const options = { calibrationGate: true, comparisonGate: true, mode: 'revision' };
  assert.equal(
    evaluateRunVerdict(createInput({ comparisonEvaluation: undefined, options, revisionEvaluation: { passed: true } })),
    true,
  );
  assert.equal(
    evaluateRunVerdict(
      createInput({ comparisonEvaluation: { passed: true }, options, revisionEvaluation: { passed: false } }),
    ),
    false,
  );
});

test('run verdict still rejects fatal, invalid, incomplete, and failed-calibration runs', () => {
  assert.equal(evaluateRunVerdict(createInput({ fatalError: 'failed' })), false);
  assert.equal(evaluateRunVerdict(createInput({ hasInvalidProductSample: true })), false);
  assert.equal(evaluateRunVerdict(createInput({ productSampleCount: 499 })), false);
  assert.equal(evaluateRunVerdict(createInput({ calibrationEvaluation: { passed: false } })), false);
});
