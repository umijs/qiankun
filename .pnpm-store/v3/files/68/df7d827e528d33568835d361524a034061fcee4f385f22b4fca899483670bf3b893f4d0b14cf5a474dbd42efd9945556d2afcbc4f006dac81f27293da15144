export { startTests } from '@vitest/runner';
import { R as ResolvedConfig, C as CoverageOptions, a as CoverageProvider, b as CoverageProviderModule } from './types-3c7dbfa5.js';
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

declare function setupCommonEnv(config: ResolvedConfig): Promise<void>;

interface Loader {
    executeId: (id: string) => Promise<{
        default: CoverageProviderModule;
    }>;
}
declare function getCoverageProvider(options: CoverageOptions | undefined, loader: Loader): Promise<CoverageProvider | null>;
declare function startCoverageInsideWorker(options: CoverageOptions | undefined, loader: Loader): Promise<unknown>;
declare function takeCoverageInsideWorker(options: CoverageOptions | undefined, loader: Loader): Promise<unknown>;
declare function stopCoverageInsideWorker(options: CoverageOptions | undefined, loader: Loader): Promise<unknown>;

export { getCoverageProvider, setupCommonEnv, startCoverageInsideWorker, stopCoverageInsideWorker, takeCoverageInsideWorker };
