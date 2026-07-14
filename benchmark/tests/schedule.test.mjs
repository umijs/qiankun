import assert from 'node:assert/strict';
import test from 'node:test';

import { createBalancedSchedule } from '../src/schedule.mjs';

const VARIANTS = ['a', 'b', 'c', 'd', 'e', 'f'];

test('createBalancedSchedule is deterministic for the same seed', () => {
  const first = createBalancedSchedule(VARIANTS, 12, 20260711);
  const second = createBalancedSchedule(VARIANTS, 12, 20260711);

  assert.deepEqual(first, second);
});

test('createBalancedSchedule runs every variant once per round', () => {
  const schedule = createBalancedSchedule(VARIANTS, 12, 20260711);

  for (let round = 0; round < 12; round += 1) {
    const entries = schedule.filter((entry) => entry.round === round);
    assert.equal(entries.length, VARIANTS.length);
    assert.deepEqual(
      entries.map((entry) => entry.position),
      [0, 1, 2, 3, 4, 5],
    );
    assert.deepEqual([...entries.map((entry) => entry.variant)].sort(), [...VARIANTS].sort());
  }
});

test('createBalancedSchedule balances each variant across positions', () => {
  const schedule = createBalancedSchedule(VARIANTS, 12, 20260711);

  for (const variant of VARIANTS) {
    const counts = Array.from({ length: VARIANTS.length }, () => 0);
    for (const entry of schedule.filter((candidate) => candidate.variant === variant)) {
      counts[entry.position] += 1;
    }
    assert.deepEqual(counts, [2, 2, 2, 2, 2, 2]);
  }
});

test('createBalancedSchedule rejects ambiguous or empty inputs', () => {
  assert.throws(() => createBalancedSchedule([], 1, 1), /at least one variant/);
  assert.throws(() => createBalancedSchedule(['a', 'a'], 1, 1), /variant ids must be unique/);
  assert.throws(() => createBalancedSchedule(['a'], 0, 1), /rounds must be a positive integer/);
});
