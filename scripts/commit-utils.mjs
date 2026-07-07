/**
 * Shared helpers for the commit-driven release tooling.
 *
 * Both scripts/generate-changesets.mjs (derive changesets from commits) and
 * scripts/generate-release-notes.mjs (aggregate a single release log from
 * commits) parse Conventional Commits and attribute changed files to packages
 * the same way — this module is the single source of truth for that logic.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const PACKAGES_DIR = join(ROOT, 'packages');

const IGNORED_TYPES = new Set(['docs', 'chore', 'ci', 'style', 'test', 'build']);
const MINOR_TYPES = new Set(['feat']);
const PATCH_TYPES = new Set(['fix', 'perf', 'refactor', 'revert']);

const SUBJECT_RE = /^(?<type>[a-z]+)(?:\((?<scope>[^)]*)\))?(?<bang>!)?:\s*(?<desc>.+)$/i;

export function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf-8' });
}

/**
 * Most recent `v*` tag reachable from HEAD, or null when none exists.
 * Used as the default lower bound for a commit range.
 */
export function latestReleaseTag() {
  try {
    return git('describe', '--tags', '--abbrev=0', '--match', 'v*', 'HEAD').trim();
  } catch {
    return null;
  }
}

/**
 * Discover publishable packages as {name, dir} where dir is repo-relative
 * (e.g. "packages/ui-bindings/react"), sorted longest-dir-first so nested
 * packages win prefix matches. Private packages are excluded.
 */
export function discoverPackages() {
  const packages = [];

  function tryRegister(absDir) {
    const pkgJsonPath = join(absDir, 'package.json');
    if (!existsSync(pkgJsonPath)) return false;
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    if (pkg.name && !pkg.private) packages.push({ name: pkg.name, dir: relative(ROOT, absDir) });
    return true;
  }

  function scan(absDir) {
    const registered = tryRegister(absDir);
    for (const entry of readdirSync(absDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (['node_modules', 'dist', 'src', 'es', 'lib'].includes(entry.name)) continue;
      const child = join(absDir, entry.name);
      if (!registered || existsSync(join(child, 'package.json'))) scan(child);
    }
  }

  for (const entry of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
    if (entry.isDirectory()) scan(join(PACKAGES_DIR, entry.name));
  }

  packages.sort((a, b) => b.dir.length - a.dir.length);
  return packages;
}

/** Map a repo-relative file path to its owning package name, or null. */
export function packageForFile(file, packages) {
  const match = packages.find((p) => file === p.dir || file.startsWith(`${p.dir}/`));
  return match ? match.name : null;
}

/** Parse a Conventional Commit subject line, or null if non-conventional. */
export function parseSubject(subject) {
  const m = SUBJECT_RE.exec(subject);
  if (!m?.groups) return null;
  return {
    type: m.groups.type.toLowerCase(),
    scope: m.groups.scope ?? null,
    breaking: Boolean(m.groups.bang),
    desc: m.groups.desc,
  };
}

/**
 * Bump level implied by a commit: 'major' | 'minor' | 'patch' | null.
 * null means "do not version" (ignored type, or non-conventional subject).
 */
export function classifyBump(subject, body) {
  const parsed = parseSubject(subject);
  if (!parsed) return null;
  const breaking = parsed.breaking || /^BREAKING[ -]CHANGE:/m.test(body);
  if (breaking) return 'major';
  if (IGNORED_TYPES.has(parsed.type)) return null;
  if (MINOR_TYPES.has(parsed.type)) return 'minor';
  if (PATCH_TYPES.has(parsed.type)) return 'patch';
  return null;
}

/**
 * List commits (oldest → newest) in `sinceRef..HEAD` (whole history when
 * sinceRef is null) as {sha, subject, body}. NUL/RS separators keep multiline
 * bodies and special characters from corrupting the parse.
 */
export function listCommits(sinceRef, { includeMerges = false } = {}) {
  const range = sinceRef ? `${sinceRef}..HEAD` : 'HEAD';
  const args = ['log', '--reverse', '--format=%H%x00%s%x00%b%x1e', range];
  if (!includeMerges) args.splice(1, 0, '--no-merges');
  const raw = git(...args);
  return raw
    .split('\x1e')
    .map((r) => r.replace(/^\n/, ''))
    .filter((r) => r.trim() !== '')
    .map((record) => {
      const [sha, subject, body = ''] = record.split('\x00');
      return { sha: sha.trim(), subject: (subject ?? '').trim(), body: body.trim() };
    });
}

/** Files changed by a single commit, as repo-relative paths. */
export function filesInCommit(sha) {
  const out = git('show', '--name-only', '--format=', '--no-renames', sha);
  return out
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Set of package names a commit touched. */
export function packagesForCommit(sha, packages) {
  const names = new Set();
  for (const file of filesInCommit(sha)) {
    const name = packageForFile(file, packages);
    if (name) names.add(name);
  }
  return names;
}
