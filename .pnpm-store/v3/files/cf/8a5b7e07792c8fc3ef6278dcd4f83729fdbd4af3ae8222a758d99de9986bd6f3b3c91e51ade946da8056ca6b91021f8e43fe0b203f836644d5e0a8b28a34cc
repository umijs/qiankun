import { VitestRunner } from './types.js';
export { CancelReason, VitestRunnerConfig, VitestRunnerConstructor, VitestRunnerImportSource } from './types.js';
import { T as Task, F as File, d as SuiteAPI, e as TestAPI, f as SuiteCollector, g as SuiteHooks, O as OnTestFailedHandler, a as Test } from './tasks-abce80cc.js';
export { D as DoneCallback, o as Fixtures, p as HookCleanupCallback, H as HookListener, R as RunMode, r as RuntimeContext, t as SequenceHooks, u as SequenceSetupFiles, S as Suite, q as SuiteFactory, i as TaskBase, b as TaskCustom, j as TaskMeta, k as TaskResult, l as TaskResultPack, h as TaskState, s as TestContext, m as TestFunction, n as TestOptions } from './tasks-abce80cc.js';
import { Awaitable } from '@vitest/utils';

declare function updateTask(task: Task, runner: VitestRunner): void;
declare function startTests(paths: string[], runner: VitestRunner): Promise<File[]>;

declare const suite: SuiteAPI;
declare const test: TestAPI;
declare const describe: SuiteAPI;
declare const it: TestAPI;
declare function getCurrentSuite<ExtraContext = {}>(): SuiteCollector<ExtraContext>;

declare function beforeAll(fn: SuiteHooks['beforeAll'][0], timeout?: number): void;
declare function afterAll(fn: SuiteHooks['afterAll'][0], timeout?: number): void;
declare function beforeEach<ExtraContext = {}>(fn: SuiteHooks<ExtraContext>['beforeEach'][0], timeout?: number): void;
declare function afterEach<ExtraContext = {}>(fn: SuiteHooks<ExtraContext>['afterEach'][0], timeout?: number): void;
declare const onTestFailed: (fn: OnTestFailedHandler) => void;

declare function setFn(key: Test, fn: (() => Awaitable<void>)): void;
declare function getFn<Task = Test>(key: Task): (() => Awaitable<void>);

declare function getCurrentTest(): Test<{}> | undefined;

export { File, OnTestFailedHandler, SuiteAPI, SuiteCollector, SuiteHooks, Task, Test, TestAPI, VitestRunner, afterAll, afterEach, beforeAll, beforeEach, describe, getCurrentSuite, getCurrentTest, getFn, it, onTestFailed, setFn, startTests, suite, test, updateTask };
