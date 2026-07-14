import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { runBrowserSample } from './src/browser.mjs';
import { collectSamples } from './src/collect.mjs';
import { parseRunnerOptions } from './src/options.mjs';
import { buildReport, renderSummaryMarkdown } from './src/report.mjs';
import { evaluateRevisionComparison, resolveVariantHostOrigin } from './src/revisions.mjs';
import { createFixtureServer } from './src/server.mjs';
import { readBaselineSnapshot } from './src/snapshot.mjs';
import { createStaticServer } from './src/static-server.mjs';
import { evaluateCalibration } from './src/stats.mjs';
import {
  CALIBRATION_VARIANTS,
  PRODUCT_COMPARISONS,
  PRODUCT_VARIANTS,
  REVISION_CALIBRATION_VARIANTS,
  REVISION_COMPARISONS,
  REVISION_VARIANTS,
} from './scenarios.mjs';

const execFileAsync = promisify(execFile);
const benchmarkRoot = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(benchmarkRoot);

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function getGitState() {
  const [commitResult, statusResult] = await Promise.all([
    execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
    execFileAsync('git', ['status', '--porcelain'], { cwd: repositoryRoot }),
  ]);
  return { commit: commitResult.stdout.trim(), dirty: statusResult.stdout.trim().length > 0 };
}

function materializeCalibrationVariants(productVariants, aliases) {
  const productById = new Map(productVariants.map((variant) => [variant.id, variant]));
  return aliases.map((alias) => {
    const source = productById.get(alias.sourceVariant);
    if (!source) throw new Error(`unknown calibration source: ${alias.sourceVariant}`);
    return { ...source, id: alias.id, label: alias.label };
  });
}

function createRunDefinition(mode) {
  if (mode === 'revision') {
    return {
      calibrationAliases: REVISION_CALIBRATION_VARIANTS,
      comparisons: REVISION_COMPARISONS,
      productTitle: 'Revision comparison',
      variants: REVISION_VARIANTS,
    };
  }
  return {
    calibrationAliases: CALIBRATION_VARIANTS,
    comparisons: PRODUCT_COMPARISONS,
    productTitle: 'Product matrix',
    variants: PRODUCT_VARIANTS,
  };
}

function ensureAllValid(samples, phase) {
  const invalid = samples.filter((sample) => !sample.valid);
  if (invalid.length > 0) {
    throw new Error(`${phase} produced ${invalid.length} invalid sample(s): ${invalid[0].error}`);
  }
}

async function collectPhase({ browser, fixtureOrigin, hostOrigins, phase, rounds, seed, timeoutMs, variants }) {
  let completed = 0;
  const total = rounds * variants.length;
  return collectSamples({
    rounds,
    seed,
    variants,
    sample: async (variant) => {
      completed += 1;
      try {
        const measurement = await runBrowserSample({
          browser,
          fixtureOrigin,
          hostOrigin: resolveVariantHostOrigin(variant, hostOrigins),
          timeoutMs,
          variant,
        });
        console.log(`[benchmark] ${phase} ${completed}/${total} ${variant.id} ${measurement.duration.toFixed(2)}ms`);
        return { ...measurement, phase, timestamp: new Date().toISOString() };
      } catch (error) {
        console.error(
          `[benchmark] ${phase} ${completed}/${total} ${variant.id} failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        throw error;
      }
    },
  });
}

function renderRunSummary({
  calibrationEvaluation,
  calibrationReport,
  fatalError,
  metadata,
  productReport,
  productTitle,
  revisionEvaluation,
}) {
  const lines = [
    metadata.options.mode === 'revision' ? '# qiankun revision benchmark' : '# qiankun vs Wujie benchmark',
    '',
    `- Run: ${metadata.runId}`,
    `${metadata.options.mode === 'revision' ? '- Candidate commit' : '- Commit'}: ${metadata.commit}${metadata.dirty ? ' (dirty)' : ''}`,
    `- Chromium: ${metadata.browserVersion}`,
    `- Samples: ${metadata.options.samples} per product cell`,
    `- Warmup: ${metadata.options.warmup} per cell`,
    `- Seed: ${metadata.options.seed}`,
    '',
    '> Positive comparison deltas mean the candidate is slower than the reference.',
    '',
  ];

  if (metadata.baseline) {
    lines.splice(
      4,
      0,
      `- Baseline commit: ${metadata.baseline.git.commit}${metadata.baseline.git.dirty ? ' (dirty)' : ''}`,
      `- Baseline bundle: ${metadata.baseline.bundleHash}`,
    );
  }

  if (fatalError) lines.push('## Fatal error', '', `\`${fatalError}\``, '');
  if (calibrationReport) {
    lines.push(
      renderSummaryMarkdown(calibrationReport, { headingLevel: 2, title: 'A/A calibration' }),
      `Calibration diagnostic: **${calibrationEvaluation?.passed ? 'passed' : 'failed'}**`,
      `Calibration gate: **${metadata.options.calibrationGate ? 'enforced' : 'disabled for plumbing check'}**`,
      '',
    );
    if (calibrationEvaluation && !calibrationEvaluation.passed) {
      calibrationEvaluation.failures.forEach((failure) => lines.push(`- ${failure}`));
      lines.push('');
    }
  }
  if (productReport) {
    lines.push(renderSummaryMarkdown(productReport, { headingLevel: 2, title: productTitle }));
  }
  if (revisionEvaluation) {
    lines.push(
      `Improvement diagnostic: **${revisionEvaluation.passed ? 'passed' : 'failed'}**`,
      `Improvement gate: **${metadata.options.comparisonGate ? 'enforced' : 'disabled for plumbing check'}**`,
      '',
    );
    revisionEvaluation.failures.forEach((failure) => lines.push(`- ${failure}`));
    if (revisionEvaluation.failures.length > 0) lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const options = parseRunnerOptions(process.argv.slice(2));
  const startedAt = new Date();
  const git = await getGitState();
  const { commit } = git;
  const runId = `${startedAt.toISOString().replace(/[:.]/gu, '-')}-${commit.slice(0, 8)}`;
  const resultDirectory = join(benchmarkRoot, 'results', runId);
  const runDefinition = createRunDefinition(options.mode);
  const hostServers = {
    candidate: createStaticServer({ port: 7600, root: join(benchmarkRoot, 'fixtures/host/dist') }),
  };
  const baselineDirectory = options.baselineDir ? resolve(benchmarkRoot, options.baselineDir) : null;
  if (baselineDirectory) {
    hostServers.baseline = createStaticServer({ port: 7602, root: join(baselineDirectory, 'host') });
  }
  const fixture = createFixtureServer({ chunkIntervalMs: options.chunkIntervalMs, port: 7601 });
  const calibrationVariants = materializeCalibrationVariants(runDefinition.variants, runDefinition.calibrationAliases);
  let baselineMetadata;
  let browser;
  let calibrationEvaluation;
  let calibrationReport;
  let calibrationSamples = [];
  let calibrationWarmupSamples = [];
  let productReport;
  let productSamples = [];
  let productWarmupSamples = [];
  let revisionEvaluation;
  let fatalError;

  try {
    if (baselineDirectory) baselineMetadata = await readBaselineSnapshot(baselineDirectory);
    await Promise.all([...Object.values(hostServers).map((host) => host.start()), fixture.start()]);
    const hostOrigins = Object.fromEntries(Object.entries(hostServers).map(([role, host]) => [role, host.origin]));
    browser = await chromium.launch({ headless: true });

    calibrationWarmupSamples = await collectPhase({
      browser,
      fixtureOrigin: fixture.origin,
      hostOrigins,
      phase: 'calibration-warmup',
      rounds: options.warmup,
      seed: options.seed - 2,
      timeoutMs: options.timeoutMs,
      variants: calibrationVariants,
    });
    ensureAllValid(calibrationWarmupSamples, 'calibration warmup');

    calibrationSamples = await collectPhase({
      browser,
      fixtureOrigin: fixture.origin,
      hostOrigins,
      phase: 'calibration',
      rounds: options.calibrationSamples,
      seed: options.seed - 1,
      timeoutMs: options.timeoutMs,
      variants: calibrationVariants,
    });
    ensureAllValid(calibrationSamples, 'calibration');
    calibrationReport = buildReport({
      comparisons: [
        {
          candidate: 'calibration-b',
          id: 'aa-calibration',
          label: 'A/A identical qiankun variants',
          reference: 'calibration-a',
        },
      ],
      samples: calibrationSamples,
      seed: options.seed,
      variants: calibrationVariants,
    });
    calibrationEvaluation = evaluateCalibration(calibrationReport.comparisons['aa-calibration']);

    if (!options.calibrationGate || calibrationEvaluation.passed) {
      productWarmupSamples = await collectPhase({
        browser,
        fixtureOrigin: fixture.origin,
        hostOrigins,
        phase: 'product-warmup',
        rounds: options.warmup,
        seed: options.seed + 1,
        timeoutMs: options.timeoutMs,
        variants: runDefinition.variants,
      });
      ensureAllValid(productWarmupSamples, 'product warmup');

      productSamples = await collectPhase({
        browser,
        fixtureOrigin: fixture.origin,
        hostOrigins,
        phase: 'product',
        rounds: options.samples,
        seed: options.seed,
        timeoutMs: options.timeoutMs,
        variants: runDefinition.variants,
      });
      productReport = buildReport({
        comparisons: runDefinition.comparisons,
        samples: productSamples,
        seed: options.seed,
        variants: runDefinition.variants,
      });
      if (options.mode === 'revision') {
        revisionEvaluation = evaluateRevisionComparison(productReport.comparisons['candidate-vs-baseline']);
      }
    }
  } catch (error) {
    fatalError = error instanceof Error ? (error.stack ?? error.message) : String(error);
  } finally {
    const cleanupTasks = [...Object.values(hostServers).map((host) => host.close()), fixture.close()];
    if (browser) cleanupTasks.push(browser.close());
    const cleanupResults = await Promise.allSettled(cleanupTasks);
    const cleanupFailures = cleanupResults
      .filter((result) => result.status === 'rejected')
      .map((result) => (result.reason instanceof Error ? result.reason.message : String(result.reason)));
    if (!fatalError && cleanupFailures.length > 0) {
      fatalError = `benchmark cleanup failed: ${cleanupFailures.join('; ')}`;
    }
  }

  const benchmarkPackage = await readJson(join(benchmarkRoot, 'package.json'));
  const qiankunPackage = await readJson(join(repositoryRoot, 'packages/qiankun/package.json'));
  const metadata = {
    arch: os.arch(),
    baseline: baselineMetadata,
    browserVersion: browser?.version() ?? 'unavailable',
    commit,
    cpu: os.cpus()[0]?.model ?? 'unknown',
    cpuCount: os.cpus().length,
    dirty: git.dirty,
    nodeVersion: process.version,
    options,
    platform: os.platform(),
    platformRelease: os.release(),
    qiankunVersion: qiankunPackage.version,
    runId,
    schemaVersion: 2,
    startedAt: startedAt.toISOString(),
    wujieVersion: benchmarkPackage.dependencies.wujie,
  };
  const hasInvalidProductSample = productSamples.some((sample) => !sample.valid);
  const passed =
    !fatalError &&
    (!options.calibrationGate || calibrationEvaluation?.passed === true) &&
    (options.mode !== 'revision' || !options.comparisonGate || revisionEvaluation?.passed === true) &&
    !hasInvalidProductSample &&
    productSamples.length === options.samples * runDefinition.variants.length;
  const result = {
    calibration: {
      evaluation: calibrationEvaluation,
      report: calibrationReport,
      samples: calibrationSamples,
      warmupSamples: calibrationWarmupSamples,
    },
    fatalError,
    metadata,
    passed,
    product: { report: productReport, samples: productSamples, warmupSamples: productWarmupSamples },
    revision: { evaluation: revisionEvaluation },
  };
  const summary = renderRunSummary({
    calibrationEvaluation,
    calibrationReport,
    fatalError,
    metadata,
    productReport,
    productTitle: runDefinition.productTitle,
    revisionEvaluation,
  });

  await mkdir(resultDirectory, { recursive: true });
  await Promise.all([
    writeFile(join(resultDirectory, 'result.json'), `${JSON.stringify(result, null, 2)}\n`),
    writeFile(join(resultDirectory, 'summary.md'), summary),
  ]);
  console.log(summary);
  console.log(`[benchmark] artifacts: ${resultDirectory}`);
  if (!passed) process.exitCode = 1;
}

await main();
