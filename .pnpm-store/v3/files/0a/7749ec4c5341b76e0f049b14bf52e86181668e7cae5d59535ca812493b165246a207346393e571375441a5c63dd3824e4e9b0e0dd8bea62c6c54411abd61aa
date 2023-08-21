interface RpcCallMessage {
    type: 'call';
    id: string;
    args: unknown[];
}
interface RpcResolveMessage {
    type: 'resolve';
    id: string;
    value: unknown;
}
interface RpcRejectMessage {
    type: 'reject';
    id: string;
    error: unknown;
}
declare type RpcMessage = RpcCallMessage | RpcResolveMessage | RpcRejectMessage;
declare type RpcMethod = (...args: any[]) => any;
declare type RpcRemoteMethod<T extends RpcMethod> = T extends (...args: infer A) => infer R ? R extends Promise<any> ? (...args: A) => R : (...args: A) => Promise<R> : (...args: unknown[]) => Promise<unknown>;
export { RpcCallMessage, RpcResolveMessage, RpcRejectMessage, RpcMessage, RpcMethod, RpcRemoteMethod, };
