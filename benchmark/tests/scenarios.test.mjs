import assert from 'node:assert/strict';
import test from 'node:test';

import { CALIBRATION_VARIANTS, PRODUCT_VARIANTS, PRODUCT_COMPARISONS } from '../scenarios.mjs';

test('the product matrix contains six explicit variants instead of a cartesian product', () => {
  assert.deepEqual(
    PRODUCT_VARIANTS.map((variant) => variant.id),
    ['qk-no-isolation', 'qk-sandbox', 'qk-full-isolation', 'wujie-isolated', 'qk-streamed', 'wujie-streamed'],
  );
});

test('qiankun variants isolate sandbox and style costs one feature at a time', () => {
  const noIsolation = PRODUCT_VARIANTS[0];
  const sandbox = PRODUCT_VARIANTS[1];
  const fullIsolation = PRODUCT_VARIANTS[2];

  assert.deepEqual(noIsolation.frameworkOptions, { sandbox: false, styleIsolation: false });
  assert.deepEqual(sandbox.frameworkOptions, { sandbox: true, styleIsolation: false });
  assert.deepEqual(fullIsolation.frameworkOptions, { sandbox: true, styleIsolation: true });
});

test('wujie variants use its fastest cold-load isolated configuration', () => {
  for (const variant of PRODUCT_VARIANTS.filter(({ framework }) => framework === 'wujie')) {
    assert.deepEqual(variant.frameworkOptions, {
      alive: false,
      degrade: false,
      fiber: false,
      sync: false,
    });
  }
});

test('the matrix defines the four comparisons used to diagnose optimization directions', () => {
  assert.deepEqual(
    PRODUCT_COMPARISONS.map((comparison) => comparison.id),
    ['sandbox-cost', 'style-isolation-cost', 'isolated-framework', 'streaming-framework'],
  );
});

test('A/A calibration aliases the exact same qiankun variant', () => {
  assert.equal(CALIBRATION_VARIANTS.length, 2);
  assert.deepEqual(
    CALIBRATION_VARIANTS.map(({ sourceVariant }) => sourceVariant),
    ['qk-full-isolation', 'qk-full-isolation'],
  );
});
