import { S as Suite, T as Task, a as Test, b as TaskCustom } from './tasks-abce80cc.js';
export { C as ChainableFunction, c as createChainable } from './tasks-abce80cc.js';
import { Arrayable } from '@vitest/utils';

/**
 * If any tasks been marked as `only`, mark all other tasks as `skip`.
 */
declare function interpretTaskModes(suite: Suite, namePattern?: string | RegExp, onlyMode?: boolean, parentIsOnly?: boolean, allowOnly?: boolean): void;
declare function someTasksAreOnly(suite: Suite): boolean;
declare function generateHash(str: string): string;
declare function calculateSuiteHash(parent: Suite): void;

/**
 * Partition in tasks groups by consecutive concurrent
 */
declare function partitionSuiteChildren(suite: Suite): Task[][];

declare function getTests(suite: Arrayable<Task>): (Test | TaskCustom)[];
declare function getTasks(tasks?: Arrayable<Task>): Task[];
declare function getSuites(suite: Arrayable<Task>): Suite[];
declare function hasTests(suite: Arrayable<Suite>): boolean;
declare function hasFailed(suite: Arrayable<Task>): boolean;
declare function getNames(task: Task): string[];

export { calculateSuiteHash, generateHash, getNames, getSuites, getTasks, getTests, hasFailed, hasTests, interpretTaskModes, partitionSuiteChildren, someTasksAreOnly };
