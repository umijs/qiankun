import assert from 'node:assert/strict';
import test from 'node:test';

import { renderClassicExperimentReport, summarizeClassicExperiment } from '../src/classic-preexecution-report.mjs';

function makeSamples({ rounds = 3, trials = 2, warmup = false } = {}) {
  return Array.from({ length: trials }, (_, trial) =>
    Array.from({ length: rounds }, (_, round) =>
      ['cold', 'fetch', 'factory'].map((variant, index) => ({
        activationMountMs: 100 - index * 10,
        activationPaintMs: 120 - index * 10,
        hostPaintMs: 20 + index,
        interactionDelayMs: 10 + index,
        peakHeapBytes: 1024 * 1024 * (index + 1),
        prepareMs: index * 10,
        round,
        scenario: 'ready',
        size: 100 * 1024,
        trial,
        variant,
        warmup,
      })),
    ).flat(),
  ).flat();
}

function findComparison(summary, metric = 'activationMountMs', candidate = 'factory', reference = 'fetch') {
  return summary.comparisons.find(
    (row) => row.metric === metric && row.candidate === candidate && row.reference === reference,
  );
}

test('classic experiment preserves paired rounds and returns exact constant delta intervals', () => {
  const samples = makeSamples();
  const summary = summarizeClassicExperiment(samples);
  const comparison = findComparison(summary);

  assert.equal(summary.cells.length, 3);
  assert.equal(summary.comparisons.length, 12);
  assert.equal(summary.measuredSampleCount, 18);
  assert.equal(comparison.absoluteDeltaMs, -10);
  assert.deepEqual(comparison.absoluteDeltaConfidenceInterval95Ms, [-10, -10]);
  assert.ok(Math.abs(comparison.relativeDeltaPercent + (10 / 90) * 100) < 1e-10);
  assert.equal(comparison.pairedCount, 6);
  assert.equal(comparison.trialCount, 2);
  assert.equal(comparison.primary, true);
  assert.equal(findComparison(summary, 'activationMountMs', 'fetch', 'cold').primary, false);
  assert.equal(summary.cells[0].metrics.activationMountMs.median, 100);
  assert.equal(summary.cells[0].metrics.activationMountMs.p95, 100);

  const shuffled = [...samples].reverse();
  assert.deepEqual(summarizeClassicExperiment(shuffled), summary);
});

test('classic experiment pairs by trial and round instead of source array position', () => {
  const samples = makeSamples();
  for (const sample of samples) {
    sample.activationMountMs += sample.trial * 100 + sample.round * 25;
  }
  const reversedFactory = [
    ...samples.filter(({ variant }) => variant !== 'factory'),
    ...samples.filter(({ variant }) => variant === 'factory').reverse(),
  ];
  const comparison = findComparison(summarizeClassicExperiment(reversedFactory));
  assert.equal(comparison.absoluteDeltaMs, -10);
  assert.deepEqual(comparison.absoluteDeltaConfidenceInterval95Ms, [-10, -10]);
});

test('classic experiment separates scenario and size cells and excludes validated warmups', () => {
  const measured = makeSamples({ rounds: 1, trials: 1 });
  const otherScenario = measured.map((sample) => ({
    ...sample,
    scenario: 'pending',
    activationMountMs: sample.activationMountMs * 2,
  }));
  const otherSize = measured.map((sample) => ({ ...sample, size: 1024 * 1024 }));
  const warmups = makeSamples({ rounds: 1, trials: 1, warmup: true }).map((sample) => ({
    ...sample,
    activationMountMs: 9999,
  }));
  const samples = [...measured, ...otherScenario, ...otherSize, ...warmups];
  const summary = summarizeClassicExperiment(samples);

  assert.equal(samples.length, 12);
  assert.equal(summary.measuredSampleCount, 9);
  assert.equal(summary.warmupSampleCount, 3);
  assert.equal(summary.cells.length, 9);
  assert.equal(summary.cells[0].metrics.activationMountMs.median, 100);
  assert.equal(summary.cells[3].size, 1024 * 1024);
  assert.equal(summary.cells[6].scenario, 'pending');
  assert.equal(summary.cells[6].metrics.activationMountMs.median, 200);
});

test('classic experiment rejects incomplete, duplicate, and failed samples without dropping them', () => {
  const samples = makeSamples({ rounds: 1, trials: 1 });
  assert.throws(() => summarizeClassicExperiment(samples.slice(1)), /incomplete pair.*missing cold/u);
  assert.throws(() => summarizeClassicExperiment([...samples, samples[0]]), /duplicate cold sample/u);
  assert.throws(
    () => summarizeClassicExperiment([...samples, { ...samples[0], error: 'navigation failed' }]),
    /records a failure/u,
  );
  const warmups = makeSamples({ rounds: 1, trials: 1, warmup: true });
  assert.throws(() => summarizeClassicExperiment([...samples, ...warmups.slice(1)]), /incomplete pair/u);
  assert.throws(() => summarizeClassicExperiment(warmups), /non-warmup sample/u);
  assert.throws(() => summarizeClassicExperiment([]), /at least one sample/u);
});

test('classic experiment validates all timing metrics and explicit heap absence, including warmups', () => {
  const samples = makeSamples({ rounds: 1, trials: 1 });
  for (const metric of [
    'activationMountMs',
    'activationPaintMs',
    'prepareMs',
    'hostPaintMs',
    'interactionDelayMs',
    'peakHeapBytes',
  ]) {
    for (const invalid of [NaN, Infinity, -1, undefined]) {
      assert.throws(
        () => summarizeClassicExperiment([{ ...samples[0], [metric]: invalid }, ...samples.slice(1)]),
        new RegExp(metric, 'u'),
      );
    }
  }
  const invalidWarmups = makeSamples({ rounds: 1, trials: 1, warmup: true });
  invalidWarmups[0].activationPaintMs = NaN;
  assert.throws(() => summarizeClassicExperiment([...samples, ...invalidWarmups]), /activationPaintMs/u);
  assert.throws(
    () => summarizeClassicExperiment([{ ...samples[0], activationMountMs: 0 }, ...samples.slice(1)]),
    /positive finite/u,
  );
});

test('classic experiment retains zero task delay absolute intervals and reports relative intervals as unavailable', () => {
  const samples = makeSamples();
  for (const sample of samples) sample.interactionDelayMs = sample.variant === 'factory' ? 2 : 0;
  const comparison = findComparison(summarizeClassicExperiment(samples), 'interactionDelayMs');

  assert.equal(comparison.absoluteDeltaMs, 2);
  assert.deepEqual(comparison.absoluteDeltaConfidenceInterval95Ms, [2, 2]);
  assert.equal(comparison.relativeDeltaPercent, null);
  assert.equal(comparison.confidenceInterval95, null);
  assert.equal(comparison.trialRelativeDeltas, null);
});

test('classic experiment reports missing heap coverage without treating it as zero', () => {
  const samples = makeSamples({ trials: 1, rounds: 2 });
  for (const sample of samples) {
    if (sample.variant === 'cold' || sample.round === 0) sample.peakHeapBytes = null;
  }
  const summary = summarizeClassicExperiment(samples);

  assert.equal(summary.cells[0].metrics.peakHeapBytes, null);
  assert.equal(summary.cells[0].heapMissingCount, 2);
  assert.equal(summary.cells[1].metrics.peakHeapBytes.count, 1);
  assert.equal(summary.cells[1].metrics.peakHeapBytes.median, 2 * 1024 * 1024);
  assert.equal(summary.cells[1].heapMissingCount, 1);
});

test('classic experiment report labels paired delta direction, uncertainty, and measurement limits', () => {
  const samples = makeSamples({ rounds: 1, trials: 1 });
  const summary = summarizeClassicExperiment(samples);
  const markdown = renderClassicExperimentReport({
    environment: { browser: 'test-chromium' },
    fixtures: [{ size: 100 * 1024, sha256: 'fixture-hash' }],
    options: { samples: 1, trials: 1 },
    samples,
    summary,
  });

  assert.match(markdown, /test-chromium/u);
  assert.match(markdown, /fixture-hash/u);
  assert.match(markdown, /正值表示候选组更慢/u);
  assert.match(markdown, /不是 INP/u);
  assert.match(markdown, /不是真实浏览器进程峰值/u);
  assert.match(markdown, /主比较/u);
  assert.match(markdown, /-10\.00 \[-10\.00, -10\.00\] ms/u);
  assert.match(markdown, /正式样本 3 个，预热样本 0 个/u);
  assert.throws(
    () => renderClassicExperimentReport({ environment: {}, options: {}, fixtures: [], samples: [], summary }),
    /counts do not match/u,
  );
});

test('classic experiment diagnostic coverage preserves missing values and activation state counts', () => {
  const samples = makeSamples({ trials: 1, rounds: 3 });
  for (const sample of samples) {
    if (sample.round === 2) continue;
    Object.assign(sample, {
      actualLeadMs: 250 + sample.round * 10,
      requests: sample.round + 1,
      bytes: 1024 * (sample.round + 1),
      serverRequests: sample.round + 1,
      factoryHit: sample.round === 1,
      prepareStateAtActivation: sample.round === 1 ? 'registering' : 'fetching',
    });
  }
  const warmups = makeSamples({ trials: 1, rounds: 1, warmup: true }).map((sample) => ({
    ...sample,
    actualLeadMs: 9999,
    factoryHit: true,
    prepareStateAtActivation: 'ready',
  }));
  const summary = summarizeClassicExperiment([...samples, ...warmups]);
  const first = summary.cells[0];

  assert.equal(first.diagnostics.actualLeadMs.count, 2);
  assert.equal(first.diagnostics.actualLeadMs.median, 255);
  assert.equal(first.diagnostics.requests.median, 1.5);
  assert.equal(first.diagnostics.bytes.median, 1536);
  assert.equal(first.diagnostics.serverRequests.median, 1.5);
  assert.deepEqual(first.factoryHits, { count: 2, hit: 1, miss: 1 });
  assert.deepEqual(first.prepareStates, { fetching: 1, registering: 1 });

  const absent = summarizeClassicExperiment(makeSamples({ trials: 1, rounds: 1 })).cells[0];
  assert.deepEqual(absent.diagnostics, {
    actualLeadMs: null,
    requests: null,
    bytes: null,
    serverRequests: null,
    inputDelayMs: null,
    inputPaintMs: null,
    inputAtMs: null,
  });
  assert.deepEqual(absent.factoryHits, { count: 0, hit: 0, miss: 0 });
  assert.deepEqual(absent.prepareStates, {});
});

test('classic experiment rejects invalid diagnostics instead of silently discarding them', () => {
  const samples = makeSamples({ trials: 1, rounds: 1 });
  for (const metric of [
    'actualLeadMs',
    'requests',
    'bytes',
    'serverRequests',
    'inputDelayMs',
    'inputPaintMs',
    'inputAtMs',
  ]) {
    for (const value of [NaN, Infinity, -1]) {
      assert.throws(
        () => summarizeClassicExperiment([{ ...samples[0], [metric]: value }, ...samples.slice(1)]),
        new RegExp(metric, 'u'),
      );
    }
  }
  assert.throws(
    () => summarizeClassicExperiment([{ ...samples[0], factoryHit: 1 }, ...samples.slice(1)]),
    /factoryHit/u,
  );
  assert.throws(
    () => summarizeClassicExperiment([{ ...samples[0], trustedInput: 1 }, ...samples.slice(1)]),
    /trustedInput/u,
  );
  assert.throws(
    () => summarizeClassicExperiment([{ ...samples[0], prepareStateAtActivation: '' }, ...samples.slice(1)]),
    /prepareStateAtActivation/u,
  );
});

test('classic experiment report exposes lead time, pending hits, failed A/A, and invalid performance evidence', () => {
  const samples = makeSamples({ trials: 1, rounds: 1 }).map((sample) => ({
    ...sample,
    scenario: 'pending',
    actualLeadMs: 10,
    requests: 2,
    bytes: 1024,
    serverRequests: 2,
    factoryHit: sample.variant === 'factory',
    prepareStateAtActivation: sample.variant === 'cold' ? 'disabled' : 'registering',
  }));
  const summary = summarizeClassicExperiment(samples);
  summary.calibration = {
    activationMountMs: {
      ...findComparison(summary, 'activationMountMs', 'fetch', 'cold'),
      passed: false,
      failures: ['calibration interval excludes zero'],
    },
    activationPaintMs: { ...findComparison(summary, 'activationPaintMs', 'fetch', 'cold'), passed: true, failures: [] },
  };
  summary.performanceEvidenceValid = false;
  const markdown = renderClassicExperimentReport({
    environment: {},
    options: { readyLeadMs: 250, pendingLeadMs: 10 },
    fixtures: [],
    samples,
    summary,
  });

  assert.match(markdown, /共同的最低激活等待时间/u);
  assert.match(markdown, /为 250 ms/u);
  assert.match(markdown, /为 10 ms/u);
  assert.match(markdown, /registering: 1/u);
  assert.match(markdown, /1 \/ 1/u);
  assert.match(markdown, /### A\/A 校准/u);
  assert.match(markdown, /失败：calibration interval excludes zero/u);
  assert.match(markdown, /通过/u);
  assert.match(markdown, /不可据此判断性能/u);
  assert.match(markdown, /-10\.00 \[-10\.00, -10\.00\] ms/u);
  assert.match(markdown, /缺失字段不计作未命中/u);
});

test('classic experiment pairs complete input metrics and keeps zero input delay absolute intervals', () => {
  const measured = makeSamples({ trials: 2, rounds: 2 }).map((sample) => ({
    ...sample,
    trustedInput: true,
    inputDelayMs: sample.variant === 'factory' ? 2 : 0,
    inputPaintMs: sample.variant === 'factory' ? 42 : 40,
    inputAtMs: 50 + sample.round,
  }));
  const warmups = makeSamples({ trials: 1, rounds: 1, warmup: true });
  const summary = summarizeClassicExperiment([...measured, ...warmups]);
  const delay = findComparison(summary, 'inputDelayMs');
  const paint = findComparison(summary, 'inputPaintMs');

  assert.equal(summary.comparisons.length, 18);
  assert.equal(delay.absoluteDeltaMs, 2);
  assert.deepEqual(delay.absoluteDeltaConfidenceInterval95Ms, [2, 2]);
  assert.equal(delay.relativeDeltaPercent, null);
  assert.equal(paint.absoluteDeltaMs, 2);
  assert.deepEqual(paint.absoluteDeltaConfidenceInterval95Ms, [2, 2]);
  assert.ok(Math.abs(paint.relativeDeltaPercent - 5) < 1e-10);
  assert.equal(summary.cells[0].diagnostics.inputAtMs.median, 50.5);
  assert.deepEqual(summary.cells[0].trustedInputs, { count: 4, trusted: 4, untrusted: 0 });
});

test('classic experiment with missing input data keeps available distributions without dropping incomplete pairs', () => {
  const samples = makeSamples({ trials: 1, rounds: 2 }).map((sample) => ({
    ...sample,
    trustedInput: sample.variant !== 'cold',
    inputDelayMs: sample.variant === 'factory' && sample.round === 0 ? null : 4,
    inputPaintMs: 40,
    inputAtMs: 50,
  }));
  const summary = summarizeClassicExperiment(samples);
  assert.equal(summary.comparisons.length, 15);
  assert.equal(findComparison(summary, 'inputDelayMs'), undefined);
  assert.equal(findComparison(summary, 'inputPaintMs').pairedCount, 2);
  assert.equal(summary.cells[2].diagnostics.inputDelayMs.count, 1);
  assert.deepEqual(summary.cells[0].trustedInputs, { count: 2, trusted: 0, untrusted: 2 });
  const markdown = renderClassicExperimentReport({ environment: {}, options: {}, fixtures: [], samples, summary });
  assert.match(markdown, /受信输入诊断/u);
  assert.match(markdown, /不是 Web Vitals INP/u);
  assert.match(markdown, /正式样本未全部提供该指标，不作配对比较/u);
  assert.match(markdown, /两帧更新耗时/u);
});
