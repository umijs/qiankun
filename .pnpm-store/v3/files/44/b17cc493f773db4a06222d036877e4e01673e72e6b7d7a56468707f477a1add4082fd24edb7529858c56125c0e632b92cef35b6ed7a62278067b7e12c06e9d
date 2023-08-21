/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as fsExtra from 'fs-extra';
import * as webdriver from 'selenium-webdriver';

import ProgressBar = require('progress');
import ansi = require('ansi-escape-sequences');

import {jsonOutput, legacyJsonOutput} from './json-output';
import {browserSignature, makeDriver, openAndSwitchToNewTab} from './browser';
import {measure, measurementName} from './measure';
import {BenchmarkResult, BenchmarkSpec} from './types';
import {formatCsvStats, formatCsvRaw} from './csv';
import {
  ResultStatsWithDifferences,
  autoSampleConditionsResolved,
  summaryStats,
  computeDifferences,
} from './stats';
import {
  verticalTermResultTable,
  horizontalTermResultTable,
  verticalHtmlResultTable,
  horizontalHtmlResultTable,
  automaticResultTable,
  spinner,
  benchmarkOneLiner,
} from './format';
import {Config} from './config';
import * as github from './github';
import {Server, Session} from './server';
import {specUrl} from './specs';
import {wait} from './util';
import * as pathlib from 'path';

interface Browser {
  name: string;
  driver: webdriver.WebDriver;
  initialTabHandle: string;
}

export class Runner {
  private readonly config: Config;
  private readonly specs: BenchmarkSpec[];
  private readonly servers: Map<BenchmarkSpec, Server>;
  private readonly browsers = new Map<string, Browser>();
  private readonly bar: ProgressBar;
  private readonly results = new Map<BenchmarkSpec, BenchmarkResult[]>();

  /**
   * How many times we will load a page and try to collect all measurements
   * before fully failing.
   */
  private readonly maxAttempts = 3;

  /**
   * Maximum milliseconds we will wait for all measurements to be collected per
   * attempt before reloading and trying a new attempt.
   */
  private readonly attemptTimeout = 10000;

  /**
   * How many milliseconds we will wait between each poll for measurements.
   */
  private readonly pollTime = 50;

  private completeGithubCheck?: (markdown: string) => void;
  private hitTimeout = false;

  constructor(config: Config, servers: Map<BenchmarkSpec, Server>) {
    this.config = config;
    this.specs = config.benchmarks;
    this.servers = servers;
    this.bar = new ProgressBar('[:bar] :status', {
      total: this.specs.length * (config.sampleSize + /** warmup */ 1),
      width: 58,
    });
  }

  async run(): Promise<Array<ResultStatsWithDifferences> | undefined> {
    await this.launchBrowsers();
    if (this.config.githubCheck !== undefined) {
      this.completeGithubCheck = await github.createCheck(
        this.config.githubCheck
      );
    }
    console.log('Running benchmarks\n');
    await this.warmup();
    await this.takeMinimumSamples();
    await this.takeAdditionalSamples();
    await this.closeBrowsers();
    const results = this.makeResults();
    await this.outputResults(results);
    return results;
  }

  private async launchBrowsers() {
    for (const {browser} of this.specs) {
      const sig = browserSignature(browser);
      if (this.browsers.has(sig)) {
        continue;
      }
      this.bar.tick(0, {status: `launching ${browser.name}`});
      // It's important that we execute each benchmark iteration in a new tab.
      // At least in Chrome, each tab corresponds to process which shares some
      // amount of cached V8 state which can cause significant measurement
      // effects. There might even be additional interaction effects that
      // would require an entirely new browser to remove, but experience in
      // Chrome so far shows that new tabs are neccessary and sufficient.
      const driver = await makeDriver(browser);
      const tabs = await driver.getAllWindowHandles();
      // We'll always launch new tabs from this initial blank tab.
      const initialTabHandle = tabs[0];
      this.browsers.set(sig, {name: browser.name, driver, initialTabHandle});
    }
  }

  private async closeBrowsers() {
    // Close the browsers by closing each of their last remaining tabs.
    await Promise.all(
      [...this.browsers.values()].map(({driver}) => driver.close())
    );
  }

  /**
   * Do one throw-away run per benchmark to warm up our server (especially
   * when expensive bare module resolution is enabled), and the browser.
   */
  private async warmup() {
    const {specs, bar} = this;
    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      if (spec.browser.trace !== undefined) {
        await fsExtra.mkdirp(spec.browser.trace.logDir);
      }

      bar.tick(0, {
        status: `warmup ${i + 1}/${specs.length} ${benchmarkOneLiner(spec)}`,
      });
      await this.takeSamples(spec, 'warmup');
      bar.tick(1);
    }
  }

  private recordSamples(spec: BenchmarkSpec, newResults: BenchmarkResult[]) {
    let specResults = this.results.get(spec);
    if (specResults === undefined) {
      specResults = [];
      this.results.set(spec, specResults);
    }

    // This function is called once per page per sample. The first time this
    // function is called for a page, that result object becomes our "primary"
    // one. On subsequent calls, we accrete the additional sample data into this
    // primary one. The other fields are always the same, so we can just ignore
    // them after the first call.

    // TODO(aomarks) The other fields (user agent, bytes sent, etc.) only need
    // to be collected on the first run of each page, so we could do that in the
    // warmup phase, and then function would only need to take sample data,
    // since it's a bit confusing how we throw away a bunch of fields after the
    // first call.
    for (const newResult of newResults) {
      const primary = specResults[newResult.measurementIndex];
      if (primary === undefined) {
        specResults[newResult.measurementIndex] = newResult;
      } else {
        primary.millis.push(...newResult.millis);
      }
    }
  }

  private async takeMinimumSamples() {
    // Always collect our minimum number of samples.
    const {config, specs, bar} = this;
    const numRuns = specs.length * config.sampleSize;
    const maxLength = config.sampleSize.toString().length;
    let run = 0;
    for (let sample = 0; sample < config.sampleSize; sample++) {
      const sampleLabel = `sample-${sample
        .toString()
        .padStart(maxLength, '0')}`;

      for (const spec of specs) {
        bar.tick(0, {
          status: `${++run}/${numRuns} ${benchmarkOneLiner(spec)}`,
        });
        this.recordSamples(spec, await this.takeSamples(spec, sampleLabel));
        if (bar.curr === bar.total - 1) {
          // Note if we tick with 0 after we've completed, the status is
          // rendered on the next line for some reason.
          bar.tick(1, {status: 'done'});
        } else {
          bar.tick(1);
        }
      }
    }
  }

  private async takeAdditionalSamples() {
    const {config, specs} = this;
    if (config.timeout <= 0) {
      return;
    }
    console.log();
    const timeoutMs = config.timeout * 60 * 1000; // minutes -> millis
    const startMs = Date.now();
    let run = 0;
    let sample = 0;
    let elapsed = 0;
    while (true) {
      if (
        autoSampleConditionsResolved(
          this.makeResults(),
          config.autoSampleConditions
        )
      ) {
        console.log();
        break;
      }
      if (elapsed >= timeoutMs) {
        this.hitTimeout = true;
        break;
      }
      // Run batches of 10 additional samples at a time for more presentable
      // sample sizes, and to nudge sample sizes up a little.
      for (let i = 0; i < 10; i++) {
        sample++;
        for (const spec of specs) {
          run++;
          elapsed = Date.now() - startMs;
          const remainingSecs = Math.max(
            0,
            Math.round((timeoutMs - elapsed) / 1000)
          );
          const mins = Math.floor(remainingSecs / 60);
          const secs = remainingSecs % 60;
          process.stdout.write(
            `\r${spinner[run % spinner.length]} Auto-sample ${sample} ` +
              `(timeout in ${mins}m${secs}s)` +
              ansi.erase.inLine(0)
          );

          const sampleLabel = `auto-sample-${sample
            .toString()
            .padStart(2, '0')}`;
          this.recordSamples(spec, await this.takeSamples(spec, sampleLabel));
        }
      }
    }
  }

  private async takeSamples(
    spec: BenchmarkSpec,
    sampleLabel: string
  ): Promise<BenchmarkResult[]> {
    const {servers, config, browsers} = this;

    let server;
    if (spec.url.kind === 'local') {
      server = servers.get(spec);
      if (server === undefined) {
        throw new Error('Internal error: no server for spec');
      }
    }

    const url = specUrl(spec, servers, config);
    const {driver, initialTabHandle} = browsers.get(
      browserSignature(spec.browser)
    )!;

    let session: Session;
    let pendingMeasurements;
    let measurementResults: number[];

    // We'll try N attempts per page. Within each attempt, we'll try to collect
    // all of the measurements by polling. If we hit our per-attempt timeout
    // before collecting all measurements, we'll move onto the next attempt
    // where we reload the whole page and start from scratch. If we hit our max
    // attempts, we'll throw.
    for (let pageAttempt = 1; ; pageAttempt++) {
      // New attempt. Reset all measurements and results.
      pendingMeasurements = new Set(spec.measurement);
      measurementResults = [];
      await openAndSwitchToNewTab(driver, spec.browser);
      await driver.get(url);
      for (
        let waited = 0;
        pendingMeasurements.size > 0 && waited <= this.attemptTimeout;
        waited += this.pollTime
      ) {
        // TODO(aomarks) You don't have to wait in callback mode!
        await wait(this.pollTime);
        for (
          let measurementIndex = 0;
          measurementIndex < spec.measurement.length;
          measurementIndex++
        ) {
          if (measurementResults[measurementIndex] !== undefined) {
            // Already collected this measurement on this attempt.
            continue;
          }
          const measurement = spec.measurement[measurementIndex];
          const result = await measure(driver, measurement, server);
          if (result !== undefined) {
            measurementResults[measurementIndex] = result;
            pendingMeasurements.delete(measurement);
          }
        }
      }

      await this.capturePerfTraces(spec, driver, sampleLabel);

      // Close the active tab (but not the whole browser, since the
      // initial blank tab is still open).
      await driver.close();
      await driver.switchTo().window(initialTabHandle);

      if (server !== undefined) {
        session = server.endSession();
      }

      if (pendingMeasurements.size === 0 || pageAttempt >= this.maxAttempts) {
        break;
      }

      console.log(
        `\n\nFailed ${pageAttempt}/${this.maxAttempts} times ` +
          `to get measurement(s) ${spec.name}` +
          (spec.measurement.length > 1
            ? ` [${[...pendingMeasurements].map(measurementName).join(', ')}]`
            : '') +
          ` in ${spec.browser.name} from ${url}. Retrying.`
      );
    }

    if (pendingMeasurements.size > 0) {
      console.log();
      throw new Error(
        `\n\nFailed ${this.maxAttempts}/${this.maxAttempts} times ` +
          `to get measurement(s) ${spec.name}` +
          (spec.measurement.length > 1
            ? ` [${[...pendingMeasurements].map(measurementName).join(', ')}]`
            : '') +
          ` in ${spec.browser.name} from ${url}`
      );
    }

    return spec.measurement.map((measurement, measurementIndex) => ({
      name:
        spec.measurement.length === 1
          ? spec.name
          : `${spec.name} [${measurementName(measurement)}]`,
      measurement,
      measurementIndex: measurementIndex,
      queryString: spec.url.kind === 'local' ? spec.url.queryString : '',
      version:
        spec.url.kind === 'local' && spec.url.version !== undefined
          ? spec.url.version.label
          : '',
      millis: [measurementResults[measurementIndex]],
      bytesSent: session ? session.bytesSent : 0,
      browser: spec.browser,
      userAgent: session ? session.userAgent : '',
    }));
  }

  async capturePerfTraces(
    spec: BenchmarkSpec,
    driver: webdriver.WebDriver,
    sampleLabel: string
  ) {
    if (spec.browser.trace === undefined) {
      return;
    }

    let perfEntries: webdriver.logging.Entry[] = [];
    let newPerfEntries: webdriver.logging.Entry[];
    do {
      newPerfEntries = await driver.manage().logs().get('performance');
      perfEntries = perfEntries.concat(newPerfEntries);
    } while (newPerfEntries.length > 0);

    const logDir = spec.browser.trace.logDir;
    await fsExtra.writeFile(
      pathlib.join(logDir, `log-${sampleLabel}.json`),
      // Convert perf logs into a format about:tracing can parse
      '[\n' +
        perfEntries
          .map((e) => JSON.parse(e.message).message)
          .filter((log) => log.method === 'Tracing.dataCollected')
          .map((log) => JSON.stringify(log.params))
          .join(',\n') +
        '\n]',
      'utf8'
    );
  }

  makeResults() {
    const resultStats = [];
    for (const results of this.results.values()) {
      for (let r = 0; r < results.length; r++) {
        const result = results[r];
        resultStats.push({result, stats: summaryStats(result.millis)});
      }
    }
    return computeDifferences(resultStats);
  }

  private async outputResults(withDifferences: ResultStatsWithDifferences[]) {
    const {config, hitTimeout} = this;
    console.log();
    const {fixed, unfixed} = automaticResultTable(withDifferences);
    console.log(horizontalTermResultTable(fixed));
    console.log(verticalTermResultTable(unfixed));

    if (hitTimeout === true) {
      console.log(
        ansi.format(
          `[bold red]{NOTE} Hit ${config.timeout} minute auto-sample timeout` +
            ` trying to resolve condition(s)`
        )
      );
      console.log(
        'Consider a longer --timeout or different --auto-sample-conditions'
      );
    }

    if (config.jsonFile) {
      const json = await jsonOutput(withDifferences);
      await fsExtra.writeJSON(config.jsonFile, json, {spaces: 2});
    }

    // TOOD(aomarks) Remove this in next major version.
    if (config.legacyJsonFile) {
      const json = await legacyJsonOutput(withDifferences.map((s) => s.result));
      await fsExtra.writeJSON(config.legacyJsonFile, json);
    }

    if (config.csvFileStats) {
      await fsExtra.writeFile(
        config.csvFileStats,
        formatCsvStats(withDifferences)
      );
    }
    if (config.csvFileRaw) {
      await fsExtra.writeFile(config.csvFileRaw, formatCsvRaw(withDifferences));
    }

    if (this.completeGithubCheck !== undefined) {
      const markdown =
        horizontalHtmlResultTable(fixed) +
        '\n' +
        verticalHtmlResultTable(unfixed);
      await this.completeGithubCheck(markdown);
    }
  }
}
