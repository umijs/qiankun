# Step 1 — Build the micro-app

A qiankun micro-app remains a normal front-end application. Its entry module additionally exposes lifecycle functions so a main app can mount and unmount it.

This tutorial uses React and Vite. For Vue or Webpack integration, see [Prepare a Vite app](/cookbook/prepare-a-vite-app) or [Prepare a Webpack app](/cookbook/prepare-a-webpack-app).

## Create the application

From your `qiankun-tutorial` directory:

```bash
npm create vite@latest sub-app -- --template react-ts
cd sub-app
npm install
npm install --save-dev @qiankunjs/bundler-plugin@rc
```

## Configure Vite

Add the qiankun plugin and give the development server a fixed port:

```ts [sub-app/vite.config.ts]
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), qiankun()],
  server: {
    port: 7101,
    strictPort: true,
  },
});
```

The plugin prepares the Vite entry for qiankun and enables the cross-origin requests needed while the main app runs on port `7099`. `strictPort` prevents Vite from silently choosing an address different from the one the main app will load.

## Export the lifecycle functions

Replace `src/main.tsx` with the following entry:

```tsx [sub-app/src/main.tsx]
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import App from './App';
import './index.css';

type AppProps = {
  container?: HTMLElement;
};

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

let root: Root | undefined;

function findRoot(props: AppProps): Element | null {
  return props.container?.querySelector('#root') ?? document.getElementById('root');
}

function render(props: AppProps = {}) {
  const element = findRoot(props);
  if (!element) return;

  root = createRoot(element);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export async function bootstrap() {
  return Promise.resolve();
}

export async function mount(props: AppProps) {
  render(props);
}

export async function unmount(props: AppProps) {
  root?.unmount();
  root = undefined;

  const element = findRoot(props);
  if (element) element.innerHTML = '';
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

The important parts are the public behavior:

- `mount` renders inside `props.container`, which qiankun provides as an `HTMLElement`.
- `unmount` destroys the React root and releases references so the application can be mounted again.
- When qiankun is not present, the final branch renders into the app's own `#root`, preserving standalone development.
- The entry is a native ES module, so qiankun reads the lifecycle exports from it directly; there is no need to attach these functions to `window`.

The default Vite `index.html` already contains `<div id="root"></div>`, so no other HTML change is required.

## Check standalone mode

Start the server:

```bash
npm run dev
```

Open **http://localhost:7101** and confirm the application renders normally. Leave this server running, then continue with [Step 2 — Build the main app](/tutorial/build-the-main-app).

For the complete lifecycle contract, including props and the optional `update` lifecycle, see [Lifecycle and props](/concepts/lifecycle-and-props).
