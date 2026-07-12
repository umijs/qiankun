import { createHash } from 'node:crypto';

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function collectChangedPaths(left, right, path = '') {
  if (Object.is(left, right)) return [];
  if (Array.isArray(left) || Array.isArray(right)) {
    return JSON.stringify(left) === JSON.stringify(right) ? [] : [path || '<root>'];
  }
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    return [...keys].sort().flatMap((key) => collectChangedPaths(left[key], right[key], path ? `${path}.${key}` : key));
  }
  return [path || '<root>'];
}

export function createHarnessFingerprint(descriptor) {
  return createHash('sha256')
    .update(JSON.stringify(canonicalize(descriptor)))
    .digest('hex');
}

export function assertComparableHarness(left, right) {
  const expectedLeft = createHarnessFingerprint(left.descriptor);
  const expectedRight = createHarnessFingerprint(right.descriptor);
  if (left.fingerprint !== expectedLeft || right.fingerprint !== expectedRight) {
    throw new Error('benchmark harness fingerprint does not match its descriptor');
  }
  if (left.fingerprint === right.fingerprint) return;

  const changedPaths = collectChangedPaths(left.descriptor, right.descriptor);
  throw new Error(`benchmark harnesses are not comparable; changed fields: ${changedPaths.join(', ')}`);
}
