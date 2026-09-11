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
| `timeout` | `number` | `0` (disabled) | Loading timeout in milliseconds; inherits the `start` default when omitted, while `0` explicitly disables it. Container waits and mount lifecycles are excluded. See [AppConfiguration](/api/configuration#timeout). |
| `streamTransformer` | `() => TransformStream<string, string>` | — | Optional transform piped into the HTML stream. |
| `nodeTransformer` | `NodeTransformer` | internal default | Rewrites each script/link/style node before it hits live DOM. Override only for advanced cases. |

```ts
type AppConfiguration =
  Partial<Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>> & {
    sandbox?: boolean | SandboxConfiguration;
    timeout?: number;
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
| `unmount()` | Unmounts the app, deactivates the sandbox, cleans up tracked side effects, and clears the container DOM. Retains the loaded configuration for remounting. |
| `unload()` | Unmounts any mounted app, then disposes of the entire generation of instances and caches sharing its name and container. See below. |
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
- **The same name and container may reuse loaded work.** Do not rely on module top-level code running again on remount. Create per-mount state inside `mount()`.
- **The caller owns teardown.** Call `unmount()` to hide an app while retaining it for reuse, or `unload()` when you no longer need this generation of instances.

See [Run multiple micro-app instances](/cookbook/run-multiple-instances) for the complete guidance on reuse and remounting.

## Dispose of instances: unload and unloadMicroApp {#unload}

`unmount()` retains lifecycle configuration and sandbox state for remounting. `unload()` disposes of those resources. A subsequent `loadMicroApp` with the same name and container element requests the entry and resources again and evaluates the scripts afresh.

Disposal is scoped to an application name and container element. Every old handle sharing that configuration generation becomes invalid, including queued instances. Same-name apps in other containers remain unaffected. Mounted instances run `unmount` first; queued instances are cancelled without waiting for them to mount.

```ts
import { loadMicroApp, unloadMicroApp } from 'qiankun';

const app = loadMicroApp({ name: 'app1', entry, container });
await app.mountPromise;
await app.unload();

// Dispose of the current generation by name and container if you did not retain its handle.
await unloadMicroApp('app1', container);
```

The `unloadMicroApp` signature requires the original container element:

```ts
function unloadMicroApp(name: string, container: HTMLElement): Promise<void>;
```

After disposal, old handles return `NOT_LOADED` from `getStatus()`. Their `mount()` and existing `update()` methods reject with a `QiankunError`; `unmount()` does nothing. Pending `mountPromise` values reject too. Repeating an old handle's `unload()` returns the same disposal result and cannot affect a newer generation. `unloadMicroApp` resolves immediately when no matching instance exists; otherwise, it always disposes of the current generation.

Disposal clears container nodes (including `qiankun-head`), framework-tracked side effects, sandbox membrane and configuration references, ESM module caches, blob URLs, and the instance's injected import map scripts. It also invalidates cached entry and asset fetches. Shared requests still used by other instances remain active. Callers should release their own handles, props, and other references too.

qiankun cannot undo native import map entries or module registrations already held by the browser. Removing injected scripts and revoking blob URLs does not clear the browser's module registry; reloading uses a new instance identifier. See [ESM sandbox RFC §11](https://github.com/umijs/qiankun/blob/next/docs/rfcs/esm-sandbox.md) for this limitation. With `sandbox: false`, qiankun also cannot automatically roll back micro-app writes to the real global object.

This named API manages only instances created by `loadMicroApp`. For registered route applications, use `unloadApplication` as described on the [registerMicroApps](/api/register-micro-apps#unload-application) page.

## Example

Resolve a container element, mount the app, then dispose of its generation when it is no longer needed.

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

// Dispose of this generation when it is no longer needed
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
