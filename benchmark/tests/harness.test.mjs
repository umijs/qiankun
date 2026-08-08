import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import {
  HARNESS_SOURCE_FILES,
  REVISION_HARNESS_SOURCE_FILES,
  createHarnessRecord,
  createRevisionHarnessRecord,
} from '../src/harness.mjs';

const benchmarkRoot = fileURLToPath(new URL('..', import.meta.url));

test('revision harness compatibility record is stable and covers source inputs', async () => {
  const first = await createRevisionHarnessRecord(benchmarkRoot);
  const second = await createRevisionHarnessRecord(benchmarkRoot);

  assert.deepEqual(second, first);
  assert.match(first.fingerprint, /^[a-f\d]{64}$/u);
  assert.match(first.descriptor.sourceHash, /^[a-f\d]{64}$/u);
  assert.equal(first.descriptor.measurement.version, 4);
  assert.deepEqual(first.descriptor.measurement.diagnostics, [
    'framework settlement',
    'HTML response end',
    'paint lead before response end',
  ]);
});

test('framework harness fingerprints include suite comparison gates and A/A aliases', async (t) => {
  const repositoryRoot = await mkdtemp(join(tmpdir(), 'qiankun-benchmark-framework-harness-'));
  const temporaryBenchmarkRoot = join(repositoryRoot, 'benchmark');
  const hostDirectory = join(temporaryBenchmarkRoot, 'fixtures/host/dist');
  t.after(() => rm(repositoryRoot, { force: true, recursive: true }));

  for (const file of HARNESS_SOURCE_FILES) {
    const target = resolve(temporaryBenchmarkRoot, file);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(resolve(benchmarkRoot, file), target);
  }
  await mkdir(join(hostDirectory, '.vite'), { recursive: true });
  await mkdir(join(hostDirectory, 'assets'), { recursive: true });
  await writeFile(join(hostDirectory, 'native.html'), '<!doctype html>\n');
  await writeFile(join(hostDirectory, 'assets/native.js'), 'export {};\n');
  await writeFile(
    join(hostDirectory, '.vite/manifest.json'),
    `${JSON.stringify({ 'native.html': { file: 'assets/native.js' } })}\n`,
  );

  const options = {
    calibrationSamples: 100,
    chunkIntervalMs: 50,
    mode: 'framework',
    samples: 100,
    seed: 20260711,
    suite: 'ci-basic',
    timeoutMs: 10_000,
    trials: 1,
    warmup: 5,
  };
  const runDefinition = {
    calibrationAliases: [{ id: 'calibration-a', label: 'A/A · A', sourceVariant: 'native' }],
    comparisonGates: [{ comparison: 'native-self', maxUpperBoundPercent: 25 }],
    comparisons: [{ candidate: 'native', id: 'native-self', label: 'native self', reference: 'native' }],
    variants: [
      {
        delivery: 'buffered',
        entrySite: 'same-site',
        framework: 'native',
        frameworkOptions: {},
        id: 'native',
        label: 'native',
      },
    ],
  };
  const createRecord = (definition) =>
    createHarnessRecord({
      benchmarkRoot: temporaryBenchmarkRoot,
      browserArgs: [],
      browserVersion: '1.0.0',
      environment: { platform: 'test' },
      frameworkVersions: { native: 'browser-iframe' },
      options,
      playwrightVersion: '1.0.0',
      runDefinition: definition,
    });
  const initial = await createRecord(runDefinition);
  const changedBudget = await createRecord({
    ...runDefinition,
    comparisonGates: [{ comparison: 'native-self', maxUpperBoundPercent: 30 }],
  });
  const changedCalibrationSource = await createRecord({
    ...runDefinition,
    calibrationAliases: [{ id: 'calibration-a', label: 'A/A · A', sourceVariant: 'future-native' }],
  });

  assert.deepEqual(initial.descriptor.suite.calibrationAliases, runDefinition.calibrationAliases);
  assert.deepEqual(initial.descriptor.suite.comparisonGates, runDefinition.comparisonGates);
  assert.notEqual(changedBudget.fingerprint, initial.fingerprint);
  assert.notEqual(changedCalibrationSource.fingerprint, initial.fingerprint);
});

test('revision harness compatibility covers package-manager inputs', async (t) => {
  const repositoryRoot = await mkdtemp(join(tmpdir(), 'qiankun-benchmark-harness-'));
  const temporaryBenchmarkRoot = join(repositoryRoot, 'benchmark');
  t.after(() => rm(repositoryRoot, { force: true, recursive: true }));

  for (const file of REVISION_HARNESS_SOURCE_FILES) {
    const target = resolve(temporaryBenchmarkRoot, file);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(resolve(benchmarkRoot, file), target);
  }

  const initial = await createRevisionHarnessRecord(temporaryBenchmarkRoot);
  await writeFile(join(repositoryRoot, 'package.json'), '{"packageManager":"pnpm@99.0.0"}\n');
  const changedPackageManager = await createRevisionHarnessRecord(temporaryBenchmarkRoot);
  assert.notEqual(changedPackageManager.descriptor.sourceHash, initial.descriptor.sourceHash);
  assert.notEqual(changedPackageManager.fingerprint, initial.fingerprint);

  await copyFile(resolve(benchmarkRoot, '../package.json'), join(repositoryRoot, 'package.json'));
  await writeFile(join(repositoryRoot, 'pnpm-workspace.yaml'), 'allowBuilds:\n  esbuild: false\n');
  const changedWorkspaceSettings = await createRevisionHarnessRecord(temporaryBenchmarkRoot);
  assert.notEqual(changedWorkspaceSettings.descriptor.sourceHash, initial.descriptor.sourceHash);
  assert.notEqual(changedWorkspaceSettings.fingerprint, initial.fingerprint);
});
