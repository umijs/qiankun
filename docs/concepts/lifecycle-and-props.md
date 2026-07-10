# Micro-app lifecycle and props

[`loadMicroApp`](/api/load-micro-app) connects two public contracts: the micro-app exports lifecycle functions, and the host receives a `MicroApp` handle that controls the running instance. Keeping both sides explicit makes an app safe to mount, update, unmount, and mount again.

Implementation details about export resolution and hook ordering live in [Lifecycle resolution internals](/internals/lifecycle-resolution).

## The micro-app contract

Every micro-app exposes `bootstrap`, `mount`, and `unmount`. `update` is optional:

```ts
type HostProps = {
  accountId: string;
};

type MountProps = HostProps & { container: HTMLElement };

export async function bootstrap() {
  // One-time setup before the first mount.
}

export async function mount(props: MountProps) {
  // Create and render the UI inside props.container.
}

export async function update(props: HostProps) {
  // Apply host-driven changes without remounting.
}

export async function unmount(props: MountProps) {
  // Destroy the UI created by mount and release its resources.
}
```

Native ESM apps can use named exports as above or export one default lifecycle object. Classic builds expose the same object through their bundler output. The [Vite](/cookbook/prepare-a-vite-app) and [Webpack](/cookbook/prepare-a-webpack-app) guides provide working configurations.

## The host controls the handle

`loadMicroApp` starts the first mount automatically and returns immediately. Keep the handle for status, updates, and teardown:

```ts
const microApp = loadMicroApp({
  name: 'account-app',
  entry: 'https://accounts.example.com/',
  container,
  props: { accountId: '42' },
});

await microApp.mountPromise;

if (microApp.update) {
  await microApp.update({ accountId: '84' });
}

await microApp.unmount();

// The same handle can be mounted again when needed.
await microApp.mount();
```

The `update` method is present only when the micro-app exports `update`. If the application does not support in-place updates, unmount it and create or mount the appropriate instance instead.

## Props, the container, and host hooks

The host's `props` are passed to the micro-app lifecycles. For `mount` and `unmount`, qiankun also supplies `props.container`, the actual `HTMLElement` owned by this instance.

Render and query within that container. Do not mount through a page-global selector: it breaks multiple instances and couples the micro-app to the host's document structure. Treat the container as instance-scoped; the micro-app must stop using it after unmount, even if the host later reuses it.

Props are also the simplest explicit channel for callbacks, shared services, and host-owned state. For longer-lived communication patterns, see [Share state and communicate between apps](/cookbook/communicate-between-apps).

Host lifecycle hooks (`beforeLoad`, `beforeMount`, `afterMount`, `beforeUnmount`, `afterUnmount`) are a separate API for observing transitions around the micro-app. Use the [Lifecycle hooks reference](/api/lifecycles) when the host needs logging, loading indicators, or policy checks; keep rendering and cleanup in the micro-app's own lifecycles.

## Mount, unmount, and remount

- `bootstrap` runs during initial loading before the first mount, not on remount.
- `mount` creates the visible application and may run more than once.
- `unmount` must reverse every user-visible effect created by `mount`.
- `update`, when exported, applies new host props to an already mounted instance.

On remount, qiankun rebuilds the entry DOM and calls `mount` again. It does not re-run the entry scripts or top-level module code for the same instance. Create disposable framework roots and view state inside `mount`, then destroy them inside `unmount`; do not depend on top-level code running again.

## Cleanup is a shared responsibility

qiankun deactivates the sandbox and clears the instance container after the micro-app's `unmount` completes. The micro-app must still clean up anything it created outside that DOM tree, including:

- framework roots and portals;
- subscriptions to host stores or event buses;
- pending requests, workers, observers, and other external resources;
- references retained by host-provided callbacks or services.

Always observe the Promise returned by `unmount()`. Await it before removing the container when the owning flow can pause; when a framework cleanup callback cannot await, start unmounting and attach a rejection handler before dropping the handle. A well-formed lifecycle should tolerate repeated mount/unmount cycles without duplicated listeners or stale UI.

For URL-driven activation, [`registerMicroApps`](/api/register-micro-apps) uses the same micro-app contract but lets routing decide when mount and unmount occur.

## Continue reading

- [`loadMicroApp` API](/api/load-micro-app) — complete handle and promise reference.
- [Loading a micro-app instance](/concepts/architecture) — the surrounding runtime model.
- [Run multiple instances](/cookbook/run-multiple-instances) — container and instance patterns.
- [Lifecycle resolution internals](/internals/lifecycle-resolution) — export discovery and hook ordering for maintainers.
