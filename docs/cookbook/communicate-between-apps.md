# Share state and communicate between apps

In qiankun v3, the host should own shared state and expose only the data and capabilities each micro-app needs. For most applications, start with `loadMicroApp`, pass initial values through `props`, and keep the returned handle so the host can update or unmount the app later.

::: warning Migrating from qiankun 2.x
`initGlobalState`, `onGlobalStateChange`, `setGlobalState`, and `MicroAppStateActions` are not part of qiankun v3. Replace them with the explicit patterns below. See [Migrate from qiankun 2.x](/cookbook/migrate-from-2x).
:::

## Recommended ownership model

Keep the source of truth in the host. A micro-app receives one of three things through props:

- a **snapshot** of data to render;
- a **callback** for reporting an event or requesting a host action;
- a **host-owned store or service** when several consumers need live state.

Do not use `window` as an application-to-application state API. It makes ownership and cleanup unclear, and it is not a reliable contract when JavaScript isolation is enabled.

## Start with `loadMicroApp` and props

Create the app from the host, save its handle, and pass the initial snapshot in `props`:

```ts [host]
import { loadMicroApp } from 'qiankun';
const profileApp = loadMicroApp({
  name: 'profile',
  entry: 'https://profile.example.com',
  container: document.getElementById('micro-app')!,
  props: {
    user: { id: 'u-42', displayName: 'Ada' },
    theme: 'light',
  },
});
// Keep profileApp for later update and unmount calls.
```

The micro-app reads those values from its lifecycle argument and renders only inside the supplied container:

```ts [micro-app entry]
let destroyView: (() => void) | undefined;
export async function mount(props) {
  destroyView = renderProfile(props.container, {
    user: props.user,
    theme: props.theme,
  });
}
export async function unmount() {
  destroyView?.();
  destroyView = undefined;
}
```

Plain values in `props` describe the mount-time snapshot. Functions and objects are references owned by the host; pass them deliberately, with a small and documented interface.

When the host no longer needs the app, call `await profileApp.unmount()`. Removing the container or dropping the variable is not a substitute for the micro-app lifecycle.

## Push a new snapshot with `update`

If an already mounted app needs new render data, keep the handle and call its optional `update` method after mounting:

```ts [host]
async function showDarkTheme() {
  const nextSnapshot = {
    user: { id: 'u-42', displayName: 'Ada' },
    theme: 'dark',
  };
  await profileApp.mountPromise;
  await profileApp.update?.(nextSnapshot);
}
```

The micro-app opts in by exporting `update`:

```ts [micro-app entry]
export async function update(nextProps) {
  rerenderProfile({
    user: nextProps.user,
    theme: nextProps.theme,
  });
}
```

Treat every update as a new complete snapshot of the custom props that the app needs; do not rely on qiankun to merge it with a previous object. If the micro-app does not export `update`, the handle has no update behavior, which is why optional chaining is useful.

For a continuous event stream or frequently changing state, a callback or host-owned store is usually clearer than issuing many snapshots.

## Pass host-owned capabilities

### Callbacks for micro-app events

Pass a narrowly scoped callback when a micro-app needs to report something or ask the host to act:

```ts [host and micro-app]
const onProfileAction = (action: { type: 'ready' | 'sign-out' }) => {
  if (action.type === 'sign-out') signOutCurrentUser();
};
const profileApp = loadMicroApp({
  name: 'profile',
  entry: 'https://profile.example.com',
  container,
  props: { user, onProfileAction },
});
// Inside the micro-app:
export async function mount(props) {
  props.onProfileAction({ type: 'ready' });
}
```

Keep callback payloads versionable and serializable where practical. A callback should express intent such as `onCheckout` or `requestNavigation`, rather than expose the host's entire application object.

### A shared store owned by the host

When multiple apps need the same live state, construct the store once in the host and pass the same small interface to each app. Redux, Zustand, RxJS, or a project-specific store can all work; qiankun does not require a particular library.

```ts [host]
const sessionStore = createSessionStore();
const profileApp = loadMicroApp({
  name: 'profile',
  entry: 'https://profile.example.com',
  container,
  props: { sessionStore },
});
```

Subscriptions created by the micro-app must be released during `unmount`:

```ts [micro-app entry]
let unsubscribe: (() => void) | undefined;
export async function mount({ container, sessionStore }) {
  renderSession(container, sessionStore.getSnapshot());
  unsubscribe = sessionStore.subscribe((snapshot) => {
    rerenderSession(snapshot);
  });
}
export async function unmount() {
  unsubscribe?.();
  unsubscribe = undefined;
  destroySessionView();
}
```

::: danger Always unsubscribe
A subscription lives on the host-owned store, so the host can retain an unmounted micro-app through its listener. qiankun cannot clean up that relationship for you. Pair every subscription made in `mount` with an unsubscribe in `unmount`.
:::

## Route-driven and loosely coupled alternatives

When the URL alone determines whether an app is active, `registerMicroApps` remains the route-driven alternative. It accepts initial `props`, but it does not return a per-app handle for pushing snapshots; use callbacks or a host-owned store for later changes. See [registerMicroApps](/api/register-micro-apps).

For deliberately loose coupling, use a browser channel that matches the requirement:

- route segments, query strings, or hashes for small serializable navigation state;
- `BroadcastChannel` for same-origin cross-tab messages;
- `postMessage` for cross-window communication, with strict origin validation;
- a host-provided `EventTarget` for same-page fire-and-forget events, with listener cleanup on unmount.

Define message schemas and ownership just as carefully as prop types. Browser channels are alternatives for a specific topology, not a reason to hide ordinary application state in a global event bus.

## Checklist

- Keep the source of truth in the host.
- Prefer `loadMicroApp` plus props for the main integration path.
- Save the returned handle; use it for optional `update` and required `unmount` work.
- Send complete, immutable snapshots through `update`.
- Pass callbacks or a small host-owned store for two-way or live communication.
- Unsubscribe from every host-owned service in `unmount`.
- Use routing or browser channels only when their loose coupling is intentional.

See [Micro-app lifecycle and props](/concepts/lifecycle-and-props), [loadMicroApp](/api/load-micro-app), and the [React](/ecosystem/react) or [Vue](/ecosystem/vue) bindings for the corresponding component APIs.
