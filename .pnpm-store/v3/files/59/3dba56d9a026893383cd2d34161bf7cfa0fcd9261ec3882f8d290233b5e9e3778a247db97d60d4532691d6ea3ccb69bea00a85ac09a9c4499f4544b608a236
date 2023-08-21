/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as http from 'http';
import * as net from 'net';
import * as path from 'path';
import {Stream} from 'stream';

import Koa = require('koa');
import mount = require('koa-mount');
import send = require('koa-send');
import getStream = require('get-stream');
import serve = require('koa-static');
import bodyParser = require('koa-bodyparser');
import {nodeResolve} from 'koa-node-resolve';

import {BenchmarkResponse, Deferred} from './types';
import {NpmInstall} from './versions';

export interface ServerOpts {
  host: string;
  ports: number[];
  root: string;
  npmInstalls: NpmInstall[];
  mountPoints: MountPoint[];
  resolveBareModules: boolean;
  cache: boolean;
}

export interface MountPoint {
  diskPath: string;
  urlPath: string;
}

const clientLib = path.resolve(__dirname, '..', 'client', 'lib');

export interface Session {
  bytesSent: number;
  userAgent: string;
}

export class Server {
  readonly url: string;
  readonly port: number;
  private readonly server: net.Server;
  private session: Session = {bytesSent: 0, userAgent: ''};
  private deferredResults = new Deferred<BenchmarkResponse>();
  private readonly urlCache = new Map<
    string,
    {
      status: number;
      headers: {[key: string]: string};
      body: string | null | undefined;
    }
  >();

  static start(opts: ServerOpts): Promise<Server> {
    const server = http.createServer();
    const ports = [...opts.ports];

    return new Promise((resolve, reject) => {
      const tryNextPort = () => {
        if (ports.length === 0) {
          reject(`No ports available, tried: ${opts.ports.join(', ')}`);
        } else {
          server.listen({host: opts.host, port: ports.shift()});
        }
      };

      server.on('listening', () => resolve(new Server(server, opts)));

      server.on('error', (e: {code?: string}) => {
        if (e.code === 'EADDRINUSE' || e.code === 'EACCES') {
          tryNextPort();
        } else {
          reject(e);
        }
      });

      tryNextPort();
    });
  }

  constructor(server: http.Server, opts: ServerOpts) {
    this.server = server;
    const app = new Koa();

    app.use(bodyParser());
    app.use(mount('/submitResults', this.submitResults.bind(this)));
    app.use(this.instrumentRequests.bind(this));
    if (opts.cache) {
      app.use(this.cache.bind(this));
    }
    app.use(this.serveBenchLib.bind(this));

    if (opts.resolveBareModules === true) {
      const npmRoot =
        opts.npmInstalls.length > 0
          ? opts.npmInstalls[0].installDir
          : opts.root;

      app.use(
        nodeResolve({
          root: npmRoot,
          // TODO Use default logging options after issues resolved:
          // https://github.com/Polymer/koa-node-resolve/issues/16
          // https://github.com/Polymer/koa-node-resolve/issues/17
          logger: false,
        })
      );
    }
    for (const {diskPath, urlPath} of opts.mountPoints) {
      app.use(mount(urlPath, serve(diskPath, {index: 'index.html'})));
    }

    this.server.on('request', app.callback());
    const address = this.server.address() as net.AddressInfo;
    let host = address.address;
    if (address.family === 'IPv6') {
      host = `[${host}]`;
    }
    this.port = address.port;
    this.url = `http://${host}:${this.port}`;
  }

  /**
   * Mark the end of one session, return the data instrumented from it, and
   * begin a new session.
   */
  endSession(): Session {
    const session = this.session;
    this.session = {bytesSent: 0, userAgent: ''};
    this.deferredResults = new Deferred();
    return session;
  }

  async nextResults(): Promise<BenchmarkResponse> {
    return this.deferredResults.promise;
  }

  async close() {
    return new Promise<void>((resolve, reject) => {
      this.server.close((error: unknown) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  private async instrumentRequests(
    ctx: Koa.Context,
    next: () => Promise<void>
  ): Promise<void> {
    const session = this.session;
    if (session === undefined) {
      return next();
    }

    session.userAgent = ctx.headers['user-agent'] ?? '';
    // Note this assumes serial runs, as we guarantee in automatic mode.
    // If we ever wanted to support parallel requests, we would require
    // some kind of session tracking.
    await next();
    if (typeof ctx.response.length === 'number') {
      session.bytesSent += ctx.response.length;
    } else if (ctx.status === 200) {
      console.log(
        `No response length for 200 response for ${ctx.url}, ` +
          `byte count may be inaccurate.`
      );
    }
  }

  /**
   * Cache all downstream middleware responses by URL in memory. This is
   * especially helpful when bare module resolution is enabled, because that
   * requires expensive parsing of all HTML and JavaScript that we really don't
   * want to do for every benchmark sample.
   */
  private async cache(ctx: Koa.Context, next: () => Promise<void>) {
    const entry = this.urlCache.get(ctx.url);
    if (entry !== undefined) {
      ctx.response.set(entry.headers);
      ctx.response.body = entry.body;
      // Note we must set status after we set body, because when we set body to
      // undefined (which happens on e.g. 404s), Koa overrides the status to
      // 204.
      ctx.response.status = entry.status;
      return;
    }

    await next();
    const body = ctx.response.body as
      | string
      | Buffer
      | Stream
      | null
      | undefined;
    let bodyString;
    if (typeof body === 'string') {
      bodyString = body;
    } else if (Buffer.isBuffer(body)) {
      bodyString = body.toString();
    } else if (isStream(body)) {
      bodyString = await getStream(body);
      // We consumed the stream.
      ctx.response.body = bodyString;
    } else if (body === null || body === undefined) {
      // The static middleware sets no body for errors. Koa automatically
      // creates a body for errors later. Just cache as-is so that the same
      // thing happens on cache hits.
      bodyString = body;
    } else {
      throw new Error(`Unknown response type ${typeof body} for ${ctx.url}`);
    }
    this.urlCache.set(ctx.url, {
      body: bodyString,
      status: ctx.response.status,
      headers: ctx.response.headers as {[key: string]: string},
    });
  }

  private async serveBenchLib(ctx: Koa.Context, next: () => Promise<void>) {
    if (ctx.path === '/bench.js') {
      await send(ctx, 'bench.js', {root: clientLib});
    } else {
      await next();
    }
  }

  private async submitResults(ctx: Koa.Context) {
    this.deferredResults.resolve(ctx.request.body as BenchmarkResponse);
    ctx.body = 'ok';
  }
}

function isStream(value: unknown): value is Stream {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as {pipe: (() => unknown) | undefined}).pipe === 'function'
  );
}
