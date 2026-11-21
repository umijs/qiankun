import {
  markNodeForNativePassthrough,
  nativeDocument,
  nativeGlobal,
  precompileScriptSource,
  type ClassicScriptFactory,
  type ClassicScriptPreparation,
} from '@qiankunjs/sandbox';
import { esmInternalPrefix, isValidJavaScriptType } from '@qiankunjs/shared';
import { type AppMetadata } from '../types';
import { withAbortSignal } from '../utils';

export interface ClassicPreparationOptions {
  fetch?: typeof window.fetch;
  signal?: AbortSignal;
  /** Retained response bytes plus UTF-16 source bytes; browser compilation memory is additional. */
  maxBytes?: number;
  /** Includes in-flight resources. */
  maxEntries?: number;
  /** Maximum lifetime, additionally limited by explicit HTTP freshness. */
  ttl?: number;
  /** Nonce for the native blob registration element, subject to the document's CSP. */
  nonce?: string;
}

export interface ClassicPreparationResult extends AppMetadata {
  status: 'ready' | 'skipped' | 'failed' | 'cancelled';
  preparedScripts: number;
  error?: unknown;
}

export interface ClassicPreparation {
  readonly ready: Promise<readonly ClassicPreparationResult[]>;
  /** Terminal. Cancels preparation and releases retained resources; does not unload applications. */
  dispose(): void;
  getStats(): { entries: number; bytes: number; preparedScripts: number };
}

type Resource = {
  body: Uint8Array;
  headers: Headers;
  status: number;
  statusText: string;
  source?: string;
  globalNames?: readonly string[];
  factory?: ClassicScriptFactory;
};
type Entry = {
  url: string;
  controller: AbortController;
  expiresAt: number;
  bytes: number;
  promise: Promise<Resource>;
  resource?: Resource;
};
class PreparationSkipped extends Error {}
const preparations = new WeakMap<ClassicPreparation, Preparation>();
const abortReason = () => new DOMException('Classic preparation was released', 'AbortError');

function positive(value: number, name: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RangeError(`${name} must be a positive safe integer`);
  return value;
}

/** Explicit preparation only. No application, sandbox, plugin, or business code is instantiated. */
export function prepareClassicApps(
  apps: readonly AppMetadata[],
  options: ClassicPreparationOptions = {},
): ClassicPreparation {
  const preparation = new Preparation(options);
  const handle: ClassicPreparation = Object.freeze({
    ready: preparation.prepare(apps),
    dispose: () => preparation.dispose(),
    getStats: () => preparation.getStats(),
  });
  preparations.set(handle, preparation);
  return handle;
}

/** A handle is usable only in its original fetch/request partition and for a declared entry. */
export function getClassicPreparation(
  handle: ClassicPreparation | undefined,
  fetch: typeof window.fetch,
  entry: string,
): Preparation | undefined {
  const preparation = handle && preparations.get(handle);
  return preparation?.matches(fetch, entry) ? preparation : undefined;
}

class Preparation implements ClassicScriptPreparation {
  private readonly fetch: typeof window.fetch;
  private readonly maxBytes: number;
  private readonly maxEntries: number;
  private readonly ttl: number;
  private readonly nonce: string | undefined;
  private readonly signal: AbortSignal | undefined;
  private readonly entries = new Map<string, Entry>();
  private readonly apps = new Set<string>();
  private bytes = 0;
  private disposed = false;
  private expiryTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly abort = () => this.dispose();

  constructor(options: ClassicPreparationOptions) {
    this.fetch = options.fetch ?? window.fetch;
    this.maxBytes = positive(options.maxBytes ?? 16 * 1024 * 1024, 'maxBytes');
    this.maxEntries = positive(options.maxEntries ?? 32, 'maxEntries');
    this.ttl = positive(options.ttl ?? 30_000, 'ttl');
    this.nonce = options.nonce;
    this.signal = options.signal;
    if (this.signal?.aborted) this.dispose();
    else this.signal?.addEventListener('abort', this.abort, { once: true });
  }

  matches(fetch: typeof window.fetch, entry: string): boolean {
    return !this.disposed && fetch === this.fetch && this.apps.has(new URL(entry, nativeDocument.baseURI).href);
  }

  async prepare(apps: readonly AppMetadata[]): Promise<ClassicPreparationResult[]> {
    const results: ClassicPreparationResult[] = [];
    // Sequential preparation bounds simultaneous downloads and blob registrations.
    for (const app of apps) {
      let preparedScripts = 0;
      try {
        if (this.disposed) throw abortReason();
        const url = new URL(app.entry, nativeDocument.baseURI).href;
        if (!this.apps.has(url) && this.apps.size >= this.maxEntries) throw new PreparationSkipped();
        this.apps.add(url);
        const html = await this.request(url, 'same-origin');
        const doc = new DOMParser().parseFromString(new TextDecoder().decode(html.body), 'text/html');
        const scripts = Array.from(doc.querySelectorAll<HTMLScriptElement>('script[src]')).filter(
          (script) =>
            Boolean(script.getAttribute('src')?.trim()) &&
            script.type !== 'module' &&
            isValidJavaScriptType(script.type) &&
            !script.noModule,
        );
        if (scripts.filter((script) => script.hasAttribute('entry')).length > 1) throw new PreparationSkipped();
        for (const script of scripts) {
          const scriptURL = new URL(script.getAttribute('src') ?? '', url).href;
          const credentials = script.crossOrigin === 'use-credentials' ? 'include' : 'same-origin';
          const resource = await this.request(scriptURL, credentials);
          const entry = this.entries.get(this.key(scriptURL, credentials));
          if (!entry || entry.resource !== resource) continue;
          if (resource.factory) {
            preparedScripts++;
            continue;
          }
          const source = new TextDecoder().decode(resource.body);
          this.reserve(entry, source.length * 2);
          const artifact = precompileScriptSource(source, scriptURL);
          const factory = await registerFactory(artifact.factorySource, entry.controller.signal, this.nonce);
          if (this.entries.get(this.key(scriptURL, credentials)) !== entry) continue;
          resource.source = source;
          resource.globalNames = artifact.globalNames;
          resource.factory = factory;
          preparedScripts++;
        }
        results.push({ ...app, status: preparedScripts ? 'ready' : 'skipped', preparedScripts });
      } catch (error) {
        results.push({
          ...app,
          status: this.disposed ? 'cancelled' : error instanceof PreparationSkipped ? 'skipped' : 'failed',
          preparedScripts,
          error,
        });
      }
    }
    return results;
  }

  get(source: string, url: string, names: readonly string[]): ClassicScriptFactory | undefined {
    this.prune();
    for (const [key, entry] of this.entries) {
      const resource = entry.resource;
      if (
        entry.url === url &&
        resource?.source === source &&
        resource.globalNames?.length === names.length &&
        resource.globalNames.every((name, index) => name === names[index]) &&
        resource.factory
      ) {
        this.entries.delete(key);
        this.entries.set(key, entry);
        return resource.factory;
      }
    }
    return undefined;
  }

  /** App-local cancellation never invalidates a preparation shared by other applications. */
  bindFetch(fallback: typeof window.fetch, signal: AbortSignal): typeof window.fetch & { invalidate(): void } {
    const lifetime = new AbortController();
    const invalidate = () => lifetime.abort(signal.reason ?? abortReason());
    signal.addEventListener('abort', invalidate, { once: true });
    if (signal.aborted) invalidate();
    const fetch: typeof window.fetch = async (input, init) => {
      const request = new Request(input, init);
      const callSignal = AbortSignal.any([request.signal, lifetime.signal]);
      callSignal.throwIfAborted();
      this.prune();
      const entry =
        request.method === 'GET' && !this.disposed
          ? this.entries.get(this.key(request.url, request.credentials))
          : undefined;
      // An unfinished HTML snapshot would buffer the entry and defeat streaming/SSR.
      // Script consumers already need the complete source, so only those share pending bodies.
      if (entry && (entry.resource || !this.apps.has(request.url))) {
        try {
          const resource = await withAbortSignal(entry.promise, callSignal);
          callSignal.throwIfAborted();
          if (
            !this.disposed &&
            this.entries.get(this.key(request.url, request.credentials)) === entry &&
            entry.expiresAt > Date.now()
          ) {
            // A new response per caller: cancellation/body consumption cannot affect other readers.
            return snapshotResponse(resource, callSignal);
          }
        } catch {
          callSignal.throwIfAborted();
        }
      }
      return fallback(request, { signal: callSignal });
    };
    return Object.assign(fetch, {
      invalidate: () => {
        signal.removeEventListener('abort', invalidate);
        invalidate();
      },
    });
  }

  getStats(): { entries: number; bytes: number; preparedScripts: number } {
    this.prune();
    return {
      entries: this.entries.size,
      bytes: this.bytes,
      preparedScripts: [...this.entries.values()].filter((entry) => entry.resource?.factory).length,
    };
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.signal?.removeEventListener('abort', this.abort);
    for (const entry of [...this.entries.values()]) this.drop(entry);
    this.apps.clear();
    clearTimeout(this.expiryTimer);
    this.expiryTimer = undefined;
  }

  private key(url: string, credentials: RequestCredentials): string {
    return JSON.stringify([url, credentials]);
  }

  private drop(entry: Entry): void {
    for (const [key, candidate] of this.entries) if (candidate === entry) this.entries.delete(key);
    this.bytes -= entry.bytes;
    entry.bytes = 0;
    entry.resource = undefined;
    entry.controller.abort(abortReason());
  }

  private prune(): void {
    for (const entry of [...this.entries.values()]) if (entry.expiresAt <= Date.now()) this.drop(entry);
    clearTimeout(this.expiryTimer);
    this.expiryTimer = undefined;
    if (this.entries.size)
      this.expiryTimer = setTimeout(
        () => this.prune(),
        Math.min(
          2_147_483_647,
          Math.max(
            1,
            [...this.entries.values()].reduce((next, entry) => Math.min(next, entry.expiresAt), Infinity) - Date.now(),
          ),
        ),
      );
  }

  private reserve(entry: Entry, bytes: number): void {
    if (entry.bytes + bytes > this.maxBytes) throw new PreparationSkipped('Resource exceeds preparation budget');
    while (this.bytes + bytes > this.maxBytes) {
      const oldest = [...this.entries.values()].find((candidate) => candidate !== entry);
      if (!oldest) throw new PreparationSkipped();
      this.drop(oldest);
    }
    entry.bytes += bytes;
    this.bytes += bytes;
  }

  private async request(url: string, credentials: RequestCredentials): Promise<Resource> {
    this.prune();
    if (this.disposed) throw abortReason();
    const key = this.key(url, credentials);
    const existing = this.entries.get(key);
    if (existing) return existing.promise;
    while (this.entries.size >= this.maxEntries) this.drop(this.entries.values().next().value!);
    const controller = new AbortController();
    const entry: Entry = {
      url,
      controller,
      expiresAt: Date.now() + this.ttl,
      bytes: 0,
      promise: Promise.resolve({ body: new Uint8Array(), headers: new Headers(), status: 200, statusText: '' }),
    };
    this.entries.set(key, entry);
    this.prune();
    entry.promise = this.download(entry, credentials).catch((error: unknown) => {
      if (this.entries.get(key) === entry) this.drop(entry);
      throw error;
    });
    return entry.promise;
  }

  private async download(entry: Entry, credentials: RequestCredentials): Promise<Resource> {
    const { signal } = entry.controller;
    const fetch = this.fetch;
    const pending = fetch(entry.url, { credentials, signal, priority: 'low' });
    // A custom transport may ignore abort: reject our wait and cancel a late body independently.
    void pending.then(
      (response) => {
        if (signal.aborted) void response.body?.cancel().catch(() => undefined);
      },
      () => undefined,
    );
    const response = await withAbortSignal(pending, signal);
    if (!response.ok) throw new Error(`Preparation request failed: ${String(response.status)}`);
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    let complete = false;
    try {
      if (reader) {
        let chunk = await withAbortSignal(reader.read(), signal);
        while (!chunk.done) {
          signal.throwIfAborted();
          this.reserve(entry, chunk.value.byteLength);
          chunks.push(chunk.value);
          chunk = await withAbortSignal(reader.read(), signal);
        }
        complete = true;
      }
    } finally {
      if (!complete) void reader?.cancel().catch(() => undefined);
      reader?.releaseLock();
    }
    const body = new Uint8Array(entry.bytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const resource: Resource = {
      body,
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    };
    // Only explicitly fresh, unredirected snapshots can be reused. no-cache/no-store and
    // responses without freshness may still be parsed as HTML but are never retained.
    const cacheControl = response.headers.get('cache-control') ?? '';
    const maxAgeMatch = /(?:^|,)\s*max-age\s*=\s*(?:"(\d+)"|(\d+))\s*(?=,|$)/i.exec(cacheControl);
    const maxAge = maxAgeMatch?.[1] ?? maxAgeMatch?.[2];
    const invalidMaxAge =
      /\bmax-age\s*=/i.test(cacheControl) && (!maxAgeMatch || (cacheControl.match(/\bmax-age\s*=/gi)?.length ?? 0) > 1);
    const now = Date.now();
    const age = Number(response.headers.get('age') ?? 0) * 1000;
    const parsedDate = Date.parse(response.headers.get('date') ?? '');
    const date = Number.isFinite(parsedDate) ? parsedDate : now;
    const responseDelay = now - (entry.expiresAt - this.ttl);
    const currentAge = Math.max(0, now - date, age + responseDelay);
    const lifetime =
      maxAge === undefined ? Date.parse(response.headers.get('expires') ?? '') - date : Number(maxAge) * 1000;
    const freshUntil = now + lifetime - currentAge;
    const redirected = response.url !== '' && response.url !== entry.url;
    if (
      invalidMaxAge ||
      response.headers
        .get('vary')
        ?.split(',')
        .some((name) => name.trim() === '*') ||
      /\b(?:no-store|no-cache)\b/i.test(cacheControl) ||
      redirected ||
      !Number.isFinite(freshUntil) ||
      freshUntil <= Date.now()
    ) {
      this.drop(entry);
      return resource;
    }
    entry.expiresAt = Math.min(entry.expiresAt, freshUntil);
    entry.resource = resource;
    this.prune();
    return resource;
  }
}

function snapshotResponse(resource: Resource, signal: AbortSignal): Response {
  const options = { headers: resource.headers, status: resource.status, statusText: resource.statusText };
  if (resource.status === 204 || resource.status === 205) return new Response(null, options);
  let removeAbort = () => {};
  const body = new ReadableStream<Uint8Array>(
    {
      start(controller) {
        const abort = () => {
          controller.error(signal.reason);
          removeAbort();
        };
        removeAbort = () => signal.removeEventListener('abort', abort);
        if (signal.aborted) abort();
        else signal.addEventListener('abort', abort, { once: true });
      },
      pull(controller) {
        try {
          signal.throwIfAborted();
          controller.enqueue(resource.body.slice());
          controller.close();
        } finally {
          removeAbort();
        }
      },
      cancel() {
        removeAbort();
      },
    },
    { highWaterMark: 0 },
  );
  return new Response(body, options);
}

function registerFactory(source: string, signal: AbortSignal, nonce?: string): Promise<ClassicScriptFactory> {
  return new Promise((resolve, reject) => {
    const key = `${esmInternalPrefix}classic_prepare_${crypto.getRandomValues(new Uint32Array(4)).join('_')}`;
    const script = nativeDocument.createElement('script');
    let registered: ClassicScriptFactory | undefined;
    let blobURL: string | undefined;
    let cancelScheduled = () => {};
    let settled = false;
    const finish = (error?: unknown) => {
      if (settled) return;
      settled = true;
      cancelScheduled();
      signal.removeEventListener('abort', abort);
      script.onload = script.onerror = null;
      script.remove();
      script.removeAttribute('src');
      if (blobURL) URL.revokeObjectURL(blobURL);
      Reflect.deleteProperty(nativeGlobal, key);
      if (error !== undefined || !registered)
        reject(error instanceof Error ? error : new Error('Classic factory registration failed'));
      else resolve(registered);
    };
    const abort = () => finish(signal.reason);
    if (signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener('abort', abort, { once: true });
    Object.defineProperty(nativeGlobal, key, {
      configurable: true,
      value: (factory: unknown) => {
        if (!signal.aborted && typeof factory === 'function') registered = factory as ClassicScriptFactory;
      },
    });
    // Yield before each registration; no business code is invoked to force compilation.
    const launch = () => {
      try {
        signal.throwIfAborted();
        blobURL = URL.createObjectURL(
          new Blob(
            [`if(typeof window[${JSON.stringify(key)}]==='function'){window[${JSON.stringify(key)}](${source});}`],
            { type: 'text/javascript' },
          ),
        );
        script.onload = () => finish();
        script.onerror = () => finish(new Error('Classic factory registration failed'));
        if (nonce) script.nonce = nonce;
        markNodeForNativePassthrough(script);
        script.src = blobURL;
        nativeDocument.head.appendChild(script);
      } catch (error) {
        finish(error);
      }
    };
    const requestIdle = Reflect.get(nativeGlobal, 'requestIdleCallback') as
      typeof window.requestIdleCallback | undefined;
    if (requestIdle) {
      const id = requestIdle.call(nativeGlobal, launch, { timeout: 1000 });
      cancelScheduled = () => nativeGlobal.cancelIdleCallback(id);
    } else {
      const id = setTimeout(launch, 0);
      cancelScheduled = () => clearTimeout(id);
    }
  });
}
