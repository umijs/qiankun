---
name: qiankun
description: >-
  Usage manual for building micro-frontend projects with qiankun 3.x. Use when the user wants to create a qiankun main (host) app or sub (micro) app, convert an existing Vite app into a qiankun micro app, or wire up micro-frontend loading with React/Vue.
---

# qiankun

qiankun is a micro-frontend framework: a main (host) app loads sub (micro) apps from their HTML entries at runtime, each inside a JS sandbox, with opt-in CSS isolation. This skill is the agent-facing manual for **qiankun 3.x**.

**Scope today: creating apps** — scaffolding a new main/sub app, or converting an existing Vite app into a qiankun micro app. For everything else (v2→v3 migration, sandbox internals, style isolation details, debugging), consult https://qiankun.umijs.org and the runnable apps under `examples/` in https://github.com/umijs/qiankun.

## Before you start

Determine these, asking the user only when not inferable from context:

1. **App type** — main (host/shell) or sub (micro app).
2. **App name** — lowercase letters, numbers, hyphens. The name the host registers must exactly match the name the sub app uses in its classic-mode fallback (see the entry template).
3. **Framework** — React or Vue; TypeScript or JavaScript. Templates below are TS; strip types for JS.
4. **Dev port** — must be fixed and unique per app, because the host hard-references it in `entry`. Convention: main app `7099`, sub apps `7101`, `7102`, …

Package versions — until qiankun 3.0 stable ships, `rc` is the dist-tag for the core packages:

| Package                               | Dist-tag | Goes in                                       |
| ------------------------------------- | -------- | --------------------------------------------- |
| `qiankun`                             | `rc`     | main app `dependencies`                       |
| `@qiankunjs/react` / `@qiankunjs/vue` | `latest` | main app `dependencies` (optional UI binding) |
| `@qiankunjs/bundler-plugin`           | `rc`     | sub app `devDependencies`                     |

Key facts that shape everything below:

- **Vite sub apps need no dedicated build mode.** qiankun 3 loads `<script type="module">` natively through its ESM sandbox — regular `vite dev` / `vite build` output is qiankun-ready as-is.
- The JS sandbox is **on by default**. CSS isolation is opt-in per app via `styleIsolation: true` (runtime CSS `@scope`).
- A sub app must stay **runnable standalone**: when not loaded by qiankun (`window.__POWERED_BY_QIANKUN__` is undefined) it renders itself directly.
- **Always unmount** what you mount. `loadMicroApp` returns a handle whose `.unmount()` must be called when the app leaves; the `<MicroApp />` bindings do this automatically on component unmount.
- Webpack sub apps use `@qiankunjs/bundler-plugin/webpack` instead of the Vite plugin; see the docs.

## Creating a sub app (Vite)

1. Scaffold with the official Vite scaffolder (templates: `react-ts`, `react`, `vue-ts`, `vue`):

   ```bash
   pnpm create vite <app-name> --template react-ts
   ```

2. Add the bundler plugin:

   ```bash
   pnpm add -D @qiankunjs/bundler-plugin@rc
   ```

3. Edit `vite.config.ts` — register the plugin and pin the port:

   ```ts
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react'; // vue: @vitejs/plugin-vue
   import { qiankun } from '@qiankunjs/bundler-plugin/vite';

   export default defineConfig({
     plugins: [react(), qiankun()],
     server: {
       port: 7101,
       strictPort: true,
     },
   });
   ```

4. Rewrite the entry to export qiankun lifecycles. React (`src/main.tsx`):

   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './index.css';

   declare global {
     interface Window {
       __POWERED_BY_QIANKUN__?: boolean;
       [key: string]: unknown;
     }
   }

   let root: ReactDOM.Root | undefined;

   function render(props: { container?: Element } = {}) {
     // when loaded by qiankun, resolve #root inside the host-provided container, not the top document
     const container = props.container?.querySelector('#root') ?? document.getElementById('root');
     if (!container) return;

     root = ReactDOM.createRoot(container);
     root.render(
       <React.StrictMode>
         <App />
       </React.StrictMode>,
     );
   }

   export async function bootstrap() {}

   export async function mount(props: { container?: Element }) {
     render(props);
   }

   // the host re-delivers its props here whenever they change — react to them without remounting
   export async function update(_props: Record<string, unknown>) {}

   export async function unmount(_props: { container?: Element }) {
     root?.unmount();
     root = undefined;
   }

   if (window.__POWERED_BY_QIANKUN__) {
     // classic-mode fallback: expose the lifecycles on window under the REGISTERED app name
     window['<app-name>'] = { bootstrap, mount, update, unmount };
   } else {
     render();
   }
   ```

   Vue (`src/main.ts`):

   ```ts
   import { createApp, reactive } from 'vue';
   import App from './App.vue';
   import './style.css';

   declare global {
     interface Window {
       __POWERED_BY_QIANKUN__?: boolean;
       [key: string]: unknown;
     }
   }

   let app: ReturnType<typeof createApp> | undefined;

   // props the host hands over — seeded on mount, kept current by `update`
   const hostProps = reactive<Record<string, unknown>>({});

   function render(props: { container?: Element } = {}) {
     const container = props.container?.querySelector('#app') ?? document.getElementById('app');
     if (!container) return;

     app = createApp(App, { hostProps });
     app.mount(container);
   }

   export async function bootstrap() {}

   export async function mount(props: { container?: Element }) {
     Object.assign(hostProps, props);
     render(props);
   }

   export async function update(props: Record<string, unknown>) {
     Object.assign(hostProps, props);
   }

   export async function unmount(_props: { container?: Element }) {
     app?.unmount();
     app = undefined;
   }

   if (window.__POWERED_BY_QIANKUN__) {
     // classic-mode fallback: expose the lifecycles on window under the REGISTERED app name
     window['<app-name>'] = { bootstrap, mount, update, unmount };
   } else {
     render();
   }
   ```

   Replace `<app-name>` with the actual registered name in both templates.

That is the whole conversion — no changes to `index.html`, `App` components, or build scripts.

## Creating a main app

1. Scaffold the shell (any framework; below assumes React + TS on port `7099`) and install qiankun:

   ```bash
   pnpm create vite <main-app-name> --template react-ts
   pnpm add qiankun@rc @qiankunjs/react@latest   # vue shell: @qiankunjs/vue@latest
   ```

2. Pick ONE loading style:

   **`<MicroApp />` component (recommended for React/Vue shells)** — mounts on render, unmounts on component unmount, with built-in loading/error slots. Extra props are forwarded to the sub app (delivered via its `update` lifecycle on change):

   ```tsx
   import { MicroApp } from '@qiankunjs/react'; // same component name in @qiankunjs/vue

   export default function SubAppPage() {
     return <MicroApp name="<app-name>" entry="//localhost:7101" autoSetLoading />;
   }
   ```

   **Router-driven registration (framework-agnostic)** — qiankun mounts/unmounts apps as the URL matches `activeRule`. Put this in the shell entry, once:

   ```ts
   import { registerMicroApps, start } from 'qiankun';

   registerMicroApps([
     {
       name: '<app-name>',
       entry: '//localhost:7101',
       container: '#micro-app-container', // an element the shell always renders
       activeRule: '/<app-name>',
     },
   ]);

   start();
   ```

   For full manual control there is also `loadMicroApp({ name, entry, container }, configuration)` — it returns a handle; you own calling `.unmount()` when the app leaves.

3. Per-app configuration (third argument of `loadMicroApp`, `configuration` prop of `<MicroApp />`, or per-app fields in `registerMicroApps`): `sandbox` defaults to on; add `styleIsolation: true` to scope the sub app's CSS with `@scope`.

## Verify the result

1. Sub app standalone: `pnpm dev` in the sub app, open `http://localhost:7101` — it must render on its own (the non-qiankun branch of the entry).
2. Integrated: run both dev servers, open the main app at `http://localhost:7099`, navigate to the sub app route — it must mount inside the shell with no console errors.
3. Leave the sub app route — its DOM must be removed (unmount actually ran).

If a browser tool is available, perform these checks yourself instead of asking the user to.
