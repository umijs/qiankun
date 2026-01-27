import { satisfies as compareSatisfies } from 'compare-versions';

/**
 * Semver-compatible satisfies check using compare-versions.
 * Handles edge cases that compare-versions doesn't support:
 * - Full wildcards (*, x, X)
 * - Short wildcards (1.x, 1.*)
 * - Prerelease version behavior
 */
export function satisfies(version: string, range: string): boolean {
  const trimmed = range.trim();
  const hasPrerelease = version.includes('-');
  const rangeHasPrerelease = /-[0-9A-Za-z]/.test(trimmed);

  // Full wildcards: *, x, X
  if (trimmed === '*' || trimmed.toLowerCase() === 'x') {
    return !hasPrerelease;
  }

  // Short wildcards: N.x, N.*, N.X (without third segment)
  const shortMatch = trimmed.match(/^(\d+)\.[xX*]$/);
  if (shortMatch) {
    const major = parseInt(shortMatch[1], 10);
    if (hasPrerelease && !rangeHasPrerelease) {
      return false;
    }
    return compareSatisfies(version, `>=${major}.0.0`) && compareSatisfies(version, `<${major + 1}.0.0`);
  }

  // Prerelease compatibility: if version is prerelease but range doesn't
  // include prerelease identifier, return false (matching semver behavior)
  if (hasPrerelease && !rangeHasPrerelease) {
    return false;
  }

  return compareSatisfies(version, range);
}
