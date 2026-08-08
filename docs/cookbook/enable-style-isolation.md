# Enable CSS style isolation

Enable `sandbox.styleIsolation` for a micro-app to stop its style rules from affecting the host or sibling applications outside its container.

This is **one-way isolation**: micro-app styles do not leak out, but global host styles can still affect the micro-app.

## Enable isolation

Pass `sandbox: { styleIsolation: true }` as the second argument to [`loadMicroApp`](/api/load-micro-app):

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('subapp-container');
if (!container) throw new Error('micro-app container not found');

const microApp = loadMicroApp(
  {
    name: 'sub-app',
    entry: '//localhost:7101',
    container,
  },
  {
    sandbox: { styleIsolation: true },
  },
);

// When the page no longer shows this app:
await microApp.unmount();
```

The React and Vue `<MicroApp>` components accept the same configuration through their `settings` prop. In route-driven mode, place it in the app's `configuration` field.

## Isolation coverage

When enabled, qiankun limits inline styles, external stylesheets, and common runtime-inserted rules from the micro-app so they apply only inside its container.

This is not bidirectional or security isolation:

- Global selectors from the host can still match elements inside the micro-app.
- A portal rendered outside the app container is outside the style scope.
- Document-level rules such as `@font-face` can still have naming conflicts between apps.
- Apps should still avoid unnecessarily broad global selectors.

See [Style isolation](/concepts/style-isolation) for the user model and [Style isolation internals](/internals/style-isolation) for the source-level pipeline.

## Prerequisites

### Browser support for CSS `@scope`

Style isolation depends on native CSS `@scope`. qiankun does not provide a polyfill; do not enable this capability in browsers that lack support.

### CORS for external stylesheets

The host page must be able to fetch external CSS used by the micro-app. Ensure that the micro-app server and third-party stylesheet origins return an appropriate `Access-Control-Allow-Origin` header.

## Verify the result

1. Add test elements with the same class to the host and the micro-app.
2. Give that class an obvious style in the micro-app CSS.
3. Confirm that only the element inside the micro-app container receives the style.
4. Unmount the app and confirm that its container and dynamically inserted styles are cleaned up.

If the app becomes unstyled after enabling isolation, first check browser support for `@scope` and whether CORS blocked an external CSS request.

## Related

- [Style isolation](/concepts/style-isolation) — capability, boundaries, and limitations.
- [AppConfiguration](/api/configuration) — `sandbox.styleIsolation` reference.
- [Handle load and runtime errors](/cookbook/handle-errors) — capture resource-loading failures.
