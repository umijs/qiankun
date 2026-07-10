# Lifecycle hooks (`LifeCycles`)

`LifeCycles` are host-provided hooks for observing one micro-app while it is prepared, mounted, and unmounted. They do not implement the micro-app itself; the app's own `bootstrap`, `mount`, `unmount`, and optional `update` exports are a separate contract.

## Use hooks with loadMicroApp

Pass hooks as the third argument to [`loadMicroApp`](/api/load-micro-app). They apply only to the returned instance:

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

const microApp = loadMicroApp(
  {
    name: 'account-app',
    entry: 'http://localhost:7101/',
    container,
  },
  {},
  {
    beforeLoad: async (app) => console.log('preparing', app.name),
    beforeMount: [
      async (app) => console.log('mounting', app.name),
      async (_app, global) => console.log('app URL', global.location.href),
    ],
    afterMount: async (app) => console.log('mounted', app.name),
    beforeUnmount: async (app) => console.log('unmounting', app.name),
    afterUnmount: async (app) => console.log('unmounted', app.name),
  },
);

await microApp.mountPromise;

// Later, when the host no longer needs this instance:
await microApp.unmount();
```

The empty second argument is the per-app configuration position. See [`AppConfiguration`](/api/configuration) when you need to set it.

## Types

```ts
type ObjectType = Record<string, unknown>;

type LifeCycleFn<T extends ObjectType> = (
  app: LoadableApp<T>,
  global: WindowProxy,
) => Promise<void>;

type LifeCycles<T extends ObjectType> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
```

`app` is the [`LoadableApp`](/api/types) description passed by the host: `{ name, entry, container, props? }`.

Each field accepts one function or an array. Array entries run in declaration order; qiankun awaits each returned Promise before starting the next. If a hook rejects, the remaining hooks in that chain do not run and the lifecycle transition fails.

## The five hooks

| Hook | Timing guarantee | Typical host use |
| --- | --- | --- |
| `beforeLoad` | Runs during entry preparation, before qiankun continues with the resolved app lifecycles; it is not guaranteed to precede the network request | Start host-side loading state or record timing |
| `beforeMount` | Runs immediately before the micro-app's own `mount` is called | Prepare host context needed for this mount |
| `afterMount` | Runs after the micro-app's `mount` Promise resolves | Hide loading UI or record a successful mount |
| `beforeUnmount` | Runs immediately before the micro-app's own `unmount` is called | Persist host-owned state or stop host subscriptions |
| `afterUnmount` | Runs during teardown after the micro-app's `unmount` Promise resolves | Finish host cleanup or record the end of a session |

`beforeMount` / `afterMount` surround the app's `mount`; they do not surround entry loading or `bootstrap`. `beforeUnmount` / `afterUnmount` similarly surround the app's `unmount` phase.

On remount, the mount and unmount hooks run for each transition. `beforeLoad` belongs to entry preparation and is not a per-mount hook.

### `beforeLoad` and network timing

Entry preparation may begin before `beforeLoad` is awaited, so the hook can overlap with the entry request. Do not use it to inject authentication, rewrite URLs, or otherwise assume it runs before fetching starts. Configure request behavior through [`AppConfiguration.fetch`](/api/configuration) instead.

qiankun waits for `beforeLoad` before it proceeds with the lifecycle object resolved from the entry. This makes the hook suitable for host-side observation, but not for changing how that entry is loaded.

## The `global` argument

With the default sandbox enabled, `global` is the isolated `WindowProxy` view seen by that micro-app instance. It is not the lifecycle object exported by the app and it is not the host page's real `window`.

Use it only when a micro-app intentionally expects a value on its window view; prefer `props` for application data and callbacks. When the sandbox is disabled, these isolation guarantees do not apply. See [JavaScript isolation](/concepts/js-sandbox) for the public boundaries.

## Route-driven applications

For the route-driven alternative, pass one `LifeCycles` object as the second argument to [`registerMicroApps`](/api/register-micro-apps). It applies to every app in that registration call, so use the `app` argument when reporting or branching by application. The hook meanings and timing guarantees are otherwise the same.

## Host hooks vs. micro-app lifecycles

Host `LifeCycles` receive `(app, global)` and observe transitions around an instance. The micro-app's own `bootstrap`, `mount`, `unmount`, and optional `update` receive props, render the app, and perform its cleanup. Host hooks do not replace those exports.

See [Micro-app lifecycle and props](/concepts/lifecycle-and-props) for the application-side contract.

## Related

- [`loadMicroApp`](/api/load-micro-app) — per-instance loading and handle ownership
- [`registerMicroApps`](/api/register-micro-apps) — route-driven activation
- [`AppConfiguration`](/api/configuration) — request and sandbox configuration
- [Type reference](/api/types) — `LoadableApp`, `MicroApp`, and related types
