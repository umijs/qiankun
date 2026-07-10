# addErrorHandler / removeErrorHandler

Register a global observer for micro-app load and lifecycle failures, then remove it with the same function reference. qiankun re-exports both functions from single-spa without changing their behavior.

Use this API for centralized logging and monitoring. Handle visible recovery near the `loadMicroApp` instance or `<MicroApp>` component that owns the affected UI.

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

The observer receives failures from apps loaded with [`loadMicroApp`](/api/load-micro-app) and from the route-driven `registerMicroApps` flow. This includes entry-loading failures and rejected micro-app lifecycle functions.

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

React and Vue `<MicroApp>` components provide component-level error UI through their own boundary options. A component boundary and the global observer can both receive the same failure; use the former for nearby recovery and the latter for telemetry.

## Related

- [Handle micro-app errors](/cookbook/handle-errors) — fallback UI, diagnosis, and retry guidance
- [`loadMicroApp`](/api/load-micro-app) — instance promises and teardown
- [React `<MicroApp>`](/ecosystem/react) and [Vue `<MicroApp>`](/ecosystem/vue) — component error boundaries
