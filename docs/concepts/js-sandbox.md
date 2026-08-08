# JavaScript isolation

qiankun runs micro-apps in the same page without giving every app unrestricted ownership of the host's globals. JavaScript isolation is enabled by default and gives each app its own view of `window`, while keeping the browser APIs that normal applications expect.

The sandbox reduces accidental interference between trusted applications. It is not a security boundary for running untrusted code.

## The model

Each micro-app receives a virtual global object. `window`, `self`, and `globalThis` all refer to that app's view.

| Operation | Observable result |
| --- | --- |
| Write `window.feature = value` | The value belongs to this app and is not published to the host or sibling apps. |
| Read an app-owned global | The app receives its own value. |
| Read an unknown global | The lookup can fall through to the host, so standard browser APIs and host-provided globals remain available. |

This asymmetry is deliberate: writes are isolated, while reads stay compatible with the page around the app. Two instances of the same micro-app receive separate global views as well.

## What qiankun isolates and tracks

App-owned global assignments stay on the app's virtual object instead of changing the host. Separately, qiankun tracks several common side effects created through the sandboxed browser view, including:

- active intervals and listeners registered on the sandboxed `window`;
- history-related listeners;
- dynamically appended scripts, styles, and stylesheet links that belong to the app.

These are common managed effects, not a promise that every browser API is intercepted.

During `unmount`, qiankun removes the side effects it can track and deactivates that app's global view. App-owned globals remain isolated and may be reused on a later mount; they are never published to sibling apps.

Always call `unmount` when an app or app instance is no longer needed. Skipping it also skips the cleanup associated with that instance.

## What the micro-app still owns

Sandbox cleanup is not general-purpose resource management. qiankun cannot infer the lifetime of every object created by application or third-party code.

The micro-app should still release its own resources in `unmount`, especially:

- framework roots, routers, stores, and subscriptions;
- `WebSocket`, `EventSource`, workers, and in-flight requests that should stop;
- `MutationObserver`, `ResizeObserver`, and `IntersectionObserver` instances;
- callbacks or DOM nodes deliberately registered outside the app container.

Explicit cleanup also makes standalone development, remounting, and multiple instances behave consistently.

::: tip
Treat automatic cleanup as a safety net, not as a replacement for a well-defined `unmount` implementation.
:::

## Boundaries

- **It is not a security sandbox.** Apps share the page's JavaScript environment and can read host globals that they have not shadowed. Only run code you trust.
- **Only mediated operations can be tracked.** A resource created through an object outside the sandbox remains the application's responsibility.
- **The host can still affect the app.** Changes made directly to shared browser services or host-owned objects are not rolled back for a micro-app.
- **Isolation does not create private backends or storage.** Cookies, storage, network services, and other shared browser facilities keep their normal origin-level behavior.

## Configuration and next steps

The `sandbox` option defaults to `true`. Setting `sandbox: false` makes the app share the real global object and also disables qiankun's isolated native ESM path. It should be a compatibility escape hatch, not a performance switch. Passing an object instead of `true` keeps isolation on and configures it — see [SandboxConfiguration](/api/configuration#sandboxconfiguration).

See [AppConfiguration](/api/configuration) for the option, [micro-app lifecycle and props](/concepts/lifecycle-and-props) for cleanup timing, and [native ESM support](/concepts/esm-sandbox) for module applications. Maintainers can find the implementation details in [JS sandbox internals](/internals/js-sandbox).
