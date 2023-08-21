/// <reference types="node" />
import type { ChildProcess } from 'child_process';
import type { RpcMethod, RpcRemoteMethod } from './types';
interface RpcWorkerBase {
    connect(): void;
    terminate(): void;
    readonly connected: boolean;
    readonly process: ChildProcess | undefined;
}
declare type RpcWorker<T extends RpcMethod = RpcMethod> = RpcWorkerBase & RpcRemoteMethod<T>;
declare function createRpcWorker<T extends RpcMethod>(modulePath: string, data: unknown, memoryLimit?: number): RpcWorker<T>;
declare function getRpcWorkerData(): unknown;
export { createRpcWorker, getRpcWorkerData, RpcWorker };
