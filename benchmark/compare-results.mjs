import { readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { compareBenchmarkResults } from './src/result-comparison.mjs';

async function readResult(argument) {
  const path = resolve(argument);
  const resultPath = (await stat(path)).isDirectory() ? join(path, 'result.json') : path;
  return JSON.parse(await readFile(resultPath, 'utf8'));
}

function formatPercent(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

const [referencePath, candidatePath, ...extra] = process.argv.slice(2);
if (!referencePath || !candidatePath || extra.length > 0) {
  throw new Error('usage: node compare-results.mjs <reference-result> <candidate-result>');
}

const rows = compareBenchmarkResults(await readResult(referencePath), await readResult(candidatePath));
console.log('| Variant | Reference median (ms) | Candidate median (ms) | Absolute-run delta |');
console.log('| --- | ---: | ---: | ---: |');
for (const row of rows) {
  console.log(
    `| ${row.label} | ${row.referenceMedian.toFixed(2)} | ${row.candidateMedian.toFixed(2)} | ${formatPercent(row.relativeDeltaPercent)} |`,
  );
}
console.log('\nCross-run absolute medians are diagnostic only; within-run paired comparisons remain primary.');
