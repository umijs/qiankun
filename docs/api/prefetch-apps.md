# prefetchApps (deprecated)

`prefetchApps` warms the browser HTTP cache for selected micro-apps. It remains only for compatibility with existing code; new projects should not call it.

::: warning Deprecated
qiankun v3 discovers and loads resources while processing a streaming HTML Entry. `start()` also no longer accepts a prefetch strategy. See [Optimize micro-app loading](/cookbook/optimize-loading) for current guidance.
:::

## Signature

```ts
function prefetchApps(
  apps: AppMetadata[],
  fetch?: typeof window.fetch,
): void;
```

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `apps` | `AppMetadata[]` | — | List of `{ name, entry }` values to warm. |
| `fetch` | `typeof window.fetch` | `window.fetch` | Fetch implementation used for entries and discovered external scripts and styles. |

The function returns immediately. It provides no completion promise and does not create a sandbox, execute scripts, or mount an application.

## Legacy behavior

When called, it fetches the entry HTML during browser idle time and attempts to fetch external scripts and stylesheets found in the document. It may skip work when the browser is offline, has Save-Data enabled, or is on a slow connection. Individual request failures do not produce a synchronous exception.

```ts
import { prefetchApps } from 'qiankun';

// Maintain existing calls only; do not add this to a new project.
prefetchApps([{ name: 'legacy-app', entry: 'https://cdn.example.com/legacy-app/' }]);
```

The `PrefetchStrategy` type is still exported for compatibility, but no public v3 API consumes it.

## Related

- [Optimize micro-app loading](/cookbook/optimize-loading)
- [HTML Entry and execution](/concepts/html-entry-loading)
- [Migrate from qiankun 2.x](/cookbook/migrate-from-2x)
