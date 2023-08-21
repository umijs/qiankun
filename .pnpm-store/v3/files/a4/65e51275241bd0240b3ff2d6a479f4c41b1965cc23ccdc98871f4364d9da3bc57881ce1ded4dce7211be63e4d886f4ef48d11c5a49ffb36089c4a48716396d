/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import type { SpdyServer as Server } from '@umijs/bundler-utils';
import { Server as HttpServer } from 'http';
import { Http2Server } from 'http2';
import { Server as HttpsServer } from 'https';
import WebSocket from '../../compiled/ws';
export declare function createWebSocketServer(server: HttpServer | HttpsServer | Http2Server | Server): {
    send(message: string): void;
    wss: WebSocket.Server<WebSocket.WebSocket>;
    close(): void;
};
