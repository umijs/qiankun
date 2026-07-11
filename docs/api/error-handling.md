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

## Handler responsibilities

- Keep handlers defensive: report the error and return instead of throwing another error.
- Avoid starting an unlimited retry loop from the global channel.
- Do not show raw stack traces or sensitive response data to users.
- Use production source maps so monitoring can resolve transformed application stacks.

React and Vue `<MicroApp>` components provide component-level error UI through their own boundary options. They are built on `loadMicroApp`, so handle and report their instance failures through the component rather than relying on the global observer.

## Related

- [Handle micro-app errors](/cookbook/handle-errors) — fallback UI, diagnosis, and retry guidance
- [`loadMicroApp`](/api/load-micro-app) — instance promises and teardown
- [React `<MicroApp>`](/ecosystem/react) and [Vue `<MicroApp>`](/ecosystem/vue) — component error boundaries
