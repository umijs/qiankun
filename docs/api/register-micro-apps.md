# registerMicroApps

Register micro-apps against the host by route. Every app is bound to an `activeRule`; qiankun mounts it when the URL matches and unmounts it when the URL stops matching.

This is the route-driven alternative to [`loadMicroApp`](/api/load-micro-app). Use it only when the URL should completely determine whether an app is mounted. Prefer `loadMicroApp` for on-demand loading, component embedding, and apps controlled by host state.

## Signature

```ts
function registerMicroApps<T extends ObjectType>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles?: LifeCycles<T>,
): void
```

`registerMicroApps` only records these apps and hands them off to [single-spa](https://single-spa.js.org/). Nothing loads until you call [start](/api/start). Registration and activation are two separate steps:

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps(apps, lifeCycles);
start();
```

## Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `apps` | `Array<RegistrableApp<T>>` | Yes | The micro-apps to register. See [RegistrableApp fields](#registrableapp-fields). |
| `lifeCycles` | `LifeCycles<T>` | No | Global lifecycle hooks applied to every app registered in this call. See [Global lifecycle hooks](#global-lifecycle-hooks). |

## RegistrableApp fields

```ts
type RegistrableApp<T extends ObjectType> = {
  name: string;
  entry: string;                       // HTMLEntry
  container: HTMLElement;
  activeRule: string | ActivityFn | Array<string | ActivityFn>;
  props?: T;
  loader?: (loading: boolean) => void;
  configuration?: AppConfiguration;
};
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | A stable, unique identifier for this route-registered app. Duplicate names are skipped, so keep it consistent across registrations. It does not normally need to match a package or Webpack library name. See [Choose a stable, unique `name`](#choose-a-stable-unique-name). |
| `entry` | `string` | Yes | The URL of the micro-app's HTML entry, e.g. `//localhost:7100`. In v3 `entry` is always a string (an HTML address); the 2.x `{ scripts, styles }` object form is gone. |
| `container` | `HTMLElement` | Yes | The DOM element the micro-app mounts into — a real element, not a selector string. Pass a node obtained from a ref, or `document.getElementById(...)`. |
| `activeRule` | `string \| ActivityFn \| Array<string \| ActivityFn>` | Yes | When the app activates; forwarded as-is to single-spa's `activeWhen`. A string is a path prefix; a function `(location) => boolean` gives you full control; an array activates when any entry matches. |
| `props` | `T` | No | Data passed to the micro-app on every lifecycle call (`bootstrap` / `mount` / `unmount` / `update`). |
| `loader` | `(loading: boolean) => void` | No | Reports loading state. It receives `true` while source loading or mounting begins and `false` after mounting completes. Treat the value as state: consecutive `true` notifications are possible. |
| `configuration` | `AppConfiguration` | No | Per-app runtime configuration: `sandbox`, `styleIsolation`, `fetch`, and so on. See [AppConfiguration](/api/configuration) and [Per-app configuration is the only configuration entry point](#per-app-configuration-is-the-only-configuration-entry-point). |

::: info entry and container
`entry` must be served with permissive CORS response headers, because qiankun fetches this HTML and its assets cross-origin. The `container` element must stay in the page for the entire registration lifetime — qiankun captures a reference to this element at registration time, so it must not be replaced by the host framework, re-created via a key, or unmounted.
:::

### About `activeRule`

`activeRule` is single-spa's `activeWhen`. The most common form is a path prefix:

```ts
registerMicroApps([
  { name: 'react', entry: '//localhost:7100', container, activeRule: '/react' },
]);
```

When a prefix can't express what you need, reach for a function or an array:

```ts
registerMicroApps([
  {
    name: 'react',
    entry: '//localhost:7100',
    container,
    // active on /react as well as any /shop/* route
    activeRule: ['/react', (location) => location.pathname.startsWith('/shop/')],
  },
]);
```

## Global lifecycle hooks

The second argument applies to every app registered in this call. Each hook is a function (or array of functions) `(app, global) => Promise<void>`:

```ts
registerMicroApps(apps, {
  beforeLoad:    (app) => { console.log('[lifecycle] before load', app.name); return Promise.resolve(); },
  beforeMount:   (app) => { console.log('[lifecycle] before mount', app.name); return Promise.resolve(); },
  afterMount:    (app) => { console.log('[lifecycle] after mount', app.name); return Promise.resolve(); },
  beforeUnmount: (app) => { console.log('[lifecycle] before unmount', app.name); return Promise.resolve(); },
  afterUnmount:  (app) => { console.log('[lifecycle] after unmount', app.name); return Promise.resolve(); },
});
```

The second argument, `global`, is the micro-app's sandbox-isolated `window` view (the Proxy membrane), not the real `window`. These framework-level hooks are a different thing from the `bootstrap` / `mount` / `unmount` a sub-app exports itself. For the full story see [Lifecycle hooks](/api/lifecycles) and [Micro-app lifecycle and props](/concepts/lifecycle-and-props).

## Behavior

- **Deduplicated by `name`.** If an app's `name` is already registered, it is skipped, so calling `registerMicroApps` twice with overlapping apps is safe.
- **Registered with single-spa.** Each new app becomes a single-spa application, with `activeWhen` taken from `activeRule` and `customProps` from `props`.
- **Activation waits for `start()`.** The internal loader waits until you call [start](/api/start) before loading and mounting. Registration alone has no visible effect.
- **`loader` reports a state, not an event count.** It receives `true` when loading begins and again before a mount when needed, then `false` after mounting. Make the callback idempotent.
- **`lifeCycles` applies to the whole call.** Hooks passed as the second argument run for every app registered by that call.

```mermaid
flowchart TD
  A["registerMicroApps(apps, lifeCycles)"] --> B{"name already registered?"}
  B -- Yes --> C["Skip"]
  B -- No --> D["single-spa registerApplication"]
  D --> E["Wait for start"]
  F["start"] --> E
  E --> G{"activeRule matches URL?"}
  G -- Yes --> H["loading true → load and mount → loading false"]
  G -- No --> I["Unmount when it no longer matches"]
```

## Example

A complete main-app integration: get a real container element, give each app its own `configuration`, and call `start()` once at the end.

::: code-group

```ts [main/src/register.ts]
import { registerMicroApps, start } from 'qiankun';

export function registerAll(
  container: HTMLElement,
  onLoading: (name: string, loading: boolean) => void,
): void {
  registerMicroApps([
    {
      name: 'react',
      entry: '//localhost:7100',
      container,
      activeRule: '/react',
      loader: (loading) => onLoading('react', loading),
      configuration: { sandbox: { styleIsolation: true } },
    },
    {
      name: 'vue',
      entry: '//localhost:7101',
      container,
      activeRule: '/vue',
      loader: (loading) => onLoading('vue', loading),
      configuration: { sandbox: { styleIsolation: true } },
    },
    {
      // stable route-app id; it does not have to match output.library.name
      name: 'webpack-app',
      entry: '//localhost:7102',
      container,
      activeRule: '/webpack',
      loader: (loading) => onLoading('webpack-app', loading),
      configuration: { sandbox: true },
    },
  ]);

  start();
}
```

```tsx [main/src/App.tsx]
import { useEffect, useRef } from 'react';
import { registerAll } from './register';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      registerAll(containerRef.current, (name, loading) => {
        console.log(`[${name}] loading: ${loading}`);
      });
    }
    // register once; the container must never be unmounted or keyed
  }, []);

  // Safe to share here because these activeRule values are mutually exclusive.
  return <div ref={containerRef} id="subapp-stage" />;
}
```

:::

::: tip Share a container only for mutually exclusive routes
Several route-driven apps may share a container only when their `activeRule` values cannot match at the same time. Overlapping rules can activate several apps concurrently; give those apps separate containers. Every registered container must remain in the DOM for the whole session.
:::

## Notes and pitfalls

### Choose a stable, unique `name`

`name` identifies a route-registered application to qiankun and single-spa. It is used for registration deduplication and runtime bookkeeping, so different apps must not share a name and the same app should keep its name across registrations.

When the entry script is correctly marked, qiankun resolves lifecycle functions from that entry's execution result: the module exports for ESM, or the value produced by the classic entry script. This primary path does not require `name` to equal a package name or Webpack's `output.library.name`.

Only when the entry result does not contain a valid lifecycle object does qiankun make a final compatibility attempt at `global[appName]` on the app's own global context. The global key must match `name` if an app deliberately relies on that fallback, but the fallback is not the normal naming contract. For the full lookup order, see [Micro-app lifecycle and props](/concepts/lifecycle-and-props).

### Per-app configuration is the only configuration entry point

There is no framework-level global config injected through `start()` in v3. `start()` only takes single-spa's `{ urlRerouteOnly? }`. What used to be global framework options — `sandbox`, `styleIsolation`, a custom `fetch` — are now all set **per app** in `RegistrableApp.configuration`:

```ts
registerMicroApps([
  {
    name: 'react',
    entry: '//localhost:7100',
    container,
    activeRule: '/react',
    configuration: {
      sandbox: {              // default true; Proxy-membrane JS isolation
        styleIsolation: true, // default false; CSS @scope isolation
      },
      // fetch: customFetch,  // optional custom fetch for this app's assets
    },
  },
]);
```

For each field and its default, see [AppConfiguration](/api/configuration).

::: warning No 2.x start options
`prefetch`, `sandbox: { strictStyleIsolation | experimentalStyleIsolation }`, `singular`, `getPublicPath`, and `getTemplate` were all qiankun 2.x `start` options, and none of them exist in v3. Style isolation is `sandbox.styleIsolation`, a single boolean implemented under the hood with CSS `@scope` — there is no Shadow DOM mode. Prefetching is done automatically by the streaming loader, so there is no `prefetch` strategy to configure. See [Migrating from qiankun 2.x](/cookbook/migrate-from-2x).
:::

::: info No built-in global state library
v3 no longer ships `initGlobalState` / `onGlobalStateChange` / `setGlobalState`. To share state, pass your own methods or store to each app through `props`. See [Sharing state and communicating between apps](/cookbook/communicate-between-apps).
:::

## See also

- [start](/api/start) — activate registered apps
- [loadMicroApp](/api/load-micro-app) — mount an app imperatively rather than by route
- [AppConfiguration](/api/configuration) — per-app `sandbox`, `styleIsolation`, `fetch`
- [Lifecycle hooks (LifeCycles)](/api/lifecycles) — global hook reference
- [setDefaultMountApp / runAfterFirstMounted](/api/effects) — routing / first-mount side effects
- [Type reference](/api/types) — `RegistrableApp`, `LoadableApp`, `HTMLEntry`
