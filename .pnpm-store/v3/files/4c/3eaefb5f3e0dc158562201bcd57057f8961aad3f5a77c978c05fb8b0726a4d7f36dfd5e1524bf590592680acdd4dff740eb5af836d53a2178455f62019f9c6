/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as os from 'os';
import * as path from 'path';

import {supportedBrowsers} from './browser';
import * as defaults from './defaults';
import {CommandLineMeasurements, measurements} from './types';

import commandLineArgs = require('command-line-args');
import commandLineUsage = require('command-line-usage');

export const defaultInstallDir = path.join(
  os.tmpdir(),
  'tachometer',
  'versions'
);

export const optDefs: commandLineUsage.OptionDefinition[] = [
  {
    name: 'help',
    description: 'Show documentation',
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'version',
    description: 'Show the installed version of tachometer',
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'root',
    description: `Root directory to search for benchmarks (default ${defaults.root})`,
    type: String,
  },
  {
    name: 'host',
    description: 'Which host to run on',
    type: String,
    defaultValue: '127.0.0.1',
  },
  {
    name: 'remote-accessible-host',
    description:
      'When using a browser over a remote WebDriver connection, ' +
      'the URL that those browsers should use to access the local ' +
      'tachometer server (default to value of --host).',
    type: String,
    defaultValue: '',
  },
  {
    name: 'port',
    description:
      'Which ports to run on (comma-delimited preference list, ' +
      '0 for random, default [8080, 8081, ..., 0])',
    type: (flag: string) => flag.split(',').map(Number),
    defaultValue: [8080, 8081, 8082, 8083, 0],
  },
  {
    name: 'config',
    description: 'Path to JSON config file (see README for format)',
    type: String,
    defaultValue: '',
  },
  {
    name: 'package-version',
    description: 'Specify an NPM package version to swap in (see README)',
    alias: 'p',
    type: String,
    defaultValue: [],
    lazyMultiple: true,
  },
  {
    name: 'npm-install-dir',
    description:
      `Where to install custom package versions ` +
      `(default ${defaultInstallDir})`,
    type: String,
    defaultValue: defaultInstallDir,
  },
  {
    name: 'force-clean-npm-install',
    description:
      `Always do a from-scratch NPM install when using custom ` +
      `package versions. If false (the default), NPM install directories ` +
      `will be re-used as long as the dependency versions haven't changed.`,
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'browser',
    description:
      'Which browsers to launch in automatic mode, ' +
      `comma-delimited (${[...supportedBrowsers].join(', ')}) ` +
      `(default ${defaults.browserName})`,
    alias: 'b',
    type: String,
  },
  {
    name: 'sample-size',
    description:
      'Minimum number of times to run each benchmark' +
      ` (default ${defaults.sampleSize})`,
    alias: 'n',
    type: Number,
  },
  {
    name: 'manual',
    description: "Don't run automatically, just show URLs and collect results",
    alias: 'm',
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'json-file',
    description: 'Save benchmark results to this JSON file.',
    type: String,
    defaultValue: '',
  },
  {
    name: 'save',
    description:
      'Deprecated. Use --json-file instead. ' +
      'Save benchmark JSON data to this file',
    alias: 's',
    type: String,
    defaultValue: '',
  },
  {
    name: 'csv-file',
    description: 'Save benchmark results to this CSV file.',
    type: String,
    defaultValue: '',
  },
  {
    name: 'csv-file-raw',
    description: 'Save raw benchmark measurement samples to this CSV file.',
    type: String,
    defaultValue: '',
  },
  {
    name: 'measure',
    description:
      'Which time interval to measure. Options:\n' +
      '* callback: call bench.start() and bench.stop() (default)\n' +
      '*   global: set window.tachometerResult = <milliseconds>\n' +
      '*      fcp: first contentful paint',
    type: (str: string): string => {
      if (!measurements.has(str)) {
        throw new Error(
          `Expected --measure flag to be one of: ` +
            `${[...measurements.values()].join(', ')} ` +
            `but was '${str}'`
        );
      }
      return str;
    },
  },
  {
    name: 'measurement-expression',
    description:
      'Javascript expression to poll from page to retrieve global\n' +
      'result. Only valid when --measure=global.',
    type: String,
    defaultValue: defaults.measurementExpression,
  },
  {
    name: 'auto-sample-conditions',
    description:
      'The degrees of difference to try and resolve when auto-sampling ' +
      '(milliseconds, comma-delimited, optionally signed, ' +
      `default ${defaults.autoSampleConditions.join(',')})`,
    type: String,
  },
  {
    name: 'horizon',
    description: 'Deprecated alias for --auto-sample-conditions',
    type: String,
  },
  {
    name: 'timeout',
    description:
      'The maximum number of minutes to spend auto-sampling ' +
      `(default ${defaults.timeout}).`,
    type: Number,
  },
  {
    name: 'github-check',
    description:
      'Post benchmark results as a GitHub Check. A JSON object ' +
      'with properties appId, installationId, repo, and commit.',
    type: String,
    defaultValue: '',
  },
  {
    name: 'resolve-bare-modules',
    description:
      'Whether to automatically convert ES module imports with ' +
      'bare module specifiers to paths (default true).',
    type: booleanString('resolve-bare-modules'),
    typeLabel: 'true|false',
  },
  {
    name: 'window-size',
    description:
      `"width,height" in pixels of the window to open for all browsers` +
      ` (default "${defaults.windowWidth},${defaults.windowHeight}").`,
    type: String,
  },
  {
    name: 'trace',
    description: '',
    type: Boolean,
  },
  {
    name: 'trace-log-dir',
    description: '',
    type: String,
    defaultValue: defaults.traceLogDir,
  },
  {
    name: 'trace-cat',
    description: '',
    type: String,
    defaultValue: defaults.traceCategories.join(','),
  },
];

export interface Opts {
  help: boolean;
  version: boolean;
  root: string | undefined;
  host: string;
  port: number[];
  config: string;
  'package-version': string[];
  'npm-install-dir': string;
  browser: string | undefined;
  'sample-size': number | undefined;
  manual: boolean;
  save: string;
  measure: CommandLineMeasurements | undefined;
  'measurement-expression': string | undefined;
  'auto-sample-conditions': string | undefined;
  timeout: number | undefined;
  'github-check': string;
  'resolve-bare-modules': boolean | undefined;
  'remote-accessible-host': string;
  'window-size': string;
  'force-clean-npm-install': boolean;
  'csv-file': string;
  'csv-file-raw': string;
  'json-file': string;
  trace: boolean;
  'trace-log-dir': string;
  'trace-cat': string;

  // Extra arguments not associated with a flag are put here. These are our
  // benchmark names/URLs.
  //
  // Note we could also define a flag and set `defaultOption: true`, but then
  // there would be two ways of specifying benchmark names/URLs. Also note the
  // _unknown property is defined in commandLineArgs.CommandLineOptions, but we
  // don't want to extend that because it includes `[propName: string]: any`.
  _unknown?: string[];
}

interface OptsWithDeprecated extends Opts {
  horizon: string | undefined;
}

/**
 * Boolean flags that default to true are not supported
 * (https://github.com/75lb/command-line-args/issues/71).
 */
function booleanString(flagName: string): (str: string) => boolean {
  return (str: string) => {
    if (str === 'true' || str === '') {
      return true;
    } else if (str === 'false') {
      return false;
    }
    throw new Error(
      `Invalid --${flagName}. Expected true or false but was ${str}.`
    );
  };
}

/**
 * Parse the given CLI argument list.
 */
export function parseFlags(argv: string[]): Opts {
  const opts = commandLineArgs(optDefs, {
    partial: true,
    argv,
  }) as OptsWithDeprecated;
  // Note that when a flag is used but not set to a value (i.e. "tachometer
  // --resolve-bare-modules ..."), then the type function is not invoked, and
  // the value will be null. Since in default-false cases (which aren't
  // supported by command-line-args) that form should be true, we need to fix
  // those cases up after parsing.
  if (opts['resolve-bare-modules'] === null) {
    opts['resolve-bare-modules'] = true;
  }
  if (opts['horizon']) {
    if (opts['auto-sample-conditions']) {
      throw new Error(
        'Please use only --auto-sample-conditions and not --horizons.'
      );
    }
    console.warn(
      '\nNOTE: The --horizon flag has been renamed to --auto-sample-conditions.\n' +
        'Please use --auto-sample-conditions going forward.\n'
    );
    opts['auto-sample-conditions'] = opts['horizon'];
    delete opts['horizon'];
  }
  return opts as Opts;
}
