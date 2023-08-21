/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as path from 'path';

import {
  parseBrowserConfigString,
  TraceConfig,
  validateBrowserConfig,
  WindowSize,
} from './browser';
import {Config, urlFromLocalPath} from './config';
import * as defaults from './defaults';
import {Opts} from './flags';
import {Server} from './server';
import {
  BenchmarkSpec,
  LocalUrl,
  Measurement,
  PackageVersion,
  RemoteUrl,
} from './types';
import {isHttpUrl, throwUnreachable} from './util';
import {parsePackageVersions} from './versions';

/**
 * Derive the set of benchmark specifications we should run according to the
 * given options, which may require checking the layout on disk of the
 * benchmarks/ directory.
 */
export async function specsFromOpts(opts: Opts): Promise<BenchmarkSpec[]> {
  let windowSize: WindowSize;
  if (opts['window-size']) {
    const match = opts['window-size'].match(/^(\d+),(\d+)$/);
    if (match === null) {
      throw new Error(
        `Invalid --window-size flag, must match "width,height, " ` +
          `but was "${opts['window-size']}"`
      );
    }
    windowSize = {
      width: Number(match[1]),
      height: Number(match[2]),
    };
  } else {
    windowSize = {
      width: defaults.windowWidth,
      height: defaults.windowHeight,
    };
  }

  let trace: TraceConfig | undefined;
  if (opts['trace']) {
    const rawLogDir = opts['trace-log-dir'];
    trace = {
      categories: opts['trace-cat'].split(','),
      logDir: path.isAbsolute(rawLogDir)
        ? rawLogDir
        : path.join(process.cwd(), rawLogDir),
    };
  }

  const browserStrings = new Set(
    (opts.browser || defaults.browserName)
      .replace(/\s+/, '')
      .split(',')
      .filter((b) => b !== '')
  );
  if (browserStrings.size === 0) {
    throw new Error('At least one --browser must be specified');
  }
  const browsers = [...browserStrings].map((str) => {
    const config = {
      ...parseBrowserConfigString(str),
      windowSize,
    };
    if (trace) {
      config.trace = trace;
    }
    validateBrowserConfig(config);
    return config;
  });

  const specs: BenchmarkSpec[] = [];

  const versions: Array<PackageVersion | undefined> = parsePackageVersions(
    opts['package-version']
  );
  if (versions.length === 0) {
    versions.push(undefined);
  }

  let measurement: Measurement | undefined;
  if (opts.measure === 'callback') {
    measurement = {
      mode: 'callback',
    };
  } else if (opts.measure === 'fcp') {
    measurement = {
      mode: 'performance',
      entryName: 'first-contentful-paint',
    };
  } else if (opts.measure === 'global') {
    measurement = {
      mode: 'expression',
      expression:
        opts['measurement-expression'] || defaults.measurementExpression,
    };
  } else if (opts.measure !== undefined) {
    throwUnreachable(
      opts.measure,
      `Internal error: unknown measure ${JSON.stringify(opts.measure)}`
    );
  }

  // Benchmark paths/URLs are the bare arguments not associated with a flag, so
  // they are found in _unknown.
  for (const argStr of opts._unknown || []) {
    const arg = parseBenchmarkArgument(argStr);

    if (arg.kind === 'remote') {
      const url: RemoteUrl = {
        kind: 'remote',
        url: arg.url,
      };

      for (const browser of browsers) {
        const spec: BenchmarkSpec = {
          name: arg.alias || arg.url,
          browser,
          measurement: [
            measurement === undefined ? defaults.measurement(url) : measurement,
          ],
          url,
        };
        specs.push(spec);
      }
    } else {
      const root = opts.root || defaults.root;
      const urlPath = await urlFromLocalPath(root, arg.diskPath);
      let name = arg.alias;
      if (name === undefined) {
        const serverRelativePath = path.relative(root, arg.diskPath);
        name = serverRelativePath.replace(/\\/g, '/');
      }
      for (const browser of browsers) {
        for (const version of versions) {
          const url: LocalUrl = {
            kind: 'local',
            urlPath,
            queryString: arg.queryString,
            version,
          };
          const spec: BenchmarkSpec = {
            name,
            browser,
            measurement: [
              measurement === undefined
                ? defaults.measurement(url)
                : measurement,
            ],
            url,
          };
          specs.push(spec);
        }
      }
    }
  }

  return specs;
}

function parseBenchmarkArgument(
  str: string
):
  | {kind: 'remote'; url: string; alias?: string}
  | {kind: 'local'; diskPath: string; queryString: string; alias?: string} {
  if (isHttpUrl(str)) {
    // http://example.com
    return {
      kind: 'remote',
      url: str,
    };
  }

  if (str.includes('=')) {
    const eq = str.indexOf('=');
    const maybeUrl = str.substring(eq + 1);
    if (isHttpUrl(maybeUrl)) {
      // foo=http://example.com
      return {
        kind: 'remote',
        url: maybeUrl,
        alias: str.substring(0, eq),
      };
    }
  }

  let queryString = '';
  if (str.includes('?')) {
    // a/b.html?a=b
    // foo=a/b.html?a=b
    const q = str.indexOf('?');
    queryString = str.substring(q);
    str = str.substring(0, q);
  }

  let alias = undefined;
  if (str.includes('=')) {
    // foo=a/b.html?a=b
    // foo=a/b.html
    const eq = str.indexOf('=');
    alias = str.substring(0, eq);
    str = str.substring(eq + 1);
  }

  // a/b.html
  // a/b.html?a=b
  // foo=a/b.html
  // foo=a/b.html?a=b
  return {
    kind: 'local',
    alias,
    diskPath: str,
    queryString: queryString,
  };
}

export function specUrl(
  spec: BenchmarkSpec,
  servers: Map<BenchmarkSpec, Server>,
  config: Config
): string {
  if (spec.url.kind === 'remote') {
    return spec.url.url;
  }
  const server = servers.get(spec);
  if (server === undefined) {
    throw new Error('Internal error: no server for spec');
  }
  if (
    config.remoteAccessibleHost !== '' &&
    spec.browser.remoteUrl !== undefined
  ) {
    return (
      'http://' +
      config.remoteAccessibleHost +
      ':' +
      server.port +
      spec.url.urlPath +
      spec.url.queryString
    );
  }
  return server.url + spec.url.urlPath + spec.url.queryString;
}
