#!/usr/bin/env node
/**
 * Builds every example into one static site, the one deployed to https://examples.qiankunjs.com.
 *
 * Locally each example runs on its own port, which is what makes the demo honest: the shells load
 * micro apps cross-origin. Deployed, they all become static builds on one origin, laid out by path:
 *
 *   /                     the React shell (examples/main)
 *   /vue-host/            the Vue shell
 *   /apps/<name>/         the micro apps the shells mount
 *   /standalone-sandbox/  the sandbox-only lab
 *
 * `/apps/*` is served with `Access-Control-Allow-Origin: *`, so those entries stay loadable from
 * any other origin — a local shell, a docs page — and not just from the two shells shipped here.
 *
 * Run from the repo root, after `pnpm run build:packages`:
 *
 *   node scripts/build-examples-site.mjs
 */
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const examplesDir = join(repoRoot, 'examples');
const siteDir = join(repoRoot, 'dist-examples');

/**
 * The shells' routes. `_redirects` needs one rewrite per route so a deep link survives a reload,
 * and the assertion below keeps this list honest against the shells' own `apps.ts`.
 */
const SHELLS = [
  { dir: 'main', base: '/', mount: '.', label: 'React shell' },
  { dir: 'vue-host', base: '/vue-host/', mount: 'vue-host', label: 'Vue shell' },
];

/** Micro apps, in the order the shells list them. `dir` is under examples/, `name` is the path segment. */
const MICRO_APPS = [
  { dir: 'react', name: 'react', build: 'vite' },
  { dir: 'vue', name: 'vue', build: 'vite' },
  { dir: 'webpack', name: 'webpack', build: 'webpack' },
  { dir: 'purehtml', name: 'purehtml', build: 'copy', files: ['index.html', 'entry.js', 'vendor'] },
];

function run(command, args, cwd) {
  console.log(`  $ ${command} ${args.join(' ')}  (${cwd.replace(repoRoot + '/', '')})`);
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

/**
 * Reads the route segments a shell declares, so a route added to a shell without a matching
 * rewrite here fails the build instead of 404ing on reload in production. Both spellings are
 * covered: the root-mounted shell writes literal paths, the sub-path one derives them from
 * Vite's base through `routeOf`.
 */
function declaredRoutes(shellDir) {
  const source = readFileSync(join(examplesDir, shellDir, 'src', 'apps.ts'), 'utf8');
  const matches = source.matchAll(/path: (?:routeOf\('([\w-]+)'\)|'\/([\w-]+)')/g);
  return [...matches].map(([, viaRouteOf, literal]) => viaRouteOf ?? literal);
}

function buildShell({ dir, base, mount }) {
  const cwd = join(examplesDir, dir);
  run('pnpm', ['exec', 'vite', 'build', '--mode', 'pages', '--base', base], cwd);
  cpSync(join(cwd, 'dist'), join(siteDir, mount), { recursive: true });
}

function buildMicroApp({ dir, name, build, files }) {
  const cwd = join(examplesDir, dir);
  const target = join(siteDir, 'apps', name);

  if (build === 'copy') {
    mkdirSync(target, { recursive: true });
    for (const file of files) cpSync(join(cwd, file), join(target, file), { recursive: true });
    console.log(`  copied ${files.join(', ')}  (examples/${dir})`);
    return;
  }

  if (build === 'webpack') {
    run('pnpm', ['exec', 'webpack', '--mode', 'production', '--env', `deployBase=/apps/${name}/`], cwd);
  } else {
    run('pnpm', ['exec', 'vite', 'build', '--mode', 'pages', '--base', `/apps/${name}/`], cwd);
  }

  cpSync(join(cwd, 'dist'), target, { recursive: true });
}

function buildStandaloneSandbox() {
  const cwd = join(examplesDir, 'standalone-sandbox');
  // Relative base rather than an absolute one: e2e serves this same `dist` from a server root
  // (see e2e/playwright.config.ts), and relative asset URLs are correct in both layouts.
  run('pnpm', ['exec', 'vite', 'build', '--base', './'], cwd);
  cpSync(join(cwd, 'dist'), join(siteDir, 'standalone-sandbox'), { recursive: true });
}

/**
 * Cloudflare Pages platform files.
 *
 * The rewrites are enumerated rather than globbed (`/vue-host/* -> …`): a glob would also match
 * that shell's own asset URLs, and the docs make no promise about whether a real file or a 200
 * rewrite wins. Enumerating leaves nothing to infer.
 *
 * Each rewrite targets the shell's directory, never its `index.html`. Pages normalizes URLs to a
 * canonical form, and a rewrite pointing at `/vue-host/index.html` comes back as a 308 to
 * `/vue-host/` instead of serving the shell — which drops the route the deep link was carrying.
 *
 * A top-level 404.html is what turns off Pages' implicit single-page-app mode. That mode would
 * answer every unmatched path with the root shell at status 200, which would quietly break the
 * Vue shell's "Missing app" route — it exists to show the error-boundary slot, and only does so
 * because the entry fetch actually fails.
 */
function writePlatformFiles() {
  const rewrites = SHELLS.flatMap(({ dir, base }) =>
    declaredRoutes(dir).map((route) => `${base}${route}`.padEnd(24) + `${base} 200`),
  );

  writeFileSync(
    join(siteDir, '_redirects'),
    ['# generated by scripts/build-examples-site.mjs — the shells own their routing client-side', ...rewrites, ''].join(
      '\n',
    ),
  );

  writeFileSync(
    join(siteDir, '_headers'),
    [
      '# generated by scripts/build-examples-site.mjs',
      '# the micro app entries are meant to be loadable from any host, not only the two shells here',
      '/apps/*',
      '  Access-Control-Allow-Origin: *',
      '',
    ].join('\n'),
  );

  cpSync(join(examplesDir, '404.html'), join(siteDir, '404.html'));
}

function assertRoutesCovered() {
  for (const { dir, label } of SHELLS) {
    const routes = declaredRoutes(dir);
    if (routes.length === 0) {
      throw new Error(`${label}: could not read any route out of examples/${dir}/src/apps.ts — has its shape changed?`);
    }
    console.log(`  ${label}: ${routes.length} routes (${routes.join(', ')})`);
  }
}

console.log('Checking shell routes');
assertRoutesCovered();

rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });

console.log('\nBuilding shells');
SHELLS.forEach(buildShell);

console.log('\nBuilding micro apps');
MICRO_APPS.forEach(buildMicroApp);

console.log('\nBuilding standalone sandbox');
buildStandaloneSandbox();

console.log('\nWriting Cloudflare Pages files');
writePlatformFiles();

console.log(`\nSite ready at ${siteDir.replace(repoRoot + '/', '')}`);
