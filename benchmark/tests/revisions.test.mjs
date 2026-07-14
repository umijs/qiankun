import assert from 'node:assert/strict';
import test from 'node:test';

test('evaluateRevisionComparison requires the confidence interval upper bound below zero', async () => {
  const { evaluateRevisionComparison } = await import('../src/revisions.mjs');

  assert.deepEqual(evaluateRevisionComparison({ confidenceInterval95: [-12, -3], relativeDeltaPercent: -7 }), {
    failures: [],
    passed: true,
  });
  assert.deepEqual(evaluateRevisionComparison({ confidenceInterval95: [-4, 0.5], relativeDeltaPercent: -2 }), {
    failures: ['95% confidence interval upper bound +0.50% is not below 0%'],
    passed: false,
  });
});

test('resolveVariantHostOrigin selects the revision host and fails on missing roles', async () => {
  const { resolveVariantHostOrigin } = await import('../src/revisions.mjs');
  const hostOrigins = { baseline: 'http://baseline', candidate: 'http://candidate' };

  assert.equal(resolveVariantHostOrigin({}, hostOrigins), 'http://candidate');
  assert.equal(resolveVariantHostOrigin({ hostRole: 'baseline' }, hostOrigins), 'http://baseline');
  assert.throws(
    () => resolveVariantHostOrigin({ hostRole: 'missing' }, hostOrigins),
    /host origin is unavailable for role: missing/u,
  );
});
