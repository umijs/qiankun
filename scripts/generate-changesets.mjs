#!/usr/bin/env node

/**
 * Derive changeset files from Conventional Commits.
 *
 * Replaces the manual "write a .changeset/*.md per PR" step: the repo already
 * enforces Conventional Commits (commitlint), so we infer which packages
 * changed and at what bump level directly from the commit range, then emit
 * changeset source files that the normal `changeset version` flow consumes.
 *
 * Usage:
 *   node scripts/generate-changesets.mjs [--since <ref>] [--dry]
 *
 *   --since <ref>   Exclusive lower bound of the commit range (default: the
 *                   most recent `v*` tag reachable from HEAD, else all history).
 *                   Release CI intentionally uses the default so each run can
 *                   reconstruct every change still waiting in the release PR.
 *                   Pass an explicit ref only for diagnostics or migrations.
 *   --dry           Print the changesets that would be written, write nothing.
 *
 * Idempotent: a changeset is named `auto-<short-sha>.md`, so re-running (or an
 * over-wide range) never produces duplicates — existing files are skipped.
 *
 * Attribution & bump rules live in scripts/commit-utils.mjs (shared with the
 * release-notes generator). Commits touching no package (docs/, e2e/,
 * examples/, root config, CI…) produce no changeset. Internal dependency
 * propagation is left to changesets' `updateInternalDependencies` at version
 * time — it is NOT added here.
 */

import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  ROOT,
  classifyBump,
  discoverPackages,
  latestReleaseTag,
  listCommits,
  packagesForCommit,
} from './commit-utils.mjs';

const CHANGESET_DIR = join(ROOT, '.changeset');

function parseArgs(argv) {
  const args = { since: undefined, dry: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry') args.dry = true;
    else if (argv[i] === '--since') args.since = argv[++i];
    else if (argv[i].startsWith('--since=')) args.since = argv[i].slice('--since='.length);
  }
  return args;
}

function main() {
  const { since, dry } = parseArgs(process.argv.slice(2));
  const sinceRef = since ?? latestReleaseTag();
  const packages = discoverPackages();
  const commits = listCommits(sinceRef);

  console.error(
    `Scanning ${commits.length} commit(s) since ${sinceRef ?? '(root)'} against ${packages.length} package(s).`,
  );

  let written = 0;
  let skippedExisting = 0;
  let skippedNoBump = 0;
  let skippedNoPackage = 0;

  for (const commit of commits) {
    const bump = classifyBump(commit.subject, commit.body);
    if (!bump) {
      skippedNoBump++;
      continue;
    }

    const affected = packagesForCommit(commit.sha, packages);
    if (affected.size === 0) {
      skippedNoPackage++;
      continue;
    }

    const fileName = `auto-${commit.sha.slice(0, 7)}.md`;
    const filePath = join(CHANGESET_DIR, fileName);
    if (existsSync(filePath)) {
      skippedExisting++;
      continue;
    }

    const frontmatter = [...affected]
      .sort()
      .map((name) => `"${name.replace(/"/g, '\\"')}": ${bump}`)
      .join('\n');
    const content = `---\n${frontmatter}\n---\n\n${commit.subject}\n`;

    if (dry) console.error(`\n--- ${fileName} (${bump}) ---\n${content}`);
    else writeFileSync(filePath, content, 'utf-8');
    written++;
  }

  console.error(
    `${dry ? '[dry] would write' : 'Wrote'} ${written} changeset(s); ` +
      `skipped ${skippedExisting} existing, ${skippedNoBump} no-bump, ${skippedNoPackage} no-package.`,
  );
}

main();
