/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import csvStringify from 'csv-stringify/lib/sync';

import {ResultStatsWithDifferences} from './stats';

const precision = 5;

/**
 * Format statistical results as a CSV file string.
 */
export function formatCsvStats(results: ResultStatsWithDifferences[]): string {
  // Note the examples in ./test/csv_test.ts should make this easier to
  // understand.
  const h1 = ['', '', ''];
  const h2 = ['', 'ms', ''];
  const h3 = ['', 'min', 'max'];
  const rows = [];
  for (const result of results) {
    h1.push(`vs ${result.result.name}`, '', '', '');
    h2.push('% change', '', 'ms change', '');
    h3.push('min', 'max', 'min', 'max');
    const row = [];
    row.push(
      result.result.name,
      result.stats.meanCI.low.toFixed(precision),
      result.stats.meanCI.high.toFixed(precision)
    );
    for (const diff of result.differences) {
      if (diff === null) {
        row.push('', '', '', '');
      } else {
        row.push(
          (diff.relative.low * 100).toFixed(precision) + '%',
          (diff.relative.high * 100).toFixed(precision) + '%',
          diff.absolute.low.toFixed(precision),
          diff.absolute.high.toFixed(precision)
        );
      }
    }
    rows.push(row);
  }
  return csvStringify([h1, h2, h3, ...rows]);
}

/**
 * Format raw sample results as a CSV file string.
 *
 * Columns correspond to benchmarks. Rows correspond to sample iterations. The
 * first row is headers containing the benchmark names.
 *
 * For example:
 *
 * foo, bar, baz
 * 1.2, 5.5, 9.4
 * 1.8, 5.6, 9.1
 * 1.3, 5.2, 9.8
 */
export function formatCsvRaw(results: ResultStatsWithDifferences[]): string {
  const headers = [];
  const rows: Array<number[]> = [];
  for (let r = 0; r < results.length; r++) {
    const {result} = results[r];
    headers.push(result.name);
    for (let m = 0; m < result.millis.length; m++) {
      if (rows[m] === undefined) {
        rows[m] = [];
      }
      rows[m][r] = result.millis[m];
    }
  }
  return csvStringify([headers, ...rows]);
}
