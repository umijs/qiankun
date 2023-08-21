import { V as VitestRunMode, U as UserConfig, e as Vitest, T as TestSequencer, W as WorkspaceSpec } from './types-3c7dbfa5.js';
export { g as TestSequencerConstructor, f as VitestWorkspace, s as startVitest } from './types-3c7dbfa5.js';
import { UserConfig as UserConfig$1, Plugin } from 'vite';
import '@vitest/snapshot';
import '@vitest/expect';
import '@vitest/runner';
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

declare function createVitest(mode: VitestRunMode, options: UserConfig, viteOverrides?: UserConfig$1): Promise<Vitest>;

declare function VitestPlugin(options?: UserConfig, ctx?: Vitest): Promise<Plugin[]>;

declare function registerConsoleShortcuts(ctx: Vitest): () => void;

declare class BaseSequencer implements TestSequencer {
    protected ctx: Vitest;
    constructor(ctx: Vitest);
    shard(files: WorkspaceSpec[]): Promise<WorkspaceSpec[]>;
    sort(files: WorkspaceSpec[]): Promise<WorkspaceSpec[]>;
}

export { BaseSequencer, TestSequencer, Vitest, VitestPlugin, WorkspaceSpec, createVitest, registerConsoleShortcuts };
