import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { BROWSER_CONTEXT_OPTIONS, runBrowserSample } from './src/browser.mjs';
import { collectSamples } from './src/collect.mjs';
import { createRevisionHarnessRecord } from './src/harness.mjs';
import { hashDirectory } from './src/hash.mjs';
import { CHROMIUM_LAUNCH_ARGS, createBenchmarkOrigins } from './src/origins.mjs';
import { evaluateRegressionBudget } from './src/regression.mjs';
import {
  RFC_INTERVAL_WIDTH_GUARD_PERCENT_POINTS,
  RFC_PERFORMANCE_METRICS,
  RFC_REGRESSION_BUDGET_PERCENT,
  parseRfcPerformanceOptions,
} from './src/rfc-performance.mjs';
import { buildReport } from './src/report.mjs';
import { createFixtureServer } from './src/server.mjs';
import { assertBaselineHarnessCompatible, readBaselineSnapshot } from './src/snapshot.mjs';
import { createStaticServer } from './src/static-server.mjs';
import { createRevisionVariants } from './scenarios.mjs';

const execFileAsync = promisify(execFile);
const benchmarkRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(benchmarkRoot);
const roles = ['baseline', 'candidate'];

function formatSignedPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

async function getGitState() {
  const [commitResult, statusResult] = await Promise.all([
    execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
    execFileAsync('git', ['status', '--porcelain'], { cwd: repositoryRoot }),
  ]);
  return { commit: commitResult.stdout.trim(), dirty: statusResult.stdout.trim().length > 0 };
}

function createMetricVariants(metric) {
  return roles.map((role) => ({
    id: `${metric.id}-${role}`,
    label: `${role} · ${metric.label}`,
    role,
  }));
}

function ensureAllValid(samples, phase) {
  const invalid = samples.filter((sample) => !sample.valid);
  if (invalid.length > 0) {
    throw new Error(`${phase} produced ${invalid.length} invalid sample(s): ${invalid[0].error}`);
  }
}

async function openMicrobenchmarkPage(context, hostOrigin, timeoutMs) {
  const page = await context.newPage();
  await page.goto(`${hostOrigin}/rfc-performance.html`, { timeout: timeoutMs, waitUntil: 'load' });
  await page.waitForFunction(() => Boolean(window.__RFC_PERFORMANCE__), null, { timeout: timeoutMs });
  return page;
}

async function runMicrobenchmarkSample(page, metric) {
  const measurement = await page.evaluate(
    ({ browserMetric, iterations }) => {
      if (!window.__RFC_PERFORMANCE__) throw new Error('RFC performance host API is unavailable');
      return window.__RFC_PERFORMANCE__.run(browserMetric, iterations);
    },
    { browserMetric: metric.browserMetric, iterations: metric.iterations },
  );
  if (!(measurement.duration > 0) || measurement.iterations !== metric.iterations) {
    throw new Error(`${metric.id} returned an invalid browser measurement`);
  }
  return {
    ...measurement,
    batchDuration: measurement.duration,
    duration: measurement.duration / measurement.iterations,
  };
}

async function collectMetricPhase({
  browser,
  fixtureOrigins,
  hostOrigins,
  loadVariants,
  metric,
  pages,
  phase,
  rounds,
  seed,
  timeoutMs,
}) {
  const variants = createMetricVariants(metric);
  let completed = 0;
  const total = rounds * variants.length;
  const samples = await collectSamples({
    rounds,
    seed,
    variants,
    sample: async (variant) => {
      completed += 1;
      let measurement;
      if (metric.kind === 'micro') {
        measurement = await runMicrobenchmarkSample(pages[variant.role], metric);
      } else {
        const loadMeasurement = await runBrowserSample({
          browser,
          fixtureOrigins,
          hostOrigin: hostOrigins[variant.role],
          timeoutMs,
          variant: loadVariants[variant.role],
        });
        measurement = {
          ...loadMeasurement,
          batchDuration: loadMeasurement.duration,
          bytesPerOperation: null,
          iterations: 1,
        };
      }
      console.log(
        `[benchmark:rfc] ${phase} ${completed}/${total} ${variant.id} ${measurement.batchDuration.toFixed(2)}ms`,
      );
      return { ...measurement, phase, timestamp: new Date().toISOString(), trial: 0 };
    },
  });
  ensureAllValid(samples, `${phase} ${metric.id}`);
  return samples;
}

function createReportDefinition() {
  return {
    comparisons: RFC_PERFORMANCE_METRICS.map((metric) => ({
      candidate: `${metric.id}-candidate`,
      id: metric.id,
      label: `${metric.label}: candidate vs baseline`,
      reference: `${metric.id}-baseline`,
    })),
    variants: RFC_PERFORMANCE_METRICS.flatMap(createMetricVariants),
  };
}

function getObservedBytes(samples, metricId) {
  return samples.find((sample) => sample.valid && sample.variant.startsWith(`${metricId}-`))?.bytesPerOperation ?? null;
}

function formatMetricValue(metric, medianMs, bytesPerOperation) {
  if (metric.displayUnit === 'Mops/s') return `${(0.001 / medianMs).toFixed(2)} Mops/s`;
  if (metric.displayUnit === 'MiB/s') {
    if (!(bytesPerOperation > 0)) return 'n/a';
    return `${(bytesPerOperation / (medianMs / 1_000) / 1024 ** 2).toFixed(2)} MiB/s`;
  }
  return `${medianMs.toFixed(2)} ms`;
}

function renderSummary({ baselineMetadata, candidate, evaluations, metadata, report, samples }) {
  const lines = [
    '# RFC hard metric 2 performance acceptance',
    '',
    `- Result: **${metadata.passed ? 'passed' : 'failed'}**`,
    `- Baseline commit: ${baselineMetadata.git.commit}`,
    `- Candidate commit: ${candidate.commit}${candidate.dirty ? ' (dirty)' : ''}`,
    `- Regression budget: paired median latency regression must be at most +${RFC_REGRESSION_BUDGET_PERCENT.toFixed(2)}%`,
    `- Resolution guard: bootstrap 95% CI width must stay below ${RFC_INTERVAL_WIDTH_GUARD_PERCENT_POINTS.toFixed(2)}pp for the run to be conclusive`,
    `- Samples: ${metadata.options.samples} paired rounds after ${metadata.options.warmup} warmup rounds`,
    '',
    'Positive latency deltas mean the candidate is slower. Throughput columns display the inverse of the measured time per operation; the gate is evaluated on paired time ratios.',
    '',
    '| Metric | Baseline median | Candidate median | Latency delta | 95% CI | Gate |',
    '| --- | ---: | ---: | ---: | ---: | --- |',
  ];

  for (const metric of RFC_PERFORMANCE_METRICS) {
    const comparison = report.comparisons[metric.id];
    const baselineMedian = report.variants[`${metric.id}-baseline`].summary.median;
    const candidateMedian = report.variants[`${metric.id}-candidate`].summary.median;
    const bytesPerOperation = getObservedBytes(samples, metric.id);
    const [lower, upper] = comparison.confidenceInterval95;
    lines.push(
      `| ${metric.label} | ${formatMetricValue(metric, baselineMedian, bytesPerOperation)} | ${formatMetricValue(metric, candidateMedian, bytesPerOperation)} | ${formatSignedPercent(comparison.relativeDeltaPercent)} | ${formatSignedPercent(lower)} to ${formatSignedPercent(upper)} | ${evaluations[metric.id].passed ? 'pass' : 'fail'} |`,
    );
  }

  const failures = Object.entries(evaluations).flatMap(([metric, evaluation]) =>
    evaluation.failures.map((failure) => `${metric}: ${failure}`),
  );
  if (failures.length > 0) {
    lines.push('', '## Failures', '', ...failures.map((failure) => `- ${failure}`));
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const options = parseRfcPerformanceOptions(process.argv.slice(2));
  const baselineDirectory = isAbsolute(options.baselineDir)
    ? options.baselineDir
    : resolve(benchmarkRoot, options.baselineDir);
  const candidateHostDirectory = join(benchmarkRoot, 'fixtures/host/dist');
  const candidate = await getGitState();
  const currentHarness = await createRevisionHarnessRecord(benchmarkRoot);
  const baselineMetadata = await readBaselineSnapshot(baselineDirectory);
  assertBaselineHarnessCompatible(baselineMetadata, currentHarness);

  const fixture = createFixtureServer({ port: 0 });
  const hostServers = {
    baseline: createStaticServer({ port: 0, root: join(baselineDirectory, 'host') }),
    candidate: createStaticServer({ port: 0, root: candidateHostDirectory }),
  };
  await Promise.all([fixture.start(), ...Object.values(hostServers).map((server) => server.start())]);
  const hostOrigins = Object.fromEntries(roles.map((role) => [role, hostServers[role].origin]));
  const { fixtureOrigins } = createBenchmarkOrigins({ fixtureOrigin: fixture.origin, hostOrigins });
  const loadVariants = Object.fromEntries(
    createRevisionVariants('sandbox').map((variant) => [variant.hostRole, variant]),
  );

  const browser = await chromium.launch({ args: CHROMIUM_LAUNCH_ARGS, headless: true });
  let browserVersion;
  const warmupSamples = [];
  const productSamples = [];
  try {
    browserVersion = browser.version();
    const microContext = await browser.newContext(BROWSER_CONTEXT_OPTIONS);
    try {
      const pages = {};
      for (const role of roles) {
        pages[role] = await openMicrobenchmarkPage(microContext, hostOrigins[role], options.timeoutMs);
      }

      for (const [metricIndex, metric] of RFC_PERFORMANCE_METRICS.entries()) {
        warmupSamples.push(
          ...(await collectMetricPhase({
            browser,
            fixtureOrigins,
            hostOrigins,
            loadVariants,
            metric,
            pages,
            phase: 'warmup',
            rounds: options.warmup,
            seed: options.seed + metricIndex * 2,
            timeoutMs: options.timeoutMs,
          })),
        );
        productSamples.push(
          ...(await collectMetricPhase({
            browser,
            fixtureOrigins,
            hostOrigins,
            loadVariants,
            metric,
            pages,
            phase: 'product',
            rounds: options.samples,
            seed: options.seed + metricIndex * 2 + 1,
            timeoutMs: options.timeoutMs,
          })),
        );
      }
    } finally {
      await microContext.close();
    }
  } finally {
    await browser.close();
    await Promise.all([fixture.close(), ...Object.values(hostServers).map((server) => server.close())]);
  }

  const definition = createReportDefinition();
  const report = buildReport({
    comparisons: definition.comparisons,
    samples: productSamples,
    seed: options.seed,
    variants: definition.variants,
  });
  const evaluations = Object.fromEntries(
    RFC_PERFORMANCE_METRICS.map((metric) => [
      metric.id,
      evaluateRegressionBudget(report.comparisons[metric.id], {
        maxIntervalWidthPercentPoints: RFC_INTERVAL_WIDTH_GUARD_PERCENT_POINTS,
        maxRegressionPercent: RFC_REGRESSION_BUDGET_PERCENT,
      }),
    ]),
  );
  const passed = Object.values(evaluations).every((evaluation) => evaluation.passed);
  const startedAt = new Date();
  const runId = `${startedAt.toISOString().replace(/[:.]/gu, '-')}-${candidate.commit.slice(0, 8)}-rfc-hard-metric-2`;
  const resultDirectory = join(benchmarkRoot, 'results', runId);
  const metadata = {
    arch: os.arch(),
    baseline: baselineMetadata,
    benchmark: 'rfc-hard-metric-2',
    browserVersion,
    candidate,
    candidateBundleHash: await hashDirectory(candidateHostDirectory),
    cpu: os.cpus()[0]?.model ?? 'unknown',
    cpuCount: os.cpus().length,
    harness: currentHarness,
    nodeVersion: process.version,
    options: {
      ...options,
      maxIntervalWidthPercentPoints: RFC_INTERVAL_WIDTH_GUARD_PERCENT_POINTS,
      maxRegressionPercent: RFC_REGRESSION_BUDGET_PERCENT,
    },
    passed,
    platform: os.platform(),
    platformRelease: os.release(),
    schemaVersion: 1,
    startedAt: startedAt.toISOString(),
  };
  const result = {
    evaluation: { metrics: evaluations, passed },
    metadata,
    report,
    samples: { product: productSamples, warmup: warmupSamples },
  };
  const summary = renderSummary({
    baselineMetadata,
    candidate,
    evaluations,
    metadata,
    report,
    samples: productSamples,
  });
  await mkdir(resultDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(resultDirectory, 'result.json'), `${JSON.stringify(result, null, 2)}\n`),
    writeFile(join(resultDirectory, 'summary.md'), summary),
  ]);
  console.log(`\n[benchmark:rfc] result: ${passed ? 'passed' : 'failed'}`);
  console.log(`[benchmark:rfc] artifacts: ${resultDirectory}`);
  if (!passed) process.exitCode = 1;
}

await main();
