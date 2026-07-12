# Step 3 — Connect, run, and verify

Both applications are ready. This step checks the behavior users depend on: loading from an independent server, mounting into the supplied element, explicit unmounting, and standalone development.

## Start both development servers

Open two terminals from the `qiankun-tutorial` directory:

::: code-group

```bash [micro-app]
cd sub-app
npm run dev
# http://localhost:7101
```

```bash [main app]
cd main-app
npm run dev
# http://localhost:7099
```

:::

Start the micro-app first, then open **http://localhost:7099**.

## Exercise the lifecycle

1. The page initially shows the main-app heading, the button, and the UI rendered by `sub-app`.
2. Select **Unmount micro-app**. React removes `MicroAppSlot`, whose cleanup calls the saved handle's `unmount()` method. The micro-app UI disappears.
3. Select **Mount micro-app**. A new slot and a new `MicroApp` handle are created, and the application appears again.
4. Open **http://localhost:7101** directly. The same sub-app renders without the main app.

These checks are enough to confirm the integration contract. The main app does not need to know how the micro-app renders internally; it only owns the container and the returned handle.

## Build both applications

Before moving the setup into a larger project, confirm both production builds succeed:

::: code-group

```bash [micro-app]
cd sub-app
npm run build
```

```bash [main app]
cd main-app
npm run build
```

:::

The micro-app's bundler plugin prepares its production HTML entry as part of this build.

## Common first-run problems

| Symptom | Check |
| --- | --- |
| The container stays empty and the entry request fails | Confirm `sub-app` is running on port `7101` and that `entry` points to `//localhost:7101`. |
| The browser reports a CORS error | Confirm the micro-app's Vite config includes `qiankun()` from `@qiankunjs/bundler-plugin/vite`. |
| qiankun cannot find lifecycle functions | Confirm that the entry module exports `bootstrap`, `mount`, and `unmount`, and that the Vite config includes the qiankun plugin. |
| The app appears once but does not remount cleanly | Confirm the React root is destroyed in the micro-app's `unmount`, and that the main app calls the handle's `unmount()`. |
| Vite starts on another port | Add `strictPort: true` and free ports `7099` and `7101` before starting again. |

For ESM micro-apps, use a Chromium-based browser or Safari; Firefox does not currently support the dynamically injected import maps required by the ESM sandbox.

## Where to go next

- Pass data to an instance with [`loadMicroApp` props](/api/load-micro-app).
- Learn the guarantees and responsibilities in [Lifecycle and props](/concepts/lifecycle-and-props).
- Enable [style isolation](/cookbook/enable-style-isolation) when the application needs it.
- Handle [loading and runtime errors](/cookbook/handle-errors) in the main app.
- Use the [React](/ecosystem/react) or [Vue](/ecosystem/vue) binding for a declarative component API.
