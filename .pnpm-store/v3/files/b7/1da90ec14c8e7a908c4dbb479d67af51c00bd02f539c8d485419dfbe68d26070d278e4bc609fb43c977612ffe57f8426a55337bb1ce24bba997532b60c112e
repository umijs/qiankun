import { UserConfig as UserConfig$1, ConfigEnv } from 'vite';
export { ConfigEnv, UserConfig, mergeConfig } from 'vite';
import { c as ResolvedCoverageOptions, U as UserConfig, d as CoverageV8Options, P as ProjectConfig } from './types-3c7dbfa5.js';
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

declare const defaultInclude: string[];
declare const defaultExclude: string[];
declare const coverageConfigDefaults: ResolvedCoverageOptions;
declare const config: {
    allowOnly: boolean;
    watch: boolean;
    globals: boolean;
    environment: "node";
    threads: boolean;
    clearMocks: boolean;
    restoreMocks: boolean;
    mockReset: boolean;
    include: string[];
    exclude: string[];
    testTimeout: number;
    hookTimeout: number;
    teardownTimeout: number;
    isolate: boolean;
    watchExclude: string[];
    forceRerunTriggers: string[];
    update: boolean;
    reporters: never[];
    silent: boolean;
    hideSkippedTests: boolean;
    api: boolean;
    ui: boolean;
    uiBase: string;
    open: boolean;
    css: {
        include: never[];
    };
    coverage: CoverageV8Options;
    fakeTimers: {
        loopLimit: number;
        shouldClearNativeTimers: true;
        toFake: ("setTimeout" | "setInterval" | "clearInterval" | "clearTimeout" | "setImmediate" | "clearImmediate" | "Date")[];
    };
    maxConcurrency: number;
    dangerouslyIgnoreUnhandledErrors: boolean;
    typecheck: {
        checker: "tsc";
        include: string[];
        exclude: string[];
    };
    slowTestThreshold: number;
};
declare const configDefaults: Required<Pick<UserConfig, keyof typeof config>>;

interface UserWorkspaceConfig extends UserConfig$1 {
    test?: ProjectConfig;
}

type UserConfigFnObject = (env: ConfigEnv) => UserConfig$1;
type UserConfigFnPromise = (env: ConfigEnv) => Promise<UserConfig$1>;
type UserConfigFn = (env: ConfigEnv) => UserConfig$1 | Promise<UserConfig$1>;
type UserConfigExport = UserConfig$1 | Promise<UserConfig$1> | UserConfigFnObject | UserConfigFnPromise | UserConfigFn;
type UserProjectConfigFn = (env: ConfigEnv) => UserWorkspaceConfig | Promise<UserWorkspaceConfig>;
type UserProjectConfigExport = UserWorkspaceConfig | Promise<UserWorkspaceConfig> | UserProjectConfigFn;
declare function defineConfig(config: UserConfig$1): UserConfig$1;
declare function defineConfig(config: Promise<UserConfig$1>): Promise<UserConfig$1>;
declare function defineConfig(config: UserConfigFnObject): UserConfigFnObject;
declare function defineConfig(config: UserConfigExport): UserConfigExport;
declare function defineProject(config: UserProjectConfigExport): UserProjectConfigExport;
declare function defineWorkspace(config: (string | (UserProjectConfigExport & {
    extends?: string;
}))[]): (string | (UserProjectConfigExport & {
    extends?: string | undefined;
}))[];

export { UserConfigExport, UserConfigFn, UserConfigFnObject, UserConfigFnPromise, UserProjectConfigExport, UserProjectConfigFn, UserWorkspaceConfig, configDefaults, coverageConfigDefaults, defaultExclude, defaultInclude, defineConfig, defineProject, defineWorkspace };
