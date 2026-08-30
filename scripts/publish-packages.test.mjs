import assert from 'node:assert/strict';
import test from 'node:test';

import { getPublishArgs } from './publish-packages.mjs';

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
