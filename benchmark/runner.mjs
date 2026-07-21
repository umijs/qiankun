import { execFile } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { assertFrameworkVariantSupported, getFrameworkAdapter } from './frameworks.mjs';
import { runBrowserSample } from './src/browser.mjs';
import { collectSamples } from './src/collect.mjs';
import { evaluateComparisonGates, renderComparisonGateSummary } from './src/comparison-gates.mjs';
import { createHarnessRecord, createRevisionHarnessRecord } from './src/harness.mjs';
import { CHROMIUM_LAUNCH_ARGS, createBenchmarkOrigins } from './src/origins.mjs';
import { parseRunnerOptions } from './src/options.mjs';
import { buildReport, renderSummaryMarkdown } from './src/report.mjs';
import { evaluateRevisionComparison, resolveVariantHostOrigin } from './src/revisions.mjs';
import { evaluateRunVerdict } from './src/run-verdict.mjs';
import { createFixtureServer } from './src/server.mjs';
import { inspectCrossSiteIsolation } from './src/site-isolation.mjs';
import { assertBaselineHarnessCompatible, readBaselineSnapshot } from './src/snapshot.mjs';
import { createStaticServer } from './src/static-server.mjs';
import { evaluateCalibration } from './src/stats.mjs';
import {
  CALIBRATION_VARIANTS,
  REVISION_CALIBRATION_VARIANTS,
  REVISION_COMPARISONS,
  SUITES,
  createRevisionVariants,
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

function createRunDefinition(options) {
  if (options.mode === 'revision') {
    return {
      calibrationAliases: REVISION_CALIBRATION_VARIANTS,
      comparisonGates: [],
      comparisons: REVISION_COMPARISONS,
      productTitle: `Revision comparison · ${options.scenario}`,
      variants: createRevisionVariants(options.scenario),
    };
  }
  const suite = SUITES[options.suite];
  if (!suite) throw new Error(`unknown benchmark suite: ${options.suite}`);
  const calibrationSourceVariant = suite.calibrationSourceVariant ?? CALIBRATION_VARIANTS[0].sourceVariant;
  return {
    calibrationAliases: CALIBRATION_VARIANTS.map((variant) => ({
      ...variant,
      sourceVariant: calibrationSourceVariant,
    })),
    comparisonGates: suite.comparisonGates ?? [],
    comparisons: suite.comparisons,
    productTitle: suite.title,
    variants: suite.variants,
  };
}

function findVariant(variants, id) {
  const variant = variants.find((candidate) => candidate.id === id);
  if (!variant) throw new Error(`unknown benchmark variant: ${id}`);
  return variant;
}

function ensureAllValid(samples, phase) {
  const invalid = samples.filter((sample) => !sample.valid);
  if (invalid.length > 0) {
    throw new Error(`${phase} produced ${invalid.length} invalid sample(s): ${invalid[0].error}`);
  }
}

async function collectPhase({ browser, fixtureOrigins, hostOrigins, phase, rounds, seed, timeoutMs, trial, variants }) {
  let completed = 0;
  const total = rounds * variants.length;
  const samples = await collectSamples({
    rounds,
    seed,
    variants,
    sample: async (variant) => {
      completed += 1;
      try {
        const measurement = await runBrowserSample({
          browser,
          fixtureOrigins,
          hostOrigin: resolveVariantHostOrigin(variant, hostOrigins),
          timeoutMs,
          variant,
        });
        console.log(
          `[benchmark] trial ${trial + 1} ${phase} ${completed}/${total} ${variant.id} ${measurement.duration.toFixed(2)}ms`,
        );
        return { ...measurement, phase, timestamp: new Date().toISOString() };
      } catch (error) {
        console.error(
          `[benchmark] trial ${trial + 1} ${phase} ${completed}/${total} ${variant.id} failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        throw error;
      }
    },
  });
  return samples.map((sample) => ({ ...sample, trial }));
}

function buildCalibrationReport(samples, seed, variants) {
  return buildReport({
    comparisons: [
      {
        candidate: 'calibration-b',
        id: 'aa-calibration',
        label: 'A/A identical qiankun variants',
        reference: 'calibration-a',
      },
    ],
    samples,
    seed,
    variants,
  });
}

function combineCalibrationEvaluations(aggregate, trialEvaluations) {
  // The gate judges the aggregate across trials; per-trial results stay visible as diagnostics
  // so trial-level drift remains observable without compounding the false-rejection rate.
  const trialDiagnostics = trialEvaluations.flatMap(({ evaluation, trial }) =>
    evaluation.failures.map((failure) => `trial ${trial + 1} diagnostic: ${failure}`),
  );
  return {
    diagnostics: trialDiagnostics,
    failures: aggregate.failures,
    passed: aggregate.passed,
    trials: trialEvaluations,
  };
}

function renderRunSummary({
  calibrationEvaluation,
  calibrationReport,
  comparisonEvaluation,
  fatalError,
  metadata,
  productReport,
  productTitle,
  revisionEvaluation,
}) {
  const lines = [
    metadata.options.mode === 'revision' ? '# qiankun revision benchmark' : '# micro-frontend HTML-entry benchmark',
    '',
    `- Run: ${metadata.runId}`,
    `${metadata.options.mode === 'revision' ? '- Candidate commit' : '- Commit'}: ${metadata.commit}${metadata.dirty ? ' (dirty)' : ''}`,
    `- Chromium: ${metadata.browserVersion}`,
    `- Suite: ${metadata.options.mode === 'revision' ? `revision:${metadata.options.scenario}` : metadata.options.suite}`,
    `- Independent browser trials: ${metadata.options.trials}`,
    `- Samples: ${metadata.options.samples} per product cell per trial`,
    `- Warmup: ${metadata.options.warmup} per cell per trial`,
    `- Seed: ${metadata.options.seed}`,
    `- Frameworks: ${Object.entries(metadata.frameworkVersions)
      .map(([name, version]) => `${name}@${version}`)
      .join(', ')}`,
    `- Harness fingerprint: ${metadata.harness?.fingerprint ?? 'unavailable'}`,
    '',
    '> Positive comparison deltas mean the candidate is slower than the reference.',
    '> Comparisons pair rounds within each browser trial, then aggregate trials with equal weight.',
    '',
  ];

  if (metadata.siteIsolation) {
    lines.splice(
      4,
      0,
      `- Native cross-site iframe: ${metadata.siteIsolation.nativeIframe.oopif ? 'OOPIF verified' : 'OOPIF not observed'}`,
      `- Wujie app-site OOPIF: ${metadata.siteIsolation.wujie.appSiteOopif ? 'observed' : 'not observed (same-site srcdoc sandbox)'}`,
    );
  }

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
    if (calibrationEvaluation?.diagnostics?.length) {
      calibrationEvaluation.diagnostics.forEach((diagnostic) => lines.push(`- ${diagnostic}`));
      lines.push('');
    }
  }
  if (productReport) {
    lines.push(renderSummaryMarkdown(productReport, { headingLevel: 2, title: productTitle }));
  }
  if (comparisonEvaluation) {
    lines.push(
      renderComparisonGateSummary(comparisonEvaluation),
      `Performance diagnostic: **${comparisonEvaluation.passed ? 'passed' : 'failed'}**`,
      `Performance gate: **${metadata.options.comparisonGate ? 'enforced' : 'disabled for plumbing check'}**`,
      '',
    );
    comparisonEvaluation.failures.forEach((failure) => lines.push(`- ${failure}`));
    if (comparisonEvaluation.failures.length > 0) lines.push('');
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
  const runDefinition = createRunDefinition(options);
  runDefinition.variants.forEach(assertFrameworkVariantSupported);
  const hostServers = {
    candidate: createStaticServer({ port: 7600, root: join(benchmarkRoot, 'fixtures/host/dist') }),
  };
  const baselineDirectory = options.baselineDir ? resolve(benchmarkRoot, options.baselineDir) : null;
  if (baselineDirectory) {
    hostServers.baseline = createStaticServer({ port: 7602, root: join(baselineDirectory, 'host') });
  }
  const fixture = createFixtureServer({ chunkIntervalMs: options.chunkIntervalMs, port: 7601 });
  const calibrationVariants = materializeCalibrationVariants(runDefinition.variants, runDefinition.calibrationAliases);
  const calibrationSamples = [];
  const calibrationTrialEvaluations = [];
  const calibrationWarmupSamples = [];
  const productSamples = [];
  const productWarmupSamples = [];
  let baselineMetadata;
  let browserVersion = 'unavailable';
  let calibrationEvaluation;
  let calibrationReport;
  let comparisonEvaluation;
  let fatalError;
  let productReport;
  let revisionEvaluation;
  let siteIsolation;

  try {
    if (baselineDirectory) {
      baselineMetadata = await readBaselineSnapshot(baselineDirectory);
      assertBaselineHarnessCompatible(baselineMetadata, await createRevisionHarnessRecord(benchmarkRoot));
    }
    await Promise.all([...Object.values(hostServers).map((host) => host.start()), fixture.start()]);
    const physicalHostOrigins = Object.fromEntries(
      Object.entries(hostServers).map(([role, host]) => [role, host.origin]),
    );
    const { fixtureOrigins, hostOrigins } = createBenchmarkOrigins({
      fixtureOrigin: fixture.origin,
      hostOrigins: physicalHostOrigins,
    });
    const launchOptions = { args: CHROMIUM_LAUNCH_ARGS, headless: true };

    if (options.mode === 'framework' && options.suite === 'site-isolation') {
      const preflightBrowser = await chromium.launch(launchOptions);
      try {
        browserVersion = preflightBrowser.version();
        siteIsolation = await inspectCrossSiteIsolation({
          browser: preflightBrowser,
          fixtureOrigins,
          hostOrigin: hostOrigins.candidate,
          nativeVariant: findVariant(runDefinition.variants, 'native-iframe-cross-site'),
          timeoutMs: options.timeoutMs,
          wujieVariant: findVariant(runDefinition.variants, 'wujie-cross-site-entry'),
        });
      } finally {
        await preflightBrowser.close();
      }
    }

    for (let trial = 0; trial < options.trials; trial += 1) {
      const trialSeed = options.seed + trial * 1009;
      const browser = await chromium.launch(launchOptions);
      try {
        browserVersion = browser.version();
        const trialCalibrationWarmup = await collectPhase({
          browser,
          fixtureOrigins,
          hostOrigins,
          phase: 'calibration-warmup',
          rounds: options.warmup,
          seed: trialSeed - 2,
          timeoutMs: options.timeoutMs,
          trial,
          variants: calibrationVariants,
        });
        calibrationWarmupSamples.push(...trialCalibrationWarmup);
        ensureAllValid(trialCalibrationWarmup, `trial ${trial + 1} calibration warmup`);

        const trialCalibrationSamples = await collectPhase({
          browser,
          fixtureOrigins,
          hostOrigins,
          phase: 'calibration',
          rounds: options.calibrationSamples,
          seed: trialSeed - 1,
          timeoutMs: options.timeoutMs,
          trial,
          variants: calibrationVariants,
        });
        calibrationSamples.push(...trialCalibrationSamples);
        ensureAllValid(trialCalibrationSamples, `trial ${trial + 1} calibration`);
        const trialCalibrationReport = buildCalibrationReport(trialCalibrationSamples, trialSeed, calibrationVariants);
        const trialCalibrationEvaluation = evaluateCalibration(trialCalibrationReport.comparisons['aa-calibration']);
        calibrationTrialEvaluations.push({ evaluation: trialCalibrationEvaluation, trial });
        // A single trial's A/A result is a diagnostic, not a gate: requiring every independent
        // trial's interval to contain zero would compound the false-rejection rate as trials are
        // added. The aggregate evaluation across all trials is the enforced judgment.
        if (options.calibrationGate && !trialCalibrationEvaluation.passed) {
          console.warn(
            `[benchmark] trial ${trial + 1} A/A diagnostic: ${trialCalibrationEvaluation.failures.join('; ')}`,
          );
        }

        const trialProductWarmup = await collectPhase({
          browser,
          fixtureOrigins,
          hostOrigins,
          phase: 'product-warmup',
          rounds: options.warmup,
          seed: trialSeed + 1,
          timeoutMs: options.timeoutMs,
          trial,
          variants: runDefinition.variants,
        });
        productWarmupSamples.push(...trialProductWarmup);
        ensureAllValid(trialProductWarmup, `trial ${trial + 1} product warmup`);

        const trialProductSamples = await collectPhase({
          browser,
          fixtureOrigins,
          hostOrigins,
          phase: 'product',
          rounds: options.samples,
          seed: trialSeed,
          timeoutMs: options.timeoutMs,
          trial,
          variants: runDefinition.variants,
        });
        productSamples.push(...trialProductSamples);
        ensureAllValid(trialProductSamples, `trial ${trial + 1} product`);
      } finally {
        await browser.close();
      }
    }
  } catch (error) {
    fatalError = error instanceof Error ? (error.stack ?? error.message) : String(error);
  } finally {
    const cleanupResults = await Promise.allSettled([
      ...Object.values(hostServers).map((host) => host.close()),
      fixture.close(),
    ]);
    const cleanupFailures = cleanupResults
      .filter((result) => result.status === 'rejected')
      .map((result) => (result.reason instanceof Error ? result.reason.message : String(result.reason)));
    if (cleanupFailures.length > 0) {
      const cleanupError = `benchmark cleanup failed: ${cleanupFailures.join('; ')}`;
      fatalError = fatalError ? `${fatalError}\n${cleanupError}` : cleanupError;
    }
  }

  try {
    if (calibrationSamples.length > 0) {
      calibrationReport = buildCalibrationReport(calibrationSamples, options.seed, calibrationVariants);
      calibrationEvaluation = combineCalibrationEvaluations(
        evaluateCalibration(calibrationReport.comparisons['aa-calibration']),
        calibrationTrialEvaluations,
      );
    }
    const expectedProductSamples = options.samples * options.trials * runDefinition.variants.length;
    if (productSamples.length === expectedProductSamples) {
      productReport = buildReport({
        comparisons: runDefinition.comparisons,
        samples: productSamples,
        seed: options.seed,
        variants: runDefinition.variants,
      });
      if (options.mode === 'revision') {
        revisionEvaluation = evaluateRevisionComparison(productReport.comparisons['candidate-vs-baseline']);
      } else if (runDefinition.comparisonGates.length > 0) {
        comparisonEvaluation = evaluateComparisonGates(productReport.comparisons, runDefinition.comparisonGates);
      }
    }
  } catch (error) {
    const reportError = error instanceof Error ? (error.stack ?? error.message) : String(error);
    fatalError = fatalError ? `${fatalError}\nReport generation failed: ${reportError}` : reportError;
  }

  const benchmarkPackage = await readJson(join(benchmarkRoot, 'package.json'));
  const qiankunPackage = await readJson(join(repositoryRoot, 'packages/qiankun/package.json'));
  const environment = {
    arch: os.arch(),
    cpu: os.cpus()[0]?.model ?? 'unknown',
    cpuCount: os.cpus().length,
    nodeVersion: process.version,
    platform: os.platform(),
    platformRelease: os.release(),
  };
  const frameworkVersions = {};
  for (const framework of new Set(runDefinition.variants.map((variant) => variant.framework))) {
    if (framework === 'native') {
      frameworkVersions[framework] = 'browser-iframe';
      continue;
    }
    if (framework === 'qiankun') {
      frameworkVersions[framework] = qiankunPackage.version;
      continue;
    }

    const packageName = getFrameworkAdapter(framework).packageName;
    frameworkVersions[framework] = packageName
      ? (await readJson(join(benchmarkRoot, 'node_modules', packageName, 'package.json'))).version
      : 'unknown';
  }
  let harness;
  try {
    harness = await createHarnessRecord({
      baselineBundleHash: baselineMetadata?.bundleHash,
      benchmarkRoot,
      browserArgs: CHROMIUM_LAUNCH_ARGS,
      browserVersion,
      environment,
      frameworkVersions,
      options,
      playwrightVersion: benchmarkPackage.devDependencies.playwright,
      runDefinition,
    });
  } catch (error) {
    const harnessError = error instanceof Error ? (error.stack ?? error.message) : String(error);
    fatalError = fatalError ? `${fatalError}\nHarness fingerprint failed: ${harnessError}` : harnessError;
  }

  const metadata = {
    arch: environment.arch,
    baseline: baselineMetadata,
    browserVersion,
    commit,
    cpu: environment.cpu,
    cpuCount: environment.cpuCount,
    dirty: git.dirty,
    frameworkVersions,
    harness,
    nodeVersion: environment.nodeVersion,
    options,
    platform: environment.platform,
    platformRelease: environment.platformRelease,
    qiankunVersion: qiankunPackage.version,
    runId,
    schemaVersion: 5,
    siteIsolation,
    startedAt: startedAt.toISOString(),
    wujieVersion: frameworkVersions.wujie,
  };
  const hasInvalidProductSample = productSamples.some((sample) => !sample.valid);
  const expectedProductSamples = options.samples * options.trials * runDefinition.variants.length;
  const passed = evaluateRunVerdict({
    calibrationEvaluation,
    comparisonEvaluation,
    expectedProductSamples,
    fatalError,
    hasComparisonGates: runDefinition.comparisonGates.length > 0,
    hasInvalidProductSample,
    options,
    productSampleCount: productSamples.length,
    revisionEvaluation,
  });
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
    product: {
      evaluation: comparisonEvaluation,
      report: productReport,
      samples: productSamples,
      warmupSamples: productWarmupSamples,
    },
    revision: { evaluation: revisionEvaluation },
  };
  const summary = renderRunSummary({
    calibrationEvaluation,
    calibrationReport,
    comparisonEvaluation,
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
