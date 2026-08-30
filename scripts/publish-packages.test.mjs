import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { getPublishArgs, withPreStateSetAside } from './publish-packages.mjs';

test('publishes prereleases under the configured prerelease tag', () => {
  assert.deepEqual(getPublishArgs({ mode: 'pre', tag: 'rc' }), ['publish', '--tag', 'rc']);
});

test('uses the default tag outside prerelease mode', () => {
  assert.deepEqual(getPublishArgs({ mode: 'exit', tag: 'rc' }), ['publish']);
  assert.deepEqual(getPublishArgs(undefined), ['publish']);
});

test('rejects prerelease mode without a tag', () => {
  assert.throws(() => getPublishArgs({ mode: 'pre', tag: '' }), /Prerelease mode requires a non-empty tag/);
});

function withTempPreState(t, run) {
  const dir = mkdtempSync(join(tmpdir(), 'qiankun-pre-state-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const filePath = join(dir, 'pre.json');
  const content = JSON.stringify({ mode: 'pre', tag: 'rc' });
  writeFileSync(filePath, content);

  return run({ dir, filePath, content });
}

test('hides the pre-state only while the callback runs and returns its result', (t) =>
  withTempPreState(t, ({ dir, filePath, content }) => {
    const result = withPreStateSetAside(() => {
      assert.equal(existsSync(filePath), false, 'pre.json must be absent during publish');
      return 42;
    }, filePath);

    assert.equal(result, 42);
    assert.equal(readFileSync(filePath, 'utf8'), content, 'pre.json must be restored verbatim');
    assert.equal(existsSync(join(dir, 'pre.json.publishing')), false, 'no parked copy may be left behind');
  }));

test('restores the pre-state even when the callback throws', (t) =>
  withTempPreState(t, ({ filePath, content }) => {
    assert.throws(
      () =>
        withPreStateSetAside(() => {
          throw new Error('publish failed');
        }, filePath),
      /publish failed/,
    );

    assert.equal(readFileSync(filePath, 'utf8'), content);
  }));
