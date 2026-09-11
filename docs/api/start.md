# start

Start the route-driven applications registered with [`registerMicroApps`](/api/register-micro-apps). After it runs, single-spa mounts and unmounts apps automatically by comparing the current URL with each app's `activeRule`.

You do not need to call `start()` when using [`loadMicroApp`](/api/load-micro-app) directly. To set a shared loading timeout default, call `start({ timeout })` before the first load.

## Signature

```ts
function start(opts?: StartOpts & Pick<AppConfiguration, 'timeout'>): void;
```

`StartOpts` comes from single-spa; qiankun adds `timeout`:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `urlRerouteOnly` | `boolean` | `true` | When `true`, reroute only after the URL actually changes. |
| `timeout` | `number` | `0` (disabled) | Default loading timeout in milliseconds for subsequent apps. Per-app configuration can override it; positive finite values enable it and `0` disables it. |

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

`start()` is idempotent; repeated calls neither start routing again nor change the timeout default established by the first call.

## Relationship to `loadMicroApp`

`loadMicroApp` ensures the runtime is ready, so on-demand loading requires no separate startup call. To set a global timeout default with `start({ timeout })`, call it before the first `loadMicroApp`. Each app can still override it in the second argument.

```ts
import { loadMicroApp, start } from 'qiankun';

start({ timeout: 10_000 });
const app = loadMicroApp({ name: 'app1', entry, container });
const streamingApp = loadMicroApp(
  { name: 'streaming-app', entry: streamingEntry, container: streamingContainer },
  { timeout: 0 },
);
```

The default also applies to route applications registered through `registerMicroApps`, which can override it with `configuration.timeout`. See [AppConfiguration](/api/configuration#timeout) for the timer's scope, cleanup behavior, and invalid values.

When migrating from qiankun 2.x, do not continue passing sandbox, prefetch, or fetch configuration to `start()`. See the [migration guide](/cookbook/migrate-from-2x) for the complete changes.

## Related

- [loadMicroApp](/api/load-micro-app) — the recommended on-demand instance loading API.
- [registerMicroApps](/api/register-micro-apps) — register apps driven by the URL.
- [Loading a micro-app instance](/concepts/architecture) — choose between the two loading modes.
