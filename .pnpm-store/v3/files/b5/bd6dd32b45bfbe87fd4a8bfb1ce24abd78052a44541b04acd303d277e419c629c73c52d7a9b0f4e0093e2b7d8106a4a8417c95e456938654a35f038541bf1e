import { B as BaseCoverageOptions, c as ResolvedCoverageOptions } from './types-3c7dbfa5.js';
import '@vitest/snapshot';
import '@vitest/expect';
import 'vite';
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

// Type definitions for istanbul-lib-coverage 2.0
// Project: https://istanbul.js.org, https://github.com/istanbuljs/istanbuljs
// Definitions by: Jason Cheatham <https://github.com/jason0x43>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

interface CoverageSummaryData {
    lines: Totals;
    statements: Totals;
    branches: Totals;
    functions: Totals;
}

declare class CoverageSummary {
    constructor(data: CoverageSummary | CoverageSummaryData);
    merge(obj: CoverageSummary): CoverageSummary;
    toJSON(): CoverageSummaryData;
    isEmpty(): boolean;
    data: CoverageSummaryData;
    lines: Totals;
    statements: Totals;
    branches: Totals;
    functions: Totals;
}

interface CoverageMapData {
    [key: string]: FileCoverage | FileCoverageData;
}

declare class CoverageMap {
    constructor(data: CoverageMapData | CoverageMap);
    addFileCoverage(pathOrObject: string | FileCoverage | FileCoverageData): void;
    files(): string[];
    fileCoverageFor(filename: string): FileCoverage;
    filter(callback: (key: string) => boolean): void;
    getCoverageSummary(): CoverageSummary;
    merge(data: CoverageMapData | CoverageMap): void;
    toJSON(): CoverageMapData;
    data: CoverageMapData;
}

interface Location {
    line: number;
    column: number;
}

interface Range {
    start: Location;
    end: Location;
}

interface BranchMapping {
    loc: Range;
    type: string;
    locations: Range[];
    line: number;
}

interface FunctionMapping {
    name: string;
    decl: Range;
    loc: Range;
    line: number;
}

interface FileCoverageData {
    path: string;
    statementMap: { [key: string]: Range };
    fnMap: { [key: string]: FunctionMapping };
    branchMap: { [key: string]: BranchMapping };
    s: { [key: string]: number };
    f: { [key: string]: number };
    b: { [key: string]: number[] };
}

interface Totals {
    total: number;
    covered: number;
    skipped: number;
    pct: number;
}

interface Coverage {
    covered: number;
    total: number;
    coverage: number;
}

declare class FileCoverage implements FileCoverageData {
    constructor(data: string | FileCoverage | FileCoverageData);
    merge(other: FileCoverageData): void;
    getBranchCoverageByLine(): { [line: number]: Coverage };
    getLineCoverage(): { [line: number]: number };
    getUncoveredLines(): number[];
    resetHits(): void;
    computeBranchTotals(): Totals;
    computeSimpleTotals(): Totals;
    toSummary(): CoverageSummary;
    toJSON(): object;

    data: FileCoverageData;
    path: string;
    statementMap: { [key: string]: Range };
    fnMap: { [key: string]: FunctionMapping };
    branchMap: { [key: string]: BranchMapping };
    s: { [key: string]: number };
    f: { [key: string]: number };
    b: { [key: string]: number[] };
}

type Threshold = 'lines' | 'functions' | 'statements' | 'branches';
declare class BaseCoverageProvider {
    /**
     * Check if current coverage is above configured thresholds and bump the thresholds if needed
     */
    updateThresholds({ configurationFile, coverageMap, thresholds, perFile }: {
        coverageMap: CoverageMap;
        thresholds: Record<Threshold, number | undefined>;
        perFile?: boolean;
        configurationFile?: string;
    }): void;
    /**
     * Checked collected coverage against configured thresholds. Sets exit code to 1 when thresholds not reached.
     */
    checkThresholds({ coverageMap, thresholds, perFile }: {
        coverageMap: CoverageMap;
        thresholds: Record<Threshold, number | undefined>;
        perFile?: boolean;
    }): void;
    /**
     * Resolve reporters from various configuration options
     */
    resolveReporters(configReporters: NonNullable<BaseCoverageOptions['reporter']>): ResolvedCoverageOptions['reporter'];
}

export { BaseCoverageProvider };
