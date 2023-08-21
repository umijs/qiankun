/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as fsExtra from 'fs-extra';
import * as jsonschema from 'jsonschema';
import * as path from 'path';
import sanitizeFileName from 'sanitize-filename';

import {
  BrowserConfig,
  BrowserName,
  parseBrowserConfigString,
  validateBrowserConfig,
} from './browser';
import {Config, parseAutoSampleConditions, urlFromLocalPath} from './config';
import * as defaults from './defaults';
import {makeUniqueSpecLabelFn} from './format';
import {
  BenchmarkSpec,
  ExtendedPackageDependencyMap,
  Measurement,
  measurements,
} from './types';
import {isHttpUrl} from './util';

/**
 * Expected format of the top-level JSON config file. Note this interface is
 * used to generate the JSON schema for validation.
 */
export interface ConfigFile {
  /**
   * Root directory to serve benchmarks from (default current directory).
   */
  root?: string;

  /**
   * Minimum number of times to run each benchmark (default 50).
   * @TJS-type integer
   * @TJS-minimum 2
   */
  sampleSize?: number;

  /**
   * The maximum number of minutes to spend auto-sampling (default 3).
   * @TJS-minimum 0
   */
  timeout?: number;

  /**
   * The degrees of difference to try and resolve when auto-sampling
   * (e.g. 0ms, +1ms, -1ms, 0%, +1%, -1%, default 0%).
   */
  autoSampleConditions?: string[];

  /**
   * Deprecated alias for autoSampleConditions.
   */
  horizons?: string[];

  /**
   * Benchmarks to run.
   * @TJS-minItems 1
   */
  benchmarks: ConfigFileBenchmark[];

  /**
   * Whether to automatically convert ES module imports with bare module
   * specifiers to paths.
   */
  resolveBareModules?: boolean;

  /**
   * An optional reference to the JSON Schema for this file.
   *
   * If none is given, and the file is a valid tachometer config file,
   * tachometer will write back to the config file to give this a value.
   */
  $schema?: string;
}

/**
 * Expected format of a benchmark in a JSON config file.
 */
interface ConfigFileBenchmark {
  /**
   * A fully qualified URL, or a local path to an HTML file or directory. If a
   * directory, must contain an index.html. Query parameters are permitted on
   * local paths (e.g. 'my/benchmark.html?foo=bar').
   */
  url?: string;

  /**
   * An optional label for this benchmark. Defaults to the URL.
   */
  name?: string;

  /**
   * Which browser to run the benchmark in.
   *
   * Options:
   *   - chrome (default)
   *   - chrome-headless
   *   - firefox
   *   - firefox-headless
   *   - safari
   *   - edge
   *   - ie
   */
  browser?: string | BrowserConfigs;

  /**
   * Which time interval to measure.
   *
   * Options:
   *   - callback: bench.start() to bench.stop() (default for local paths)
   *   - fcp: first contentful paint (default for fully qualified URLs)
   *   - global: result returned from window.tachometerResult (or custom
   *       expression set via measurementExpression)
   *   - {
   *       performanceEntry: {
   *         //
   * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEntry/name
   *         name: string;
   *       }
   *     }
   */
  measurement?: ConfigFileMeasurement;

  /**
   * Expression to use to retrieve global result.  Defaults to
   * `window.tachometerResult`.
   */
  measurementExpression?: string;

  /**
   * Optional NPM dependency overrides to apply and install. Only supported with
   * local paths.
   */
  packageVersions?: ConfigFilePackageVersion;

  /**
   * Recursively expand this benchmark configuration with any number of
   * variations. Useful for testing the same base configuration with e.g.
   * multiple browers or package versions.
   */
  expand?: ConfigFileBenchmark[];
}

type ConfigFileMeasurement =
  | 'callback'
  | 'fcp'
  | 'global'
  | Measurement
  | Array<Measurement>;

type BrowserConfigs =
  | ChromeConfig
  | FirefoxConfig
  | SafariConfig
  | EdgeConfig
  | IEConfig;

interface BrowserConfigBase {
  /**
   * Name of the browser:
   *
   * Options:
   *   - chrome
   *   - firefox
   *   - safari
   *   - edge
   *   - ie
   */
  name: BrowserName;

  /**
   * A remote WebDriver server HTTP address to launch the browser from.
   */
  remoteUrl?: string;

  /**
   * The size of new windows created from this browser. Defaults to 1024x768.
   */
  windowSize?: WindowSize;
}

interface WindowSize {
  /**
   * Width of the browser window in pixels. Defaults to 1024.
   *
   * @TJS-type integer
   * @TJS-minimum 0
   */
  width: number;

  /**
   * Height of the browser window in pixels. Defaults to 768.
   *
   * @TJS-type integer
   * @TJS-minimum 0
   */
  height: number;
}

interface ChromeConfig extends BrowserConfigBase {
  name: 'chrome';

  /**
   * Whether to launch the headless (no GUI) version of this browser.
   */
  headless?: boolean;

  /**
   * Path to the binary to use when launching this browser, instead of the
   * default one.
   */
  binary?: string;

  /**
   * Additional command-line arguments to pass when launching the browser.
   */
  addArguments?: string[];

  /**
   * Command-line arguments that WebDriver normally adds by default when
   * launching the browser, which you would like to omit.
   */
  removeArguments?: string[];

  /**
   * Optional CPU Throttling rate. (1 is no throttle, 2 is 2x slowdown,
   * etc). This is currently only supported in headless mode.
   * @TJS-minimum 1
   */
  cpuThrottlingRate?: number;

  /**
   * Optional config to turn on performance tracing.
   */
  trace?: TraceConfig | true;

  /**
   * Path to a profile directory to use instead of the default temporary fresh
   * one.
   */
  profile?: string;
}

/**
 * Configuration to turn on performance tracing
 */
interface TraceConfig {
  /**
   * The tracing categories the browser should log. See Tachometer readme for a
   * description of available categories. The source of the categories in
   * Chromium can be found here: https://chromium.googlesource.com/chromium/src/+/master/base/trace_event/builtin_categories.h
   */
  categories?: string[];

  /**
   * The directory to log performance traces to
   */
  logDir?: string;
}

interface FirefoxConfig extends BrowserConfigBase {
  name: 'firefox';

  /**
   * Whether to launch the headless (no GUI) version of this browser.
   */
  headless?: boolean;

  /**
   * Path to the binary to use when launching this browser, instead of the
   * default one.
   */
  binary?: string;

  /**
   * Additional command-line arguments to pass when launching the browser.
   */
  addArguments?: string[];

  /**
   * Advanced preferences that are usually set from the about:config page
   * in Firefox (see
   * https://support.mozilla.org/en-US/kb/about-config-editor-firefox).
   */
  preferences?: {[name: string]: string | number | boolean};

  /**
   * Path to a profile directory to use instead of the default temporary fresh
   * one.
   */
  profile?: string;
}

interface SafariConfig extends BrowserConfigBase {
  name: 'safari';
}

interface EdgeConfig extends BrowserConfigBase {
  name: 'edge';
}

interface IEConfig extends BrowserConfigBase {
  name: 'ie';
}

interface ConfigFilePackageVersion {
  /**
   * Required label to identify this version map.
   */
  label: string;

  /**
   * Map from NPM package to version. Any version syntax supported by NPM is
   * supported here.
   */
  dependencies: ExtendedPackageDependencyMap;
}

/**
 * Validate the given JSON object parsed from a config file, and expand it into
 * a fully specified configuration.
 */
export async function parseConfigFile(
  parsedJson: unknown
): Promise<Partial<Config>> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const schema = require('../config.schema.json');
  const result = jsonschema.validate(parsedJson, schema);
  if (result.errors.length > 0) {
    throw new Error(
      [...new Set(result.errors.map(customizeJsonSchemaError))].join('\n')
    );
  }
  const validated = parsedJson as ConfigFile;
  const root = validated.root || '.';
  const benchmarks: BenchmarkSpec[] = [];
  for (const benchmark of validated.benchmarks) {
    for (const expanded of applyExpansions(benchmark)) {
      benchmarks.push(applyDefaults(await parseBenchmark(expanded, root)));
    }
  }

  // Update trace logDir with label per spec
  const labelFn = makeUniqueSpecLabelFn(benchmarks);
  for (const spec of benchmarks) {
    if (spec.browser.trace !== undefined) {
      spec.browser.trace.logDir = path.join(
        spec.browser.trace.logDir,
        sanitizeFileName(labelFn(spec))
      );
    }
  }

  if (validated.horizons !== undefined) {
    if (validated.autoSampleConditions !== undefined) {
      throw new Error(
        'Please use only "autoSampleConditions" and not "horizons".'
      );
    }
    console.warn(
      '\nNOTE: The "horizons" setting has been renamed to "autoSampleConditions".\n' +
        'Please rename it.\n'
    );
    validated.autoSampleConditions = validated.horizons;
  }

  return {
    root,
    sampleSize: validated.sampleSize,
    timeout: validated.timeout,
    autoSampleConditions:
      validated.autoSampleConditions !== undefined
        ? parseAutoSampleConditions(validated.autoSampleConditions)
        : undefined,
    benchmarks,
    resolveBareModules: validated.resolveBareModules,
  };
}

/**
 * Some of the automatically generated jsonschema errors are unclear, e.g. when
 * there is a union of complex types they are reported as "[schema1],
 * [schema2]" etc.
 */
function customizeJsonSchemaError(error: jsonschema.ValidationError): string {
  let str;
  if (error.property.match(/^instance\.benchmarks\[\d+\]\.measurement$/)) {
    str =
      `${error.property} is not any of: ${[...measurements].join(', ')}` +
      ' or an object like `performanceEntry: string`';
  } else {
    str = error.toString();
  }
  return str.replace(/^instance/, 'config');
}

async function parseBenchmark(
  benchmark: ConfigFileBenchmark,
  root: string
): Promise<Partial<BenchmarkSpec>> {
  const spec: Partial<BenchmarkSpec> = {};

  if (benchmark.name !== undefined) {
    spec.name = benchmark.name;
  }

  if (benchmark.browser !== undefined) {
    let browser;
    if (typeof benchmark.browser === 'string') {
      browser = {
        ...parseBrowserConfigString(benchmark.browser),
        windowSize: {
          width: defaults.windowWidth,
          height: defaults.windowHeight,
        },
      };
    } else {
      browser = parseBrowserObject(benchmark.browser);
    }
    validateBrowserConfig(browser);
    spec.browser = browser;
  }

  if (benchmark.measurement === 'callback') {
    spec.measurement = [
      {
        mode: 'callback',
      },
    ];
  } else if (benchmark.measurement === 'fcp') {
    spec.measurement = [
      {
        mode: 'performance',
        entryName: 'first-contentful-paint',
      },
    ];
  } else if (benchmark.measurement === 'global') {
    spec.measurement = [
      {
        mode: 'expression',
        expression:
          benchmark.measurementExpression || defaults.measurementExpression,
      },
    ];
  } else if (Array.isArray(benchmark.measurement)) {
    spec.measurement = benchmark.measurement;
  } else if (benchmark.measurement !== undefined) {
    spec.measurement = [benchmark.measurement];
  }

  const url = benchmark.url;
  if (url !== undefined) {
    if (isHttpUrl(url)) {
      spec.url = {
        kind: 'remote',
        url,
      };
    } else {
      let urlPath, queryString;
      const q = url.indexOf('?');
      if (q !== -1) {
        urlPath = url.substring(0, q);
        queryString = url.substring(q);
      } else {
        urlPath = url;
        queryString = '';
      }

      spec.url = {
        kind: 'local',
        urlPath: await urlFromLocalPath(root, urlPath),
        queryString,
      };

      if (benchmark.packageVersions !== undefined) {
        spec.url.version = {
          label: benchmark.packageVersions.label,
          dependencyOverrides: benchmark.packageVersions.dependencies,
        };
      }
    }
  }

  return spec;
}

function parseBrowserObject(config: BrowserConfigs): BrowserConfig {
  const parsed: BrowserConfig = {
    name: config.name,
    headless: ('headless' in config && config.headless) || defaults.headless,
    windowSize: ('windowSize' in config && config.windowSize) || {
      width: defaults.windowWidth,
      height: defaults.windowHeight,
    },
  };

  if ('cpuThrottlingRate' in config) {
    parsed.cpuThrottlingRate = config.cpuThrottlingRate;
  }
  if (config.remoteUrl) {
    parsed.remoteUrl = config.remoteUrl;
  }
  if ('binary' in config && config.binary) {
    parsed.binary = config.binary;
  }
  if ('addArguments' in config && config.addArguments) {
    parsed.addArguments = config.addArguments;
  }
  if ('removeArguments' in config && config.removeArguments) {
    parsed.removeArguments = config.removeArguments;
  }
  if ('preferences' in config && config.preferences) {
    parsed.preferences = config.preferences;
  }
  if ('trace' in config && config.trace !== undefined) {
    if (config.trace === true) {
      parsed.trace = {
        categories: defaults.traceCategories,
        logDir: defaults.traceLogDir,
      };
    } else if (typeof config.trace === 'object') {
      parsed.trace = {
        categories: config.trace.categories ?? defaults.traceCategories,
        logDir:
          config.trace.logDir === undefined
            ? defaults.traceLogDir
            : path.isAbsolute(config.trace.logDir)
            ? config.trace.logDir
            : path.join(process.cwd(), config.trace.logDir),
      };
    }
  }
  if ('profile' in config && config.profile !== undefined) {
    parsed.profile = config.profile;
  }
  return parsed;
}

function applyExpansions(bench: ConfigFileBenchmark): ConfigFileBenchmark[] {
  if (bench.expand === undefined || bench.expand.length === 0) {
    return [bench];
  }
  const expanded = [];
  for (const expansion of bench.expand) {
    for (const expandedBench of applyExpansions(expansion)) {
      expanded.push({
        ...bench,
        ...expandedBench,
      });
    }
  }
  return expanded;
}

function applyDefaults(partialSpec: Partial<BenchmarkSpec>): BenchmarkSpec {
  const url = partialSpec.url;
  let {name, measurement, browser} = partialSpec;
  if (url === undefined) {
    // Note we can't validate this with jsonschema, because we only need to
    // ensure we have a URL after recursive expansion; so at any given level
    // the URL could be optional.
    throw new Error('No URL specified');
  }
  if (url.kind === 'remote') {
    if (name === undefined) {
      name = url.url;
    }
  } else {
    if (name === undefined) {
      name = url.urlPath + url.queryString;
    }
  }
  if (browser === undefined) {
    browser = {
      name: defaults.browserName,
      headless: defaults.headless,
      windowSize: {
        width: defaults.windowWidth,
        height: defaults.windowHeight,
      },
    };
  }
  if (measurement === undefined) {
    measurement = [defaults.measurement(url)];
  }
  return {name, url, browser, measurement};
}

export async function writeBackSchemaIfNeeded(
  rawConfigObj: Partial<ConfigFile>,
  configFile: string
) {
  // Add the $schema field to the original config file if it's absent.
  // We only want to do this if the file validated though, so we don't mutate
  // a file that's not actually a tachometer config file.
  if (!('$schema' in rawConfigObj)) {
    const $schema =
      'https://raw.githubusercontent.com/Polymer/tachometer/master/config.schema.json';
    // Extra IDE features can be activated if the config file has a schema.
    const withSchema = {
      $schema,
      ...rawConfigObj,
    };
    const contents = JSON.stringify(withSchema, null, 2);
    await fsExtra.writeFile(configFile, contents, {encoding: 'utf-8'});
  }
}
