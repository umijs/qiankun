/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as fsExtra from 'fs-extra';
import * as path from 'path';

import {fcpBrowsers} from './browser';
import {parseConfigFile, writeBackSchemaIfNeeded} from './configfile';
import * as defaults from './defaults';
import {Opts} from './flags';
import {CheckConfig, parseGithubCheckFlag} from './github';
import {specsFromOpts} from './specs';
import {AutoSampleConditions} from './stats';
import {BenchmarkSpec} from './types';
import {fileKind} from './util';

/**
 * Validated and fully specified configuration.
 */
export interface Config {
  root: string;
  sampleSize: number;
  timeout: number;
  benchmarks: BenchmarkSpec[];
  autoSampleConditions: AutoSampleConditions;
  mode: 'automatic' | 'manual';
  jsonFile: string;
  // TODO(aomarks) Remove this in next major version.
  legacyJsonFile: string;
  githubCheck?: CheckConfig;
  resolveBareModules: boolean;
  remoteAccessibleHost: string;
  forceCleanNpmInstall: boolean;
  csvFileStats: string;
  csvFileRaw: string;
}

export async function makeConfig(opts: Opts): Promise<Config> {
  // These options are only controlled by flags.
  const baseConfig: Partial<Config> = {
    mode: (opts.manual === true ? 'manual' : 'automatic') as
      | 'manual'
      | 'automatic',
    jsonFile: opts['json-file'],
    legacyJsonFile: opts['save'],
    csvFileStats: opts['csv-file'],
    csvFileRaw: opts['csv-file-raw'],
    forceCleanNpmInstall: opts['force-clean-npm-install'],
    githubCheck: opts['github-check']
      ? parseGithubCheckFlag(opts['github-check'])
      : undefined,
    remoteAccessibleHost: opts['remote-accessible-host'],
  };

  let config: Config;
  if (opts.config) {
    if (opts.root !== undefined) {
      throw new Error('--root cannot be specified when using --config');
    }
    if (opts.browser !== undefined) {
      throw new Error('--browser cannot be specified when using --config');
    }
    if (opts['sample-size'] !== undefined) {
      throw new Error('--sample-size cannot be specified when using --config');
    }
    if (opts.timeout !== undefined) {
      throw new Error('--timeout cannot be specified when using --config');
    }
    if (opts['auto-sample-conditions'] !== undefined) {
      throw new Error(
        '--auto-sample-conditions cannot be specified when using --config'
      );
    }
    if (opts.measure !== undefined) {
      throw new Error('--measure cannot be specified when using --config');
    }
    if (opts['resolve-bare-modules'] !== undefined) {
      throw new Error(
        '--resolve-bare-modules cannot be specified when using --config'
      );
    }
    if (opts['window-size'] !== undefined) {
      throw new Error('--window-size cannot be specified when using --config');
    }
    const rawConfigObj = await fsExtra.readJson(opts.config);
    const validatedConfigObj = await parseConfigFile(rawConfigObj);

    await writeBackSchemaIfNeeded(rawConfigObj, opts.config);

    config = applyDefaults({
      ...baseConfig,
      ...validatedConfigObj,
    });
  } else {
    config = applyDefaults({
      ...baseConfig,
      root: opts.root,
      sampleSize: opts['sample-size'],
      timeout: opts.timeout,
      autoSampleConditions:
        opts['auto-sample-conditions'] !== undefined
          ? parseAutoSampleConditions(opts['auto-sample-conditions'].split(','))
          : undefined,
      benchmarks: await specsFromOpts(opts),
      resolveBareModules: opts['resolve-bare-modules'],
    });
  }

  if (config.sampleSize <= 1) {
    throw new Error('--sample-size must be > 1');
  }

  if (config.timeout < 0) {
    throw new Error('--timeout must be >= 0');
  }

  if (config.benchmarks.length === 0) {
    throw new Error('No benchmarks matched with the given flags');
  }

  for (const spec of config.benchmarks) {
    for (const measurement of spec.measurement) {
      if (
        measurement.mode === 'performance' &&
        measurement.entryName === 'first-contentful-paint' &&
        !fcpBrowsers.has(spec.browser.name)
      ) {
        throw new Error(
          `Browser ${spec.browser.name} does not support the ` +
            `first contentful paint (FCP) measurement`
        );
      }
    }
  }

  return config;
}

export function applyDefaults(partial: Partial<Config>): Config {
  return {
    benchmarks: partial.benchmarks !== undefined ? partial.benchmarks : [],
    csvFileStats:
      partial.csvFileStats !== undefined ? partial.csvFileStats : '',
    csvFileRaw: partial.csvFileRaw !== undefined ? partial.csvFileRaw : '',
    forceCleanNpmInstall:
      partial.forceCleanNpmInstall !== undefined
        ? partial.forceCleanNpmInstall
        : defaults.forceCleanNpmInstall,
    githubCheck: partial.githubCheck,
    autoSampleConditions:
      partial.autoSampleConditions !== undefined
        ? partial.autoSampleConditions
        : parseAutoSampleConditions([...defaults.autoSampleConditions]),
    jsonFile: partial.jsonFile !== undefined ? partial.jsonFile : '',
    legacyJsonFile:
      partial.legacyJsonFile !== undefined ? partial.legacyJsonFile : '',
    sampleSize:
      partial.sampleSize !== undefined
        ? partial.sampleSize
        : defaults.sampleSize,
    mode: partial.mode !== undefined ? partial.mode : defaults.mode,
    remoteAccessibleHost:
      partial.remoteAccessibleHost !== undefined
        ? partial.remoteAccessibleHost
        : '',
    resolveBareModules:
      partial.resolveBareModules !== undefined
        ? partial.resolveBareModules
        : defaults.resolveBareModules,
    root: partial.root !== undefined ? partial.root : defaults.root,
    timeout: partial.timeout !== undefined ? partial.timeout : defaults.timeout,
  };
}

/**
 * Derives the URL that we'll use to benchmark using the given HTML file or
 * directory on disk, relative to the root directory we'll be serving. Throws if
 * it's a file that doesn't exist, or a directory without an index.html.
 */
export async function urlFromLocalPath(
  rootDir: string,
  diskPath: string
): Promise<string> {
  const serverRelativePath = path.relative(rootDir, diskPath);
  if (serverRelativePath.startsWith('..')) {
    throw new Error(
      'File or directory is not accessible from server root: ' + diskPath
    );
  }

  const kind = await fileKind(diskPath);
  if (kind === undefined) {
    throw new Error(`No such file or directory: ${diskPath}`);
  }

  let urlPath = `/${serverRelativePath.replace(path.win32.sep, '/')}`;
  if (kind === 'dir') {
    if ((await fileKind(path.join(diskPath, 'index.html'))) !== 'file') {
      throw new Error(`Directory did not contain an index.html: ${diskPath}`);
    }
    // We need a trailing slash when serving a directory. Our static server
    // will serve index.html at both /foo and /foo/, without redirects. But
    // these two forms will have baseURIs that resolve relative URLs
    // differently, and we want the form that would work the same as
    // /foo/index.html.
    urlPath += '/';
  }
  return urlPath;
}

/**
 * Parse auto sample condition strings.
 */
export function parseAutoSampleConditions(
  strs: string[]
): AutoSampleConditions {
  const absolute = new Set<number>();
  const relative = new Set<number>();
  for (const str of strs) {
    if (!str.match(/^[-+]?(\d*\.)?\d+(ms|%)$/)) {
      throw new Error(`Invalid auto sample condition ${str}`);
    }

    let num;
    let absOrRel;
    const isPercent = str.endsWith('%');
    if (isPercent === true) {
      num = Number(str.slice(0, -1)) / 100;
      absOrRel = relative;
    } else {
      // Otherwise ends with "ms".
      num = Number(str.slice(0, -2)); // Note that Number("+1") === 1
      absOrRel = absolute;
    }

    if (str.startsWith('+') || str.startsWith('-') || num === 0) {
      // If the sign was explicit (e.g. "+0.1", "-0.1") then we're only
      // interested in that signed condition.
      absOrRel.add(num);
    } else {
      // Otherwise (e.g. "0.1") we're interested in the condition as a
      // difference in either direction.
      absOrRel.add(-num);
      absOrRel.add(num);
    }
  }
  return {
    absolute: [...absolute].sort((a, b) => a - b),
    relative: [...relative].sort((a, b) => a - b),
  };
}
