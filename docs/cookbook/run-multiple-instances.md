# Run multiple micro-app instances

`loadMicroApp` can load different applications at the same time or mount one application in several places. Use this for tabs, dialogs, dashboards, and other cases where host state determines the number of instances.

## Give every instance its own container

Every concurrently visible instance needs its own `HTMLElement`:

```ts
import { loadMicroApp } from 'qiankun';

function requireElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing container: ${id}`);
  return element;
}

const apps = [
  loadMicroApp({
    name: 'reports',
    entry: '//localhost:7101',
    container: requireElement('reports-pane'),
  }),
  loadMicroApp({
    name: 'settings',
    entry: '//localhost:7102',
    container: requireElement('settings-pane'),
  }),
];

await Promise.all(apps.map((app) => app.mountPromise));

// When the dashboard closes:
await Promise.all(apps.map((app) => app.unmount()));
```

Do not share one container between two live instances. To switch applications in one location, await the current instance's `unmount()` before loading the next one.

qiankun does hold a per-container occupancy gate: apps targeting the same element take FIFO turns for their DOM writes, so a second `loadMicroApp` into an occupied container waits instead of silently overwriting it. That is a safety net against interleaved writes, not a substitute for unmounting — an app whose handle is never unmounted holds its container forever, and everything queued behind it waits with it (in development, a wait longer than a few seconds logs a warning).

## Several instances of one application

The same `name` and `entry` can be loaded more than once with different containers:

```ts
const left = loadMicroApp({
  name: 'reports',
  entry: '//localhost:7101',
  container: requireElement('left-pane'),
  props: { accountId: 'A' },
});

const right = loadMicroApp({
  name: 'reports',
  entry: '//localhost:7101',
  container: requireElement('right-pane'),
  props: { accountId: 'B' },
});

await Promise.all([left.mountPromise, right.mountPromise]);
```

The micro-app must query and render only inside `props.container`. Page-level selectors, shared globals, and a singleton framework root let instances overwrite each other.

If `sandbox.styleIsolation` is enabled, remember that its CSS scope is keyed by `name`. Same-name instances share that selector; give each instance a distinct name when instance-specific styles must not match the others.

## Update an instance

When the micro-app exports an `update` lifecycle, update props through the corresponding handle:

```ts
if (left.update) {
  await left.update({ accountId: 'C' });
}
```

Each instance has its own handle. Do not mix update and unmount operations between handles.

## Remounting and container reuse

After unmounting the same instance, you can call `mount()` on its handle again. qiankun reuses the lifecycles it already discovered instead of executing entry top-level code again. Create application instances, routers, and stores needed for every mount inside the micro-app's `mount()`.

If the host destroys the old container and calls `loadMicroApp` for a new one, treat that as a new instance with its own cleanup path. Do not remove the DOM and discard the old handle.

## Every handle must be unmounted

The host owns every handle returned by `loadMicroApp` and the matching cleanup responsibility:

```ts
await Promise.all([left.unmount(), right.unmount()]);
```

`unmount()` invokes the micro-app lifecycle and releases container and sandbox side effects qiankun can track. The micro-app must still release external resources such as store subscriptions, workers, WebSockets, observers, and portals.

## Native ESM caveat

Concurrent instances of one ESM application need separate containers and testing around initial evaluation and dynamically created elements. The current ESM implementation still has known limitations when same-origin instances evaluate concurrently. If the product depends heavily on many concurrent instances, validate the real application first or evaluate a Classic build.

See [ESM sandbox internals](/internals/esm-sandbox) for the implementation background and [Native ESM support](/concepts/esm-sandbox) for normal integration requirements.

## Related

- [`loadMicroApp` API](/api/load-micro-app)
- [Lifecycle and props](/concepts/lifecycle-and-props)
- [JavaScript isolation](/concepts/js-sandbox)
- [Communicate between apps](/cookbook/communicate-between-apps)
