import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { createRevisionHarnessRecord, REVISION_HARNESS_SOURCE_FILES } from '../src/harness.mjs';

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
