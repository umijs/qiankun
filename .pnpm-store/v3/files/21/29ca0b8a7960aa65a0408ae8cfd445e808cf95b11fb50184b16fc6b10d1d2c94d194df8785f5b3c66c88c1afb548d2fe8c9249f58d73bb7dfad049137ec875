import { S as SnapshotStateOptions, a as SnapshotMatchOptions, b as SnapshotResult, R as RawSnapshotInfo } from './index-6461367c.js';
export { c as SnapshotData, e as SnapshotSummary, d as SnapshotUpdateState, U as UncheckedSnapshot } from './index-6461367c.js';
import { S as SnapshotEnvironment } from './environment-38cdead3.js';
import { Plugin, Plugins } from 'pretty-format';

interface ParsedStack {
    method: string;
    file: string;
    line: number;
    column: number;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

interface SnapshotReturnOptions {
    actual: string;
    count: number;
    expected?: string;
    key: string;
    pass: boolean;
}
interface SaveStatus {
    deleted: boolean;
    saved: boolean;
}
declare class SnapshotState {
    testFilePath: string;
    snapshotPath: string;
    private _counters;
    private _dirty;
    private _updateSnapshot;
    private _snapshotData;
    private _initialData;
    private _inlineSnapshots;
    private _rawSnapshots;
    private _uncheckedKeys;
    private _snapshotFormat;
    private _environment;
    private _fileExists;
    added: number;
    expand: boolean;
    matched: number;
    unmatched: number;
    updated: number;
    private constructor();
    static create(testFilePath: string, options: SnapshotStateOptions): Promise<SnapshotState>;
    get environment(): SnapshotEnvironment;
    markSnapshotsAsCheckedForTest(testName: string): void;
    protected _inferInlineSnapshotStack(stacks: ParsedStack[]): ParsedStack | null;
    private _addSnapshot;
    clear(): void;
    save(): Promise<SaveStatus>;
    getUncheckedCount(): number;
    getUncheckedKeys(): Array<string>;
    removeUncheckedKeys(): void;
    match({ testName, received, key, inlineSnapshot, isInline, error, rawSnapshot, }: SnapshotMatchOptions): SnapshotReturnOptions;
    pack(): Promise<SnapshotResult>;
}

interface AssertOptions {
    received: unknown;
    filepath?: string;
    name?: string;
    message?: string;
    isInline?: boolean;
    properties?: object;
    inlineSnapshot?: string;
    error?: Error;
    errorMessage?: string;
    rawSnapshot?: RawSnapshotInfo;
}
declare class SnapshotClient {
    private Service;
    filepath?: string;
    name?: string;
    snapshotState: SnapshotState | undefined;
    snapshotStateMap: Map<string, SnapshotState>;
    constructor(Service?: typeof SnapshotState);
    setTest(filepath: string, name: string, options: SnapshotStateOptions): Promise<void>;
    getSnapshotState(filepath: string): SnapshotState;
    clearTest(): void;
    skipTestSnapshots(name: string): void;
    /**
     * Should be overridden by the consumer.
     *
     * Vitest checks equality with @vitest/expect.
     */
    equalityCheck(received: unknown, expected: unknown): boolean;
    assert(options: AssertOptions): void;
    assertRaw(options: AssertOptions): Promise<void>;
    resetCurrent(): Promise<SnapshotResult | null>;
    clear(): void;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare function addSerializer(plugin: Plugin): void;
declare function getSerializers(): Plugins;

declare function stripSnapshotIndentation(inlineSnapshot: string): string;

export { SnapshotClient, SnapshotMatchOptions, SnapshotResult, SnapshotState, SnapshotStateOptions, addSerializer, getSerializers, stripSnapshotIndentation };
