# Handle micro-app errors

Handle failures at the same level where recovery is possible. For [`loadMicroApp`](/api/load-micro-app), the host that owns the instance should render its fallback UI and retain the handle for cleanup. Use the global error channel separately for centralized logging and monitoring.

This page covers entry and lifecycle failures. Errors from ordinary UI events or application code after a successful mount still belong to the micro-app's own framework boundary and monitoring setup.

## Handle the current instance first

`loadMicroApp` returns before loading and mounting finish. Attach a rejection handler to `mountPromise`, show an error state for that instance, and keep ownership of `unmount()`:

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

const microApp = loadMicroApp({
  name: 'account-app',
  entry: 'http://localhost:7101/',
  container,
});

const mountFinished = microApp.mountPromise
  .then(() => true)
  .catch(() => {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'This section could not be loaded.';
    container.replaceChildren(message);
    return false;
  });

export async function disposeMicroApp() {
  const mounted = await mountFinished;
  if (mounted) {
    await microApp.unmount();
  }
}
```

The same pattern can be written with `try` / `await`. The important part is that catching `mountPromise` does not transfer lifecycle ownership: do not discard a successfully mounted handle or remove its container without awaiting `unmount()`.

An `unmount()` rejection should also be handled by the host operation that initiated teardown. Keep the visible message generic; let the global handler below send the original error to monitoring.

## Use the global channel for reporting

Register one global handler near host startup to enrich and report errors across applications. Keep the same function reference so it can be removed in tests or during host teardown:

```ts
import { addErrorHandler, removeErrorHandler } from 'qiankun';

const reportMicroAppError = (error: Error) => {
  reportToMonitoring(error);
};

addErrorHandler(reportMicroAppError);

// During host teardown or test cleanup:
removeErrorHandler(reportMicroAppError);
```

This channel observes load and lifecycle failures from all `loadMicroApp` instances. Apps activated with [`registerMicroApps`](/api/register-micro-apps) enter the same global channel. Use it for telemetry, not for choosing or rendering an instance's fallback UI.

Do not throw, reload the page, or start an unbounded retry loop inside a global handler. See the [`addErrorHandler` / `removeErrorHandler` reference](/api/error-handling) for the error shape and lifecycle coverage.

## React and Vue hosts

The React and Vue `<MicroApp>` components wrap the same instance-level promise handling and own unmount through the component lifecycle.

- React supports `autoCaptureError` or a custom `errorBoundary`; see the [React integration](/ecosystem/react).
- Vue supports `autoCaptureError` or the `#error-boundary` slot; see the [Vue integration](/ecosystem/vue).

Use a component boundary for nearby fallback UI and the global handler for centralized reporting. They are complementary and may both observe the same failure.

## Diagnose by symptom

Start with the browser Network panel and the micro-app's standalone build, then narrow the failure by what the user sees:

| Symptom | What to check | Typical action |
| --- | --- | --- |
| Entry or asset request fails, redirects unexpectedly, or returns an empty response | Status, final URL, authentication, and CORS for the HTML entry and every fetched asset | Fix the deployment URL and allow the host origin; configure a custom [`fetch`](/api/configuration) when credentials are required |
| Entry loads but the app never reaches `mount` | The entry exports `bootstrap`, `mount`, and `unmount` in the format expected by its build | Follow the [Vite](/cookbook/prepare-a-vite-app) or [Webpack](/cookbook/prepare-a-webpack-app) preparation guide |
| The HTML entry is rejected because more than one entry is present | Generated `index.html` and bundler-plugin output | Ensure exactly one external script has the `entry` attribute |
| The app has no valid mount target or renders in the wrong place | The value passed as `container` and selectors used inside `props.container` | Pass a live `HTMLElement`, not a selector string, and query only inside that element |
| An ESM app fails before mounting | Failed module requests, unresolved bare imports, import-map entries, MIME types, and CORS | Let Vite emit URL-based imports, or provide valid app-owned mappings; fix failed module responses |
| The app renders without styles after style isolation is enabled | External stylesheet requests in the Network panel | Enable CORS for CSS and verify the stylesheet URL; see [Style isolation](/cookbook/enable-style-isolation) |

Avoid matching private runtime error strings in application logic. Messages may change; use the failed instance, lifecycle phase, network response, and monitoring metadata as diagnostic context.

## Retry only transient failures

qiankun performs limited retries for transient network failures before rejecting the instance promise and notifying global handlers. Do not add a recursive or unlimited retry loop around `loadMicroApp`.

If retry is useful, make it an explicit user action after the previous `mountPromise` has settled. Configuration errors—invalid exports, multiple entry scripts, an invalid container, or unresolved ESM dependencies—must be fixed rather than retried. Authentication and gateway requirements belong in a custom [`fetch`](/api/configuration).

## Preserve production diagnostics

Enable production source maps for each micro-app and upload them to the monitoring service with the matching app name and release version. Verify that a staged error resolves to the original source before shipping; transformed ESM stacks are not useful without the corresponding maps.

Keep source maps access-controlled if the source is private, and avoid displaying raw stack traces or sensitive server responses in user-facing fallback UI.

## Related

- [`loadMicroApp`](/api/load-micro-app) — instance promises and teardown ownership
- [`addErrorHandler` / `removeErrorHandler`](/api/error-handling) — global error API
- [Micro-app lifecycle and props](/concepts/lifecycle-and-props) — the phases that can fail
- [Native ESM support](/concepts/esm-sandbox) — ESM behavior and compatibility
- [Share state and communicate](/cookbook/communicate-between-apps) — keeping host callbacks and subscriptions clean
