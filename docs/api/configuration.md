# AppConfiguration

`AppConfiguration` is the runtime configuration for one micro-app instance. It covers JavaScript isolation, style isolation, loading timeouts, custom fetch behavior, and advanced loading transforms.

Pass it as the second argument to [`loadMicroApp`](/api/load-micro-app) by default. Route-driven apps use the `configuration` field in `registerMicroApps`, and `<MicroApp>` components expose the same type through `settings`.

## Type

```ts
import { type AppConfiguration } from 'qiankun';
```

Every field is optional. The table below lists the default behavior when a field is omitted.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | The single umbrella switch for isolation. `false` runs the micro-app directly against the real global; `true` enables the sandbox with defaults; an object enables it and configures the underlying Compartment. |
| `fetch` | `typeof window.fetch` | `window.fetch` | Fetch implementation for the entry and loader-managed scripts, modules, and styles. Browser-native requests such as images do not necessarily pass through it. |
| `timeout` | `number` | `0` (disabled) | Loading timeout in milliseconds. When omitted, inherits the default set by `start({ timeout })`; an explicit `0` disables it. |
| `streamTransformer` | `() => TransformStream<string, string>` | `undefined` | Optional transform spliced into the HTML entry streaming pipeline, operating on the decoded HTML string stream. |
| `nodeTransformer` | `<T extends Node>(node: T, opts) => T` | built-in asset transformer | Rewrites script / link / style nodes before they enter the container. Advanced extensions only. |

## Fields in detail

### sandbox

Defaults to `true`. Each micro-app receives an isolated `window` view, and native ESM entries use the same per-app isolation. See [JavaScript isolation](/concepts/js-sandbox) for supported guarantees and responsibilities.

Set `sandbox: false` and the micro-app runs directly against the real global context — useful for legacy apps that can't tolerate a proxied global, at the cost of isolation. This also disables the native ESM isolation path.

```ts
configuration: { sandbox: false }
```

Pass an object instead of `true` to keep isolation on and configure it:

```ts
configuration: {
  sandbox: {
    styleIsolation: true,
    globals: { TENANT_ID: 'acme' },
  },
}
```

## SandboxConfiguration

`SandboxConfiguration` is structurally a public projection of the sandbox's `CompartmentOptions` plus two host extensions, `plugins` and `styleIsolation`:

```ts
import { type SandboxConfiguration } from 'qiankun';

type SandboxConfiguration = Pick<
  CreateSandboxOptions,
  'globals' | 'incubatorContext' | 'modules' | 'resolveHook' | 'importHook' | 'loadHook' | 'plugins' | 'styleIsolation'
>;
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `styleIsolation` | `boolean` | `false` | Enables runtime CSS isolation, wrapping the micro-app's styles in a CSS `@scope` block scoped to the app container. |
| `globals` | `Record<string, unknown \| PropertyDescriptor>` | `{}` | Values and descriptors installed on this app's compartment global, without touching the host `window`. |
| `incubatorContext` | `WindowProxy` | `window` | The host context that incubates the sandbox — the global it reads through for properties it has not shadowed. |
| `plugins` | `readonly IsolationPlugin[]` | `[]` | Isolation plugins appended after qiankun's built-in ones. |
| `modules` / `resolveHook` / `importHook` / `loadHook` | Compartment module hooks | `undefined` | Advanced module resolution and loading hooks for sandboxed ESM. |

### sandbox.styleIsolation

Defaults to `false`. When enabled, qiankun uses native CSS [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) to limit micro-app styles to the application container. The scope root is derived from the app configuration and cannot be customized.

Style isolation lives inside the `sandbox` object rather than next to it because dynamically injected styles ride on the sandbox's DOM interception: static entry styles are scoped by the loader transpiler, dynamic ones by the sandbox. Isolated CSS without a JS sandbox would silently leak every dynamic style, so that combination is not expressible.

::: warning Browser support and CORS
Style isolation relies on native CSS `@scope`, with no polyfill in qiankun. Treat browsers without `@scope` as unsupported for this option. External stylesheets must also be reachable over CORS: if a fetch or transform fails, that stylesheet is dropped rather than loaded unscoped.
:::

See [Style isolation](/concepts/style-isolation) for boundaries, [Enable style isolation](/cookbook/enable-style-isolation) for the steps, and [Style isolation internals](/internals/style-isolation) for implementation detail.

### sandbox.globals

Defaults to `{}`. Each entry is installed on the micro-app's own compartment global — as a plain value, or as a property descriptor when you need to control writability or enumerability. The host `window` is never modified, and the keys are visible to both classic and ESM applications.

```ts
configuration: {
  sandbox: {
    globals: {
      tenantId: 'acme',
      featureClient: { value: createFeatureClient(), writable: false },
    },
  },
}
```

### sandbox.incubatorContext

Defaults to `window`. This is the host context that incubates the sandbox — the global it reads through for properties it has not shadowed. The name follows the "incubator realm" of the ShadowRealm proposal. In an ordinary single-window setup you never set it; it exists for hosting scenarios where the base realm isn't the top-level `window`.

### sandbox.plugins

Defaults to `[]`. Isolation plugins run after qiankun's built-in ones: `bootstrap` plugins run before the app's scripts, `mount` plugins run on every mount and their returned `Free` functions join unmount cleanup and remount recovery. See [Extend the sandbox with plugins](/cookbook/sandbox-plugins) for the full protocol.

### sandbox module hooks

`modules`, `resolveHook`, and `importHook` (with `loadHook` as its alias) are set directly on the `sandbox` object and configure this app's Compartment module loading — redirects, private protocols, or precompiled module sources. They affect sandboxed ESM only. See [Use the sandbox standalone](/cookbook/standalone-sandbox) for worked examples.

### fetch

Defaults to `window.fetch`. qiankun validates that response status is in the `200-399` range, adds a limited retry budget for request failures, and deduplicates and caches requests around the fetch implementation you provide.

Use a custom `fetch` to inject credentials, headers, or a proxy. It must preserve standard Fetch API response and streaming semantics; the outer validation, retry, and cache behavior still applies.

To support loading cancellation, a custom fetch must forward the received `init.signal` to the underlying request and stop reading its response stream after cancellation.

### timeout

Loading timeouts are disabled by default. Without a global default, omitting `timeout` or setting it to `0` leaves loading unrestricted. A positive finite number specifies milliseconds; negative values, `NaN`, and `Infinity` are invalid and produce a `QiankunError`.

The timer starts when the app acquires permission to load into its container. It covers `beforeLoad`, entry loading, resource work awaited by the loader, entry lifecycle discovery, and completion of the HTML stream. Time spent waiting for a previous instance to release the container is excluded. The setting does not limit `bootstrap`, `mount`, `unmount`, or remounts that reuse loaded configuration.

With a timeout enabled, qiankun waits for both entry lifecycles and the complete HTML stream before starting the mount phase. With timeouts disabled, the existing streaming behavior still permits mounting as soon as lifecycles are ready. An HTML response that never finishes therefore fails during loading when a timeout is enabled; it is not mounted first and then destroyed by a loading timeout.

```ts
const app = loadMicroApp({ name: 'app1', entry, container }, { timeout: 10_000 });
await app.mountPromise;
```

Expiry rejects the loading Promise with `LoadAppTimeoutError`, aborts the instance's loading requests, clears partially written container nodes and its sandbox, and releases the container. Shared requests still used by other instances continue. The error includes the app name, configured limit, and elapsed time; see [addErrorHandler / removeErrorHandler](/api/error-handling#load-timeout) for handling examples.

The timeout does not cover all later native ESM evaluations or application asynchronous work. Cancellation stops requests and loader DOM writes and retires sandbox access; it cannot preempt synchronous JavaScript, forcibly stop native continuations that already hold raw DOM references, or undo browser ESM registrations. See [loadMicroApp](/api/load-micro-app#unload) for cleanup boundaries.

### streamTransformer

Defaults to `undefined`. When provided, its `TransformStream<string, string>` is spliced into the HTML entry's streaming pipeline, after byte decoding and before qiankun rewrites the tags itself. Use it to rewrite the entry HTML mid-stream (for instance, to inject or strip some markup). Most apps won't need it.

For the pipeline, see [Streaming HTML Entry internals](/internals/streaming-html-entry).

### nodeTransformer

The default transformer provides qiankun's standard handling for script, link, and style nodes. Overriding it makes the caller responsible for node rewriting and can affect script isolation, module resolution, and style isolation. Use it only for advanced extensions. See [Streaming HTML Entry internals](/internals/streaming-html-entry) for the input/output contract and default pipeline.

## Where to pass configuration

Pass configuration as the second argument to `loadMicroApp` by default:

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp(
  {
    name: 'react-app',
    entry: '//localhost:7101',
    container: document.getElementById('subapp-container')!,
  },
  {
    sandbox: { styleIsolation: true },
  },
);
```

The React and Vue `<MicroApp>` components accept the same type through `settings`. Route-driven apps put it in an app's `configuration` field for `registerMicroApps`.

`container` belongs to the app description rather than `AppConfiguration`; it must be a real `HTMLElement`.

## Precedence

Every field applies per micro-app instance. The first `start({ timeout })` call can set a global timeout default for subsequent manual and route-driven loads. An app's own `timeout` takes precedence; an explicit `0` disables the default timeout, while omission or `undefined` inherits it. The global default does not change configuration that is already cached.

`start()` neither accepts nor merges global sandbox, style, or fetch configuration.

A per-app `sandbox` object replaces any outer one wholesale — configurations are merged with a shallow spread, so individual sandbox fields are never deep-merged.

## Migrating from v2

The v2 sandbox object, legacy sandbox or prefetch configuration through `start()`, and old style-isolation options are not part of this type. The complete replacement map is maintained only in [Migrate from qiankun 2.x](/cookbook/migrate-from-2x).

## Related

- [loadMicroApp](/api/load-micro-app) — takes `AppConfiguration` as its second argument.
- [registerMicroApps](/api/register-micro-apps) — route-driven apps set the same type through `configuration`.
- [start](/api/start) — framework startup and the loading timeout default.
- [Type reference](/api/types) — the full type surface, including `RegistrableApp` and `LoadableApp`.
- [Style Isolation](/concepts/style-isolation) and [JS Sandbox](/concepts/js-sandbox) — the concepts behind `styleIsolation` and `sandbox`.
