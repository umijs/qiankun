import { performance } from 'node:perf_hooks';
import { startTests } from '@vitest/runner';
import './vendor-index.087d1af7.js';
import { d as globalExpect, r as resetModules, v as vi } from './vendor-vi.271667ef.js';
import { s as startCoverageInsideWorker, a as stopCoverageInsideWorker } from './vendor-coverage.78040316.js';
import { V as VitestSnapshotEnvironment, s as setupChaiConfig, r as resolveTestRunner } from './vendor-index.9378c9a4.js';
import { createRequire } from 'node:module';
import { isatty } from 'node:tty';
import { installSourcemapsSupport } from 'vite-node/source-map';
import { setupColors, createColors, getSafeTimers } from '@vitest/utils';
import { i as index } from './vendor-index.eff408fd.js';
import { setupCommonEnv } from './browser.js';
import { g as getWorkerState } from './vendor-global.97e4527c.js';
import 'pathe';
import 'std-env';
import '@vitest/runner/utils';
import 'chai';
import './vendor-_commonjsHelpers.7d1333e8.js';
import '@vitest/expect';
import '@vitest/snapshot';
import '@vitest/utils/error';
import './vendor-source-map.e6c1997b.js';
import 'util';
import './vendor-date.6e993429.js';
import '@vitest/spy';
import '@vitest/snapshot/environment';
import './vendor-paths.84fc7a99.js';
import 'node:url';
import './vendor-rpc.cbd8e972.js';
import './vendor-run-once.3e5ef7d7.js';

let globalSetup = false;
async function setupGlobalEnv(config, { environment }) {
  await setupCommonEnv(config);
  Object.defineProperty(globalThis, "__vitest_index__", {
    value: index,
    enumerable: false
  });
  const state = getWorkerState();
  if (!state.config.snapshotOptions.snapshotEnvironment)
    state.config.snapshotOptions.snapshotEnvironment = new VitestSnapshotEnvironment(state.rpc);
  if (globalSetup)
    return;
  globalSetup = true;
  setupColors(createColors(isatty(1)));
  if (environment.transformMode === "web") {
    const _require = createRequire(import.meta.url);
    _require.extensions[".css"] = () => ({});
    _require.extensions[".scss"] = () => ({});
    _require.extensions[".sass"] = () => ({});
    _require.extensions[".less"] = () => ({});
  }
  installSourcemapsSupport({
    getSourceMap: (source) => state.moduleCache.getSourceMap(source)
  });
  await setupConsoleLogSpy(state);
}
async function setupConsoleLogSpy(state) {
  const { createCustomConsole } = await import('./chunk-runtime-console.ea222ffb.js');
  globalThis.console = createCustomConsole(state);
}
async function withEnv({ environment }, options, fn) {
  globalThis.__vitest_environment__ = environment.name;
  globalExpect.setState({
    environment: environment.name
  });
  const env = await environment.setup(globalThis, options);
  try {
    await fn();
  } finally {
    const { setTimeout } = getSafeTimers();
    await new Promise((resolve) => setTimeout(resolve));
    await env.teardown(globalThis);
  }
}

async function run(files, config, environment, executor) {
  const workerState = getWorkerState();
  await setupGlobalEnv(config, environment);
  await startCoverageInsideWorker(config.coverage, executor);
  if (config.chaiConfig)
    setupChaiConfig(config.chaiConfig);
  const runner = await resolveTestRunner(config, executor);
  workerState.onCancel.then((reason) => {
    var _a;
    return (_a = runner.onCancel) == null ? void 0 : _a.call(runner, reason);
  });
  workerState.durations.prepare = performance.now() - workerState.durations.prepare;
  workerState.environment = environment.environment;
  workerState.durations.environment = performance.now();
  await withEnv(environment, environment.options || config.environmentOptions || {}, async () => {
    workerState.durations.environment = performance.now() - workerState.durations.environment;
    for (const file of files) {
      if (config.isolate) {
        workerState.mockMap.clear();
        resetModules(workerState.moduleCache, true);
      }
      workerState.filepath = file;
      await startTests([file], runner);
      vi.resetConfig();
      vi.restoreAllMocks();
    }
    await stopCoverageInsideWorker(config.coverage, executor);
  });
  workerState.environmentTeardownRun = true;
}

export { run };
