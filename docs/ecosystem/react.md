# The `<MicroApp>` component for React (@qiankunjs/react)

`@qiankunjs/react` gives you a `MicroApp` component that mounts a qiankun micro-app into your React component tree. It wraps [`loadMicroApp`](/api/load-micro-app) and ties the whole lifecycle — mount, update, unmount — to the component's own lifecycle and re-renders, so you never have to reach for that imperative API yourself.

Use it when the host is a React SPA and you want to drop a micro-app in as an ordinary component (on a route, inside a panel) rather than registering it globally with [`registerMicroApps`](/api/register-micro-apps).

## Installation

```bash
pnpm add @qiankunjs/react qiankun
```

The peer dependencies are `react` and `react-dom`, both required at `>=16.9.0`.

## Basic usage

The only required props are `name` and `entry`, where `entry` is the URL of the micro-app's HTML entry.

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" />;
}
```

The component renders a container `<div>` and mounts the micro-app into it; when the component unmounts, the micro-app unmounts with it.

::: warning name and entry are required
If either `name` or `entry` is missing, the component just logs `the name and entry of MicroApp is needed` and does nothing — it does not throw. Make sure you always pass both.
:::

## Props

```ts
import { type MicroApp } from 'qiankun';

// The exported component type
type Props = SharedProps & SharedSlots<React.ReactNode> & Record<string, unknown>;
```

That trailing `Record<string, unknown>` is deliberate: **any prop that isn't one of the reserved props listed below is forwarded to the micro-app as-is, becoming its props**. There's no separate `appProps` here — the extra props _are_ the micro-app's props.

### Reserved props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` * | `string` | — | The unique name of the micro-app. Changing it remounts a brand-new micro-app. |
| `entry` * | `string` | — | The micro-app's HTML entry URL. |
| `settings` | [`AppConfiguration`](/api/configuration) | — | Loader / sandbox configuration passed through to `loadMicroApp`. |
| `lifeCycles` | [`LifeCycles`](/api/lifecycles) | — | Global lifecycle hooks (`beforeLoad`, `beforeMount`, etc.) for this micro-app. |
| `autoSetLoading` | `boolean` | `false` | Render the built-in loader and clear it automatically once the app is mounted. |
| `autoCaptureError` | `boolean` | `false` | Render the built-in error boundary instead of throwing loading errors outward. |
| `wrapperClassName` | `string` | — | Class prepended to the wrapper element. Only takes effect when a loader or error boundary is active. |
| `className` | `string` | — | Class prepended to the mount container element. |
| `loader` | `(loading: boolean) => ReactNode` | — | Render-prop slot for a custom loading UI. |
| `errorBoundary` | `(error: Error) => ReactNode` | — | Render-prop slot for a custom error UI. |

`*` = required.

Every other prop is deep-compared on each render and then forwarded to the micro-app. See [Passing props to the micro-app](#passing-props-to-the-micro-app).

::: info Reserved fields are not forwarded
`name`, `entry`, `settings`, `lifeCycles`, `wrapperClassName`, and `className` are consumed by the component itself and stripped off before the props reach the micro-app. Don't expect to receive them inside the sub-app.
:::

## Passing props to the micro-app {#passing-props-to-the-micro-app}

Any non-reserved prop is forwarded to the micro-app and delivered to its `bootstrap`/`mount`/`update` lifecycles.

```tsx
<MicroApp
  name="app1"
  entry="http://localhost:8000"
  // forwarded to the micro-app as props
  userId={42}
  theme="dark"
  onEvent={(e) => console.log(e)}
/>
```

Inside the micro-app, these values show up on the `props` of each lifecycle:

```ts
export async function mount(props) {
  console.log(props.userId, props.theme);
}
```

When these props change, the component deep-compares them with lodash's `isEqual` and calls `microApp.update(props)` on the running app — the micro-app is not remounted. And the update only actually runs when the app's status is `MOUNTED`.

::: tip Remount vs update
Changing `name` mounts a brand-new micro-app; changing any forwarded prop triggers a single in-place `update`. To reset completely, change `name` (or give it a `key`).
:::

## Loading state

The internal loading flag starts out `true`. It's only cleared automatically — via `setLoading(false)`, driven by the app's `mountPromise` — when `autoSetLoading` is enabled. Without a loader configured there's nothing to render for the loading state anyway, so the flag has no visible effect.

### Built-in loader

```tsx
<MicroApp name="app1" entry="http://localhost:8000" autoSetLoading />
```

The built-in loader is just a placeholder that renders the literal text `loading...`. For a real UI, pass your own `loader`.

### Custom loader

```tsx
<MicroApp
  name="app1"
  entry="http://localhost:8000"
  loader={(loading) => <Spinner spinning={loading} />}
/>
```

If you pass a `loader` you don't also need `autoSetLoading` — the loading UI is activated as soon as the slot is present. `wrapperClassName` only takes effect when a loader or error boundary is active, because that's the only time the component renders the positioned wrapper element.

## Error handling

By default, errors from loading, bootstrap, and mount are **thrown outward** — the component doesn't swallow them for you. You have to catch them with an outer React error boundary, or opt into the built-in / custom error UI.

::: danger Uncaught errors propagate upward
With neither `autoCaptureError` nor `errorBoundary` set, a failed load throws during render and takes down the whole subtree — unless a React error boundary higher up catches it.
:::

### Built-in error boundary

```tsx
<MicroApp name="app1" entry="http://localhost:8000" autoCaptureError />
```

The built-in boundary renders a bare `<div>` containing `error.message`. For production UI, pass your own `errorBoundary`.

### Custom error boundary

```tsx
<MicroApp
  name="app1"
  entry="http://localhost:8000"
  errorBoundary={(error) => <ErrorPanel message={error.message} />}
/>
```

### Loading and error together

```tsx
<MicroApp
  name="app1"
  entry="http://localhost:8000"
  autoSetLoading
  autoCaptureError
/>
```

For a more systematic treatment of error handling, see [Handling loading and runtime errors](/cookbook/handle-errors) and [addErrorHandler / removeErrorHandler](/api/error-handling).

## Getting the running app through a ref

The component is a `forwardRef`. The forwarded ref points at the running micro-app handle — a single-spa Parcel (the `MicroApp` type from `qiankun`) — so you can read its status and await its lifecycle promises.

```tsx
import { useRef, useEffect } from 'react';
import { MicroApp } from '@qiankunjs/react';
import { type MicroApp as MicroAppType } from 'qiankun';

function Page() {
  const microAppRef = useRef<MicroAppType>();

  useEffect(() => {
    // e.g. 'MOUNTING' | 'MOUNTED' | 'LOAD_ERROR' | ...
    console.log(microAppRef.current?.getStatus());
  }, []);

  return <MicroApp name="app1" entry="http://localhost:8000" ref={microAppRef} />;
}
```

### The ref handle

The handle is single-spa's Parcel interface:

| Member | Type | Description |
| --- | --- | --- |
| `getStatus()` | `() => Status` | The current lifecycle status (see below). |
| `mount()` | `() => Promise<null>` | Mount the app. |
| `unmount()` | `() => Promise<null>` | Unmount the app. |
| `update?(props)` | `(props) => Promise<unknown>` | Push new props (present only if the app exports an `update` lifecycle). |
| `loadPromise` | `Promise<null>` | Resolves when the source code has finished loading. |
| `bootstrapPromise` | `Promise<null>` | Resolves when the app has finished bootstrapping. |
| `mountPromise` | `Promise<null>` | Resolves when the app has finished mounting. |
| `unmountPromise` | `Promise<null>` | Resolves when the app has finished unmounting. |

`getStatus()` returns one of: `NOT_LOADED`, `LOADING_SOURCE_CODE`, `NOT_BOOTSTRAPPED`, `BOOTSTRAPPING`, `NOT_MOUNTED`, `MOUNTING`, `MOUNTED`, `UPDATING`, `UNMOUNTING`, `UNLOADING`, `SKIP_BECAUSE_BROKEN`, `LOAD_ERROR`.

::: warning Let the component manage the lifecycle
The ref is for reading status and awaiting promises. Don't call its `mount()`/`unmount()` yourself — the component owns mount / update / unmount, and it also guards against concurrent unmount and remount. Calling those by hand tends to corrupt that state.
:::

## Passing configuration

Loader- and sandbox-related options all go through `settings`, an [`AppConfiguration`](/api/configuration).

```tsx
<MicroApp
  name="app1"
  entry="http://localhost:8000"
  settings={{ sandbox: true, styleIsolation: true }}
/>
```

Before calling `loadMicroApp`, the component always forces `globalContext: window`, then merges your `settings` on top. For what `styleIsolation` actually enables, see [Style isolation](/concepts/style-isolation); for `sandbox`, see [The JS sandbox](/concepts/js-sandbox).

## Lifecycle hooks

Framework-level hooks are passed via `lifeCycles`. They're merged with the global hooks (appended, not replaced) and run around this micro-app's load / mount / unmount.

```tsx
<MicroApp
  name="app1"
  entry="http://localhost:8000"
  lifeCycles={{
    beforeMount: async (app) => console.log('before mount', app.name),
    afterMount: async (app) => console.log('mounted', app.name),
  }}
/>
```

For the full list of hooks and their signatures, see [Lifecycle hooks](/api/lifecycles).

## Styling hooks

The component always attaches two classes you can target in CSS:

| Element | Class |
| --- | --- |
| Wrapper (rendered only when a loader or error boundary is active) | `qiankun-micro-app-wrapper` |
| Mount container (always rendered) | `qiankun-micro-app-container` |

```css
.qiankun-micro-app-wrapper {
  position: relative; /* already applied inline; add your own layout here */
}

.qiankun-micro-app-container {
  min-height: 240px;
}
```

`wrapperClassName` and `className` are **prepended** to these two classes, so both your own class and qiankun's hook class end up on the element.

## How it works under the hood

```mermaid
flowchart TD
  A[MicroApp renders] --> B{name / entry both present?}
  B -- no --> B0[console.error, do nothing]
  B -- yes --> C["loading = true, mountMicroApp()"]
  C --> D["loadMicroApp(app, settings, lifeCycles)"]
  D --> E{mountPromise}
  E -- success --> F["if autoSetLoading: loading = false"]
  E -- failure --> G{loader / errorBoundary set?}
  G -- yes --> H["setError(err)"]
  G -- no --> I["throw err (caught by outer boundary)"]
  J[name changes] --> K[unmount old, mount new]
  L[forwarded props change] --> M["deep compare, microApp.update(props)"]
  N[component unmounts] --> O[unmount micro-app]
```

- Mounting is keyed on `name`; changing it remounts a brand-new app.
- Prop updates are driven by a deep comparison of the forwarded props and go through `microApp.update`.
- Before unmounting, the component waits for the app's `mountPromise` and guards against concurrent teardown, so remounting and multiple instances stay consistent.

## Related

- [loadMicroApp](/api/load-micro-app) — the facade API this component wraps.
- [AppConfiguration](/api/configuration) — the shape of `settings`.
- [Lifecycle hooks](/api/lifecycles) — the shape of `lifeCycles`.
- [The `<MicroApp>` component for Vue](/ecosystem/vue) — the Vue version (note: Vue passes app props through a dedicated `appProps` object).
- [Running multiple micro-app instances at once](/cookbook/run-multiple-instances)
