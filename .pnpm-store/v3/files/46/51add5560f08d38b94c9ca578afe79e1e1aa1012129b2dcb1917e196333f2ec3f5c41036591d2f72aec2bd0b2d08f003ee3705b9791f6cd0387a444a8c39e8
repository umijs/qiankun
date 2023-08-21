/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import stripAnsi = require('strip-ansi');
import * as table from 'table';
import {UAParser} from 'ua-parser-js';

import ansi = require('ansi-escape-sequences');

import {
  Difference,
  ConfidenceInterval,
  ResultStats,
  ResultStatsWithDifferences,
} from './stats';
import {BenchmarkSpec, BenchmarkResult} from './types';

export const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(
  (frame) => ansi.format(`[blue]{${frame}}`)
);

/**
 * An abstraction for the various dimensions of data we display.
 */
interface Dimension {
  label: string;
  format: (r: ResultStats) => string;
  tableConfig?: table.ColumnUserConfig;
}

export interface ResultTable {
  dimensions: Dimension[];
  results: ResultStats[];
}

export interface AutomaticResults {
  fixed: ResultTable;
  unfixed: ResultTable;
}

/**
 * Create an automatic mode result table.
 */
export function automaticResultTable(results: ResultStats[]): AutomaticResults {
  // Typically most dimensions for a set of results share the same value (e.g
  // because we're only running one benchmark, one browser, etc.). To save
  // horizontal space and make the results easier to read, we first show the
  // fixed values in one table, then the unfixed values in another.
  const fixed: Dimension[] = [];
  const unfixed: Dimension[] = [];

  const possiblyFixed = [
    benchmarkDimension,
    versionDimension,
    browserDimension,
    sampleSizeDimension,
    bytesSentDimension,
  ];

  for (const dimension of possiblyFixed) {
    const values = new Set<string>();
    for (const res of results) {
      values.add(dimension.format(res));
    }
    if (values.size === 1) {
      fixed.push(dimension);
    } else {
      unfixed.push(dimension);
    }
  }

  // These are the primary observed results, so they always go in the main
  // result table, even if they happen to be the same in one run.
  unfixed.push(runtimeConfidenceIntervalDimension);
  if (results.length > 1) {
    // Create an NxN matrix comparing every result to every other result.
    const labelFn = makeUniqueLabelFn(results.map((result) => result.result));
    for (let i = 0; i < results.length; i++) {
      unfixed.push({
        label: `vs ${labelFn(results[i].result)}`,
        tableConfig: {
          alignment: 'right',
        },
        format: (r: ResultStats & Partial<ResultStatsWithDifferences>) => {
          if (r.differences === undefined) {
            return '';
          }
          const diff = r.differences[i];
          if (diff === null) {
            return ansi.format('\n[gray]{-}       ');
          }
          return formatDifference(diff);
        },
      });
    }
  }

  const fixedTable = {dimensions: fixed, results: [results[0]]};
  const unfixedTable = {dimensions: unfixed, results};
  return {fixed: fixedTable, unfixed: unfixedTable};
}

/**
 * Format a terminal text result table where each result is a row:
 *
 * +--------+--------+
 * | Header | Header |
 * +--------+--------+
 * | Value  | Value  |
 * +--------+--------+
 * | Value  | Value  |
 * +--------+--------+
 */
export function verticalTermResultTable({
  dimensions,
  results,
}: ResultTable): string {
  const columns = dimensions.map((d) => d.tableConfig || {});
  const rows = [
    dimensions.map((d) => ansi.format(`[bold]{${d.label}}`)),
    ...results.map((r) => dimensions.map((d) => d.format(r))),
  ];
  return table.table(rows, {
    border: table.getBorderCharacters('norc'),
    // The table library only accepts an object with numeric keys, not an array.
    // https://github.com/gajus/table/issues/134
    columns: Object.fromEntries(Object.entries(columns)),
  });
}

/**
 * Format a terminal text result table where each result is a column:
 *
 * +--------+-------+-------+
 * | Header | Value | Value |
 * +--------+-------+-------+
 * | Header | Value | Value |
 * +--------+-------+-------+
 */
export function horizontalTermResultTable({
  dimensions,
  results,
}: ResultTable): string {
  const columns: table.ColumnUserConfig[] = [
    {alignment: 'right'},
    ...results.map((): table.ColumnUserConfig => ({alignment: 'left'})),
  ];
  const rows = dimensions.map((d) => {
    return [
      ansi.format(`[bold]{${d.label}}`),
      ...results.map((r) => d.format(r)),
    ];
  });
  return table.table(rows, {
    border: table.getBorderCharacters('norc'),
    // The table library only accepts an object with numeric keys, not an array.
    // https://github.com/gajus/table/issues/134
    columns: Object.fromEntries(Object.entries(columns)),
  });
}

/**
 * Format an HTML result table where each result is a row:
 *
 * <table>
 *   <tr> <th>Header</th> <th>Header</th> </tr>
 *   <tr> <td>Value</td> <td>Value</td> </tr>
 *   <tr> <td>Value</td> <td>Value</td> </tr>
 * </table>
 */
export function verticalHtmlResultTable({
  dimensions,
  results,
}: ResultTable): string {
  const headers = dimensions.map((d) => `<th>${d.label}</th>`);
  const rows = [];
  for (const r of results) {
    const cells = dimensions.map(
      (d) => `<td>${ansiCellToHtml(d.format(r))}</td>`
    );
    rows.push(`<tr>${cells.join('')}</tr>`);
  }
  return `<table>
    <tr>${headers.join('')}</tr>
    ${rows.join('')}
  </table>`;
}

/**
 * Format an HTML result table where each result is a column:
 *
 * <table>
 *   <tr> <th>Header</th> <td>Value</td> <td>Value</td> </tr>
 *   <tr> <th>Header</th> <td>Value</td> <td>Value</td> </tr>
 * </table>
 */
export function horizontalHtmlResultTable({
  dimensions,
  results,
}: ResultTable): string {
  const rows: string[] = [];
  for (const d of dimensions) {
    const cells = [
      `<th align="right">${d.label}</th>`,
      ...results.map((r) => `<td>${ansiCellToHtml(d.format(r))}</td>`),
    ];
    rows.push(`<tr>${cells.join('')}</tr>`);
  }
  return `<table>${rows.join('')}</table>`;
}

function ansiCellToHtml(ansi: string): string {
  // For now, just remove ANSI color sequences and prevent line-breaks. We may
  // want to add an htmlFormat method to each dimension object so that we can
  // have more advanced control per dimension.
  return stripAnsi(ansi).replace(/ /g, '&nbsp;');
}

/**
 * Format a confidence interval as "[low, high]".
 */
const formatConfidenceInterval = (
  ci: ConfidenceInterval,
  format: (n: number) => string
) => {
  return ansi.format(`${format(ci.low)} [gray]{-} ${format(ci.high)}`);
};

/**
 * Prefix positive numbers with a red "+" and negative ones with a green "-".
 */
const colorizeSign = (n: number, format: (n: number) => string) => {
  if (n > 0) {
    return ansi.format(`[red bold]{+}${format(n)}`);
  } else if (n < 0) {
    // Negate the value so that we don't get a double negative sign.
    return ansi.format(`[green bold]{-}${format(-n)}`);
  } else {
    return format(n);
  }
};

const benchmarkDimension: Dimension = {
  label: 'Benchmark',
  format: (r: ResultStats) => r.result.name,
};

const versionDimension: Dimension = {
  label: 'Version',
  format: (r: ResultStats) => r.result.version || ansi.format('[gray]{<none>}'),
};

const browserDimension: Dimension = {
  label: 'Browser',
  format: (r: ResultStats) => {
    const browser = r.result.browser;
    let s = browser.name;
    if (browser.headless) {
      s += '-headless';
    }
    if (browser.remoteUrl) {
      s += `\n@${browser.remoteUrl}`;
    }
    if (r.result.userAgent !== '') {
      // We'll only have a user agent when using the built-in static server.
      // TODO Get UA from window.navigator.userAgent so we always have it.
      const ua = new UAParser(r.result.userAgent).getBrowser();
      s += `\n${ua.version}`;
    }
    return s;
  },
};

const sampleSizeDimension: Dimension = {
  label: 'Sample size',
  format: (r: ResultStats) => r.result.millis.length.toString(),
};

const bytesSentDimension: Dimension = {
  label: 'Bytes',
  format: (r: ResultStats) => (r.result.bytesSent / 1024).toFixed(2) + ' KiB',
};

const runtimeConfidenceIntervalDimension: Dimension = {
  label: 'Avg time',
  tableConfig: {
    alignment: 'right',
  },
  format: (r: ResultStats) => formatConfidenceInterval(r.stats.meanCI, milli),
};

function formatDifference({absolute, relative}: Difference): string {
  let word, rel, abs;
  if (absolute.low > 0 && relative.low > 0) {
    word = `[bold red]{slower}`;
    rel = formatConfidenceInterval(relative, percent);
    abs = formatConfidenceInterval(absolute, milli);
  } else if (absolute.high < 0 && relative.high < 0) {
    word = `[bold green]{faster}`;
    rel = formatConfidenceInterval(negate(relative), percent);
    abs = formatConfidenceInterval(negate(absolute), milli);
  } else {
    word = `[bold blue]{unsure}`;
    rel = formatConfidenceInterval(relative, (n) => colorizeSign(n, percent));
    abs = formatConfidenceInterval(absolute, (n) => colorizeSign(n, milli));
  }

  return ansi.format(`${word}\n${rel}\n${abs}`);
}

function percent(n: number): string {
  return (n * 100).toFixed(0) + '%';
}

function milli(n: number): string {
  return n.toFixed(2) + 'ms';
}

function negate(ci: ConfidenceInterval): ConfidenceInterval {
  return {
    low: -ci.high,
    high: -ci.low,
  };
}

/**
 * Create a function that will return the shortest unambiguous label for a
 * result, given the full array of results.
 */
function makeUniqueLabelFn(
  results: BenchmarkResult[]
): (result: BenchmarkResult) => string {
  const names = new Set<string>();
  const versions = new Set<string>();
  const browsers = new Set<string>();
  for (const result of results) {
    names.add(result.name);
    versions.add(result.version);
    browsers.add(result.browser.name);
  }
  return (result: BenchmarkResult) => {
    const fields: string[] = [];
    if (names.size > 1) {
      fields.push(result.name);
    }
    if (versions.size > 1) {
      fields.push(result.version);
    }
    if (browsers.size > 1) {
      fields.push(result.browser.name);
    }
    return fields.join('\n');
  };
}

/**
 * Create a function that will return the shortest unambiguous label for a
 * benchmark spec, given the full array of specs
 */
export function makeUniqueSpecLabelFn(
  specs: BenchmarkSpec[]
): (spec: BenchmarkSpec) => string {
  const names = new Set<string>();
  const versions = new Set<string>();
  const browsers = new Set<string>();
  for (const spec of specs) {
    names.add(spec.name);
    browsers.add(spec.browser.name);

    if (spec.url.kind === 'local' && spec.url.version !== undefined) {
      versions.add(spec.url.version.label);
    }
  }
  return (spec: BenchmarkSpec) => {
    const fields: string[] = [];
    if (names.size > 1) {
      if (spec.name.startsWith('http://')) {
        fields.push(spec.name.slice(6));
      } else if (spec.name.startsWith('https://')) {
        fields.push(spec.name.slice(7));
      } else {
        fields.push(spec.name);
      }
    }
    if (
      versions.size > 1 &&
      spec.url.kind === 'local' &&
      spec.url.version !== undefined
    ) {
      fields.push(spec.url.version.label);
    }
    if (browsers.size > 1) {
      fields.push(spec.browser.name);
    }
    return fields.join('-');
  };
}

/**
 * A one-line summary of a benchmark, e.g. for a progress bar:
 *
 *   chrome my-benchmark [@my-version]
 */
export function benchmarkOneLiner(spec: BenchmarkSpec) {
  let maybeVersion = '';
  if (spec.url.kind === 'local' && spec.url.version !== undefined) {
    maybeVersion = ` [@${spec.url.version.label}]`;
  }
  return `${spec.browser.name} ${spec.name}${maybeVersion}`;
}
