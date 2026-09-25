# start

Start the route-driven applications registered with [`registerMicroApps`](/api/register-micro-apps). After it runs, single-spa mounts and unmounts apps automatically by comparing the current URL with each app's `activeRule`.

You do not call `start()` when using [`loadMicroApp`](/api/load-micro-app) directly.

## Signature

```ts
function start(opts?: StartOpts): void;
```

`StartOpts` comes from single-spa:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `urlRerouteOnly` | `boolean` | `true` | When `true`, reroute only after the URL actually changes. |

## Usage

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'sub-app',
    entry: '//localhost:7101',
    container: document.getElementById('subapp-container')!,
    activeRule: '/sub-app',
  },
]);

start();
```

`start()` is idempotent; repeated calls do not start routing again.

## Relationship to `loadMicroApp`

`loadMicroApp` ensures the runtime is ready, so on-demand loading requires no separate startup call. Only route-driven registration requires an explicit `start()`.

When migrating from qiankun 2.x, do not continue passing sandbox, prefetch, or fetch configuration to `start()`. See the [migration guide](/cookbook/migrate-from-2x) for the complete changes.

## Related

- [loadMicroApp](/api/load-micro-app) — the recommended on-demand instance loading API.
- [registerMicroApps](/api/register-micro-apps) — register apps driven by the URL.
- [Loading a micro-app instance](/concepts/architecture) — choose between the two loading modes.
