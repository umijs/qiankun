# API reference overview

The recommended way to use `qiankun` is to load and manage a micro-app instance on demand with [`loadMicroApp`](/api/load-micro-app). It mounts the app immediately and returns a handle for updating, inspecting, and unmounting it.

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({
  name: 'sub-app',
  entry: '//localhost:7101',
  container: document.getElementById('subapp-container')!,
});

// Release the instance when it is no longer needed.
await microApp.unmount();
```

When an app must activate automatically with the URL, use [`registerMicroApps`](/api/register-micro-apps) with [`start`](/api/start). This is a route-driven alternative, not a prerequisite for `loadMicroApp`.

## Public exports

| Export | Purpose |
| --- | --- |
| [`loadMicroApp`](/api/load-micro-app) | Load and mount one micro-app immediately, returning a [`MicroApp`](/api/types) handle. |
| [`registerMicroApps`](/api/register-micro-apps) | Register micro-apps driven by URL `activeRule` values. |
| [`start`](/api/start) | Start route-driven registration mode. You normally do not call it when using `loadMicroApp` directly. |
| [`setDefaultMountApp`](/api/effects) | Navigate to a default app route when no app is mounted. |
| [`runAfterFirstMounted`](/api/effects) | Run a callback once after the first micro-app mounts. |
| [`addErrorHandler` / `removeErrorHandler`](/api/error-handling) | Add or remove a global error handler. |
| [`isRuntimeCompatible`](/api/is-runtime-compatible) | Probe whether the browser supports the qiankun v3 base runtime. |
| [`prefetchApps`](/api/prefetch-apps) | Deprecated manual prefetch API. |

## Two loading modes

### On demand: `loadMicroApp`

Use it for page regions, components, modals, and apps controlled by host state. The host decides when to create and unmount each instance.

```ts
function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp;
```

The returned handle exposes `mount`, `unmount`, `getStatus`, and lifecycle promises. It exposes `update` only when the micro-app exports that optional lifecycle. Call `unmount()` for every instance you no longer use.

### Route driven: `registerMicroApps` + `start`

Use this mode when the URL completely determines whether an app is mounted. Register the applications and their `activeRule` values, then call `start()` so single-spa can activate and unmount them automatically.

```ts
registerMicroApps(apps, lifeCycles?);
start(opts?);
```

See [Loading a micro-app instance](/concepts/architecture) for help choosing between the two modes.

## Configuration, lifecycles, and types

- [`AppConfiguration`](/api/configuration): sandboxing, style isolation, custom fetch, and advanced transformation options.
- [`LifeCycles`](/api/lifecycles): host-provided observation hooks around loading, mounting, and unmounting.
- [`MicroApp`, `LoadableApp`, and other types](/api/types): complete type declarations.
- [Micro-app lifecycle and props](/concepts/lifecycle-and-props): the `bootstrap`, `mount`, and `unmount` contract implemented by a micro-app.

## Migration and deprecations

Use the [migration guide](/cookbook/migrate-from-2x) as the single source of truth when upgrading from qiankun 2.x. Individual API pages describe only current behavior.

`prefetchApps` is deprecated. Streaming HTML Entry loading discovers and preloads resources while parsing an entry. See [Optimize loading](/cookbook/optimize-loading) for current guidance.
