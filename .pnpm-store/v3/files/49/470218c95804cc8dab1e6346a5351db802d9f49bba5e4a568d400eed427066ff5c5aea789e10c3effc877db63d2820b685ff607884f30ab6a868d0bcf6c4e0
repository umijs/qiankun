import { Test, File, TaskResultPack, CancelReason } from '@vitest/runner';
export { DoneCallback, File, HookCleanupCallback, HookListener, OnTestFailedHandler, RunMode, RuntimeContext, SequenceHooks, SequenceSetupFiles, Suite, SuiteAPI, SuiteCollector, SuiteFactory, SuiteHooks, Task, TaskBase, TaskMeta, TaskResult, TaskResultPack, TaskState, Test, TestAPI, TestContext, TestFunction, TestOptions, afterAll, afterEach, beforeAll, beforeEach, describe, it, onTestFailed, suite, test } from '@vitest/runner';
import { h as BenchmarkAPI, F as FakeTimerInstallOpts, M as MockFactoryWithHelper, i as RuntimeConfig, A as AfterSuiteRunMeta, j as UserConsoleLog, R as ResolvedConfig, k as ModuleGraphData, l as Reporter } from './types-3c7dbfa5.js';
export { x as ApiConfig, a0 as ArgumentsType, $ as Arrayable, Z as Awaitable, B as BaseCoverageOptions, ae as BenchFunction, ac as Benchmark, ad as BenchmarkResult, ab as BenchmarkUserOptions, t as BuiltinEnvironment, w as CSSModuleScopeStrategy, o as CollectLineNumbers, p as CollectLines, a2 as Constructable, r as Context, O as ContextRPC, L as ContextTestEnvironment, a9 as CoverageIstanbulOptions, C as CoverageOptions, a as CoverageProvider, b as CoverageProviderModule, a8 as CoverageReporter, d as CoverageV8Options, aa as CustomProviderOptions, D as DepsOptimizationOptions, E as Environment, y as EnvironmentOptions, a4 as EnvironmentReturn, I as InlineConfig, J as JSDOMOptions, a3 as ModuleCache, a1 as MutableArray, _ as Nullable, a6 as OnServerRestartHandler, P as ProjectConfig, m as RawErrsMap, a7 as ReportContext, S as ResolveIdFunction, c as ResolvedCoverageOptions, N as ResolvedTestEnvironment, q as RootAndTarget, K as RunnerRPC, H as RuntimeRPC, z as TransformModePatterns, n as TscErrorInfo, G as TypecheckConfig, U as UserConfig, e as Vitest, u as VitestEnvironment, v as VitestPool, V as VitestRunMode, a5 as VmEnvironmentReturn, Q as WorkerContext, Y as WorkerGlobalState, X as WorkerRPC } from './types-3c7dbfa5.js';
import { ExpectStatic } from '@vitest/expect';
export { Assertion, AsymmetricMatchersContaining, ExpectStatic, JestAssertion } from '@vitest/expect';
import { spyOn, fn, MaybeMockedDeep, MaybeMocked, MaybePartiallyMocked, MaybePartiallyMockedDeep, EnhancedSpy } from '@vitest/spy';
export { EnhancedSpy, Mock, MockContext, MockInstance, Mocked, MockedClass, MockedFunction, MockedObject, SpyInstance } from '@vitest/spy';
export { SnapshotEnvironment } from '@vitest/snapshot/environment';
import { SnapshotResult } from '@vitest/snapshot';
export { SnapshotData, SnapshotMatchOptions, SnapshotResult, SnapshotStateOptions, SnapshotSummary, SnapshotUpdateState, UncheckedSnapshot } from '@vitest/snapshot';
import { TransformResult } from 'vite';
import * as chai from 'chai';
export { chai };
export { assert, should } from 'chai';
export { UserWorkspaceConfig } from './config.js';
export { ErrorWithDiff, ParsedStack } from '@vitest/utils';
export { Bench as BenchFactory, Options as BenchOptions, Task as BenchTask, TaskResult as BenchTaskResult } from 'tinybench';
import 'vite-node';
import '@vitest/runner/utils';
import 'vite-node/client';
import '@vitest/snapshot/manager';
import 'vite-node/server';
import 'node:worker_threads';
import 'rollup';
import 'node:fs';

declare type Not<T extends boolean> = T extends true ? false : true;
declare type And<Types extends boolean[]> = Types[number] extends true ? true : false;
declare type Eq<Left extends boolean, Right extends boolean> = Left extends true ? Right : Not<Right>;
declare const secret: unique symbol;
declare type Secret = typeof secret;
declare type IsNever<T> = [T] extends [never] ? true : false;
declare type IsAny<T> = [T] extends [Secret] ? Not<IsNever<T>> : false;
declare type IsUnknown<T> = [unknown] extends [T] ? Not<IsAny<T>> : false;
/**
 * Recursively walk a type and replace it with a branded type related to the original. This is useful for
 * equality-checking stricter than `A extends B ? B extends A ? true : false : false`, because it detects
 * the difference between a few edge-case types that vanilla typescript doesn't by default:
 * - `any` vs `unknown`
 * - `{ readonly a: string }` vs `{ a: string }`
 * - `{ a?: string }` vs `{ a: string | undefined }`
 */
declare type DeepBrand<T> = IsNever<T> extends true ? {
    type: 'never';
} : IsAny<T> extends true ? {
    type: 'any';
} : IsUnknown<T> extends true ? {
    type: 'unknown';
} : T extends string | number | boolean | symbol | bigint | null | undefined | void ? {
    type: 'primitive';
    value: T;
} : T extends new (...args: any[]) => any ? {
    type: 'constructor';
    params: ConstructorParams<T>;
    instance: DeepBrand<InstanceType<Extract<T, new (...args: any) => any>>>;
} : T extends (...args: infer P) => infer R ? {
    type: 'function';
    params: DeepBrand<P>;
    return: DeepBrand<R>;
    this: DeepBrand<ThisParameterType<T>>;
} : T extends any[] ? {
    type: 'array';
    items: {
        [K in keyof T]: T[K];
    };
} : {
    type: 'object';
    properties: {
        [K in keyof T]: DeepBrand<T[K]>;
    };
    readonly: ReadonlyKeys<T>;
    required: RequiredKeys<T>;
    optional: OptionalKeys<T>;
    constructorParams: DeepBrand<ConstructorParams<T>>;
};
declare type RequiredKeys<T> = Extract<{
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T], keyof T>;
declare type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>;
declare type ReadonlyKeys<T> = Extract<{
    [K in keyof T]-?: ReadonlyEquivalent<{
        [_K in K]: T[K];
    }, {
        -readonly [_K in K]: T[K];
    }> extends true ? never : K;
}[keyof T], keyof T>;
declare type ReadonlyEquivalent<X, Y> = Extends<(<T>() => T extends X ? true : false), (<T>() => T extends Y ? true : false)>;
declare type Extends<L, R> = IsNever<L> extends true ? IsNever<R> : [L] extends [R] ? true : false;
declare type StrictExtends<L, R> = Extends<DeepBrand<L>, DeepBrand<R>>;
declare type StrictEqual<L, R> = (<T>() => T extends (L & T) | T ? true : false) extends <T>() => T extends (R & T) | T ? true : false ? IsNever<L> extends IsNever<R> ? true : false : false;
declare type Equal<Left, Right, Branded = true> = Branded extends true ? And<[StrictExtends<Left, Right>, StrictExtends<Right, Left>]> : StrictEqual<Left, Right>;
declare type Params<Actual> = Actual extends (...args: infer P) => any ? P : never;
declare type ConstructorParams<Actual> = Actual extends new (...args: infer P) => any ? Actual extends new () => any ? P | [] : P : never;
declare type MismatchArgs<ActualResult extends boolean, ExpectedResult extends boolean> = Eq<ActualResult, ExpectedResult> extends true ? [] : [never];
interface ExpectTypeOfOptions {
    positive: boolean;
    branded: boolean;
}
interface ExpectTypeOf<Actual, Options extends ExpectTypeOfOptions> {
    toBeAny: (...MISMATCH: MismatchArgs<IsAny<Actual>, Options['positive']>) => true;
    toBeUnknown: (...MISMATCH: MismatchArgs<IsUnknown<Actual>, Options['positive']>) => true;
    toBeNever: (...MISMATCH: MismatchArgs<IsNever<Actual>, Options['positive']>) => true;
    toBeFunction: (...MISMATCH: MismatchArgs<Extends<Actual, (...args: any[]) => any>, Options['positive']>) => true;
    toBeObject: (...MISMATCH: MismatchArgs<Extends<Actual, object>, Options['positive']>) => true;
    toBeArray: (...MISMATCH: MismatchArgs<Extends<Actual, any[]>, Options['positive']>) => true;
    toBeNumber: (...MISMATCH: MismatchArgs<Extends<Actual, number>, Options['positive']>) => true;
    toBeString: (...MISMATCH: MismatchArgs<Extends<Actual, string>, Options['positive']>) => true;
    toBeBoolean: (...MISMATCH: MismatchArgs<Extends<Actual, boolean>, Options['positive']>) => true;
    toBeVoid: (...MISMATCH: MismatchArgs<Extends<Actual, void>, Options['positive']>) => true;
    toBeSymbol: (...MISMATCH: MismatchArgs<Extends<Actual, symbol>, Options['positive']>) => true;
    toBeNull: (...MISMATCH: MismatchArgs<Extends<Actual, null>, Options['positive']>) => true;
    toBeUndefined: (...MISMATCH: MismatchArgs<Extends<Actual, undefined>, Options['positive']>) => true;
    toBeNullable: (...MISMATCH: MismatchArgs<Not<Equal<Actual, NonNullable<Actual>, Options['branded']>>, Options['positive']>) => true;
    toMatchTypeOf: {
        <Expected>(...MISMATCH: MismatchArgs<Extends<Actual, Expected>, Options['positive']>): true;
        <Expected>(expected: Expected, ...MISMATCH: MismatchArgs<Extends<Actual, Expected>, Options['positive']>): true;
    };
    toEqualTypeOf: {
        <Expected>(...MISMATCH: MismatchArgs<Equal<Actual, Expected, Options['branded']>, Options['positive']>): true;
        <Expected>(expected: Expected, ...MISMATCH: MismatchArgs<Equal<Actual, Expected, Options['branded']>, Options['positive']>): true;
    };
    toBeCallableWith: Options['positive'] extends true ? (...args: Params<Actual>) => true : never;
    toBeConstructibleWith: Options['positive'] extends true ? (...args: ConstructorParams<Actual>) => true : never;
    toHaveProperty: <K extends string>(key: K, ...MISMATCH: MismatchArgs<Extends<K, keyof Actual>, Options['positive']>) => K extends keyof Actual ? ExpectTypeOf<Actual[K], Options> : true;
    extract: <V>(v?: V) => ExpectTypeOf<Extract<Actual, V>, Options>;
    exclude: <V>(v?: V) => ExpectTypeOf<Exclude<Actual, V>, Options>;
    parameter: <K extends keyof Params<Actual>>(number: K) => ExpectTypeOf<Params<Actual>[K], Options>;
    parameters: ExpectTypeOf<Params<Actual>, Options>;
    constructorParameters: ExpectTypeOf<ConstructorParams<Actual>, Options>;
    thisParameter: ExpectTypeOf<ThisParameterType<Actual>, Options>;
    instance: Actual extends new (...args: any[]) => infer I ? ExpectTypeOf<I, Options> : never;
    returns: Actual extends (...args: any[]) => infer R ? ExpectTypeOf<R, Options> : never;
    resolves: Actual extends PromiseLike<infer R> ? ExpectTypeOf<R, Options> : never;
    items: Actual extends ArrayLike<infer R> ? ExpectTypeOf<R, Options> : never;
    guards: Actual extends (v: any, ...args: any[]) => v is infer T ? ExpectTypeOf<T, Options> : never;
    asserts: Actual extends (v: any, ...args: any[]) => asserts v is infer T ? unknown extends T ? never : ExpectTypeOf<T, Options> : never;
    branded: Omit<ExpectTypeOf<Actual, {
        positive: Options['positive'];
        branded: true;
    }>, 'branded'>;
    not: Omit<ExpectTypeOf<Actual, {
        positive: Not<Options['positive']>;
        branded: Options['branded'];
    }>, 'not'>;
}
declare type _ExpectTypeOf = {
    <Actual>(actual: Actual): ExpectTypeOf<Actual, {
        positive: true;
        branded: false;
    }>;
    <Actual>(): ExpectTypeOf<Actual, {
        positive: true;
        branded: false;
    }>;
};
/**
 * Similar to Jest's `expect`, but with type-awareness.
 * Gives you access to a number of type-matchers that let you make assertions about the
 * form of a reference or generic type parameter.
 *
 * @example
 * import {foo, bar} from '../foo'
 * import {expectTypeOf} from 'expect-type'
 *
 * test('foo types', () => {
 *   // make sure `foo` has type {a: number}
 *   expectTypeOf(foo).toMatchTypeOf({a: 1})
 *   expectTypeOf(foo).toHaveProperty('a').toBeNumber()
 *
 *   // make sure `bar` is a function taking a string:
 *   expectTypeOf(bar).parameter(0).toBeString()
 *   expectTypeOf(bar).returns.not.toBeAny()
 * })
 *
 * @description
 * See the [full docs](https://npmjs.com/package/expect-type#documentation) for lots more examples.
 */
declare const expectTypeOf: _ExpectTypeOf;

interface AssertType {
    <T>(value: T): void;
}
declare const assertType: AssertType;

declare const bench: BenchmarkAPI;

/**
 * This utils allows computational intensive tasks to only be ran once
 * across test reruns to improve the watch mode performance.
 *
 * Currently only works with `isolate: false`
 *
 * @experimental
 */
declare function runOnce<T>(fn: (() => T), key?: string): T;
/**
 * Get a boolean indicates whether the task is running in the first time.
 * Could only be `false` in watch mode.
 *
 * Currently only works with `isolate: false`
 *
 * @experimental
 */
declare function isFirstRun(): boolean;

declare function createExpect(test?: Test): ExpectStatic;
declare const globalExpect: ExpectStatic;

interface VitestUtils {
    useFakeTimers(config?: FakeTimerInstallOpts): this;
    useRealTimers(): this;
    runOnlyPendingTimers(): this;
    runOnlyPendingTimersAsync(): Promise<this>;
    runAllTimers(): this;
    runAllTimersAsync(): Promise<this>;
    runAllTicks(): this;
    advanceTimersByTime(ms: number): this;
    advanceTimersByTimeAsync(ms: number): Promise<this>;
    advanceTimersToNextTimer(): this;
    advanceTimersToNextTimerAsync(): Promise<this>;
    getTimerCount(): number;
    setSystemTime(time: number | string | Date): this;
    getMockedSystemTime(): Date | null;
    getRealSystemTime(): number;
    clearAllTimers(): this;
    spyOn: typeof spyOn;
    fn: typeof fn;
    /**
     * Run the factory before imports are evaluated. You can return a value from the factory
     * to reuse it inside your `vi.mock` factory and tests.
     */
    hoisted<T>(factory: () => T): T;
    /**
     * Makes all `imports` to passed module to be mocked.
     * - If there is a factory, will return it's result. The call to `vi.mock` is hoisted to the top of the file,
     * so you don't have access to variables declared in the global file scope, if you didn't put them before imports!
     * - If `__mocks__` folder with file of the same name exist, all imports will
     * return it.
     * - If there is no `__mocks__` folder or a file with the same name inside, will call original
     * module and mock it.
     * @param path Path to the module. Can be aliased, if your config supports it
     * @param factory Factory for the mocked module. Has the highest priority.
     */
    mock(path: string, factory?: MockFactoryWithHelper): void;
    /**
     * Removes module from mocked registry. All subsequent calls to import will
     * return original module even if it was mocked.
     * @param path Path to the module. Can be aliased, if your config supports it
     */
    unmock(path: string): void;
    doMock(path: string, factory?: () => any): void;
    doUnmock(path: string): void;
    /**
     * Imports module, bypassing all checks if it should be mocked.
     * Can be useful if you want to mock module partially.
     * @example
     * vi.mock('./example', async () => {
     *  const axios = await vi.importActual('./example')
     *
     *  return { ...axios, get: vi.fn() }
     * })
     * @param path Path to the module. Can be aliased, if your config supports it
     * @returns Actual module without spies
     */
    importActual<T = unknown>(path: string): Promise<T>;
    /**
     * Imports a module with all of its properties and nested properties mocked.
     * For the rules applied, see docs.
     * @param path Path to the module. Can be aliased, if your config supports it
     * @returns Fully mocked module
     */
    importMock<T>(path: string): Promise<MaybeMockedDeep<T>>;
    /**
     * Type helpers for TypeScript. In reality just returns the object that was passed.
     *
     * When `partial` is `true` it will expect a `Partial<T>` as a return value.
     * @example
     * import example from './example'
     * vi.mock('./example')
     *
     * test('1+1 equals 2' async () => {
     *  vi.mocked(example.calc).mockRestore()
     *
     *  const res = example.calc(1, '+', 1)
     *
     *  expect(res).toBe(2)
     * })
     * @param item Anything that can be mocked
     * @param deep If the object is deeply mocked
     * @param options If the object is partially or deeply mocked
     */
    mocked<T>(item: T, deep?: false): MaybeMocked<T>;
    mocked<T>(item: T, deep: true): MaybeMockedDeep<T>;
    mocked<T>(item: T, options: {
        partial?: false;
        deep?: false;
    }): MaybeMocked<T>;
    mocked<T>(item: T, options: {
        partial?: false;
        deep: true;
    }): MaybeMockedDeep<T>;
    mocked<T>(item: T, options: {
        partial: true;
        deep?: false;
    }): MaybePartiallyMocked<T>;
    mocked<T>(item: T, options: {
        partial: true;
        deep: true;
    }): MaybePartiallyMockedDeep<T>;
    mocked<T>(item: T): MaybeMocked<T>;
    isMockFunction(fn: any): fn is EnhancedSpy;
    clearAllMocks(): this;
    resetAllMocks(): this;
    restoreAllMocks(): this;
    /**
     * Makes value available on global namespace.
     * Useful, if you want to have global variables available, like `IntersectionObserver`.
     * You can return it back to original value with `vi.unstubGlobals`, or by enabling `unstubGlobals` config option.
     */
    stubGlobal(name: string | symbol | number, value: unknown): this;
    /**
     * Changes the value of `import.meta.env` and `process.env`.
     * You can return it back to original value with `vi.unstubEnvs`, or by enabling `unstubEnvs` config option.
     */
    stubEnv(name: string, value: string): this;
    /**
     * Reset the value to original value that was available before first `vi.stubGlobal` was called.
     */
    unstubAllGlobals(): this;
    /**
     * Reset environmental variables to the ones that were available before first `vi.stubEnv` was called.
     */
    unstubAllEnvs(): this;
    resetModules(): this;
    /**
     * Wait for all imports to load. Useful, if you have a synchronous call that starts
     * importing a module that you cannot await otherwise.
     * Will also wait for new imports, started during the wait.
     */
    dynamicImportSettled(): Promise<void>;
    /**
     * Updates runtime config. You can only change values that are used when executing tests.
     */
    setConfig(config: RuntimeConfig): void;
    /**
     * If config was changed with `vi.setConfig`, this will reset it to the original state.
     */
    resetConfig(): void;
}
declare const vitest: VitestUtils;
declare const vi: VitestUtils;

declare function getRunningMode(): "watch" | "run";
declare function isWatchMode(): boolean;

interface TransformResultWithSource extends TransformResult {
    source?: string;
}
interface WebSocketHandlers {
    onCollected(files?: File[]): Promise<void>;
    onTaskUpdate(packs: TaskResultPack[]): void;
    onAfterSuiteRun(meta: AfterSuiteRunMeta): void;
    onDone(name: string): void;
    onCancel(reason: CancelReason): void;
    getCountOfFailedTests(): number;
    sendLog(log: UserConsoleLog): void;
    getFiles(): File[];
    getPaths(): string[];
    getConfig(): ResolvedConfig;
    resolveSnapshotPath(testPath: string): string;
    resolveSnapshotRawPath(testPath: string, rawPath: string): string;
    getModuleGraph(id: string): Promise<ModuleGraphData>;
    getTransformResult(id: string): Promise<TransformResultWithSource | undefined>;
    readFile(id: string): Promise<string | null>;
    writeFile(id: string, content: string, ensureDir?: boolean): Promise<void>;
    removeFile(id: string): Promise<void>;
    createDirectory(id: string): Promise<string | undefined>;
    snapshotSaved(snapshot: SnapshotResult): void;
    rerun(files: string[]): Promise<void>;
    updateSnapshot(file?: File): Promise<void>;
}
interface WebSocketEvents extends Pick<Reporter, 'onCollected' | 'onFinished' | 'onTaskUpdate' | 'onUserConsoleLog' | 'onPathsCollected'> {
    onCancel(reason: CancelReason): void;
}

export { AfterSuiteRunMeta, AssertType, BenchmarkAPI, ExpectTypeOf, ModuleGraphData, Reporter, ResolvedConfig, RuntimeConfig, TransformResultWithSource, UserConsoleLog, WebSocketEvents, WebSocketHandlers, assertType, bench, createExpect, globalExpect as expect, expectTypeOf, getRunningMode, isFirstRun, isWatchMode, runOnce, vi, vitest };
