# Types reference

This page lists the public types and `Window` augmentations exported from the `qiankun` package root. Import them directly from the package:

```ts
import type {
  ObjectType,
  HTMLEntry,
  AppMetadata,
  LoadableApp,
  RegistrableApp,
  AppConfiguration,
  SandboxConfiguration,
  LifeCycleFn,
  LifeCycles,
  MicroApp,
  MicroAppLifeCycles,
  PrefetchStrategy,
} from 'qiankun';
```

::: warning Coming from qiankun 2.x
Three shapes changed in ways that will produce type errors if you port 2.x code verbatim:

- `entry` is a plain string (`HTMLEntry = string`). There is no object entry (`{ scripts, styles }`) and no `EntryOpts`.
- `container` is an `HTMLElement`. A selector string such as `'#subapp-viewport'` is no longer accepted.
- There is no `FrameworkConfiguration` type. Per-app configuration is `AppConfiguration`, and `start()` takes only single-spa's `StartOpts`.

See [Migrate from qiankun 2.x](/cookbook/migrate-from-2x) for the full list.
:::

## Type overview

| Type | Shape | Notes |
| --- | --- | --- |
| `ObjectType` | `Record<string, unknown>` | Base constraint for the props generic `T`. |
| `HTMLEntry` | `string` | The micro-app's HTML entry URL. String only. |
| `AppMetadata` | `{ name; entry }` | The minimal identity of a micro-app. |
| `LoadableApp<T>` | `AppMetadata & { container; props? }` | Used with [`loadMicroApp`](/api/load-micro-app). `container` is an `HTMLElement`. |
| `RegistrableApp<T>` | `LoadableApp<T> & { loader?; activeRule; configuration? }` | Used with [`registerMicroApps`](/api/register-micro-apps). |
| `AppConfiguration` | loader options `& { sandbox? }` | Per-app runtime configuration. See [AppConfiguration](/api/configuration). |
| `SandboxConfiguration` | `{ styleIsolation?; globals?; incubatorContext?; plugins?; …module hooks }` | The object form of `sandbox`. See [SandboxConfiguration](/api/configuration#sandboxconfiguration). |
| `LifeCycleFn<T>` | `(app, global) => Promise<void>` | A single framework lifecycle hook. |
| `LifeCycles<T>` | `{ beforeLoad?; beforeMount?; afterMount?; beforeUnmount?; afterUnmount? }` | Framework hooks. See [Lifecycle hooks](/api/lifecycles). |
| `MicroApp` | single-spa `Parcel` | The handle returned by `loadMicroApp`. |
| `MicroAppLifeCycles` | `{ bootstrap; mount; unmount; update? }` | The lifecycle exports a micro-app itself provides. |
| `PrefetchStrategy` | `boolean \| 'all' \| string[] \| fn` | Exported for legacy compatibility; unused by any v3 API. |

## ObjectType

```ts
export type ObjectType = Record<string, unknown>;
```

The constraint used everywhere qiankun accepts a props generic `T`. When you type your own props object, it must extend `ObjectType`:

```ts
type Props = { userId: number; theme: 'light' | 'dark' };
// Props satisfies Record<string, unknown>, so it is a valid T
```

## HTMLEntry

```ts
export type HTMLEntry = string;
```

The entry of a micro-app is always the URL of its HTML document. qiankun streams that HTML through the [HTML-entry loader](/concepts/html-entry-loading) and executes the scripts it references.

```ts
const entry: HTMLEntry = 'http://localhost:7101';
```

::: danger No object entry
The qiankun 2.x `entry: { scripts: [...], styles: [...] }` form does not exist in v3. Point `entry` at an HTML page and let the loader discover its assets.
:::

## AppMetadata

```ts
export type AppMetadata = {
  name: string;
  entry: HTMLEntry;
};
```

The minimal descriptor of a micro-app: a stable `name` and its HTML `entry`. `AppMetadata` is the base that `LoadableApp` and `RegistrableApp` extend, and it is the element type accepted by [`prefetchApps`](/api/prefetch-apps).

## LoadableApp

```ts
export type LoadableApp<T extends ObjectType> = AppMetadata & {
  container: HTMLElement;
  props?: T;
};
```

The descriptor for an app you mount imperatively with [`loadMicroApp`](/api/load-micro-app).

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Application identifier. Separate `loadMicroApp` instances may reuse it when they use different containers. |
| `entry` | `HTMLEntry` | HTML entry URL. |
| `container` | `HTMLElement` | The DOM element the app mounts into. Must be an element, not a selector. |
| `props` | `T` (optional) | Props forwarded to the micro-app's lifecycle exports. |

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('subapp')!;
const app = loadMicroApp<{ userId: number }>({
  name: 'app1',
  entry: 'http://localhost:7101',
  container,
  props: { userId: 42 },
});
```

::: warning container is an HTMLElement
`container: '#subapp'` compiles in 2.x but is a type error in v3. Resolve the element yourself, for example with `document.getElementById(...)` or a framework ref.
:::

## RegistrableApp

```ts
export type RegistrableApp<T extends ObjectType> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;
  activeRule: RegisterApplicationConfig['activeWhen'];
  configuration?: AppConfiguration;
};
```

The descriptor for a route-driven app you hand to [`registerMicroApps`](/api/register-micro-apps). It extends `LoadableApp` with three route/loading fields.

| Field | Type | Description |
| --- | --- | --- |
| `loader` | `(loading: boolean) => void` (optional) | Reports route-app loading state. Treat the value as state because `true` may be reported more than once before the final `false`. |
| `activeRule` | single-spa `Activity` | When the app is active. A path prefix string, an `(location) => boolean` function, or an array mixing both. |
| `configuration` | `AppConfiguration` (optional) | Per-app runtime configuration, merged over the framework defaults. |

`activeRule` is single-spa's `activeWhen` type — `string | ((location: Location) => boolean) | Array<string | ((location: Location) => boolean)>`:

```ts
import { registerMicroApps } from 'qiankun';

registerMicroApps([
  {
    name: 'app1',
    entry: 'http://localhost:7100',
    container: document.getElementById('subapp')!,
    activeRule: '/app1',
    configuration: { sandbox: { styleIsolation: true } },
  },
]);
```

## AppConfiguration

```ts
export type AppConfiguration = Partial<
  Pick<LoaderOpts, 'fetch' | 'streamTransformer' | 'nodeTransformer'>
> & {
  sandbox?: boolean | SandboxConfiguration;
};
```

The per-app runtime configuration. It is the second argument to [`loadMicroApp`](/api/load-micro-app) and the `configuration` field of `RegistrableApp`.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `fetch` | `typeof window.fetch` | `window.fetch` | Custom fetch for the entry and loader-managed scripts, modules, and styles. |
| `streamTransformer` | `() => TransformStream<string, string>` | `undefined` | A transform piped into the HTML stream while it loads. |
| `nodeTransformer` | `<T extends Node>(node: T, opts) => T` | internal default | Rewrites script / link / style nodes before they enter the container. |
| `sandbox` | `boolean \| SandboxConfiguration` | `true` | Enables the [JS sandbox](/concepts/js-sandbox) membrane and, where applicable, the [ESM sandbox](/concepts/esm-sandbox). The object form also configures it. |

See [AppConfiguration](/api/configuration) for field behavior and defaults.

## SandboxConfiguration

```ts
export type SandboxConfiguration = Pick<
  CreateSandboxOptions,
  | 'globals'
  | 'incubatorContext'
  | 'modules'
  | 'resolveHook'
  | 'importHook'
  | 'loadHook'
  | 'plugins'
  | 'styleIsolation'
>;
```

The object form of `sandbox` — structurally a public projection of the sandbox's `CompartmentOptions` plus the two host extensions `plugins` and `styleIsolation`.

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `styleIsolation` | `boolean` | `false` | Enables runtime CSS `@scope` [style isolation](/concepts/style-isolation) scoped to the app container. |
| `globals` | `CompartmentGlobals` | `{}` | Values or property descriptors installed on the app's compartment global. |
| `incubatorContext` | `WindowProxy` | `window` | The host context that incubates the sandbox. |
| `plugins` | `readonly IsolationPlugin[]` | `[]` | Isolation plugins appended after the built-in ones. |
| `modules` / `resolveHook` / `importHook` / `loadHook` | Compartment module hooks | `undefined` | Module resolution and loading hooks for sandboxed ESM. |

::: danger No 2.x sandbox object, no FrameworkConfiguration
`sandbox` is a boolean or a `SandboxConfiguration`. The 2.x object form `sandbox: { strictStyleIsolation, experimentalStyleIsolation }` and Shadow DOM isolation are gone; style isolation is `sandbox.styleIsolation`, implemented with CSS `@scope`. There is no `FrameworkConfiguration` type, and `start()` accepts no sandbox, prefetch, or singular options.
:::

## LifeCycleFn and LifeCycles

```ts
export type LifeCycleFn<T extends ObjectType> = (
  app: LoadableApp<T>,
  global: WindowProxy,
) => Promise<void>;

export type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

The framework-level hooks you pass as the optional last argument to `registerMicroApps` and `loadMicroApp`. Each hook is one function or an array of them, run in order. The second argument, `global`, is the sandbox-proxied `window` for that app, not the real `window`.

```ts
const lifeCycles: LifeCycles<Record<string, unknown>> = {
  beforeLoad: async (app) => console.log('before load', app.name),
  afterMount: [
    async (app, global) => console.log('mounted into', app.container, global),
  ],
};
```

::: info Two distinct lifecycle types
`LifeCycles` (the five framework hooks above) is separate from `MicroAppLifeCycles` (the `bootstrap`/`mount`/`unmount`/`update` a micro-app exports about itself). See [Micro-app lifecycle and props](/concepts/lifecycle-and-props).
:::

## MicroApp

```ts
import type { Parcel } from '@qiankunjs/single-spa';
export type MicroApp = Parcel;
```

The handle returned by [`loadMicroApp`](/api/load-micro-app). It is a `Parcel` from `@qiankunjs/single-spa` — qiankun's vendored single-spa fork, already installed as a dependency — giving you imperative control plus promises for each phase. Import routing helpers from that package too, never from the separate `single-spa` package, which would set up a second, independent router.

| Member | Type | Description |
| --- | --- | --- |
| `mount()` | `() => Promise<null>` | Mount the app. |
| `unmount()` | `() => Promise<null>` | Unmount the app. |
| `update?(props)` | `(props) => Promise<any>` | Push new props, when the app exports an `update` hook. |
| `getStatus()` | `() => Status` | Current lifecycle status (union below). |
| `loadPromise` | `Promise<null>` | Resolves when source code has loaded. |
| `bootstrapPromise` | `Promise<null>` | Resolves when bootstrap completes. |
| `mountPromise` | `Promise<null>` | Resolves when mount completes. |
| `unmountPromise` | `Promise<null>` | Resolves when unmount completes. |

`getStatus()` returns one of single-spa's status strings:

```ts
type Status =
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
```

```ts
const app = loadMicroApp({ name: 'app1', entry, container });
await app.mountPromise;
console.log(app.getStatus()); // 'MOUNTED'
await app.unmount();
```

## MicroAppLifeCycles

```ts
type ExtraProps = { container: HTMLElement };
export type MicroAppLifeCycles = FlattenArrayValue<ParcelLifeCycles<ExtraProps>>;
```

The shape of the lifecycle object a micro-app exports for qiankun to drive it. After flattening single-spa's array form, it resolves to:

```ts
type MicroAppLifeCycles = {
  bootstrap: (props) => Promise<void>;
  mount: (props) => Promise<void>;
  unmount: (props) => Promise<void>;
  update?: (props) => Promise<void>;
};
```

Every lifecycle receives the data passed through `props`. qiankun additionally injects `container: HTMLElement` only when it calls `mount` and `unmount`; `bootstrap` and `update` should not rely on that field. A micro-app's entry exports these:

```ts
let root: { unmount(): void } | null = null;

export async function bootstrap() {}
export async function mount(props: { container: HTMLElement }) {
  root = render(props.container); // render and keep the handle
}
export async function unmount() {
  root?.unmount(); // tear down the rendered tree
  root = null;
}
```

## PrefetchStrategy

```ts
export type PrefetchStrategy =
  | boolean
  | 'all'
  | string[]
  | ((apps: AppMetadata[]) => {
      criticalAppNames: string[];
      minorAppsName: string[];
    });
```

::: warning Exported but unused
`PrefetchStrategy` is a legacy type kept for source compatibility. No v3 public API consumes it — the streaming loader preloads automatically, and [`prefetchApps`](/api/prefetch-apps) is deprecated. It is documented here only because it is still exported.
:::

## Window augmentations

qiankun augments the global `Window` interface. These properties are how a micro-app detects it is running under qiankun and how the runtime cooperates with zone-based frameworks.

```ts
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
    __QIANKUN_DEVELOPMENT__?: boolean;
    Zone?: CallableFunction;
    __zone_symbol__setTimeout?: Window['setTimeout'];
  }
}
```

| Property | Type | Description |
| --- | --- | --- |
| `__POWERED_BY_QIANKUN__` | `boolean` | Set on the sandboxed global when the app runs inside qiankun. Read it to branch standalone vs. embedded behavior. |
| `__INJECTED_PUBLIC_PATH_BY_QIANKUN__` | `string` | The runtime public path qiankun injects so the app resolves its assets from the correct origin. |
| `__QIANKUN_DEVELOPMENT__` | `boolean` | Set when qiankun runs in development mode, enabling extra dev-time diagnostics. |
| `Zone` | `CallableFunction` | Present when zone.js is loaded (for example Angular). qiankun accounts for it so patched timers behave correctly. |
| `__zone_symbol__setTimeout` | `Window['setTimeout']` | zone.js's saved reference to the original `setTimeout`, used to reach the unpatched timer when zone.js is active. |

A micro-app typically reads the first two to adapt at runtime:

```ts
// Inside the micro-app
if (window.__POWERED_BY_QIANKUN__) {
  // running under qiankun: export bootstrap/mount/unmount
} else {
  // running standalone
  render(document.getElementById('root'));
}

// Align the module public path with qiankun's injected value (webpack)
if (window.__POWERED_BY_QIANKUN__) {
  // eslint-disable-next-line no-undef, camelcase
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

::: tip Global augmentation is automatic
Importing anything from `qiankun` pulls in this `declare global` block, so `window.__POWERED_BY_QIANKUN__` is typed in your project without extra setup. In a micro-app that does not depend on `qiankun`, add your own `declare global` block with the same properties.
:::

## See also

- [AppConfiguration](/api/configuration) — every configuration field in depth
- [Lifecycle hooks (LifeCycles)](/api/lifecycles) — the framework hooks reference
- [registerMicroApps](/api/register-micro-apps) and [loadMicroApp](/api/load-micro-app) — where these types are consumed
- [Micro-app lifecycle and props](/concepts/lifecycle-and-props) — how mount props flow to a micro-app
- [Migrate from qiankun 2.x](/cookbook/migrate-from-2x) — the breaking type changes in one place
