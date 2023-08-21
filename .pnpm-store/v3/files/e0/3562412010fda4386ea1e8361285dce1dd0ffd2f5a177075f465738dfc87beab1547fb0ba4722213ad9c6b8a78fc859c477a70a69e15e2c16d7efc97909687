/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as childProcess from 'child_process';
import * as crypto from 'crypto';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import * as util from 'util';

const execFilePromise = util.promisify(childProcess.execFile);
const execPromise = util.promisify(childProcess.exec);

import {MountPoint} from './server';
import {
  BenchmarkSpec,
  GitDependency,
  NpmPackageJson,
  PackageDependencyMap,
  PackageVersion,
} from './types';
import {fileKind, runNpm, throwUnreachable} from './util';

interface GitDependencyWithTempDir extends GitDependency {
  tempDir: string;
  sha: string;
}

/**
 * Parse an array of strings of the form <package>@<version>.
 */
export function parsePackageVersions(flags: string[]): PackageVersion[] {
  const versions: PackageVersion[] = [];
  for (const flag of flags) {
    const match = flag.match(/^(?:(.+)=)?(.+)@(.+)$/);
    if (match === null) {
      throw new Error(`Invalid package format ${flag}`);
    }
    const [, label, dep, version] = match;
    versions.push({
      label: label || `${dep}@${version}`,
      dependencyOverrides: {
        [dep]: version,
      },
    });
  }
  return versions;
}

export interface ServerPlan {
  /** The benchmarks this server will handle. */
  specs: BenchmarkSpec[];
  /** NPM installations needed for this server. */
  npmInstalls: NpmInstall[];
  /** URL to disk path mappings. */
  mountPoints: MountPoint[];
}

export interface NpmInstall {
  installDir: string;
  packageJson: NpmPackageJson;
}

export async function makeServerPlans(
  benchmarkRoot: string,
  npmInstallRoot: string,
  specs: BenchmarkSpec[]
): Promise<{plans: ServerPlan[]; gitInstalls: GitDependencyWithTempDir[]}> {
  const depSwaps = new Map<
    string,
    {
      installDir: string;
      packageJsonPath: string;
      specs: BenchmarkSpec[];
      dependencies: PackageDependencyMap;
    }
  >();
  const defaultSpecs = [];
  const gitInstalls = new Map<string, GitDependencyWithTempDir>();
  for (const spec of specs) {
    if (spec.url.kind === 'remote') {
      // No server needed for remote URLs.
      continue;
    }
    if (spec.url.version === undefined) {
      defaultSpecs.push(spec);
      continue;
    }

    const diskPath = path.join(benchmarkRoot, spec.url.urlPath);
    const kind = await fileKind(diskPath);
    if (kind === undefined) {
      throw new Error(`No such file or directory ${diskPath}`);
    }
    const originalPackageJsonPath = await findPackageJsonPath(
      kind === 'file' ? path.dirname(diskPath) : diskPath
    );
    if (originalPackageJsonPath === undefined) {
      throw new Error(`Could not find a package.json for ${diskPath}`);
    }
    const originalPackageJson = (await fsExtra.readJson(
      originalPackageJsonPath
    )) as NpmPackageJson;

    const updatedDeps: PackageDependencyMap = {
      ...originalPackageJson.dependencies,
    };
    for (const pkg of Object.keys(spec.url.version.dependencyOverrides)) {
      const version = spec.url.version.dependencyOverrides[pkg];
      if (typeof version === 'string') {
        // NPM dependency syntax that can be handled directly by NPM without any
        // help from us. This includes NPM packages, file paths, git repos (but
        // not monorepos!), etc. (see
        // https://docs.npmjs.com/configuring-npm/package-json.html#dependencies)
        updatedDeps[pkg] = version;
      } else {
        switch (version.kind) {
          case 'git': {
            // NPM doesn't support directly installing from a sub-directory of a
            // git repo, like in monorepos, so we handle those cases ourselves.

            // If repo is a local relative path, we need to make it absolute.
            // Otherwise, when we run "npm install" in our temp directory, our
            // dependency will reference the wrong path.
            const repo = makeLocalRelativeGitRepoAbsolute(
              version.repo,
              process.cwd()
            );

            // Immediately resolve the git reference (branch, tag, etc.) to a
            // SHA and use that going forward, so that we never fall behind the
            // origin repo when re-using temp directories.
            const sha = looksLikeGitSha(version.ref)
              ? version.ref
              : await remoteResolveGitRefToSha(repo, version.ref);
            if (sha === undefined) {
              throw new Error(
                `Git repo ${version.repo} could not resolve ref "${version.ref}"`
              );
            }

            // This hash uniquely identifies a `git clone` directory for some
            // dependency at a particular SHA, with a particular setup routine.
            const gitInstallHash = hashStrings(
              // Include the tachometer version in case any changes or bugs
              // would affect how we do this installation.
              tachometerVersion,
              repo,
              sha,
              JSON.stringify(version.setupCommands)
            );
            const tempDir = path.join(npmInstallRoot, gitInstallHash);
            const tempPackageDir = version.subdir
              ? path.join(tempDir, version.subdir)
              : tempDir;
            updatedDeps[pkg] = tempPackageDir;
            // We're using a Map here because we want to de-duplicate git
            // installations that have the exact same parameters, since they can
            // be re-used across multiple benchmarks.
            gitInstalls.set(gitInstallHash, {...version, repo, tempDir, sha});
            break;
          }
          default: {
            throwUnreachable(
              version.kind,
              'Unknown dependency version kind: ' + version.kind
            );
          }
        }
      }
    }

    // This hash uniquely identifes the `npm install` location for some
    // `package.json` where some of its dependencies have been swapped.
    const depSwapHash = hashStrings(
      // Include the tachometer version in case any changes or bugs
      // would affect how we do this installation.
      tachometerVersion,
      originalPackageJsonPath,
      // Sort deps by package name for more temp-directory cache hits since
      // the order declared in the dependencies object doesn't matter.
      JSON.stringify(
        Object.entries(updatedDeps).sort(([pkgA], [pkgB]) =>
          pkgA.localeCompare(pkgB)
        )
      )
    );

    let swap = depSwaps.get(depSwapHash);
    if (swap === undefined) {
      swap = {
        specs: [],
        installDir: path.join(npmInstallRoot, depSwapHash),
        dependencies: updatedDeps,
        packageJsonPath: originalPackageJsonPath,
      };
      depSwaps.set(depSwapHash, swap);
    }
    swap.specs.push(spec);
  }

  const plans = [];

  if (defaultSpecs.length > 0) {
    plans.push({
      specs: defaultSpecs,
      npmInstalls: [],
      mountPoints: [
        {
          urlPath: `/`,
          diskPath: benchmarkRoot,
        },
      ],
    });
  }

  for (const {
    specs,
    installDir,
    dependencies,
    packageJsonPath,
  } of depSwaps.values()) {
    plans.push({
      specs,
      npmInstalls: [
        {
          installDir,
          packageJson: {
            private: true,
            dependencies,
          },
        },
      ],
      mountPoints: [
        {
          urlPath: path.posix.join(
            '/',
            path
              .relative(benchmarkRoot, path.dirname(packageJsonPath))
              .replace(path.win32.sep, '/'),
            'node_modules'
          ),
          diskPath: path.join(installDir, 'node_modules'),
        },
        {
          urlPath: `/`,
          diskPath: benchmarkRoot,
        },
      ],
    });
  }

  return {plans, gitInstalls: [...gitInstalls.values()]};
}

// TODO(aomarks) Some consolidation with install.ts may be possible.
async function findPackageJsonPath(
  startDir: string
): Promise<string | undefined> {
  let cur = path.resolve(startDir);
  while (true) {
    const possibleLocation = path.join(cur, 'package.json');
    if (await fsExtra.pathExists(possibleLocation)) {
      return possibleLocation;
    }
    const parentDir = path.resolve(cur, '..');
    if (parentDir === cur) {
      return undefined;
    }
    cur = parentDir;
  }
}

export function hashStrings(...strings: string[]) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(strings))
    .digest('hex');
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const tachometerVersion = require(path.join(
  __dirname,
  '..',
  'package.json'
)).version;

/**
 * Name of special file used to indicate that an NPM or git install directory
 * completed successfully.
 */
const installSuccessFile = '__TACHOMETER_INSTALL_SUCCESS__';

/**
 * Write the given package.json to the given directory and run "npm install" in
 * it. If the directory already exists, don't do anything except log.
 */
export async function prepareVersionDirectory(
  {installDir, packageJson}: NpmInstall,
  forceCleanInstall: boolean
): Promise<void> {
  if (forceCleanInstall) {
    await fsExtra.remove(installDir);
  } else if (await fsExtra.pathExists(installDir)) {
    if (await fsExtra.pathExists(path.join(installDir, installSuccessFile))) {
      console.log(`\nRe-using NPM install dir:\n ${installDir}\n`);
      return;
    } else {
      console.log(`\nCleaning up failed npm install:\n  ${installDir}\n`);
      await fsExtra.remove(installDir);
    }
  }

  console.log(`\nRunning npm install in temp dir:\n  ${installDir}\n`);
  await fsExtra.ensureDir(installDir);
  await fsExtra.writeFile(
    path.join(installDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  await runNpm(['install'], {cwd: installDir});
  await fsExtra.writeFile(path.join(installDir, installSuccessFile), '');
}

/**
 * Check out the given commit from the given git repo, and run setup commands.
 * If the directory already exists, don't do anything except log.
 */
export async function installGitDependency(
  gitInstall: GitDependencyWithTempDir,
  forceCleanInstall: boolean
): Promise<void> {
  if (forceCleanInstall) {
    await fsExtra.remove(gitInstall.tempDir);
  } else if (await fsExtra.pathExists(gitInstall.tempDir)) {
    if (
      await fsExtra.pathExists(
        path.join(gitInstall.tempDir, installSuccessFile)
      )
    ) {
      console.log(
        `\nRe-using git checkout:\n` +
          `  ${gitInstall.repo}#${gitInstall.ref}\n` +
          `  ${gitInstall.tempDir}\n`
      );
      return;
    } else {
      console.log(
        `\nCleaning up failed git checkout:\n  ${gitInstall.tempDir}\n`
      );
      await fsExtra.remove(gitInstall.tempDir);
    }
  }

  console.log(
    `\nFetching git commit to temp dir:\n` +
      `  ${gitInstall.repo}#${gitInstall.ref}\n` +
      `  ${gitInstall.tempDir}\n`
  );
  // This approach only requires us to hit the remote repo once (as opposed to
  // using `git clone`, which doesn't support fetching only one commit).
  await fsExtra.ensureDir(gitInstall.tempDir);
  const cwdOpts = {cwd: gitInstall.tempDir};
  await execFilePromise('git', ['init'], cwdOpts);
  await execFilePromise(
    'git',
    ['remote', 'add', 'origin', gitInstall.repo],
    cwdOpts
  );
  await execFilePromise(
    'git',
    ['fetch', 'origin', '--depth=1', gitInstall.sha],
    cwdOpts
  );
  await execFilePromise('git', ['checkout', gitInstall.sha], cwdOpts);

  for (const setupCommand of gitInstall.setupCommands || []) {
    console.log(`\nRunning setup command:\n  ${setupCommand}\n`);
    await execPromise(setupCommand, cwdOpts);
  }
  await fsExtra.writeFile(
    path.join(gitInstall.tempDir, installSuccessFile),
    ''
  );
}

/**
 * Return whether the given string looks like a 40-characters of hexadecimal,
 * i.e. a valid full length git commit SHA-1 hash.
 */
function looksLikeGitSha(ref: string): boolean {
  return ref.match(/^[a-fA-F0-9]{40}$/) !== null;
}

/**
 * Use the `git ls-remote` command to remotely query the given git repo, and
 * resolve the given ref (e.g. a branch or tag) to a commit SHA. Returns
 * `undefined` if the ref does not resolve to anything in the repo. Throws if
 * the repo is invalid or errors.
 */
async function remoteResolveGitRefToSha(
  repo: string,
  ref: string
): Promise<string | undefined> {
  const {stdout} = await execFilePromise('git', [
    'ls-remote',
    repo,
    '--symref',
    ref,
  ]);
  if (stdout.trim() === '') {
    return undefined;
  }
  const parts = stdout.trim().split(/\W/);
  if (parts.length > 0 && looksLikeGitSha(parts[0])) {
    return parts[0];
  }
  throw new Error(
    `Could not parse output of \`git ls-remote ${repo} --symref ${ref}\`:\n${stdout}`
  );
}

function makeLocalRelativeGitRepoAbsolute(repo: string, root: string): string {
  if (repo.startsWith('.') || repo.startsWith('file://.')) {
    const rel = repo.replace(/^file:\/\//, '');
    return path.resolve(root, rel);
  }
  return repo;
}
