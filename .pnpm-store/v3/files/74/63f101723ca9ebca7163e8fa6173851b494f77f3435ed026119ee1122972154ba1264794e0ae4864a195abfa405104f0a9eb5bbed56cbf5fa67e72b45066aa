import { VitestRunner, VitestRunnerImportSource, Suite, Test, CancelReason, TestContext } from '@vitest/runner';
import { R as ResolvedConfig } from './types-3c7dbfa5.js';
import '@vitest/snapshot';
import '@vitest/expect';
import 'vite';
import 'vite-node';
import '@vitest/runner/utils';
import '@vitest/utils';
import 'tinybench';
import 'vite-node/client';
import '@vitest/snapshot/manager';
import 'vite-node/server';
import 'node:worker_threads';
import 'rollup';
import 'node:fs';
import 'chai';

declare class VitestTestRunner implements VitestRunner {
    config: ResolvedConfig;
    private snapshotClient;
    private workerState;
    private __vitest_executor;
    private cancelRun;
    constructor(config: ResolvedConfig);
    importFile(filepath: string, source: VitestRunnerImportSource): unknown;
    onBeforeRun(): void;
    onAfterRun(): Promise<void>;
    onAfterRunSuite(suite: Suite): void;
    onAfterRunTest(test: Test): void;
    onCancel(_reason: CancelReason): void;
    onBeforeRunTest(test: Test): Promise<void>;
    onBeforeRunSuite(suite: Suite): void;
    onBeforeTryTest(test: Test): void;
    onAfterTryTest(test: Test): void;
    extendTestContext(context: TestContext): TestContext;
}

declare class NodeBenchmarkRunner implements VitestRunner {
    config: ResolvedConfig;
    private __vitest_executor;
    constructor(config: ResolvedConfig);
    importFile(filepath: string, source: VitestRunnerImportSource): unknown;
    runSuite(suite: Suite): Promise<void>;
    runTest(): Promise<void>;
}

export { NodeBenchmarkRunner, VitestTestRunner };
