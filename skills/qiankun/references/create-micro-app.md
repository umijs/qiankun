# Create a micro (sub) app, or convert an existing Vite app

Prerequisites: the shared facts in [SKILL.md](../SKILL.md) — app name, framework, port, package versions.

For a **new** app, start at step 1. To **convert an existing Vite app**, skip to step 2 — the conversion is exactly steps 2–4 and touches nothing else (no changes to `index.html`, `App` components, or build scripts).

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

4. Rewrite the entry to export qiankun lifecycles, using the template below for the app's framework. Replace `<app-name>` with the actual registered name in both templates.

## React entry template (`src/main.tsx`)

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

## Vue entry template (`src/main.ts`)

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

## Verify

1. `pnpm dev` in the sub app, open `http://localhost:7101` — it must render on its own (the non-qiankun branch of the entry).
2. If a main app exists, run it too and confirm the sub app mounts inside it with no console errors — see the verification checklist in [create-main-app.md](create-main-app.md).
