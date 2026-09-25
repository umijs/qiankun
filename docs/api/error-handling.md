# addErrorHandler / removeErrorHandler

Register a global single-spa error observer, primarily for load and lifecycle failures from route-driven applications registered with `registerMicroApps`, then remove it with the same function reference. qiankun re-exports both functions from single-spa without changing their behavior.

Use this API for centralized logging and monitoring of route-driven applications. Initial load and lifecycle failures from `loadMicroApp` parcels reject their handle promises instead of entering this global channel. Handle those failures, and visible recovery, near the `loadMicroApp` instance or `<MicroApp>` component that owns the affected UI.

## Signatures

```ts
type AppError = Error & {
  appOrParcelName: string;
};

function addErrorHandler(handler: (error: AppError) => void): void;
function removeErrorHandler(handler: (error: AppError) => void): void;
```

`appOrParcelName` identifies the application or instance associated with the failure. `removeErrorHandler` compares function references, so an equivalent new function does not unregister the original one.

## Usage

Register the observer once near host startup:

```ts
import { addErrorHandler, removeErrorHandler } from 'qiankun';

type AppError = Error & { appOrParcelName: string };

const reportMicroAppError = (error: AppError) => {
  reportToMonitoring(error, {
    app: error.appOrParcelName,
  });
};

addErrorHandler(reportMicroAppError);

// During host teardown or test cleanup:
removeErrorHandler(reportMicroAppError);
```

The observer receives entry-loading and lifecycle failures from the route-driven `registerMicroApps` flow. Because `loadMicroApp` uses single-spa's root-parcel flow, its initial load and lifecycle failures reject the corresponding handle promises and are not sent to this observer.

The handler is global and renders nothing. For instance-level UI, observe the returned handle separately:

```ts
import { loadMicroApp } from 'qiankun';

const microApp = loadMicroApp({ name, entry, container });

void microApp.mountPromise.catch((error: unknown) => {
  showFallback(container, error);
});
```

Keep the `MicroApp` handle and call `unmount()` when a successfully mounted view is removed.

## Handle loading timeouts {#load-timeout}

When [`timeout`](/api/configuration#timeout) is enabled, a loading timeout produces a `LoadAppTimeoutError`. This class is exported from `qiankun`, extends `QiankunError`, and exposes these readonly fields:

| Field | Type | Description |
| --- | --- | --- |
| `appName` | `string` | Name of the micro-app whose load timed out. |
| `timeout` | `number` | Configured limit in milliseconds. |
| `elapsed` | `number` | Actual time in milliseconds between starting the timer and triggering the timeout. |

For manual loads, catch the handle Promise's rejection. Route applications can use the same type check inside a global error handler:

```ts
import { LoadAppTimeoutError, loadMicroApp } from 'qiankun';

const app = loadMicroApp({ name, entry, container }, { timeout: 10_000 });

try {
  await app.mountPromise;
} catch (error) {
  if (error instanceof LoadAppTimeoutError) {
    reportToMonitoring(error, {
      app: error.appName,
      timeout: error.timeout,
      elapsed: error.elapsed,
    });
  }
  showFallback(container, error);
}
```

Before rejecting the timed-out load, qiankun cancels its loading work, removes partially written nodes and the sandbox, and releases the container. Retry by calling `loadMicroApp` again to create an instance; do not remount the failed handle. `timeout` covers loading preparation only, not the micro-app's `bootstrap`, `mount`, or `unmount` lifecycle.

A `LoadAppTimeoutError` has the `code` `load-timeout`. An invalid timeout configuration throws a `QiankunError` with the `code` `timeout-invalid`. See [load-timeout: Micro app loading timed out](/errors/load-timeout) and [timeout-invalid: Invalid loading timeout](/errors/timeout-invalid) for troubleshooting.

## Handler responsibilities

- Keep handlers defensive: report the error and return instead of throwing another error.
- Avoid starting an unlimited retry loop from the global channel.
- Do not show raw stack traces or sensitive response data to users.
- Use production source maps so monitoring can resolve transformed application stacks.

React and Vue `<MicroApp>` components provide component-level error UI through their own boundary options. They are built on `loadMicroApp`, so handle and report their instance failures through the component rather than relying on the global observer.

## QiankunError

Use the top-level `QiankunError` export to identify framework errors thrown by qiankun. Framework errors from the loader, sandbox, and shared modules are all instances of it, and its read-only `code` property provides a stable error identifier.

```ts
import { QiankunError } from 'qiankun';

void microApp.mountPromise.catch((error: unknown) => {
  if (error instanceof QiankunError) {
    reportToMonitoring(error, { code: error.code });
  }
  showFallback(container, error);
});
```

Errors from micro-app code, browser networking, and single-spa are not necessarily instances of `QiankunError` and still need handling. See [Error codes and solutions](/errors/) for code conventions and troubleshooting guidance.

## Related

- [Handle micro-app errors](/cookbook/handle-errors) — fallback UI, diagnosis, and retry guidance
- [`loadMicroApp`](/api/load-micro-app) — instance promises and teardown
- [React `<MicroApp>`](/ecosystem/react) and [Vue `<MicroApp>`](/ecosystem/vue) — component error boundaries
