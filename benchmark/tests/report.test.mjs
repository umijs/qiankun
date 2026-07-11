import assert from 'node:assert/strict';
import test from 'node:test';

import { buildReport, renderSummaryMarkdown } from '../src/report.mjs';

const variants = [
  { id: 'a', label: 'Variant A' },
  { id: 'b', label: 'Variant B' },
];

const samples = [
  { duration: 10, position: 0, round: 0, sequence: 0, valid: true, variant: 'a' },
  { duration: 20, position: 1, round: 0, sequence: 1, valid: true, variant: 'b' },
  { duration: 30, position: 1, round: 1, sequence: 2, valid: true, variant: 'a' },
  { duration: 60, position: 0, round: 1, sequence: 3, valid: true, variant: 'b' },
  { error: 'timeout', position: 0, round: 2, sequence: 4, valid: false, variant: 'a' },
];

test('buildReport summarizes valid samples while retaining invalid counts', () => {
  const report = buildReport({
    comparisons: [{ candidate: 'b', id: 'b-vs-a', label: 'B vs A', reference: 'a' }],
    samples,
    seed: 5,
    variants,
  });

  assert.equal(report.variants.a.summary.count, 2);
  assert.equal(report.variants.a.invalidCount, 1);
  assert.equal(report.variants.b.summary.count, 2);
  assert.ok(Math.abs(report.comparisons['b-vs-a'].relativeDeltaPercent - 100) < 1e-10);
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
