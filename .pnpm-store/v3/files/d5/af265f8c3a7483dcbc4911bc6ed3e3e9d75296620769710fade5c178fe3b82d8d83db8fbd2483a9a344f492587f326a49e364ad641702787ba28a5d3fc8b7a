import type { Options as HPMOptions } from '../compiled/http-proxy-middleware';
export interface HttpsServerOptions {
    key?: string;
    cert?: string;
    hosts?: string[];
    http2?: boolean;
}
declare type HPMFnArgs = Parameters<NonNullable<HPMOptions['onProxyReq']>>;
export interface ProxyOptions extends HPMOptions {
    target?: string;
    context?: string | string[];
    bypass?: (...args: [HPMFnArgs[1], HPMFnArgs[2], HPMFnArgs[3]]) => string | boolean | null | void;
}
export {};
