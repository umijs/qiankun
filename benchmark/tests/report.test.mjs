import assert from 'node:assert/strict';
import test from 'node:test';

import { buildReport, renderSummaryMarkdown } from '../src/report.mjs';

const variants = [
  { id: 'a', label: 'Variant A' },
  { id: 'b', label: 'Variant B' },
];

const samples = [
  {
    duration: 10,
    entryResponseEndDuration: 40,
    position: 0,
    round: 0,
    sequence: 0,
    settledDuration: 50,
    trial: 0,
    valid: true,
    variant: 'a',
  },
  {
    duration: 20,
    entryResponseEndDuration: 40,
    position: 1,
    round: 0,
    sequence: 1,
    settledDuration: 55,
    trial: 0,
    valid: true,
    variant: 'b',
  },
  {
    duration: 30,
    entryResponseEndDuration: 50,
    position: 1,
    round: 1,
    sequence: 2,
    settledDuration: 60,
    trial: 0,
    valid: true,
    variant: 'a',
  },
  {
    duration: 60,
    entryResponseEndDuration: 70,
    position: 0,
    round: 1,
    sequence: 3,
    settledDuration: 80,
    trial: 0,
    valid: true,
    variant: 'b',
  },
  { error: 'timeout', position: 0, round: 2, sequence: 4, trial: 0, valid: false, variant: 'a' },
];

test('buildReport summarizes valid samples while retaining invalid counts', () => {
  const report = buildReport({
    comparisons: [{ candidate: 'b', id: 'b-vs-a', label: 'B vs A', reference: 'a' }],
    samples,
    seed: 5,
    variants,
  });

  assert.equal(report.variants.a.summary.count, 2);
  assert.equal(report.variants.a.diagnostics.settledDuration.median, 55);
  assert.equal(report.variants.a.diagnostics.entryResponseEndDuration.median, 45);
  assert.equal(report.variants.a.diagnostics.paintLeadBeforeResponseEnd.median, 25);
  assert.equal(report.variants.a.invalidCount, 1);
  assert.equal(report.variants.b.summary.count, 2);
  assert.ok(Math.abs(report.comparisons['b-vs-a'].relativeDeltaPercent - 100) < 1e-10);
  assert.equal(report.comparisons['b-vs-a'].trialCount, 1);
});

test('buildReport pairs repeated round numbers within their trial instead of overwriting them', () => {
  const report = buildReport({
    comparisons: [{ candidate: 'b', id: 'b-vs-a', label: 'B vs A', reference: 'a' }],
    samples: [
      { duration: 10, round: 0, trial: 0, valid: true, variant: 'a' },
      { duration: 20, round: 0, trial: 0, valid: true, variant: 'b' },
      { duration: 10, round: 0, trial: 1, valid: true, variant: 'a' },
      { duration: 10, round: 0, trial: 1, valid: true, variant: 'b' },
    ],
    seed: 5,
    variants,
  });

  assert.equal(report.comparisons['b-vs-a'].pairedCount, 2);
  assert.equal(report.comparisons['b-vs-a'].trialCount, 2);
  assert.deepEqual(report.comparisons['b-vs-a'].trialRelativeDeltas, [100, 0]);
});

test('buildReport rejects incomplete and duplicate pairs instead of dropping them silently', () => {
  const comparison = [{ candidate: 'b', id: 'b-vs-a', label: 'B vs A', reference: 'a' }];
  assert.throws(
    () =>
      buildReport({
        comparisons: comparison,
        samples: [
          { duration: 10, round: 0, trial: 0, valid: true, variant: 'a' },
          { duration: 20, round: 1, trial: 0, valid: true, variant: 'b' },
        ],
        seed: 5,
        variants,
      }),
    /b-vs-a trial 0 has unpaired rounds/u,
  );
  assert.throws(
    () =>
      buildReport({
        comparisons: comparison,
        samples: [
          { duration: 10, round: 0, trial: 0, valid: true, variant: 'a' },
          { duration: 11, round: 0, trial: 0, valid: true, variant: 'a' },
          { duration: 20, round: 0, trial: 0, valid: true, variant: 'b' },
        ],
        seed: 5,
        variants,
      }),
    /b-vs-a trial 0 has duplicate reference round 0/u,
  );
});

test('renderSummaryMarkdown exposes counts, medians, and comparison confidence intervals', () => {
  const report = buildReport({
    comparisons: [{ candidate: 'b', id: 'b-vs-a', label: 'B vs A', reference: 'a' }],
    samples,
    seed: 5,
    variants,
  });
  const markdown = renderSummaryMarkdown(report, { title: 'Smoke result' });

  assert.match(markdown, /# Smoke result/);
  assert.match(markdown, /Variant A \| 2 \| 1 \| 20\.00/);
  assert.match(markdown, /## Phase diagnostics/);
  assert.match(markdown, /Variant A \| 55\.00 \| 45\.00 \| 25\.00/);
  assert.match(markdown, /B vs A \| \+100\.00%/);
});

test('renderSummaryMarkdown can nest a report without flattening its sections', () => {
  const report = buildReport({
    comparisons: [{ candidate: 'b', id: 'b-vs-a', label: 'B vs A', reference: 'a' }],
    samples,
    seed: 5,
    variants,
  });
  const markdown = renderSummaryMarkdown(report, { headingLevel: 2, title: 'Nested result' });

  assert.match(markdown, /^## Nested result$/mu);
  assert.match(markdown, /^### Variants$/mu);
  assert.match(markdown, /^### Comparisons$/mu);
});
