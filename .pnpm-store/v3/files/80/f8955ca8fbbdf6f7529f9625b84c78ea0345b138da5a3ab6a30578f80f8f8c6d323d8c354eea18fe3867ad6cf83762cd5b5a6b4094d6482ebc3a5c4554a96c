import { isatty } from 'node:tty';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { startTests } from '@vitest/runner';
import { setupColors, createColors } from '@vitest/utils';
import { V as VitestSnapshotEnvironment, s as setupChaiConfig, r as resolveTestRunner } from './vendor-index.9378c9a4.js';
import { s as startCoverageInsideWorker, a as stopCoverageInsideWorker } from './vendor-coverage.78040316.js';
import { g as getWorkerState } from './vendor-global.97e4527c.js';
import { i as index } from './vendor-index.eff408fd.js';
import { setupCommonEnv } from './browser.js';
import 'chai';
import '@vitest/snapshot/environment';
import 'pathe';
import './vendor-paths.84fc7a99.js';
import 'node:url';
import './vendor-rpc.cbd8e972.js';
import './vendor-vi.271667ef.js';
import '@vitest/runner/utils';
import './vendor-index.087d1af7.js';
import 'std-env';
import './vendor-_commonjsHelpers.7d1333e8.js';
import '@vitest/expect';
import '@vitest/snapshot';
import '@vitest/utils/error';
import './vendor-source-map.e6c1997b.js';
import 'util';
import './vendor-date.6e993429.js';
import '@vitest/spy';
import './vendor-run-once.3e5ef7d7.js';

async function run(files, config, executor) {
  const workerState = getWorkerState();
  await setupCommonEnv(config);
  Object.defineProperty(globalThis, "__vitest_index__", {
    value: index,
    enumerable: false
  });
  config.snapshotOptions.snapshotEnvironment = new VitestSnapshotEnvironment(workerState.rpc);
  setupColors(createColors(isatty(1)));
  if (workerState.environment.transformMode === "web") {
    const _require = createRequire(import.meta.url);
    _require.extensions[".css"] = () => ({});
    _require.extensions[".scss"] = () => ({});
    _require.extensions[".sass"] = () => ({});
    _require.extensions[".less"] = () => ({});
  }
  await startCoverageInsideWorker(config.coverage, executor);
  if (config.chaiConfig)
    setupChaiConfig(config.chaiConfig);
  const runner = await resolveTestRunner(config, executor);
  workerState.durations.prepare = performance.now() - workerState.durations.prepare;
  for (const file of files) {
    workerState.filepath = file;
    await startTests([file], runner);
    workerState.filepath = void 0;
  }
  await stopCoverageInsideWorker(config.coverage, executor);
}

export { run };
