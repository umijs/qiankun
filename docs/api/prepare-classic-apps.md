# prepareClassicApps

Fetch classic HTML-entry scripts and register reusable factories ahead of activation. Preparation creates no micro app or sandbox, runs no business code, and invokes no lifecycle.

This feature is disabled by default. Use it only after measurements identify classic bundle activation as a bottleneck and the application can provide sufficient lead time. It does not guarantee that every nested function has been compiled, and it does not prepare ESM graphs.

## Signature

```ts
import { prepareClassicApps, loadMicroApp } from 'qiankun';

const preparation = prepareClassicApps([{ name: 'orders', entry: 'https://example.com/orders/' }], {
  maxBytes: 16 * 1024 * 1024,
  maxEntries: 32,
  ttl: 30_000,
});

// Optional. Loading does not wait for unfinished factory registration.
const results = await preparation.ready;
const app = loadMicroApp(
  { name: 'orders', entry: 'https://example.com/orders/', container },
  { classicPreparation: preparation },
);
await app.mountPromise;
preparation.dispose(); // Terminal and idempotent; does not unload app.
await app.unmount();
await app.unload();
```

For registered applications, pass the handle through `configuration.classicPreparation`. This is not a `start()` option and does not restore the deprecated `prefetchApps` strategy.

## Parameters

`apps` is a readonly array of application metadata, each containing `name` and `entry`.

| Option | Type | Description |
| --- | --- | --- |
| `fetch` | `typeof window.fetch` | Defaults to `window.fetch`. Loading must use the identical function object; otherwise it falls back. |
| `signal` | `AbortSignal` | Aborting cancels preparation and releases the handle, without cancelling loaded applications. |
| `maxBytes` | `number` | Defaults to `16777216`. Budget for response body bytes and retained UTF-16 source bytes; does not measure browser compilation memory. |
| `maxEntries` | `number` | Defaults to `32`. Resource limit, including pending requests. Declared-entry metadata has the same count limit. |
| `ttl` | `number` | Defaults to `30000` milliseconds from request start, additionally capped by explicit HTTP freshness. |
| `nonce` | `string` | Optional nonce for the preparation blob script; the effective document CSP still applies. |

Budget values must be positive safe integers. Preparation fetches resources sequentially and schedules each registration during an idle opportunity, yielding a task when idle callbacks are unavailable. A large script cannot be pre-empted by an idle budget, so prefer preparation after critical host work.

## Return value

- `ready`: resolves to per-application results with `name`, `entry`, `preparedScripts`, and `status`: `ready`, `skipped`, `failed`, or `cancelled`. Individual failures are results with an `error` field rather than rejecting the entire promise. `ready` means at least one factory registered at that point; later eviction can still cause a miss.
- `dispose()`: cancels preparation requests and registration, and clears retained responses, sources, factories, temporary nodes, URLs, and callbacks. An evaluation already queued by the loader remains pinned by its application until execution or application disposal.
- `getStats()`: returns `{ entries, bytes, preparedScripts }`. `bytes` is budget occupancy, not process RSS or peak compiler memory.

## Hits, fallback, and freshness

Each handle has a response partition separate from the runtime-wide LRU. Request identity includes URL and effective credentials; a factory also requires exact source text, source URL, and ordered global configuration. Release and recreate the handle when authentication, header semantics, deployment version, or fetch context changes.

Only responses with valid explicit `Cache-Control: max-age` or `Expires` freshness are retained. `no-store`, `no-cache`, expired, and redirected responses are not cached. Unretained HTML may still discover scripts, but loading fetches that HTML again. CSS, inline scripts, ESM, dynamic chunks, and shared-dependency redirects are not precompiled.

Unprepared, unfinished, disposed, expired, over-budget, or mismatched factories use the original loading path without waiting for registration. The same applies to `sandbox: false`, custom node/stream transformers, and sandbox customization other than `styleIsolation`. Loading may await an in-flight script download; unfinished HTML snapshots are bypassed to preserve streaming. if preparation is cancelled, it falls back to its own fetch rather than reusing an aborted request.

Existing instance reuse is unchanged: remounting a reusable instance does not evaluate it again to consume a newly prepared factory.

## CSP and memory boundaries

Registration uses native blob classic scripts, without `eval` or `new Function`. The host must permit the applicable script elements and blob URLs. A nonce does not bypass CSP or Trusted Types. See [Content Security Policy (CSP)](/guide/csp-requirements).

Budgets cover framework-retained responses and source. Browser compilation memory is not precisely measurable, and `dispose()` cannot guarantee immediate garbage collection. Evaluate hit rate, host interaction, concurrent application count, and memory after release before enabling preparation.

## Related

- [Optimize micro-app loading](/cookbook/optimize-loading)
- [AppConfiguration](/api/configuration)
- [loadMicroApp](/api/load-micro-app)
