/**
 * Cross-shard aggregator for the basic performance gate.
 *
 * A single hosted-runner VM biases the sandbox-versus-native comparison by several percentage
 * points (the two architectures stress different browser subsystems, so machine differences do
 * not cancel in the ratio the way they do for qiankun-versus-qiankun cells). The workflow
 * therefore runs the suite on several independent VMs (shards, each with its own trials and
 * seed) and this script pools their raw samples: shard trials are re-tagged into globally
 * unique trial ids and judged by the same hierarchical bootstrap and gates the runner uses,
 * so between-VM variance is part of the reported confidence intervals.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { evaluateComparisonGates, renderComparisonGateSummary } from './src/comparison-gates.mjs';
import { buildReport, renderSummaryMarkdown } from './src/report.mjs';
import { evaluateCalibration } from './src/stats.mjs';
import { CALIBRATION_VARIANTS, SUITES } from './scenarios.mjs';

function parseArguments(args) {
  const options = { input: null, shards: null, summaryFile: null };
  for (const arg of args) {
    const match = /^--([a-z-]+)=(.+)$/u.exec(arg);
    if (!match) throw new Error(`unrecognized argument: ${arg}`);
    const [, name, value] = match;
    if (name === 'input') options.input = resolve(value);
    else if (name === 'shards') options.shards = Number(value);
    else if (name === 'summary-file') options.summaryFile = resolve(value);
    else throw new Error(`unrecognized option: ${name}`);
  }
  if (!options.input)
    throw new Error('usage: node aggregate-shards.mjs --input=<dir> --shards=<n> [--summary-file=<path>]');
  if (!Number.isInteger(options.shards) || options.shards < 2) {
    throw new Error('shards must be an integer greater than 1');
  }
  return options;
}

async function findResultFiles(root) {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name === 'result.json')
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

// Fingerprints legitimately differ across shards in exactly two dimensions: the per-shard seed,
// and the VM identity — machine heterogeneity is the very thing the shards exist to sample.
function normalizedDescriptor(result) {
  const descriptor = structuredClone(result.metadata.harness.descriptor);
  descriptor.sampling = { ...descriptor.sampling, seed: null };
  descriptor.environment = null;
  return JSON.stringify(descriptor);
}

function materializeCalibrationVariants(suite) {
  const sourceVariantId = suite.calibrationSourceVariant ?? CALIBRATION_VARIANTS[0].sourceVariant;
  const productById = new Map(suite.variants.map((variant) => [variant.id, variant]));
  const source = productById.get(sourceVariantId);
  if (!source) throw new Error(`unknown calibration source: ${sourceVariantId}`);
  return CALIBRATION_VARIANTS.map((alias) => ({ ...source, id: alias.id, label: alias.label }));
}

function assertCompleteAndValid(samples, expected, label) {
  if (samples.length !== expected) {
    throw new Error(`${label}: expected ${expected} samples, found ${samples.length}`);
  }
  const invalid = samples.filter((sample) => !sample.valid);
  if (invalid.length > 0) {
    throw new Error(`${label}: ${invalid.length} invalid sample(s): ${invalid[0].error}`);
  }
}

const options = parseArguments(process.argv.slice(2));
const files = await findResultFiles(options.input);
if (files.length !== options.shards) {
  throw new Error(`expected ${options.shards} shard results under ${options.input}, found ${files.length}`);
}

const shards = [];
for (const file of files) {
  shards.push({ file, result: JSON.parse(await readFile(file, 'utf8')) });
}

const [first] = shards;
const firstOptions = first.result.metadata.options;
const suite = SUITES[firstOptions.suite];
if (!suite) throw new Error(`unknown benchmark suite: ${firstOptions.suite}`);
const gates = suite.comparisonGates ?? [];
if (gates.length === 0) throw new Error(`suite ${firstOptions.suite} defines no comparison gates to aggregate`);

const reference = normalizedDescriptor(first.result);
for (const shard of shards) {
  if (normalizedDescriptor(shard.result) !== reference) {
    throw new Error(`shard harness mismatch (beyond the per-shard seed): ${shard.file}`);
  }
  if (shard.result.passed !== true) {
    throw new Error(`shard run did not pass its own validity verdict: ${shard.file}`);
  }
}

const trialsPerShard = firstOptions.trials;
const retag = (samples, shardIndex) =>
  samples.map((sample) => ({ ...sample, trial: shardIndex * trialsPerShard + sample.trial }));

const productSamples = shards.flatMap((shard, index) => retag(shard.result.product.samples, index));
const calibrationSamples = shards.flatMap((shard, index) => retag(shard.result.calibration.samples, index));

const calibrationVariants = materializeCalibrationVariants(suite);
assertCompleteAndValid(
  productSamples,
  options.shards * trialsPerShard * firstOptions.samples * suite.variants.length,
  'aggregated product phase',
);
assertCompleteAndValid(
  calibrationSamples,
  options.shards * trialsPerShard * firstOptions.calibrationSamples * calibrationVariants.length,
  'aggregated calibration phase',
);

const calibrationReport = buildReport({
  comparisons: [
    {
      candidate: 'calibration-b',
      id: 'aa-calibration',
      label: 'A/A identical qiankun variants',
      reference: 'calibration-a',
    },
  ],
  samples: calibrationSamples,
  seed: firstOptions.seed,
  variants: calibrationVariants,
});
const calibrationEvaluation = evaluateCalibration(calibrationReport.comparisons['aa-calibration']);

const productReport = buildReport({
  comparisons: suite.comparisons,
  samples: productSamples,
  seed: firstOptions.seed,
  variants: suite.variants,
});
const comparisonEvaluation = evaluateComparisonGates(productReport.comparisons, gates);

const passed = calibrationEvaluation.passed && comparisonEvaluation.passed;
const lines = [
  `# ${suite.title} · ${options.shards}-shard aggregate`,
  '',
  `- Shards (independent runner VMs): ${options.shards} × ${trialsPerShard} trials × ${firstOptions.samples} samples`,
  `- Commit: ${first.result.metadata.commit}`,
  '> Confidence intervals aggregate every shard trial with the hierarchical bootstrap, so between-VM variance is included.',
  '',
  renderSummaryMarkdown(calibrationReport, { headingLevel: 2, title: 'A/A calibration (aggregate)' }),
  `Calibration gate: **${calibrationEvaluation.passed ? 'passed' : 'failed'}**`,
  '',
  ...(calibrationEvaluation.passed ? [] : [...calibrationEvaluation.failures.map((failure) => `- ${failure}`), '']),
  renderSummaryMarkdown(productReport, { headingLevel: 2, title: suite.title }),
  renderComparisonGateSummary(comparisonEvaluation),
  '',
  `Aggregate verdict: **${passed ? 'passed' : 'FAILED'}**`,
  '',
];
const summary = lines.join('\n');

console.log(summary);
if (options.summaryFile) await writeFile(options.summaryFile, summary);
if (!passed) process.exit(1);
