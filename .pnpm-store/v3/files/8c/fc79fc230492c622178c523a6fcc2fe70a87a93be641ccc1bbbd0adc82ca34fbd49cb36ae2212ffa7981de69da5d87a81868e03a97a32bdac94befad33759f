import type { AbortSignal } from 'node-abort-controller';
declare type Task<T> = (signal?: AbortSignal) => Promise<T>;
interface Pool {
    submit<T>(task: Task<T>, signal?: AbortSignal): Promise<T>;
    size: number;
    readonly pending: number;
    readonly drained: Promise<void>;
}
declare function createPool(size: number): Pool;
export { Pool, createPool };
