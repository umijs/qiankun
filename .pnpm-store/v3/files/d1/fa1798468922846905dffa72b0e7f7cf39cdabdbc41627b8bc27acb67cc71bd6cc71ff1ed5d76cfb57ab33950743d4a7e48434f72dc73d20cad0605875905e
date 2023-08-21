/// <reference types="node" />
import { RequestListener } from 'http';
import spdy from 'spdy';
import { HttpsServerOptions } from './types';
export type { Server as SpdyServer } from 'spdy';
export declare function resolveHttpsConfig(httpsConfig: HttpsServerOptions): Promise<{
    key: string;
    cert: string;
}>;
export declare function createHttpsServer(app: RequestListener, httpsConfig: HttpsServerOptions): Promise<spdy.server.Server>;
