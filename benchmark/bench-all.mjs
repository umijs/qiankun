import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

import { DEFAULT_SUITE_IDS, SUITES } from './scenarios.mjs';
import { renderBenchReport } from './src/console-report.mjs';

const benchmarkRoot = dirname(fileURLToPath(import.meta.url));

const PROFILES = {
  check: {
    calibrationGate: false,
    calibrationSamples: 5,
    comparisonGate: false,
    samples: 5,
    trials: 1,
    warmup: 2,
  },
  full: {
    calibrationGate: true,
    calibrationSamples: 100,
    comparisonGate: true,
    samples: 100,
    trials: 3,
    warmup: 5,
  },
  standard: {
    calibrationGate: true,
    calibrationSamples: 50,
    comparisonGate: true,
    samples: 50,
    trials: 1,
    warmup: 5,
  },
};

// Forwarding these would silently override the per-suite/per-mode arguments this script injects,
// producing a report whose section titles no longer match what actually ran.
const RESERVED_RUNNER_FLAGS = new Set(['suite', 'mode', 'baseline-dir']);

function parseBenchArgs(argv) {
  let profile = 'standard';
  let suites = DEFAULT_SUITE_IDS;
  const passthrough = [];
  for (const argument of argv) {
    const match = /^--([^=]+)=(.+)$/u.exec(argument);
    if (!match) throw new Error(`unknown option: ${argument}`);
    const [, name, value] = match;
    if (name === 'profile') {
      if (!PROFILES[value]) throw new Error(`profile must be one of: ${Object.keys(PROFILES).join(', ')}`);
      profile = value;
    } else if (name === 'suites') {
      suites = value.split(',').map((suite) => suite.trim());
      const unknown = suites.filter((suite) => !Object.hasOwn(SUITES, suite));
      if (unknown.length > 0) {
        throw new Error(`unknown suite(s): ${unknown.join(', ')}; valid suites: ${Object.keys(SUITES).join(', ')}`);
      }
    } else if (RESERVED_RUNNER_FLAGS.has(name)) {
      throw new Error(`--${name} is managed by bench-all; use --suites=a,b to pick suites`);
    } else {
      // Any other --key=value flag is forwarded verbatim to runner.mjs and overrides the profile defaults.
      passthrough.push(argument);
    }
  }
  return { passthrough, profile, suites };
}

function profileRunnerArgs(profile) {
  const settings = PROFILES[profile];
  return [
    `--samples=${settings.samples}`,
    `--warmup=${settings.warmup}`,
    `--calibration-samples=${settings.calibrationSamples}`,
    `--trials=${settings.trials}`,
    `--calibration-gate=${settings.calibrationGate}`,
    `--comparison-gate=${settings.comparisonGate}`,
  ];
}

function createProgressWriter(label) {
  const interactive = process.stdout.isTTY === true;
  let lastLoggedAt = 0;
  return {
    clear() {
      if (interactive) process.stdout.write('\r\u001B[2K');
    },
    update(message) {
      const line = `[bench] ${label} · ${message}`;
      if (interactive) {
        const width = process.stdout.columns ?? 120;
        process.stdout.write(`\r\u001B[2K${line.slice(0, width - 1)}`);
        return;
      }
      const now = Date.now();
      if (now - lastLoggedAt >= 5000) {
        console.log(line);
        lastLoggedAt = now;
      }
    },
  };
}

function runSuite({ runnerArgs, suite, onProgress }) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, ['runner.mjs', `--suite=${suite}`, ...runnerArgs], {
      cwd: benchmarkRoot,
      stdio: ['ignore', 'pipe', 'inherit'],
    });
    let artifactsDir = null;
    const tail = [];
    const lines = createInterface({ input: child.stdout });
    lines.on('line', (line) => {
      const artifactsMatch = /^\[benchmark\] artifacts: (.+)$/u.exec(line);
      if (artifactsMatch) {
        artifactsDir = artifactsMatch[1];
        return;
      }
      if (line.startsWith('[benchmark] ')) {
        onProgress(line.slice('[benchmark] '.length));
        return;
      }
      // The runner's markdown summary lands in summary.md; keep a tail only for failure diagnostics.
      tail.push(line);
      if (tail.length > 400) tail.shift();
    });
    child.on('error', rejectPromise);
    child.on('close', (code) => resolvePromise({ artifactsDir, exitCode: code ?? 1, tail }));
  });
}

async function main() {
  const { passthrough, profile, suites } = parseBenchArgs(process.argv.slice(2));
  const runnerArgs = [...profileRunnerArgs(profile), ...passthrough];
  const startedAt = Date.now();
  const results = [];
  console.log(`[bench] profile ${profile} · suites: ${suites.join(', ')}`);
  if (profile === 'check') {
    console.log('[bench] check profile disables performance gates; results are plumbing evidence only');
  }

  for (const suite of suites) {
    const progress = createProgressWriter(suite);
    progress.update('starting');
    const { artifactsDir, exitCode, tail } = await runSuite({ runnerArgs, suite, onProgress: progress.update });
    progress.clear();

    let run = null;
    let loadError = null;
    if (artifactsDir) {
      try {
        run = JSON.parse(await readFile(join(artifactsDir, 'result.json'), 'utf8'));
      } catch (error) {
        loadError = `failed to read ${join(artifactsDir, 'result.json')}: ${error instanceof Error ? error.message : String(error)}`;
      }
    }
    const passed = exitCode === 0 && run?.passed === true;
    console.log(`[bench] ${suite} ${passed ? 'completed' : 'failed'}${artifactsDir ? ` · ${artifactsDir}` : ''}`);
    if (!run && tail.length > 0) console.error(tail.slice(-40).join('\n'));
    results.push({ artifactsDir, exitCode, loadError, run, suite, title: SUITES[suite].title });
  }

  const report = renderBenchReport({
    colorize: process.stdout.isTTY === true && process.env.NO_COLOR === undefined,
    durationMs: Date.now() - startedAt,
    profile,
    results,
  });
  console.log(`\n${report}`);
  if (results.some((result) => !(result.exitCode === 0 && result.run?.passed === true))) process.exitCode = 1;
}

await main();
