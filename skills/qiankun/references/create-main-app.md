# Create a main (host) app

Prerequisites: the shared facts in [SKILL.md](../SKILL.md) — app name, framework, port, package versions.

1. Scaffold the shell (any framework; below assumes React + TS on port `7099`) and install qiankun:

   ```bash
   pnpm create vite <main-app-name> --template react-ts
   pnpm add qiankun@rc @qiankunjs/react@rc   # vue shell: @qiankunjs/vue@rc
   ```

   Pin the port in `vite.config.ts` (`server: { port: 7099, strictPort: true }`).

2. Pick ONE loading style:

   **`MicroApp` component (recommended for React/Vue shells)** — mounts on render, unmounts on component unmount, with built-in loading/error slots. Extra props are forwarded to the sub app (delivered via its `update` lifecycle on change):

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

3. Per-app configuration (third argument of `loadMicroApp`, `configuration` prop of the `MicroApp` component, or per-app fields in `registerMicroApps`): `sandbox` defaults to on; add `styleIsolation: true` to scope the sub app's CSS with `@scope`.

## Verify

1. Run both dev servers, open the main app at `http://localhost:7099`, navigate to the sub app route — it must mount inside the shell with no console errors.
2. Leave the sub app route — its DOM must be removed (unmount actually ran).
3. The sub app must still render standalone at `http://localhost:7101` — see [create-micro-app.md](create-micro-app.md).
