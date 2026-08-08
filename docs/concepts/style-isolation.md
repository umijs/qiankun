# Style isolation

Style isolation keeps CSS declared by a micro-app from matching elements outside that app's container. It is opt-in, scoped per app, and implemented with the browser's native CSS `@scope` support.

It is configured inside the sandbox object: the JS sandbox is enabled by default, while `sandbox.styleIsolation` defaults to `false`. CSS isolation lives there because dynamically injected styles ride on the sandbox's DOM interception — isolated CSS without a JS sandbox would silently leak them.

## The model

With `sandbox: { styleIsolation: true }`, qiankun limits the app's rules to the container identified by its app name. Conceptually, its styles become:

```css
@scope ([data-name="catalog"]) {
  /* the micro-app's rules */
}
```

The app remains in the host document; it is not moved into Shadow DOM. Existing document-level integrations can therefore keep working, subject to the one-way boundary below.

## What is covered

| Style source | Behavior when isolation is enabled |
| --- | --- |
| Inline `<style>` | Its rules are limited to the app container. |
| External `<link rel="stylesheet">` | qiankun reads and scopes the stylesheet before it is applied. |
| Runtime-inserted rules and common CSS-in-JS output | Rules associated with the app are scoped as they are inserted. |

Relative asset URLs in external stylesheets are resolved against that stylesheet's URL. Inline `<style>` content is not rewritten against the micro-app entry, so use absolute URLs when the host and micro-app documents have different base URLs. If a stylesheet cannot be safely scoped, qiankun does not fall back to applying the unscoped CSS globally.

## A one-way boundary

Style isolation stops the micro-app's rules from leaking **out**. It does not stop host styles, inherited properties, browser defaults, or shared CSS custom properties from flowing **into** the app.

Portals need special attention. A menu, dialog, or tooltip rendered under `document.body` instead of inside the micro-app container is outside the scope root, so the app's scoped selectors will not match it. Prefer a portal root inside `props.container`, or style that external surface explicitly.

::: info
Isolation is configured per app. Isolated and unisolated apps can coexist, but CSS from an unisolated app can still affect the whole page.
:::

## Requirements and limits

- **Native `@scope` support is required.** qiankun provides no polyfill or fallback; verify your target browser matrix before enabling the option.
- **Cross-origin stylesheets need CORS.** qiankun must be able to read their CSS. A stylesheet that cannot be fetched is discarded rather than allowed to leak globally.
- **`@font-face` remains global.** Use app-specific font-family names to avoid collisions.
- **Keyframe names are isolated when declared in CSS.** A name assembled dynamically in JavaScript cannot always be updated with the stylesheet and may fail to match.
- **Content outside the app container is outside the scope.** This includes portals and nodes deliberately moved by application code.
- **The scope is keyed by app name, not instance handle.** Concurrent instances that reuse one `name` share the same scope selector; use distinct names when their CSS must be isolated from each other.

## Enable it

Set the option on the app that needs isolation:

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app');
if (!container) throw new Error('micro-app container not found');

const microApp = loadMicroApp(
  {
    name: 'catalog',
    entry: 'https://catalog.example.com',
    container,
  },
  {
    sandbox: { styleIsolation: true },
  },
);
```

See [Enable CSS style isolation](/cookbook/enable-style-isolation) for an end-to-end check and [AppConfiguration](/api/configuration) for the option reference. Maintainers can find rewriting details in [style isolation internals](/internals/style-isolation).
