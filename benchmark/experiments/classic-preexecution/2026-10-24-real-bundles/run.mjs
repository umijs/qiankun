import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile, appendFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import { createClassicExperimentServer } from './synthetic-fixture.mjs';
import { comparePairedTrials, evaluateCalibration, summarize } from './stats.mjs';
import { createBalancedSchedule } from './schedule.mjs';
const root = dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] || 'check';
const runDir = resolve(root, mode + '-' + new Date().toISOString().replaceAll(':', '-'));
await mkdir(runDir, { recursive: true });
console.log('OUTPUT ' + runDir);
const bodies = Object.fromEntries(
  await Promise.all(
    ['mermaid', 'react-cytoscape'].map(async (name) => [name, await readFile(`${root}/bundles/${name}.js`)]),
  ),
);
const synthetic = createClassicExperimentServer({ latencyMs: 20 });
await synthetic.start();
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public,max-age=600');
  const match = /^\/app\/([^/]+)\/([ab])\/(index.html|entry.js)$/.exec(url.pathname);
  if (match) {
    const [, name, , file] = match;
    if (!bodies[name]) {
      res.writeHead(404);
      res.end();
      return;
    }
    await new Promise((r) => setTimeout(r, 20));
    res.setHeader('Content-Type', file === 'entry.js' ? 'text/javascript' : 'text/html');
    res.end(
      file === 'entry.js'
        ? bodies[name]
        : '<!doctype html><html><head></head><body><script src="./entry.js" entry></script></body></html>',
    );
    return;
  }
  try {
    const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    if (file.includes('..')) throw Error();
    const content = await readFile(`${root}/dist/${file}`);
    res.setHeader('Content-Type', extname(file) === '.js' ? 'text/javascript' : 'text/html');
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const args = ['--site-per-process', '--enable-precise-memory-info'];
const samples = [];
const environment = {
  date: new Date().toISOString(),
  platform: os.platform(),
  release: os.release(),
  cpu: os.cpus()[0].model,
  memory: os.totalmem(),
  node: process.version,
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  bundles: JSON.parse(await readFile(`${root}/bundles/metadata.json`, 'utf8')),
  mode,
  args,
  formalProfile: {
    trials: 3,
    rounds: 20,
    warmups: 2,
    cpus: [1, 4],
    arms: ['a', 'b', 'factory'],
    readyLead: 250,
    AA: { maxAbsoluteDeltaPercent: 3, maxIntervalWidthPercentPoints: 10 },
  },
  measurement:
    'Untraced timing; fresh BrowserContext per sample; new Chromium per trial; CPU throttling affects renderer, not whole physical device; two stable painted frames after mount plus PR core check; JS heap sampled not RSS',
};
async function launch(extra = []) {
  browser = await chromium.launch({ headless: true, args: [...args, ...extra] });
  environment.browser = browser.version();
  return browser;
}
async function sample({
  workload = 'mermaid',
  arm = 'factory',
  cpu = 1,
  scenario = 'ready',
  trace = false,
  ...meta
} = {}) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    locale: 'en-US',
    timezoneId: 'UTC',
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto(origin, { waitUntil: 'load' });
  if (trace)
    await cdp.send('Tracing.start', {
      categories:
        'v8,v8.execute,disabled-by-default-v8.compile,disabled-by-default-v8.runtime_stats,devtools.timeline,disabled-by-default-devtools.timeline,blink.user_timing',
      transferMode: 'ReturnAsStream',
    });
  let inputTask;
  await page.exposeFunction('__CLASSIC_PREEXECUTION_INPUT_START__', () => {
    inputTask = new Promise((done, reject) =>
      setTimeout(
        () =>
          cdp
            .send('Input.dispatchMouseEvent', {
              type: 'mousePressed',
              x: 20,
              y: 20,
              button: 'left',
              clickCount: 1,
              timestamp: Date.now() / 1000,
            })
            .then(() =>
              cdp.send('Input.dispatchMouseEvent', {
                type: 'mouseReleased',
                x: 20,
                y: 20,
                button: 'left',
                clickCount: 1,
                timestamp: Date.now() / 1000,
              }),
            )
            .then(done, reject),
        50,
      ),
    );
  });
  const variant = arm === 'factory' ? 'factory' : 'fetch';
  const entry =
    workload === 'synthetic-5m' ? `${synthetic.origin}/app/5m/a/index.html` : `${origin}/app/${workload}/a/index.html`;
  let result;
  try {
    result = await page.evaluate((config) => window.__CLASSIC_PREEXECUTION__.run(config), {
      variant,
      scenario,
      entry,
      otherEntry: entry.replace('/a/', '/b/'),
      activationDelayMs: scenario === 'pending' ? 10 : 250,
      hostWorkMs: 30,
      interactionWindowMs: 500,
    });
    await inputTask;
    if (errors.length) throw Error(errors.join('\n'));
    if (
      result.executions !== 1 ||
      result.preparationExecutions !== 0 ||
      result.hostPolluted ||
      !result.cleanupPassed ||
      !result.trustedInput
    )
      throw Error('semantics ' + JSON.stringify(result));
    if (arm === 'factory' && scenario === 'ready' && !result.factoryHit) throw Error('factory missed');
    if (workload === 'mermaid' && result.checksum !== 24) throw Error('checksum');
    if (workload === 'react-cytoscape' && result.checksum !== 80) throw Error('checksum');
    // PR observer starts before mount. For async real render also require mount
    // completion followed by two frames; activation paint is the slower endpoint.
    const mark = Object.fromEntries(result.phaseMarks.map((m) => [m.name, m.startTime]));
    result.businessMs = mark['business-end'] - mark['business-start'];
    result.renderMs = mark['render-end'] - mark['render-start'];
    result.registrationMs = arm === 'factory' ? mark['registration-end'] - mark['registration-start'] : 0;
    result = { ...meta, workload, arm, cpu, scenario, ...result };
    if (trace) {
      const complete = new Promise((r) => cdp.once('Tracing.tracingComplete', r));
      await cdp.send('Tracing.end');
      const { stream } = await complete;
      let data = '';
      while (true) {
        const part = await cdp.send('IO.read', { handle: stream });
        data += part.base64Encoded ? Buffer.from(part.data, 'base64').toString() : part.data;
        if (part.eof) break;
      }
      await cdp.send('IO.close', { handle: stream });
      await writeFile(`${runDir}/${workload}-${cpu}-${arm}-trace.json`, data);
    }
    await appendFile(`${runDir}/samples.jsonl`, JSON.stringify(result) + '\n');
    samples.push(result);
    return result;
  } catch (e) {
    await writeFile(
      `${runDir}/failure.json`,
      JSON.stringify({ workload, arm, cpu, scenario, error: String(e), errors }, null, 2),
    );
    throw e;
  } finally {
    await context.close();
  }
}
try {
  if (mode === 'formal') {
    for (let trial = 0; trial < 3; trial++) {
      await launch();
      for (const cpu of [1, 4])
        for (const workload of ['react-cytoscape', 'mermaid']) {
          for (let warm = 0; warm < 2; warm++)
            for (const arm of ['a', 'b', 'factory'])
              await sample({ trial, round: warm, warmup: true, cpu, workload, arm });
          const schedule = createBalancedSchedule(
            ['a', 'b', 'factory'],
            20,
            20261024 + trial * 10 + cpu + (workload === 'mermaid' ? 100 : 0),
          );
          for (const { round, position, variant: arm } of schedule)
            await sample({ trial, round, position, warmup: false, cpu, workload, arm });
          console.log(`trial ${trial} CPU ${cpu} ${workload}: complete ${samples.length}`);
        }
      await browser.close();
      browser = undefined;
    }
  } else if (mode === 'trace') {
    for (const workload of ['synthetic-5m', 'mermaid', 'react-cytoscape'])
      for (const arm of ['a', 'factory']) {
        const log = `${runDir}/${workload}-${arm}-v8.log`;
        await launch([`--js-flags=--log-function_events --logfile=${log}`]);
        await sample({ workload, arm, trace: true });
        await browser.close();
        browser = undefined;
        console.log('traced ' + workload + ' ' + arm);
      }
  } else {
    await launch();
    for (const workload of ['react-cytoscape', 'mermaid'])
      for (const arm of ['a', 'factory']) console.log(JSON.stringify(await sample({ workload, arm })));
  }
  const summary = [];
  if (mode === 'formal')
    for (const cpu of [1, 4])
      for (const workload of ['react-cytoscape', 'mermaid']) {
        const cell = samples.filter((s) => !s.warmup && s.cpu === cpu && s.workload === workload);
        const row = { cpu, workload, metrics: {}, calibration: {}, cells: {} };
        for (const arm of ['a', 'b', 'factory'])
          row.cells[arm] = Object.fromEntries(
            [
              'activationMountMs',
              'activationPaintMs',
              'prepareMs',
              'hostPaintMs',
              'interactionDelayMs',
              'peakHeapBytes',
              'businessMs',
              'renderMs',
              'registrationMs',
            ].map((key) => [key, summarize(cell.filter((s) => s.arm === arm).map((s) => s[key]))]),
          );
        for (const metric of ['activationMountMs', 'activationPaintMs', 'hostPaintMs', 'interactionDelayMs']) {
          const makeTrials = (arm) =>
            Array.from({ length: 3 }, (_, trial) => ({
              reference: cell
                .filter((s) => s.trial === trial && s.arm === 'a')
                .sort((a, b) => a.round - b.round)
                .map((s) => s[metric]),
              candidate: cell
                .filter((s) => s.trial === trial && s.arm === arm)
                .sort((a, b) => a.round - b.round)
                .map((s) => s[metric]),
            }));
          row.metrics[metric] = comparePairedTrials(makeTrials('factory'), { seed: 20261024 });
          if (metric.startsWith('activation')) {
            const c = comparePairedTrials(makeTrials('b'), { seed: 20261024 });
            row.calibration[metric] = { ...c, ...evaluateCalibration(c) };
          }
        }
        row.performanceEvidenceValid = Object.values(row.calibration).every((c) => c.passed);
        summary.push(row);
      }
  await writeFile(`${runDir}/summary.json`, JSON.stringify(summary, null, 2));
  await writeFile(`${runDir}/environment.json`, JSON.stringify(environment, null, 2));
  await writeFile(`${runDir}/status.json`, JSON.stringify({ completed: true, samples: samples.length }, null, 2));
  console.log(
    JSON.stringify(
      summary.map((r) => ({
        cpu: r.cpu,
        workload: r.workload,
        valid: r.performanceEvidenceValid,
        mount: r.metrics.activationMountMs,
        paint: r.metrics.activationPaintMs,
      })),
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
  await Promise.all([new Promise((r) => server.close(r)), synthetic.close()]);
}
