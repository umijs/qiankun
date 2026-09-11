import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { arch, cpus, platform, release, totalmem } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { BROWSER_CONTEXT_OPTIONS } from './src/browser.mjs';
import { createClassicExperimentServer } from './src/classic-preexecution-fixture.mjs';
import { renderClassicExperimentReport, summarizeClassicExperiment } from './src/classic-preexecution-report.mjs';
import { hashViteEntries } from './src/hash.mjs';
import { createBalancedSchedule } from './src/schedule.mjs';
import { comparePairedTrials, evaluateCalibration } from './src/stats.mjs';
import { createStaticServer } from './src/static-server.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const options = {
  samples: 20,
  trials: 3,
  warmup: 2,
  calibrationSamples: 20,
  calibrationSize: '1m',
  readyLeadMs: 250,
  pendingLeadMs: 10,
  latencyMs: 20,
  hostWorkMs: 30,
  interactionWindowMs: 500,
  inputDelayMs: 50,
  timeoutMs: 30_000,
  seed: 20260912,
  sizes: ['100k', '1m', '5m'],
  scenarios: ['ready', 'pending', 'miss'],
  output: resolve(root, 'results/classic-preexecution', new Date().toISOString().replaceAll(':', '-')),
};
const integers = {
  samples: 'samples',
  trials: 'trials',
  warmup: 'warmup',
  'calibration-samples': 'calibrationSamples',
  'ready-lead': 'readyLeadMs',
  'pending-lead': 'pendingLeadMs',
  latency: 'latencyMs',
  'host-work': 'hostWorkMs',
  'interaction-window': 'interactionWindowMs',
  'input-delay': 'inputDelayMs',
  timeout: 'timeoutMs',
  seed: 'seed',
};
for (const argument of process.argv.slice(2)) {
  const match = /^--([a-z-]+)=(.+)$/u.exec(argument);
  if (!match) throw new Error(`Expected --option=value: ${argument}`);
  const [, key, value] = match;
  if (key === 'output') options.output = resolve(value);
  else if (key === 'calibration-size') {
    if (!['100k', '1m', '5m'].includes(value)) throw new Error(`Invalid calibration-size: ${value}`);
    options.calibrationSize = value;
  } else if (key === 'sizes' || key === 'scenarios') {
    const allowed = options[key];
    const selected = value.split(',');
    if (selected.some((item) => !allowed.includes(item)) || new Set(selected).size !== selected.length) {
      throw new Error(`Invalid ${key}: ${value}`);
    }
    options[key] = selected;
  } else if (integers[key]) {
    const parsed = Number(value);
    const minimum = key === 'warmup' || key === 'host-work' || key === 'latency' ? 0 : 1;
    if (!Number.isSafeInteger(parsed) || parsed < minimum) throw new Error(`Invalid ${key}: ${value}`);
    options[integers[key]] = parsed;
  } else throw new Error(`Unknown option: ${key}`);
}

// Abort rather than overwrite an earlier run; partial samples survive failed runs.
await mkdir(dirname(options.output), { recursive: true });
await mkdir(options.output);
const samples = [];
const calibrationSamples = [];
const sizes = { '100k': 100 * 1024, '1m': 1024 * 1024, '5m': 5 * 1024 * 1024 };
let scheduleSeed = options.seed;
function shuffle(values) {
  return createBalancedSchedule(values, 1, scheduleSeed++).map((entry) => entry.variant);
}

function pairedOrder(variants, round, seed) {
  if (round < 0) return shuffle(variants);
  return createBalancedSchedule(variants, round + 1, seed)
    .filter((entry) => entry.round === round)
    .map((entry) => entry.variant);
}

const sourceFiles = [
  'classic-preexecution.mjs',
  'src/classic-preexecution-fixture.mjs',
  'src/classic-preexecution-report.mjs',
  'src/stats.mjs',
  'src/schedule.mjs',
  'fixtures/host/src/classic-preexecution.ts',
  'fixtures/host/classic-preexecution.html',
];
const hash = createHash('sha256');
for (const file of sourceFiles) hash.update(file).update(await readFile(resolve(root, file)));
const environment = {
  recordedAt: new Date().toISOString(),
  platform: platform(),
  release: release(),
  arch: arch(),
  cpu: cpus()[0]?.model,
  logicalCpus: cpus().length,
  totalMemoryBytes: totalmem(),
  node: process.version,
  playwright: JSON.parse(await readFile(resolve(root, 'node_modules/playwright/package.json'), 'utf8')).version,
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  sourceHash: hash.digest('hex'),
  hostBundleHash: await hashViteEntries(resolve(root, 'fixtures/host/dist'), ['classic-preexecution.html']),
  browserArgs: ['--site-per-process', '--enable-precise-memory-info'],
  context: BROWSER_CONTEXT_OPTIONS,
  command: `pnpm --filter @qiankunjs/benchmark run classic-preexecution ${process.argv.slice(2).join(' ')}`,
  measurement: {
    primary: 'Real loadMicroApp: activation to mountPromise and styled core surviving two animation frames',
    interaction: 'Scheduled main-thread task delay proxy, not a real input event or INP',
    trustedInput: `CDP mousePressed with sender timestamp, scheduled ${options.inputDelayMs}ms after the runner receives the page's start notification; inputAtMs is handler receipt time relative to the page's experiment start; handler delay and two-frame update, not Web Vitals INP`,
    memory: 'Sampled performance.memory.usedJSHeapSize high-water mark; not process RSS or an exact peak',
    preparation: 'No business code runs; native blob classic registers a factory only',
  },
};
const fixture = createClassicExperimentServer({ latencyMs: options.latencyMs });
const host = createStaticServer({ port: 0, root: resolve(root, 'fixtures/host/dist') });
let browser;

async function runSample({ trial, round, position, sizeLabel, scenario, variant, warmup = false, arm }) {
  const context = await browser.newContext(BROWSER_CONTEXT_OPTIONS);
  const errors = [];
  let inputTimer;
  fixture.resetRequestCounts();
  try {
    const page = await context.newPage();
    const inputSession = await context.newCDPSession(page);
    let resolveInput;
    let rejectInput;
    const inputSent = new Promise((resolve, reject) => {
      resolveInput = resolve;
      rejectInput = reject;
    });
    void inputSent.catch(() => {});
    await page.exposeFunction('__CLASSIC_PREEXECUTION_INPUT_START__', () => {
      inputTimer = setTimeout(() => {
        void inputSession
          .send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            x: 20,
            y: 20,
            button: 'left',
            clickCount: 1,
            timestamp: Date.now() / 1000,
          })
          .then(() =>
            inputSession.send('Input.dispatchMouseEvent', {
              type: 'mouseReleased',
              x: 20,
              y: 20,
              button: 'left',
              clickCount: 1,
              timestamp: Date.now() / 1000,
            }),
          )
          .then(resolveInput, rejectInput);
      }, options.inputDelayMs);
    });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('requestfailed', (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`${response.url()}: ${response.status()}`);
    });
    await page.goto(`${host.origin}/classic-preexecution.html`, { waitUntil: 'load', timeout: options.timeoutMs });
    if (fixture.getRequestCount() !== 0) throw new Error('Fixture requested before preparation began');
    let timer;
    const result = await Promise.race([
      page.evaluate((config) => window.__CLASSIC_PREEXECUTION__.run(config), {
        variant,
        scenario,
        entry: `${fixture.origin}/app/${sizeLabel}/a/index.html`,
        otherEntry: `${fixture.origin}/app/${sizeLabel}/b/index.html`,
        activationDelayMs: scenario === 'pending' ? options.pendingLeadMs : options.readyLeadMs,
        hostWorkMs: options.hostWorkMs,
        interactionWindowMs: options.interactionWindowMs,
      }),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Experiment sample timed out')), options.timeoutMs);
      }),
    ]).finally(() => clearTimeout(timer));
    await inputSent;
    if (errors.length) throw new Error(errors.join('\n'));
    if (!result.trustedInput || !Number.isFinite(result.inputDelayMs) || !Number.isFinite(result.inputPaintMs)) {
      throw new Error(`Trusted input missing: ${JSON.stringify(result)}`);
    }
    if (result.executions !== 1 || result.preparationExecutions !== 0 || !result.cleanupPassed || result.hostPolluted) {
      throw new Error(`Invalid semantics: ${JSON.stringify(result)}`);
    }
    if (
      (variant === 'factory' && scenario === 'ready' && !result.factoryHit) ||
      ((variant !== 'factory' || scenario === 'miss') && result.factoryHit)
    ) {
      throw new Error(`Unexpected factory hit: ${JSON.stringify(result)}`);
    }
    if (
      variant !== 'cold' &&
      scenario === 'pending' &&
      !['fetching', 'registering'].includes(result.prepareStateAtActivation)
    ) {
      throw new Error(`Pending sample was already ready: ${JSON.stringify(result)}`);
    }
    const metadata = fixture.fixtures.find((item) => item.size === sizeLabel && item.revision === 'a');
    if (result.checksum !== metadata.expectedChecksum || result.moduleExecutions !== metadata.moduleCount) {
      throw new Error(`Incomplete module execution: ${JSON.stringify(result)}`);
    }
    if (result.currentScriptSrc !== `${fixture.origin}/app/${sizeLabel}/a/entry.js`) {
      throw new Error(`currentScript drift: ${result.currentScriptSrc}`);
    }
    const sample = {
      trial,
      round,
      position,
      warmup,
      variant,
      scenario,
      size: sizes[sizeLabel],
      sizeLabel,
      ...(arm ? { arm } : {}),
      ...result,
      serverRequests: fixture.getRequestCount(),
      serverRequestsByPath: Object.fromEntries(
        fixture.fixtures
          .filter((item) => item.size === sizeLabel)
          .flatMap((item) => [item.entryPath, item.scriptPath])
          .map((path) => [path, fixture.getRequestCount(path)]),
      ),
    };
    await appendFile(
      resolve(options.output, arm ? 'calibration.jsonl' : 'samples.jsonl'),
      `${JSON.stringify(sample)}\n`,
    );
    return sample;
  } finally {
    clearTimeout(inputTimer);
    await context.close();
  }
}

try {
  await Promise.all([fixture.start(), host.start()]);
  await writeFile(
    resolve(options.output, 'environment.json'),
    JSON.stringify({ environment, options, fixtures: fixture.fixtures }, null, 2),
  );
  for (let trial = 0; trial < options.trials; trial += 1) {
    browser = await chromium.launch({ headless: true, args: environment.browserArgs });
    environment.chromium = browser.version();
    await writeFile(
      resolve(options.output, 'environment.json'),
      JSON.stringify({ environment, options, fixtures: fixture.fixtures }, null, 2),
    );
    // Same implementation under two aliases, independent contexts, no discarded failures.
    for (let round = -options.warmup; round < options.calibrationSamples; round += 1) {
      for (const [position, arm] of pairedOrder(['a', 'b'], round, options.seed + trial).entries()) {
        calibrationSamples.push(
          await runSample({
            trial,
            round: round + options.warmup,
            position,
            warmup: round < 0,
            sizeLabel: options.calibrationSize,
            scenario: 'ready',
            variant: 'fetch',
            arm,
          }),
        );
      }
    }
    console.log(`Trial ${trial + 1}/${options.trials}: A/A collected`);
    for (let round = -options.warmup; round < options.samples; round += 1) {
      for (const sizeLabel of shuffle(options.sizes)) {
        for (const scenario of shuffle(options.scenarios)) {
          const cellSeed =
            options.seed + trial * 100 + options.sizes.indexOf(sizeLabel) * 10 + options.scenarios.indexOf(scenario);
          for (const [position, variant] of pairedOrder(['cold', 'fetch', 'factory'], round, cellSeed).entries()) {
            samples.push(
              await runSample({
                trial,
                round: round + options.warmup,
                position,
                sizeLabel,
                scenario,
                variant,
                warmup: round < 0,
              }),
            );
          }
        }
      }
      console.log(
        `Trial ${trial + 1}/${options.trials}, round ${round + 1}/${options.samples}: ${samples.length} samples retained`,
      );
    }
    await browser.close();
    browser = undefined;
  }
  const summary = summarizeClassicExperiment(samples, { seed: options.seed });
  summary.calibration = Object.fromEntries(
    ['activationMountMs', 'activationPaintMs'].map((metric) => {
      const trials = Array.from({ length: options.trials }, (_, trial) => {
        const ordered = calibrationSamples
          .filter((sample) => sample.trial === trial && !sample.warmup)
          .sort((left, right) => left.round - right.round);
        return {
          reference: ordered.filter((sample) => sample.arm === 'a').map((sample) => sample[metric]),
          candidate: ordered.filter((sample) => sample.arm === 'b').map((sample) => sample[metric]),
        };
      });
      const comparison = comparePairedTrials(trials, { seed: options.seed });
      return [metric, { ...comparison, ...evaluateCalibration(comparison) }];
    }),
  );
  summary.validationFailures = Object.entries(summary.calibration).flatMap(([metric, entry]) =>
    entry.failures.map((failure) => `${metric}: ${failure}`),
  );
  if (options.trials < 3 || options.samples < 20 || options.calibrationSamples < 20) {
    summary.validationFailures.push(
      'Diagnostic profile: requires at least 3 trials, 20 paired rounds and 20 calibration rounds for performance evidence',
    );
  }
  summary.performanceEvidenceValid = summary.validationFailures.length === 0;
  const result = { environment, options, fixtures: fixture.fixtures, samples, summary };
  await writeFile(
    resolve(options.output, 'summary.json'),
    JSON.stringify({ environment, options, fixtures: fixture.fixtures, summary }, null, 2),
  );
  await writeFile(resolve(options.output, 'report.md'), renderClassicExperimentReport(result));
  await writeFile(
    resolve(options.output, 'status.json'),
    JSON.stringify(
      {
        completed: true,
        performanceEvidenceValid: summary.performanceEvidenceValid,
        samples: samples.length,
        calibrationSamples: calibrationSamples.length,
      },
      null,
      2,
    ),
  );
  console.log(`Complete: ${options.output}`);
  console.log(`A/A: ${JSON.stringify(summary.calibration)}`);
} catch (error) {
  await writeFile(
    resolve(options.output, 'status.json'),
    JSON.stringify({ completed: false, samples: samples.length, error: String(error), stack: error?.stack }, null, 2),
  );
  throw error;
} finally {
  await browser?.close();
  await Promise.all([fixture.close(), host.close()]);
}
