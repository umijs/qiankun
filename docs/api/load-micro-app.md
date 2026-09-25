# loadMicroApp

`loadMicroApp` is qiankun's recommended loading primitive. It mounts a micro-app into a DOM element and returns a handle for managing that instance. The same model works for page regions, tabs, dialogs, and apps controlled by host state.

Use [registerMicroApps](/api/register-micro-apps) with [`start`](/api/start) only when an app must activate automatically from the URL.

This is the same primitive the framework wrappers [`<MicroApp>` for React](/ecosystem/react) and [`<MicroApp>` for Vue](/ecosystem/vue) build on.

## Signature

```ts
function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp;
```

`loadMicroApp` returns a `MicroApp` handle that extends single-spa Parcel with an `unload()` method for disposal. Use it to observe status, unmount, and dispose of the app. Loading and mounting run asynchronously; await the promises on the returned handle to observe completion.

## Parameters

### `app: LoadableApp<T>`

Describes which micro-app to load and where to mount it.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | yes | Micro-app name. Multiple instances may reuse it; concurrently mounted instances still need separate containers. |
| `entry` | `string` | yes | URL of the micro-app's HTML entry. Always a string — the 2.x object form (`{ scripts, styles }`) does not exist in v3. |
| `container` | `HTMLElement` | yes | The DOM element to render into. Must be an actual element, not a CSS-selector string. |
| `props` | `T` | no | Data passed through to the micro-app's lifecycle functions. |

```ts
type ObjectType = Record<string, unknown>;

type LoadableApp<T extends ObjectType> = {
  name: string;
  entry: string;
  container: HTMLElement;
  props?: T;
};
```

::: warning `container` must be an element
In qiankun v3, `container` is an `HTMLElement`, not a `string | HTMLElement`. Resolve the element yourself (`document.getElementById(...)`, a framework ref, etc.) before passing it. A selector string is a type error and will not work at runtime.
:::

### `configuration?: AppConfiguration`

Per-app options. All fields are optional; the defaults below are resolved internally.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | Enables the Proxy-membrane [JS sandbox](/concepts/js-sandbox) and the [ESM sandbox](/concepts/esm-sandbox). Set `false` only for legacy apps that must run against the real global; pass an object to keep isolation on and configure it. |
| `fetch` | `typeof window.fetch` | `window.fetch` | Custom fetch for the entry and loader-managed scripts, modules, and styles. |
| `streamTransformer` | `() => TransformStream<string, string>` | — | Optional transform piped into the HTML stream. |
| `nodeTransformer` | `NodeTransformer` | internal default | Rewrites each script/link/style node before it hits live DOM. Override only for advanced cases. |

```ts
type AppConfiguration =
  Partial<Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>> & {
    sandbox?: boolean | SandboxConfiguration;
  };
```

`sandbox` is the single umbrella for isolation. Its object form carries `styleIsolation`, `globals`, `incubatorContext`, `plugins`, and the Compartment module hooks:

```ts
loadMicroApp(app, {
  sandbox: {
    styleIsolation: true,
    globals: { TENANT_ID: 'acme' },
  },
});
```

See [AppConfiguration](/api/configuration) for the full reference.

### `lifeCycles?: LifeCycles<T>`

Optional lifecycle hooks that run around this app's load, mount, and unmount. Each hook is a single function or an array of functions, and each receives `(app, global)` where `global` is the sandboxed window view.

```ts
type LifeCycleFn<T extends ObjectType> = (app: LoadableApp<T>, global: WindowProxy) => Promise<void>;

type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

See [Lifecycle hooks](/api/lifecycles) for details.

## Return value

The returned `MicroApp` extends the single-spa Parcel handle:

```ts
type MicroApp = Parcel & { unload(): Promise<void> };

type Parcel = {
  mount(): Promise<null>;
  unmount(): Promise<null>;
  update?(customProps: object): Promise<any>;
  getStatus():
    | 'NOT_LOADED'
    | 'LOADING_SOURCE_CODE'
    | 'NOT_BOOTSTRAPPED'
    | 'BOOTSTRAPPING'
    | 'NOT_MOUNTED'
    | 'MOUNTING'
    | 'MOUNTED'
    | 'UPDATING'
    | 'UNMOUNTING'
    | 'UNLOADING'
    | 'SKIP_BECAUSE_BROKEN'
    | 'LOAD_ERROR';
  loadPromise: Promise<null>;
  bootstrapPromise: Promise<null>;
  mountPromise: Promise<null>;
  unmountPromise: Promise<null>;
};
```

| Member | Description |
| --- | --- |
| `mount()` | Mounts the parcel. loadMicroApp already mounts on load, so you rarely call this directly. |
| `unmount()` | Unmounts the app, deactivates the sandbox, cleans up tracked side effects, and clears the container DOM. The loaded instance is kept for remounting or reuse by the same app name. |
| `unload()` | Unmounts any mounted app, then disposes of the instance this handle uses and its caches; the handle becomes invalid. See [below](#unload) for the scope. |
| `update?(props)` | Present only if the micro-app exports an `update` lifecycle. Pushes new props to the running app. |
| `getStatus()` | Returns the current lifecycle status from the union above. |
| `loadPromise` | Resolves when the source has finished loading. |
| `bootstrapPromise` | Resolves when bootstrap has finished. |
| `mountPromise` | Resolves when mount has finished. Await this to know the app is on screen. |
| `unmountPromise` | Resolves when unmount has finished. |

::: warning Handle rejections
The promises reject if loading or mounting fails. Attach a `.catch` (or wrap in `try/await`) so failures do not surface as unhandled rejections.
:::

## Behavior {#behavior}

Observable behavior for callers:

- **Loading and mounting start immediately.** You do not call `start()` first; await `mountPromise` when you need to know the app is visible.
- **One container hosts one app at a time.** When apps are loaded into the same container in succession, the next instance waits for the previous one to unmount.
- **An app name reuses its unmounted instances.** When you call it again with the same `name` and `entry` and that app has an idle, unmounted instance, qiankun mounts that instance into the container you pass, without loading the entry again or calling `bootstrap`. If none is idle, an instance whose `unmount()` has been called but has not finished is reused as well, and the new instance mounts once that unmount completes. Only instances mounted at the same time load separate copies. A `name` should therefore always refer to the same app, and per-mount state belongs in `mount()`.
- **The caller owns teardown.** Call `unmount()` when the app is no longer shown, as the official `<MicroApp>` components do. Call `unload()` or `unloadMicroApp(name)` only when the loaded resources should be released.

See [Run multiple micro-app instances](/cookbook/run-multiple-instances) for the complete guidance on reuse and remounting.

## Dispose of instances: unload and unloadMicroApp {#unload}

After `unmount()`, qiankun keeps the loaded instance, including its lifecycles, sandbox, and caches. A later load of the same app name reuses it directly without executing the entry again. Instances are kept until the host disposes of them; call the handle's `unload()` or `unloadMicroApp(name)` to release them. The official `<MicroApp>` components only call `unmount()` when they are destroyed and never dispose of instances.

The two calls differ in scope:

- **`unload()` disposes of only the instance this handle uses.** One instance can be shared by several handles, such as handles queued on the same container and handles returned by later calls that reused it. All of them become invalid, and queued ones are cancelled. Other instances of the same app are unaffected.
- **`unloadMicroApp(name)` disposes of every manually loaded instance of that name**, both mounted and idle after unmounting.

After disposal, a new `loadMicroApp` call requests the entry and resources again and evaluates the scripts afresh.

Mounted instances run `unmount` first; queued instances are cancelled without waiting for them to mount. A `bootstrap`, `mount`, `unmount`, or `update` that has already started cannot be interrupted, so disposal waits for it to finish. An instance cancelled in the middle of mounting finishes unmounting and clears the container before the container is handed to the next instance.

```ts
import { loadMicroApp, unloadMicroApp } from 'qiankun';

const app = loadMicroApp({ name: 'app1', entry, container });
await app.mountPromise;
await app.unload();

// Without a retained handle, dispose of every instance of the app by name.
await unloadMicroApp('app1');
```

The `unloadMicroApp` signature is:

```ts
function unloadMicroApp(name: string): Promise<void>;
```

After disposal, invalidated handles return `NOT_LOADED` from `getStatus()`. Their `mount()` and existing `update()` methods reject with a `QiankunError`; `unmount()` does nothing. Pending `mountPromise` values reject too. Repeating a handle's `unload()` returns the same disposal result and cannot affect instances created later. `unloadMicroApp` resolves immediately when no matching instance exists. When an instance fails to clean up, it waits for every disposal to finish and then rejects with the first error.

Disposal clears container nodes (including `qiankun-head`), framework-tracked side effects, sandbox membrane and configuration references, ESM module caches, blob URLs, and the instance's injected import map scripts. It also invalidates cached entry and asset fetches. Shared requests still used by other instances remain active. Callers should release their own handles, props, and other references too.

Disposal revokes the membrane. A `setTimeout`, `requestAnimationFrame`, or Promise callback queued before disposal throws a `TypeError` when it later runs and accesses globals such as `window`. Micro-apps should clear such pending asynchronous callbacks in their own `unmount`.

qiankun cannot undo native import map entries or module registrations already held by the browser. Removing injected scripts and revoking blob URLs does not clear the browser's module registry; reloading uses a new instance identifier. See [ESM sandbox RFC §11](https://github.com/umijs/qiankun/blob/next/docs/rfcs/esm-sandbox.md) for this limitation. With `sandbox: false`, qiankun also cannot automatically roll back micro-app writes to the real global object.

`unloadMicroApp` manages only instances created by `loadMicroApp`. For registered route applications, use `unloadApplication` as described on the [registerMicroApps](/api/register-micro-apps#unload-application) page.

## Example

Resolve a container element, mount the app, then dispose of it when it is no longer needed.

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('container not found');

const microApp = loadMicroApp(
  {
    name: 'app1',
    entry: 'http://localhost:7101',
    container,
    props: { userId: 42 },
  },
  { sandbox: true },
);

// wait until it is on screen
await microApp.mountPromise;
console.log(microApp.getStatus()); // 'MOUNTED'

// Dispose of the instance when it is no longer needed
await microApp.unload();
```

For a legacy app that cannot run under isolation, disable the sandbox:

```ts
const microApp = loadMicroApp(
  { name: 'legacy-app', entry: 'http://localhost:7200', container },
  { sandbox: false },
);
```

::: tip React and Vue wrappers
If the host uses React or Vue, the corresponding [`<MicroApp>`](/ecosystem/react) component can manage the container ref, prop updates, and unmount. These wrappers use the same `loadMicroApp` instance model.
:::

## Related

- [registerMicroApps](/api/register-micro-apps) — route-driven activation instead of manual mounting.
- [start](/api/start) — auto-invoked by `loadMicroApp`, but call it explicitly for route-driven apps.
- [AppConfiguration](/api/configuration) — the full option reference.
- [Lifecycle hooks](/api/lifecycles) — the `LifeCycles` hooks.
- [Micro-app lifecycle and props](/concepts/lifecycle-and-props) — how props and lifecycles reach the sub-app.
- [Run multiple micro-app instances](/cookbook/run-multiple-instances) — patterns for multiple instances on a page.
