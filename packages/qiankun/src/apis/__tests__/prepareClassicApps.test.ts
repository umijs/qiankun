import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { esmInternalPrefix } from '@qiankunjs/shared';
import { precompileScriptSource } from '@qiankunjs/sandbox';
import { prepareClassicApps, getClassicPreparation, type ClassicPreparation } from '../prepareClassicApps';

const entry = 'https://app.test/index.html';
const scriptURL = 'https://app.test/app.js';
const source = 'window.app = { mount() {}, unmount() {} };';
const handles: ClassicPreparation[] = [];
const executed = vi.fn();
const factory = (_view: WindowProxy) =>
  function () {
    executed();
  };
const response = (body: string, cacheControl = 'public, max-age=60') =>
  new Response(body, { headers: { 'cache-control': cacheControl } });
const transport = () =>
  vi.fn<typeof window.fetch>(async (input) =>
    response(String(input).endsWith('.js') ? source : '<html><script src="./app.js" entry></script></html>'),
  );
const prepare = (fetch: typeof window.fetch, options: Parameters<typeof prepareClassicApps>[1] = {}) => {
  const handle = prepareClassicApps([{ name: 'app', entry }], { fetch, ...options });
  handles.push(handle);
  return handle;
};

beforeEach(() => {
  vi.stubGlobal('requestIdleCallback', undefined);
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:prepared');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  vi.spyOn(document.head, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
    queueMicrotask(() => {
      const key = Object.getOwnPropertyNames(window).find((name) =>
        name.startsWith(`${esmInternalPrefix}classic_prepare_`),
      );
      if (key) {
        const register = Reflect.get(window, key) as (value: unknown) => void;
        register(factory);
      }
      node.dispatchEvent(new Event('load'));
    });
    return node;
  });
});
afterEach(() => {
  handles.splice(0).forEach((handle) => handle.dispose());
  executed.mockClear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('explicit classic preparation', () => {
  it('registers without running business code and shares independent response readers', async () => {
    const fetch = transport();
    const handle = prepare(fetch);
    expect(await handle.ready).toEqual([{ name: 'app', entry, status: 'ready', preparedScripts: 1 }]);
    expect(executed).not.toHaveBeenCalled();
    const preparation = getClassicPreparation(handle, fetch, entry)!;
    const lifetime = new AbortController();
    const fallback = vi.fn<typeof window.fetch>();
    const bound = preparation.bindFetch(fallback, lifetime.signal);
    const first = await bound(scriptURL);
    const second = await bound(scriptURL);
    await first.body!.cancel();
    expect(await second.text()).toBe(source);
    expect(fallback).not.toHaveBeenCalled();
    const artifact = precompileScriptSource(source, scriptURL);
    const prepared = preparation.get(source, scriptURL, artifact.globalNames)!;
    prepared(window).call(window);
    expect(executed).toHaveBeenCalledTimes(1);
    bound.invalidate();
    expect(handle.getStats().preparedScripts).toBe(1);
  });

  it('does not cross fetch, entry, credentials, source, or wrapper configuration partitions', async () => {
    const fetch = transport();
    const handle = prepare(fetch);
    await handle.ready;
    expect(getClassicPreparation(handle, transport(), entry)).toBeUndefined();
    expect(getClassicPreparation(handle, fetch, 'https://other.test/')).toBeUndefined();
    const preparation = getClassicPreparation(handle, fetch, entry)!;
    const globals = precompileScriptSource(source, scriptURL).globalNames;
    expect(preparation.get('changed()', scriptURL, globals)).toBeUndefined();
    expect(preparation.get(source, scriptURL, [...globals, 'extra'])).toBeUndefined();
    const fallback = vi.fn<typeof window.fetch>(async () => response('private'));
    const bound = preparation.bindFetch(fallback, new AbortController().signal);
    expect(await (await bound(scriptURL, { credentials: 'include' })).text()).toBe('private');
    expect(fallback).toHaveBeenCalledTimes(1);
    bound.invalidate();
  });

  it('bounds streamed bytes and entries, including a single oversized resource', async () => {
    const fetch = vi.fn<typeof window.fetch>(async (input) =>
      response(String(input).endsWith('.js') ? 'x'.repeat(1024) : '<script src="./app.js" entry></script>'),
    );
    const handle = prepare(fetch, { maxBytes: 100, maxEntries: 1 });
    expect((await handle.ready)[0].status).toBe('skipped');
    expect(handle.getStats().bytes).toBeLessThanOrEqual(100);
    expect(handle.getStats().entries).toBeLessThanOrEqual(1);
    handle.dispose();
    expect(handle.getStats()).toEqual({ entries: 0, bytes: 0, preparedScripts: 0 });
  });

  it.each(['no-store', 'no-cache', 'max-age=0', ''])(
    'does not retain scripts without explicit freshness: %s',
    async (policy) => {
      const fetch = vi.fn<typeof window.fetch>(async (input) =>
        response(
          String(input).endsWith('.js') ? source : '<script src="./app.js" entry></script>',
          String(input).endsWith('.js') ? policy : 'max-age=60',
        ),
      );
      const handle = prepare(fetch);
      expect((await handle.ready)[0].status).toBe('skipped');
      expect(handle.getStats().preparedScripts).toBe(0);
    },
  );

  it('expires responses and factories without requiring another lookup', async () => {
    const handle = prepare(transport(), { ttl: 500 });
    await handle.ready;
    expect(handle.getStats().preparedScripts).toBe(1);
    vi.useFakeTimers();
    // getStats reschedules the existing real timer under the fake clock.
    handle.getStats();
    await vi.advanceTimersByTimeAsync(501);
    expect(handle.getStats()).toEqual({ entries: 0, bytes: 0, preparedScripts: 0 });
  });

  it('settles cancellation when a transport ignores the signal and cancels its eventual body', async () => {
    let complete: ((response: Response) => void) | undefined;
    const fetch = vi.fn<typeof window.fetch>(
      () =>
        new Promise((resolve) => {
          complete = resolve;
        }),
    );
    const controller = new AbortController();
    const handle = prepare(fetch, { signal: controller.signal });
    controller.abort();
    expect((await handle.ready)[0].status).toBe('cancelled');
    const late = response('late');
    const cancel = vi.spyOn(late.body!, 'cancel');
    complete!(late);
    await Promise.resolve();
    expect(cancel).toHaveBeenCalled();
    expect(handle.getStats().entries).toBe(0);
  });

  it('falls back after preparation disposal without cancelling an active application reader', async () => {
    const fetch = transport();
    const handle = prepare(fetch);
    await handle.ready;
    const preparation = getClassicPreparation(handle, fetch, entry)!;
    const fallback = vi.fn<typeof window.fetch>(async () => response('fresh'));
    const bound = preparation.bindFetch(fallback, new AbortController().signal);
    const retained = await bound(scriptURL);
    handle.dispose();
    expect(await retained.text()).toBe(source);
    expect(await (await bound(scriptURL)).text()).toBe('fresh');
    expect(handle.getStats()).toEqual({ entries: 0, bytes: 0, preparedScripts: 0 });
    bound.invalidate();
  });

  it('removes registration nodes, URLs, and callbacks on cancellation before load', async () => {
    vi.spyOn(document.head, 'appendChild').mockImplementation(<T extends Node>(node: T): T => node);
    const handle = prepare(transport());
    await vi.waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled());
    handle.dispose();
    expect((await handle.ready)[0].status).toBe('cancelled');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:prepared');
    expect(
      Object.getOwnPropertyNames(window).filter((name) => name.startsWith(`${esmInternalPrefix}classic_prepare_`)),
    ).toEqual([]);
  });

  it('aborts a cached response body for only the calling reader', async () => {
    const fetch = transport();
    const handle = prepare(fetch);
    await handle.ready;
    const bound = getClassicPreparation(handle, fetch, entry)!.bindFetch(fetch, new AbortController().signal);
    const caller = new AbortController();
    const cancelled = await bound(scriptURL, { signal: caller.signal });
    const other = await bound(scriptURL);
    const reason = new Error('reader stopped');
    caller.abort(reason);
    await expect(cancelled.body!.getReader().read()).rejects.toBe(reason);
    expect(await other.text()).toBe(source);
    expect(handle.getStats().preparedScripts).toBe(1);
    bound.invalidate();
  });

  it('retries with application-owned fetch when shared preparation is disposed mid-download', async () => {
    const fetch = vi.fn<typeof window.fetch>((input) =>
      String(input).endsWith('.js')
        ? new Promise(() => {})
        : Promise.resolve(response('<script src="./app.js" entry></script>')),
    );
    const handle = prepare(fetch);
    await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    const fallback = vi.fn<typeof window.fetch>(async () => response('application response'));
    const bound = getClassicPreparation(handle, fetch, entry)!.bindFetch(fallback, new AbortController().signal);
    const loading = bound(scriptURL);
    expect(fallback).not.toHaveBeenCalled();
    handle.dispose();
    expect(await (await loading).text()).toBe('application response');
    expect((await handle.ready)[0].status).toBe('cancelled');
    expect(fallback).toHaveBeenCalledTimes(1);
    bound.invalidate();
  });

  it('does not buffer activation behind an unfinished HTML entry snapshot', async () => {
    const fetch = vi.fn<typeof window.fetch>(() => new Promise(() => {}));
    const handle = prepare(fetch);
    const fallback = vi.fn<typeof window.fetch>(async () => response('<html>streaming</html>'));
    const bound = getClassicPreparation(handle, fetch, entry)!.bindFetch(fallback, new AbortController().signal);
    expect(await (await bound(entry)).text()).toBe('<html>streaming</html>');
    expect(fallback).toHaveBeenCalledTimes(1);
    handle.dispose();
    await handle.ready;
    bound.invalidate();
  });

  it('does not let a future Date header extend a short max-age', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn<typeof window.fetch>(
      async () =>
        new Response('<html></html>', {
          headers: { 'cache-control': 'max-age=1', date: new Date(Date.now() + 60_000).toUTCString() },
        }),
    );
    const handle = prepare(fetch, { ttl: 10_000 });
    await handle.ready;
    expect(handle.getStats().entries).toBe(1);
    await vi.advanceTimersByTimeAsync(1001);
    expect(handle.getStats().entries).toBe(0);
  });

  it('does not retain a Vary:* response', async () => {
    const fetch = vi.fn<typeof window.fetch>(
      async () => new Response('<html></html>', { headers: { 'cache-control': 'max-age=60', vary: '*' } }),
    );
    const handle = prepare(fetch);
    await handle.ready;
    expect(handle.getStats().entries).toBe(0);
  });

  it.each(['max-age=1.5', 'max-age=60, max-age=120'])(
    'does not fall through invalid max-age to Expires: %s',
    async (policy) => {
      const fetch = vi.fn<typeof window.fetch>(
        async () =>
          new Response('<html></html>', {
            headers: { 'cache-control': policy, expires: new Date(Date.now() + 60_000).toUTCString() },
          }),
      );
      const handle = prepare(fetch);
      await handle.ready;
      expect(handle.getStats().entries).toBe(0);
    },
  );

  it('rejects invalid resource budgets synchronously', () => {
    expect(() => prepare(transport(), { maxBytes: 0 })).toThrow(RangeError);
    expect(() => prepare(transport(), { maxEntries: Infinity })).toThrow(RangeError);
    expect(() => prepare(transport(), { ttl: -1 })).toThrow(RangeError);
  });
});
