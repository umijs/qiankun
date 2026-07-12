import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { createHarnessFingerprint } from '../src/fingerprint.mjs';

function createHarness(sourceHash = 'source-a') {
  const descriptor = { measurement: { version: 3 }, sourceHash };
  return { descriptor, fingerprint: createHarnessFingerprint(descriptor) };
}

test('createBaselineSnapshot copies a complete host bundle and records reproducibility metadata', async (t) => {
  const { assertBaselineHarnessCompatible, createBaselineSnapshot, readBaselineSnapshot } =
    await import('../src/snapshot.mjs');
  const root = await mkdtemp(join(tmpdir(), 'qiankun-benchmark-snapshot-'));
  t.after(() => rm(root, { force: true, recursive: true }));
  const sourceDirectory = join(root, 'dist');
  const targetDirectory = join(root, 'artifacts', 'baseline');
  await mkdir(join(sourceDirectory, 'assets'), { recursive: true });
  await writeFile(join(sourceDirectory, 'qiankun.html'), '<script src="./assets/app.js"></script>');
  await writeFile(join(sourceDirectory, 'assets/app.js'), 'console.log("baseline");');

  const created = await createBaselineSnapshot({
    createdAt: '2026-07-11T00:00:00.000Z',
    git: { commit: 'abc123', dirty: false },
    harness: createHarness(),
    sourceDirectory,
    targetDirectory,
  });

  assert.equal(
    await readFile(join(targetDirectory, 'host/qiankun.html'), 'utf8'),
    '<script src="./assets/app.js"></script>',
  );
  assert.match(created.bundleHash, /^[a-f\d]{64}$/u);
  assert.equal(created.schemaVersion, 2);
  assert.deepEqual(await readBaselineSnapshot(targetDirectory), created);
  assert.doesNotThrow(() => assertBaselineHarnessCompatible(created, createHarness()));
  assert.throws(
    () => assertBaselineHarnessCompatible(created, createHarness('source-b')),
    /benchmark harnesses are not comparable; changed fields: sourceHash/u,
  );
  await assert.rejects(
    createBaselineSnapshot({
      createdAt: '2026-07-11T00:00:00.000Z',
      git: { commit: 'abc123', dirty: false },
      harness: createHarness(),
      sourceDirectory,
      targetDirectory,
    }),
    /already exists/u,
  );

  await writeFile(join(targetDirectory, 'host/assets/app.js'), 'console.log("tampered");');
  await assert.rejects(readBaselineSnapshot(targetDirectory), /baseline bundle hash mismatch/u);
});

test('assertCleanBaselineGitState rejects dirty snapshots', async () => {
  const { assertCleanBaselineGitState } = await import('../src/snapshot.mjs');

  assert.doesNotThrow(() => assertCleanBaselineGitState({ commit: 'abc123', dirty: false }));
  assert.throws(
    () => assertCleanBaselineGitState({ commit: 'abc123', dirty: true }),
    /baseline snapshot requires a clean git worktree/u,
  );
});
