import assert from 'node:assert/strict';
import test from 'node:test';

import { collectSamples } from '../src/collect.mjs';

test('collectSamples executes variants serially and preserves schedule metadata', async () => {
  const variants = [{ id: 'a' }, { id: 'b' }];
  let active = 0;
  let maximumActive = 0;

  const samples = await collectSamples({
    rounds: 3,
    seed: 11,
    sample: async (variant) => {
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await Promise.resolve();
      active -= 1;
      return { duration: variant.id === 'a' ? 10 : 20, t0: 1, t1: variant.id === 'a' ? 11 : 21 };
    },
    variants,
  });

  assert.equal(maximumActive, 1);
  assert.equal(samples.length, 6);
  for (let round = 0; round < 3; round += 1) {
    const entries = samples.filter((sample) => sample.round === round);
    assert.deepEqual([...entries.map((sample) => sample.variant)].sort(), ['a', 'b']);
    assert.deepEqual(entries.map((sample) => sample.position).sort(), [0, 1]);
    assert.ok(entries.every((sample) => sample.valid));
  }
});

test('collectSamples records failures and continues without silently replacing them', async () => {
  let failed = false;
  const samples = await collectSamples({
    rounds: 2,
    seed: 3,
    sample: async (variant) => {
      if (variant.id === 'b' && !failed) {
        failed = true;
        throw new Error('page crashed');
      }
      return { duration: 10, t0: 1, t1: 11 };
    },
    variants: [{ id: 'a' }, { id: 'b' }],
  });

  assert.equal(samples.length, 4);
  assert.equal(samples.filter((sample) => sample.valid).length, 3);
  assert.deepEqual(
    samples.find((sample) => !sample.valid),
    {
      error: 'page crashed',
      position: 1,
      round: 0,
      sequence: 1,
      valid: false,
      variant: 'b',
    },
  );
});
