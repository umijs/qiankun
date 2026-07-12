import { join } from 'node:path';

import { FRAMEWORK_ADAPTER_API_VERSION, getFrameworkAdapter, getVariantHostPage } from '../frameworks.mjs';
import { BROWSER_CONTEXT_OPTIONS, MEASUREMENT_CONTRACT } from './browser.mjs';
import { createHarnessFingerprint } from './fingerprint.mjs';
import { hashFiles, hashViteEntries } from './hash.mjs';
import { CHROMIUM_LAUNCH_ARGS } from './origins.mjs';

const HARNESS_SOURCE_FILES = [
  'runner.mjs',
  'src/browser.mjs',
  'src/collect.mjs',
  'src/fingerprint.mjs',
  'src/harness.mjs',
  'src/hash.mjs',
  'src/origins.mjs',
  'src/report.mjs',
  'src/revisions.mjs',
  'src/schedule.mjs',
  'src/server.mjs',
  'src/site-isolation.mjs',
  'src/static-server.mjs',
  'src/stats.mjs',
];

const REVISION_HARNESS_SOURCE_FILES = [
  ...HARNESS_SOURCE_FILES,
  '../pnpm-lock.yaml',
  'fixtures/host/qiankun.html',
  'fixtures/host/src/benchmark.ts',
  'fixtures/host/src/host.css',
  'fixtures/host/src/qiankun.ts',
  'fixtures/host/vite.config.ts',
  'frameworks.mjs',
  'package.json',
  'scenarios.mjs',
  'src/options.mjs',
];

export async function createRevisionHarnessRecord(benchmarkRoot) {
  const descriptor = {
    adapterApiVersion: FRAMEWORK_ADAPTER_API_VERSION,
    browser: {
      args: CHROMIUM_LAUNCH_ARGS,
      context: BROWSER_CONTEXT_OPTIONS,
    },
    measurement: MEASUREMENT_CONTRACT,
    sourceHash: await hashFiles(benchmarkRoot, REVISION_HARNESS_SOURCE_FILES),
    version: 1,
  };
  return { descriptor, fingerprint: createHarnessFingerprint(descriptor) };
}

export async function createHarnessRecord({
  baselineBundleHash,
  benchmarkRoot,
  browserArgs,
  browserVersion,
  environment,
  frameworkVersions,
  options,
  playwrightVersion,
  runDefinition,
}) {
  const hostPages = [...new Set(runDefinition.variants.map(getVariantHostPage))];
  const adapterIds = [...new Set(runDefinition.variants.map((variant) => variant.framework))];
  const hostDirectory = join(benchmarkRoot, 'fixtures/host/dist');
  const descriptor = {
    adapterApiVersion: FRAMEWORK_ADAPTER_API_VERSION,
    adapters: Object.fromEntries(adapterIds.map((id) => [id, getFrameworkAdapter(id)])),
    browser: {
      args: browserArgs,
      context: BROWSER_CONTEXT_OPTIONS,
      driverVersion: playwrightVersion,
      name: 'chromium',
      version: browserVersion,
    },
    environment,
    fixture: {
      chunkIntervalMs: options.chunkIntervalMs,
      hostBundleHash: await hashViteEntries(hostDirectory, hostPages),
    },
    frameworks: frameworkVersions,
    harnessSourceHash: await hashFiles(benchmarkRoot, HARNESS_SOURCE_FILES),
    measurement: MEASUREMENT_CONTRACT,
    revision: baselineBundleHash ? { baselineBundleHash } : null,
    sampling: {
      calibrationSamples: options.calibrationSamples,
      samples: options.samples,
      seed: options.seed,
      timeoutMs: options.timeoutMs,
      trials: options.trials,
      warmup: options.warmup,
    },
    suite: {
      comparisons: runDefinition.comparisons,
      id: options.mode === 'revision' ? `revision:${options.scenario}` : options.suite,
      variants: runDefinition.variants,
    },
  };

  return { descriptor, fingerprint: createHarnessFingerprint(descriptor) };
}
