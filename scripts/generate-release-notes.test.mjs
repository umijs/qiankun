import assert from 'node:assert/strict';
import test from 'node:test';

import { extractLatestEntry } from './generate-release-notes.mjs';

test('removes empty subsections before, between, and after actual changes', () => {
  const entry = extractLatestEntry(`# qiankun

## 3.0.0

### Empty before

### Major Changes

- Introduce the new runtime.

### Empty middle

- Updated dependencies [abc123]
  - @qiankunjs/shared@1.0.0

### Minor Changes

- Support a new integration.

### Empty after

`);

  assert.equal(
    entry.join('\n').trim(),
    `## 3.0.0

### Major Changes

- Introduce the new runtime.

### Minor Changes

- Support a new integration.`,
  );
});

test('removes dependency-only subsections and their version references', () => {
  const entry = extractLatestEntry(`## 3.0.0-rc.22

### Patch Changes

- Updated dependencies [abc123]
- Updated dependencies [def456]
  - @qiankunjs/shared@1.0.0-rc.22
  - @qiankunjs/sandbox@1.0.0-rc.22

### Minor Changes

- Updated dependencies [789abc]
  - @qiankunjs/loader@1.0.0-rc.22
`);

  assert.equal(entry.join('\n').trim(), '## 3.0.0-rc.22');
});

test('preserves actual change items and multiline descriptions around dependency updates', () => {
  const entry = extractLatestEntry(`## 3.0.0

### Patch Changes

- Fix remounting.
  Keep the container occupied until cleanup finishes.

  - Preserve the mount order.
  - Release the container on failure.

  Further details belong to the same change.

- Updated dependencies [abc123]
  - @qiankunjs/shared@1.0.0
- Fix cleanup.
  Preserve this continuation too.
`);

  assert.equal(
    entry.join('\n').trim(),
    `## 3.0.0

### Patch Changes

- Fix remounting.
  Keep the container occupied until cleanup finishes.

  - Preserve the mount order.
  - Release the container on failure.

  Further details belong to the same change.

- Fix cleanup.
  Preserve this continuation too.`,
  );
});

test('extracts only the latest version while retaining populated subsections', () => {
  const entry = extractLatestEntry(`# qiankun

## 3.0.0

### Major Changes

- Ship the stable release.

## 3.0.0-rc.22

### Patch Changes

- Fix the previous prerelease.
`);

  assert.equal(
    entry.join('\n').trim(),
    `## 3.0.0

### Major Changes

- Ship the stable release.`,
  );
});

test('does not fall back to older changes when the latest version only updates dependencies', () => {
  const entry = extractLatestEntry(`## 3.0.0

### Patch Changes

- Updated dependencies [abc123]
  - @qiankunjs/shared@1.0.0

## 3.0.0-rc.22

### Patch Changes

- Fix the previous prerelease.
`);

  assert.equal(entry.join('\n').trim(), '## 3.0.0');
});

test('preserves changes without a subsection heading', () => {
  const entry = extractLatestEntry(`## 3.0.0

- Fix cleanup.
  Retain the description.

- Updated dependencies [abc123]
  - @qiankunjs/shared@1.0.0
`);

  assert.equal(
    entry.join('\n').trim(),
    `## 3.0.0

- Fix cleanup.
  Retain the description.`,
  );
});

test('returns null when no version entry exists', () => {
  assert.equal(extractLatestEntry('# qiankun\n\nNo releases yet.\n'), null);
});
