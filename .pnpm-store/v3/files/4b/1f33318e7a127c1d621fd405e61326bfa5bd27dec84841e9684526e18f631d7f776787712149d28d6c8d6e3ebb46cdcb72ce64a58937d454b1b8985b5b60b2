import { setState, GLOBAL_EXPECT, getState } from '@vitest/expect';
import { g as getSnapshotClient, c as createExpect, v as vi, a as getBenchOptions, b as getBenchFn } from './vendor-vi.271667ef.js';
import './vendor-index.087d1af7.js';
import { a as rpc } from './vendor-rpc.cbd8e972.js';
import { g as getFullName } from './vendor-source-map.e6c1997b.js';
import { g as getWorkerState } from './vendor-global.97e4527c.js';
import { getNames } from '@vitest/runner/utils';
import { performance } from 'node:perf_hooks';
import { updateTask } from '@vitest/runner';
import { createDefer, getSafeTimers } from '@vitest/utils';
import 'chai';
import './vendor-_commonjsHelpers.7d1333e8.js';
import '@vitest/snapshot';
import '@vitest/utils/error';
import 'util';
import './vendor-date.6e993429.js';
import '@vitest/spy';
import 'pathe';
import 'std-env';

class VitestTestRunner {
  constructor(config) {
    this.config = config;
  }
  snapshotClient = getSnapshotClient();
  workerState = getWorkerState();
  __vitest_executor;
  cancelRun = false;
  importFile(filepath, source) {
    if (source === "setup")
      this.workerState.moduleCache.delete(filepath);
    return this.__vitest_executor.executeId(filepath);
  }
  onBeforeRun() {
    this.snapshotClient.clear();
  }
  async onAfterRun() {
    const result = await this.snapshotClient.resetCurrent();
    if (result)
      await rpc().snapshotSaved(result);
  }
  onAfterRunSuite(suite) {
    if (this.config.logHeapUsage && typeof process !== "undefined")
      suite.result.heap = process.memoryUsage().heapUsed;
  }
  onAfterRunTest(test) {
    this.snapshotClient.clearTest();
    if (this.config.logHeapUsage && typeof process !== "undefined")
      test.result.heap = process.memoryUsage().heapUsed;
    this.workerState.current = void 0;
  }
  onCancel(_reason) {
    this.cancelRun = true;
  }
  async onBeforeRunTest(test) {
    const name = getNames(test).slice(1).join(" > ");
    if (this.cancelRun)
      test.mode = "skip";
    if (test.mode !== "run") {
      this.snapshotClient.skipTestSnapshots(name);
      return;
    }
    clearModuleMocks(this.config);
    await this.snapshotClient.setTest(test.file.filepath, name, this.workerState.config.snapshotOptions);
    this.workerState.current = test;
  }
  onBeforeRunSuite(suite) {
    if (this.cancelRun)
      suite.mode = "skip";
  }
  onBeforeTryTest(test) {
    var _a;
    setState({
      assertionCalls: 0,
      isExpectingAssertions: false,
      isExpectingAssertionsError: null,
      expectedAssertionsNumber: null,
      expectedAssertionsNumberErrorGen: null,
      testPath: (_a = test.suite.file) == null ? void 0 : _a.filepath,
      currentTestName: getFullName(test),
      snapshotState: this.snapshotClient.snapshotState
    }, globalThis[GLOBAL_EXPECT]);
  }
  onAfterTryTest(test) {
    const {
      assertionCalls,
      expectedAssertionsNumber,
      expectedAssertionsNumberErrorGen,
      isExpectingAssertions,
      isExpectingAssertionsError
      // @ts-expect-error local is untyped
    } = test.context._local ? test.context.expect.getState() : getState(globalThis[GLOBAL_EXPECT]);
    if (expectedAssertionsNumber !== null && assertionCalls !== expectedAssertionsNumber)
      throw expectedAssertionsNumberErrorGen();
    if (isExpectingAssertions === true && assertionCalls === 0)
      throw isExpectingAssertionsError;
  }
  extendTestContext(context) {
    let _expect;
    Object.defineProperty(context, "expect", {
      get() {
        if (!_expect)
          _expect = createExpect(context.meta);
        return _expect;
      }
    });
    Object.defineProperty(context, "_local", {
      get() {
        return _expect != null;
      }
    });
    return context;
  }
}
function clearModuleMocks(config) {
  const { clearMocks, mockReset, restoreMocks, unstubEnvs, unstubGlobals } = config;
  if (restoreMocks)
    vi.restoreAllMocks();
  else if (mockReset)
    vi.resetAllMocks();
  else if (clearMocks)
    vi.clearAllMocks();
  if (unstubEnvs)
    vi.unstubAllEnvs();
  if (unstubGlobals)
    vi.unstubAllGlobals();
}

async function importTinybench() {
  if (!globalThis.EventTarget)
    await import('./vendor-index.98139333.js').then(function (n) { return n.i; });
  return await import('tinybench');
}
function createBenchmarkResult(name) {
  return {
    name,
    rank: 0,
    rme: 0,
    samples: []
  };
}
const benchmarkTasks = /* @__PURE__ */ new WeakMap();
async function runBenchmarkSuite(suite, runner) {
  var _a;
  const { Task, Bench } = await importTinybench();
  const start = performance.now();
  const benchmarkGroup = [];
  const benchmarkSuiteGroup = [];
  for (const task of suite.tasks) {
    if (task.mode !== "run")
      continue;
    if ((_a = task.meta) == null ? void 0 : _a.benchmark)
      benchmarkGroup.push(task);
    else if (task.type === "suite")
      benchmarkSuiteGroup.push(task);
  }
  if (benchmarkSuiteGroup.length)
    await Promise.all(benchmarkSuiteGroup.map((subSuite) => runBenchmarkSuite(subSuite, runner)));
  if (benchmarkGroup.length) {
    const defer = createDefer();
    const benchmarkMap = {};
    suite.result = {
      state: "run",
      startTime: start,
      benchmark: createBenchmarkResult(suite.name)
    };
    updateTask$1(suite);
    benchmarkGroup.forEach((benchmark, idx) => {
      const options = getBenchOptions(benchmark);
      const benchmarkInstance = new Bench(options);
      const benchmarkFn = getBenchFn(benchmark);
      benchmark.result = {
        state: "run",
        startTime: start,
        benchmark: createBenchmarkResult(benchmark.name)
      };
      const id = idx.toString();
      benchmarkMap[id] = benchmark;
      const task = new Task(benchmarkInstance, id, benchmarkFn);
      benchmarkTasks.set(benchmark, task);
      updateTask$1(benchmark);
    });
    benchmarkGroup.forEach((benchmark) => {
      const task = benchmarkTasks.get(benchmark);
      task.addEventListener("complete", (e) => {
        const task2 = e.task;
        const _benchmark = benchmarkMap[task2.name || ""];
        if (_benchmark) {
          const taskRes = task2.result;
          const result = _benchmark.result.benchmark;
          Object.assign(result, taskRes);
          updateTask$1(_benchmark);
        }
      });
      task.addEventListener("error", (e) => {
        const task2 = e.task;
        const _benchmark = benchmarkMap[task2.name || ""];
        defer.reject(_benchmark ? task2.result.error : e);
      });
    });
    const tasks = [];
    for (const benchmark of benchmarkGroup) {
      const task = benchmarkTasks.get(benchmark);
      await task.warmup();
      const { setTimeout } = getSafeTimers();
      tasks.push(await new Promise((resolve) => setTimeout(async () => {
        resolve(await task.run());
      })));
    }
    suite.result.duration = performance.now() - start;
    suite.result.state = "pass";
    tasks.sort((a, b) => a.result.mean - b.result.mean).forEach((cycle, idx) => {
      const benchmark = benchmarkMap[cycle.name || ""];
      benchmark.result.state = "pass";
      if (benchmark) {
        const result = benchmark.result.benchmark;
        result.rank = Number(idx) + 1;
        updateTask$1(benchmark);
      }
    });
    updateTask$1(suite);
    defer.resolve(null);
    await defer;
  }
  function updateTask$1(task) {
    updateTask(task, runner);
  }
}
class NodeBenchmarkRunner {
  constructor(config) {
    this.config = config;
  }
  __vitest_executor;
  importFile(filepath, source) {
    if (source === "setup")
      getWorkerState().moduleCache.delete(filepath);
    return this.__vitest_executor.executeId(filepath);
  }
  async runSuite(suite) {
    await runBenchmarkSuite(suite, this);
  }
  async runTest() {
    throw new Error("`test()` and `it()` is only available in test mode.");
  }
}

export { NodeBenchmarkRunner, VitestTestRunner };
