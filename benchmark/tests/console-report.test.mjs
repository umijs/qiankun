import assert from 'node:assert/strict';
import test from 'node:test';

import {
  comparisonVerdict,
  createColorizer,
  formatDuration,
  renderBenchReport,
  renderTable,
  visibleWidth,
} from '../src/console-report.mjs';

function createRun(overrides = {}) {
  return {
    calibration: {
      evaluation: { failures: [], passed: true },
      report: {
        comparisons: {
          'aa-calibration': {
            confidenceInterval95: [-1.2, 0.9],
            label: 'A/A identical qiankun variants',
            relativeDeltaPercent: 0.42,
          },
        },
      },
    },
    fatalError: undefined,
    metadata: {
      browserVersion: '141.0.7361.0',
      commit: 'abcdef0123456789',
      dirty: false,
      options: { calibrationGate: true, samples: 50, trials: 1 },
    },
    passed: true,
    product: {
      report: {
        comparisons: {
          'sandbox-cost': {
            confidenceInterval95: [1.1, 5.4],
            label: 'sandbox vs no isolation',
            relativeDeltaPercent: 3.21,
          },
        },
        variants: {
          'qk-sandbox': {
            invalidCount: 0,
            label: 'qiankun · sandbox',
            summary: { count: 50, mad: 2.1, mean: 83.5, median: 82.11, p95: 91.02 },
          },
        },
      },
    },
    ...overrides,
  };
}

test('visibleWidth ignores ANSI color sequences', () => {
  const colors = createColorizer(true);
  assert.equal(visibleWidth(colors.red('abc')), 3);
  assert.equal(visibleWidth('abc'), 3);
});

test('createColorizer is a no-op when disabled', () => {
  const colors = createColorizer(false);
  assert.equal(colors.green('fast'), 'fast');
});

test('renderTable aligns columns and pads colored cells correctly', () => {
  const colors = createColorizer(true);
  const table = renderTable({
    columns: [
      { align: 'left', title: 'Name' },
      { align: 'right', title: 'Value' },
    ],
    rows: [
      ['first', colors.green('+1.00%')],
      ['a much longer label', '-12.00%'],
    ],
  });
  const lines = table.split('\n');
  assert.equal(lines.length, 6);
  const widths = new Set(lines.map((line) => visibleWidth(line)));
  assert.equal(widths.size, 1, 'every rendered line must have the same visible width');
  assert.ok(lines[0].startsWith('┌') && lines[0].endsWith('┐'));
  assert.ok(lines[5].startsWith('└') && lines[5].endsWith('┘'));
  assert.match(lines[3], /\+1\.00%/u);
});

test('comparisonVerdict maps confidence intervals to verdicts', () => {
  assert.equal(comparisonVerdict({ confidenceInterval95: [-5, -1] }), 'faster');
  assert.equal(comparisonVerdict({ confidenceInterval95: [1, 5] }), 'slower');
  assert.equal(comparisonVerdict({ confidenceInterval95: [-1, 1] }), 'unsure');
});

test('formatDuration renders seconds, minutes, and hours', () => {
  assert.equal(formatDuration(41_000), '41s');
  assert.equal(formatDuration(83_000), '1m 23s');
  assert.equal(formatDuration(3_723_000), '1h 2m 3s');
});

test('renderBenchReport includes header, variant medians, verdicts, and calibration state', () => {
  const report = renderBenchReport({
    durationMs: 90_000,
    profile: 'standard',
    results: [
      {
        artifactsDir: '/tmp/results/run-1',
        exitCode: 0,
        loadError: null,
        run: createRun(),
        suite: 'core',
        title: 'Core HTML-entry matrix',
      },
    ],
  });
  assert.match(report, /qiankun unified benchmark/u);
  assert.match(report, /commit abcdef01 · Chromium 141\.0\.7361\.0 · profile standard/u);
  assert.match(report, /Core HTML-entry matrix/u);
  assert.match(report, /qiankun · sandbox/u);
  assert.match(report, /82\.11/u);
  assert.match(report, /sandbox vs no isolation/u);
  assert.match(report, /\+3\.21%/u);
  assert.match(report, /slower/u);
  assert.match(report, /A\/A calibration: \+0\.42%/u);
  assert.match(report, /gate enforced/u);
  assert.match(report, /1\/1 suites passed · total 1m 30s/u);
});

test('renderBenchReport reports failed suites and missing results', () => {
  const failedRun = createRun({ fatalError: 'trial 1 A/A calibration failed: interval too wide', passed: false });
  const report = renderBenchReport({
    durationMs: 1000,
    profile: 'standard',
    results: [
      {
        artifactsDir: '/tmp/results/run-1',
        exitCode: 1,
        loadError: null,
        run: failedRun,
        suite: 'core',
        title: 'Core HTML-entry matrix',
      },
      {
        artifactsDir: null,
        exitCode: 1,
        loadError: null,
        run: null,
        suite: 'ssr-streaming',
        title: 'SSR streaming matrix',
      },
    ],
  });
  assert.match(report, /FAILED/u);
  assert.match(report, /fatal: trial 1 A\/A calibration failed/u);
  assert.match(report, /runner exited with code 1 before writing results/u);
  assert.match(report, /0\/2 suites passed/u);
});
