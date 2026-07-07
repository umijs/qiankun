# Step 2 — Build the Main App

In [Step 1](/tutorial/build-the-micro-app) you got a micro-app running on `//localhost:7100`. Now build the **main app** (the host, the shell): an ordinary Vite app that registers micro-apps, decides from the URL when each one activates, and renders it into a container the main app owns.

By the end of this page you'll have a host that:

- registers micro-apps with [`registerMicroApps`](/api/register-micro-apps) and boots qiankun with [`start`](/api/start);
- owns one persistent container element that micro-apps mount into;
- drives mount and unmount from the URL with a few lines of hand-written routing;
- shows a loading indicator while a micro-app is being fetched and mounted.

::: info The host is not a micro-app
The main app is just an ordinary app. It does **not** use `@qiankunjs/bundler-plugin`, and its HTML entry script tag has **no** `entry` attribute — that attribute belongs only to apps that qiankun loads. For the sub-app side of the setup, see [Prepare a Vite app for qiankun](/cookbook/prepare-a-vite-app).
:::

## Create a host Vite app

Scaffold a React + Vite app as usual. The plugins you need are exactly the ones you'd use in any Vite app.

::: code-group

```bash [terminal]
npm create vite@latest main -- --template react-ts
cd main
npm install qiankun
```

```ts [main/vite.config.ts]
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // plain react() — no qiankun bundler plugin, the host is not a micro-app
  plugins: [react()],
  server: {
    port: 7099,
    strictPort: true,
  },
});
```

:::

The HTML entry is a standard Vite SPA entry. Note that the script tag has no `entry` attribute.

```html [main/index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>qiankun host</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- a normal SPA entry: no `entry` attribute here -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Register the micro-apps

Registration is the core of the host. Pass an array to [`registerMicroApps`](/api/register-micro-apps), one entry per micro-app, then call [`start`](/api/start) once — exactly once.

```ts [main/src/register.ts]
import { registerMicroApps, start } from 'qiankun';

let registered = false;

export function registerAll(
  container: HTMLElement,
  onLoading: (name: string, loading: boolean) => void,
): void {
  // guard against double-invoke — React StrictMode runs effects twice in dev
  if (registered) return;
  registered = true;

  registerMicroApps([
    {
      name: 'react', // must match the window global the sub-app exposes
      entry: '//localhost:7100', // the sub-app dev server root (its index.html)
      container, // the persistent host element captured at registration time
      activeRule: '/sub', // qiankun mounts this app while the path starts with /sub
      loader: (loading) => onLoading('react', loading),
      configuration: {
        sandbox: true, // Proxy-membrane JS sandbox (default true)
        styleIsolation: true, // runtime CSS @scope isolation (default false)
      },
    },
  ]);

  start();
}
```

Each item in the array is a `RegistrableApp`. The fields used here:

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | The app's unique name. Must match the window global / library name the sub-app exposes (see below). |
| `entry` | `string` | The address of the sub-app's HTML entry. In v3 it's just a plain string — always an HTML address. |
| `container` | `HTMLElement` | The DOM element the app mounts into. The element instance itself, not a selector. |
| `activeRule` | `string \| fn \| Array` | The single-spa activation rule. When it matches `location.pathname` the app mounts, otherwise it unmounts. |
| `loader` | `(loading: boolean) => void` | Called with `true` before mount and `false` after — the loading UI is driven from here. |
| `configuration` | `AppConfiguration` | Per-app configuration. See [AppConfiguration](/api/configuration). |

::: tip v3 configuration is per-app
qiankun 3.0 has no global configuration passed through `start()`. `start` takes only `{ urlRerouteOnly? }` (a single-spa option). Everything else — `sandbox`, `styleIsolation`, `fetch`, `globalContext`, `nodeTransformer`, `streamTransformer` — lives on each app's own `configuration` object. See [AppConfiguration](/api/configuration) for the full list.
:::

### Why `name` must match the sub-app's global

After qiankun loads a classic (UMD/global) micro-app, it has to find the app's lifecycle functions. The last fallback in that lookup is `window[name]` — the global keyed by the `name` you registered with. So if it doesn't match, qiankun can't find `bootstrap`/`mount`/`unmount` and throws.

Concretely, if you register `name: 'react'`, the sub-app has to expose its lifecycles as `window['react']` (classic path), or export them from its ESM entry module. If your bundler sets a library name — for example, `@qiankunjs/bundler-plugin` produces `output.library = { name: 'webpack-app', type: 'window' }` for Webpack — then the registered `name` must equal that library name (`'webpack-app'`), which is often not the same thing as the route.

::: warning `name` is app identity, not routing
`name` and `activeRule` are independent. An app called `webpack-app` activating on `/webpack` is perfectly fine. Align `name` with the sub-app's global, and leave the URL to `activeRule`.
:::

## Provide a persistent container

qiankun records the **element reference** of `container` at the moment of registration, and reuses that same element every time the app mounts and unmounts afterward. This comes with one hard rule.

::: danger The container must never be unmounted or given a key
Render the container `<div>` once and let it stay in the DOM for the entire lifetime of the host. Don't conditionally render it, don't tuck it behind a route, and don't give it a changing React `key` — any of these swaps the element for a new one while qiankun is still writing into the old, now-detached, dead node. The symptom: the micro-app "mounts" but never shows up.
:::

Capture the element with a ref, and register only once it's actually in the DOM.

```tsx [main/src/App.tsx]
import { useEffect, useRef, useState } from 'react';
import { registerAll } from './register';
import { usePathname } from './router';

export default function App() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // register once the container exists; registerAll self-guards, so
  // StrictMode's double effect is harmless
  useEffect(() => {
    if (containerRef.current) {
      registerAll(containerRef.current, (_name, isLoading) => setLoading(isLoading));
    }
  }, []);

  const onSub = pathname.startsWith('/sub');

  return (
    <div>
      <nav>{/* navigation goes here — see below */}</nav>

      {/* the container stays mounted forever — qiankun holds this exact element */}
      <div ref={containerRef} id="subapp-container" hidden={!onSub} />

      {loading && <p>loading micro-app…</p>}
      {!onSub && <p>Pick a micro-app from the nav.</p>}
    </div>
  );
}
```

::: tip Hide it, don't delete it
When no micro-app is active you can hide the container (`hidden`, `display: none`, zero height), but don't remove it from the tree. Hiding keeps the element reference; deleting breaks the next mount.
:::

## Wire up routing

qiankun is built on [single-spa](https://github.com/single-spa/single-spa): when the URL changes, single-spa re-checks every app's `activeRule` and mounts or unmounts accordingly. This needs no router library — just two things:

1. a way to **change** the URL (`history.pushState`), and
2. a way to **react** to URL changes, so your own shell UI (the active nav highlight, the container's visibility) stays in sync.

For the second, listen to both `popstate` (browser back/forward) and `single-spa:routing-event` (dispatched after every single-spa reroute, including the ones triggered by `pushState`).

```ts [main/src/router.ts]
import { useSyncExternalStore } from 'react';

// single-spa patches pushState and emits its routing event after each reroute;
// listening to both keeps the shell in sync with every navigation
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('single-spa:routing-event', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('single-spa:routing-event', callback);
  };
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname);
}

export function navigate(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
  }
}
```

Navigation is just a `pushState`; qiankun handles the rest.

```tsx [main/src/App.tsx (nav)]
import { navigate } from './router';

// inside <nav>:
<button type="button" onClick={() => navigate('/sub')}>
  Open micro-app
</button>
<button type="button" onClick={() => navigate('/')}>
  Home
</button>
```

Clicking **Open micro-app** pushes `/sub`; single-spa sees that `activeRule: '/sub'` now matches and mounts the app into your container. Clicking **Home** pushes `/`, the rule no longer matches, and single-spa unmounts the app and runs its `unmount` lifecycle.

Here's the full chain:

```mermaid
flowchart TD
  A["navigate('/sub')"] --> B["history.pushState"]
  B --> C["single-spa reroute"]
  C --> D{"activeRule '/sub'<br/>matches pathname?"}
  D -->|yes| E["loader(true)"]
  E --> F["fetch entry and stream into container"]
  F --> G["run sub-app mount()"]
  G --> H["loader(false)"]
  D -->|no| I["run sub-app unmount()"]
  C --> J["single-spa:routing-event"]
  J --> K["shell re-render (nav, visibility)"]
```

## Drive the loading UI

Every registered app can carry a `loader` callback. qiankun calls it with `true` right before mount and with `false` once the mount resolves, which makes it the natural place to hook up a spinner or skeleton. You already wired it up in `register.ts`, so on the host side all that's left is turning the signal into UI.

```tsx [main/src/App.tsx (loading)]
// onLoading was passed into registerAll and stored in state:
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (containerRef.current) {
    registerAll(containerRef.current, (_name, isLoading) => setLoading(isLoading));
  }
}, []);

// …later in the render:
{loading && <p>loading micro-app…</p>}
```

With more than one micro-app, key the loading state by `name` so each app shows its own indicator:

```tsx
const [loadingApps, setLoadingApps] = useState<Record<string, boolean>>({});

registerAll(containerRef.current, (name, isLoading) => {
  setLoadingApps((prev) => (prev[name] === isLoading ? prev : { ...prev, [name]: isLoading }));
});
```

::: tip See what qiankun writes onto the container
When an app mounts, qiankun stamps some data attributes onto its container that are handy for diagnostics: `data-name` (the app name), `data-version` (the qiankun version), and `data-sandbox-cfg` (the serialized sandbox configuration). They're a good fit for a status badge in the shell.
:::

## Boot the host

Render `App` as usual. The entry file needs no qiankun-related wiring — registration happens in `App`'s effect.

```tsx [main/src/main.tsx]
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`registerAll` latches itself behind the `registered` flag, so even though StrictMode deliberately runs the effect twice, the apps aren't registered twice and `start()` isn't called twice. `start()` is idempotent on its own, but gating registration behind a latch too is the cleaner approach.

## Recap

- The host is an ordinary Vite app — no bundler plugin, no `entry` attribute on the script.
- `registerMicroApps([...])` declares each app; `start()` runs once to activate them.
- The container element is captured at registration and must stay alive — no key, no unmount.
- `name` must match the global / library name the sub-app exposes; `activeRule` drives mount and unmount from the URL.
- Routing is `history.pushState` plus listening to `popstate` and `single-spa:routing-event`.
- `loader(loading)` hands you the mount/unmount signal to build a loading indicator from.

Next, [Step 3 — Run It, Verify It, See the Isolation](/tutorial/run-and-verify) starts both dev servers and confirms the micro-app mounts, unmounts, and stays isolated in its sandbox.
