#!/usr/bin/env node

/**
 * Generate unified release notes from individual package CHANGELOGs.
 *
 * Usage: node scripts/generate-release-notes.mjs '<publishedPackagesJSON>'
 *
 * Reads each published package's CHANGELOG.md, extracts the latest version entry,
 * filters out "Updated dependencies" noise, and outputs aggregated markdown to stdout.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');

/**
 * Scan packages/ directory and build a map of package name → directory path.
 * Handles nested structures like packages/ui-bindings/react/.
 */
function discoverPackageDirs() {
  const dirs = new Map();
  const packagesDir = join(ROOT, 'packages');

  function tryRegister(dir) {
    const pkgJsonPath = join(dir, 'package.json');
    if (existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
      if (pkg.name) {
        dirs.set(pkg.name, dir);
      }
      return true;
    }
    return false;
  }

  function scanDir(dir) {
    const registered = tryRegister(dir);

    // Also scan subdirectories for nested packages (e.g. ui-bindings/react)
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !['node_modules', 'dist', 'src', '.'].includes(entry.name)) {
          const subDir = join(dir, entry.name);
          if (!registered || existsSync(join(subDir, 'package.json'))) {
            scanDir(subDir);
          }
        }
      }
    } catch {
      // ignore read errors
    }
  }

  const topLevelDirs = readdirSync(packagesDir, { withFileTypes: true });
  for (const entry of topLevelDirs) {
    if (entry.isDirectory()) {
      scanDir(join(packagesDir, entry.name));
    }
  }

  return dirs;
}

/**
 * Extract the latest version entry from a CHANGELOG.md content string.
 * Returns filtered lines with "Updated dependencies" noise removed,
 * or null if no entry is found.
 */
function extractLatestEntry(changelogContent) {
  const lines = changelogContent.split('\n');

  // Find the range of the first ## version section
  let startIndex = -1;
  let endIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match "## <version>" headings (not ### sub-headings)
    if (/^## \S/.test(line)) {
      if (startIndex === -1) {
        startIndex = i;
      } else {
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex === -1) return null;

  const entryLines = lines.slice(startIndex, endIndex);

  // Filter out "Updated dependencies" blocks:
  //   - Updated dependencies [hash]
  //   - Updated dependencies [hash]
  //     - @pkg/name@version
  //     - @pkg/name@version
  const filtered = [];
  let inUpdatedDeps = false;

  for (const line of entryLines) {
    if (line.startsWith('- Updated dependencies')) {
      inUpdatedDeps = true;
      continue;
    }

    if (inUpdatedDeps) {
      // Indented lines are dependency version references
      if (line.startsWith('  - ')) {
        continue;
      }
      // Any other line exits the block
      inUpdatedDeps = false;
    }

    filtered.push(line);
  }

  return filtered;
}

// --- Main ---

const publishedPackagesJSON = process.argv[2];
if (!publishedPackagesJSON) {
  console.error("Usage: node scripts/generate-release-notes.mjs '<publishedPackagesJSON>'");
  process.exit(1);
}

let publishedPackages;
try {
  publishedPackages = JSON.parse(publishedPackagesJSON);
} catch (e) {
  console.error('Failed to parse publishedPackages JSON:', e.message);
  process.exit(1);
}

if (!Array.isArray(publishedPackages) || publishedPackages.length === 0) {
  console.error('No published packages provided.');
  process.exit(1);
}

const packageDirs = discoverPackageDirs();
const sections = [];

// Sort: qiankun first (facade package), then alphabetical
const sorted = [...publishedPackages].sort((a, b) => {
  if (a.name === 'qiankun') return -1;
  if (b.name === 'qiankun') return 1;
  return a.name.localeCompare(b.name);
});

for (const { name, version } of sorted) {
  const dir = packageDirs.get(name);
  if (!dir) {
    console.error(`Warning: could not find directory for package "${name}"`);
    continue;
  }

  const changelogPath = join(dir, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    console.error(`Warning: no CHANGELOG.md found for "${name}" at ${changelogPath}`);
    continue;
  }

  const content = readFileSync(changelogPath, 'utf-8');
  const entryLines = extractLatestEntry(content);

  if (!entryLines || entryLines.length === 0) {
    continue;
  }

  // Skip the "## version" line (first entry) — we'll use our own formatted header
  const restLines = entryLines.slice(1);

  // Trim leading/trailing blank lines
  while (restLines.length > 0 && restLines[0].trim() === '') restLines.shift();
  while (restLines.length > 0 && restLines[restLines.length - 1].trim() === '') restLines.pop();

  // If only headings remain with no actual change items, skip this package
  const hasActualChanges = restLines.some((l) => l.startsWith('- '));
  if (!hasActualChanges) {
    continue;
  }

  sections.push(`## ${name} \`${version}\`\n\n${restLines.join('\n')}`);
}

if (sections.length === 0) {
  console.error('No changelog entries found for any published package.');
  process.exit(1);
}

console.log(sections.join('\n\n'));
