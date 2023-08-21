/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import * as path from 'path';
import ansi from 'ansi-escape-sequences';
import * as semver from 'semver';

import commandLineUsage from 'command-line-usage';

import {optDefs, parseFlags} from './flags';
import {BenchmarkSpec} from './types';
import {makeConfig} from './config';
import {Server} from './server';
import {ResultStatsWithDifferences} from './stats';
import {
  prepareVersionDirectory,
  makeServerPlans,
  installGitDependency,
} from './versions';
import {manualMode} from './manual';
import {Runner} from './runner';
import {runNpm} from './util';

const installedVersion = (): string =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(path.join('..', 'package.json')).version;

export async function main(
  argv: string[]
): Promise<Array<ResultStatsWithDifferences> | undefined> {
  // Don't block anything on a network query to NPM.
  const latestVersionPromise = latestVersionFromNpm();
  let results;

  try {
    results = await realMain(argv);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }

  try {
    notifyIfOutdated(await latestVersionPromise);
  } catch (e) {
    // Don't set a non-zero exit code just because the NPM query failed. Maybe
    // we're behind a firewall and can't contact NPM.
    console.error(`\nFailed to check NPM for latest version:\n${e}`);
  }

  return results;
}

async function latestVersionFromNpm(): Promise<string> {
  const stdout = await runNpm(['info', 'tachometer@latest', 'version']);
  return stdout.toString('utf8').trim();
}

function notifyIfOutdated(latestVersion: string) {
  const iv = installedVersion();
  if (semver.lt(iv, latestVersion)) {
    console.log(
      ansi.format(`
[bold magenta]{Update available!}
The latest version of tachometer is [green]{${latestVersion}}
You are running version [yellow]{${iv}}
See what's new at [cyan]{https://github.com/Polymer/tachometer/blob/master/CHANGELOG.md}`)
    );
  }
}

async function realMain(
  argv: string[]
): Promise<Array<ResultStatsWithDifferences> | undefined> {
  const opts = parseFlags(argv);

  if (opts.help) {
    console.log(
      commandLineUsage([
        {
          header: 'tach',
          content: `v${installedVersion()}\nhttps://github.com/PolymerLabs/tachometer`,
        },
        {
          header: 'Usage',
          content: `
Run a benchmark from a local file:
$ tach foo.html

Compare a benchmark with different URL parameters:
$ tach foo.html?i=1 foo.html?i=2

Benchmark index.html in a directory:
$ tach foo/bar

Benchmark a remote URL's First Contentful Paint time:
$ tach http://example.com
`,
        },
        {
          header: 'Options',
          optionList: optDefs,
        },
      ])
    );
    return;
  }

  if (opts.version) {
    console.log(installedVersion());
    return;
  }

  const config = await makeConfig(opts);

  if (config.legacyJsonFile) {
    console.log(
      `Please use --json-file instead of --save. ` +
        `--save will be removed in the next major version.`
    );
  }

  const {plans, gitInstalls} = await makeServerPlans(
    config.root,
    opts['npm-install-dir'],
    config.benchmarks
  );

  await Promise.all(
    gitInstalls.map((gitInstall) =>
      installGitDependency(gitInstall, config.forceCleanNpmInstall)
    )
  );

  const servers = new Map<BenchmarkSpec, Server>();
  const promises = [];
  for (const {npmInstalls, mountPoints, specs} of plans) {
    promises.push(
      ...npmInstalls.map((install) =>
        prepareVersionDirectory(install, config.forceCleanNpmInstall)
      )
    );
    promises.push(
      (async () => {
        const server = await Server.start({
          host: opts.host,
          ports: opts.port,
          root: config.root,
          npmInstalls,
          mountPoints,
          resolveBareModules: config.resolveBareModules,
          cache: config.mode !== 'manual',
        });
        for (const spec of specs) {
          servers.set(spec, server);
        }
      })()
    );
  }
  await Promise.all(promises);

  if (config.mode === 'manual') {
    await manualMode(config, servers);
  } else {
    const runner = new Runner(config, servers);
    try {
      return await runner.run();
    } finally {
      const allServers = new Set<Server>([...servers.values()]);
      await Promise.all([...allServers].map((server) => server.close()));
    }
  }
}
