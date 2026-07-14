import assert from 'node:assert/strict';
import test from 'node:test';

import * as scenarios from '../scenarios.mjs';

const { CALIBRATION_VARIANTS, PRODUCT_COMPARISONS, PRODUCT_VARIANTS } = scenarios;

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

test('revision comparison variants differ only by revision host role', () => {
  const { REVISION_CALIBRATION_VARIANTS, REVISION_COMPARISONS, REVISION_VARIANTS } = scenarios;

  assert.deepEqual(
    REVISION_VARIANTS.map(({ hostRole, id }) => ({ hostRole, id })),
    [
      { hostRole: 'baseline', id: 'revision-baseline' },
      { hostRole: 'candidate', id: 'revision-candidate' },
    ],
  );
  assert.deepEqual(
    REVISION_VARIANTS.map(({ delivery, framework, frameworkOptions }) => ({
      delivery,
      framework,
      frameworkOptions,
    })),
    [
      {
        delivery: 'streamed',
        framework: 'qiankun',
        frameworkOptions: { sandbox: true, styleIsolation: true },
      },
      {
        delivery: 'streamed',
        framework: 'qiankun',
        frameworkOptions: { sandbox: true, styleIsolation: true },
      },
    ],
  );
  assert.deepEqual(REVISION_COMPARISONS, [
    {
      candidate: 'revision-candidate',
      id: 'candidate-vs-baseline',
      label: 'candidate vs baseline',
      reference: 'revision-baseline',
    },
  ]);
  assert.deepEqual(
    REVISION_CALIBRATION_VARIANTS.map(({ sourceVariant }) => sourceVariant),
    ['revision-candidate', 'revision-candidate'],
  );
});
