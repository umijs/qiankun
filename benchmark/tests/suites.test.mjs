import assert from 'node:assert/strict';
import test from 'node:test';

import { SUITES } from '../scenarios.mjs';
import { createHarnessFingerprint } from '../src/fingerprint.mjs';
import { createBalancedSchedule } from '../src/schedule.mjs';

test('suite memberships stay explicit while the core fingerprint remains frozen', () => {
  assert.equal(
    createHarnessFingerprint(SUITES.core),
    'cfdd7caaf5aa7f3a8579699c2b740ea24624b10b5e0b2d23c99aab7a7fc71665',
  );
  assert.deepEqual(
    SUITES.core.variants.map(({ id }) => id),
    [
      'qk-no-isolation',
      'qk-sandbox',
      'qk-full-isolation',
      'native-iframe',
      'wujie-isolated',
      'native-iframe-streamed',
      'qk-streamed',
      'wujie-streamed',
    ],
  );
  assert.deepEqual(
    SUITES['site-isolation'].variants.map(({ id }) => id),
    [
      'qk-full-isolation',
      'native-iframe',
      'wujie-isolated',
      'qk-full-isolation-cross-site',
      'native-iframe-cross-site',
      'wujie-cross-site-entry',
    ],
  );
  assert.deepEqual(
    SUITES['ecosystem-html'].variants.map(({ id }) => id),
    [
      'native-iframe',
      'qk-v2-full-isolation',
      'qk-full-isolation',
      'wujie-isolated',
      'microapp-default-isolation',
      'garfish-strict-isolation',
    ],
  );
  assert.deepEqual(
    SUITES['ssr-streaming'].variants.map(({ id }) => id),
    [
      'native-iframe-ssr-streamed',
      'qk-v3-ssr-delayed-buffered',
      'qk-v2-ssr-streamed',
      'qk-v3-ssr-streamed',
      'wujie-ssr-streamed',
      'garfish-ssr-streamed',
    ],
  );
  assert.equal(SUITES['ssr-streaming'].calibrationSourceVariant, 'qk-v3-ssr-streamed');
});

test('adding an ecosystem variant cannot change the core balanced schedule', () => {
  const coreIds = SUITES.core.variants.map(({ id }) => id);
  const before = createBalancedSchedule(coreIds, 24, 20260711);
  const expandedEcosystem = [...SUITES['ecosystem-html'].variants, { id: 'future-framework' }];

  assert.equal(expandedEcosystem.length, SUITES['ecosystem-html'].variants.length + 1);
  assert.deepEqual(createBalancedSchedule(coreIds, 24, 20260711), before);
});

test('each suite owns comparisons whose variants exist in that suite', () => {
  for (const suite of Object.values(SUITES)) {
    const variantIds = new Set(suite.variants.map(({ id }) => id));
    for (const comparison of suite.comparisons) {
      assert.ok(variantIds.has(comparison.reference), `${suite.id}:${comparison.id}:reference`);
      assert.ok(variantIds.has(comparison.candidate), `${suite.id}:${comparison.id}:candidate`);
    }
  }
});
