# Extending sandbox isolation

The `sandbox` configuration of `loadMicroApp` carries two lightweight extension points:

- `globals` adds application-specific values or property descriptors to the compartment global.
- `plugins` installs isolation behavior before application code runs and on every mount.

Use `globals` for values. Use a plugin when the capability also needs setup, cleanup, or remount recovery.

## Adding globals

```ts
loadMicroApp(
  {
    name: 'reporting',
    entry: '/apps/reporting/',
    container: document.querySelector('#reporting')!,
  },
  {
    sandbox: {
      globals: {
        tenantId: 'acme',
        featureClient: {
          configurable: true,
          enumerable: true,
          value: createFeatureClient(),
          writable: false,
        },
      },
    },
  },
);
```

A value is installed as a normal compartment global. An object with one of the standard descriptor keys (`value`, `get`, `set`, `writable`, `enumerable`, or `configurable`) is treated as a `PropertyDescriptor`. Wrap a descriptor-shaped object in `{ value: object }` when the object itself is the intended value.

Classic scripts can read these values from `window`. ESM scripts can also reference their configured names as bare identifiers. The values remain absent from the host `window`.

## Writing an isolation plugin

The following plugin gives each micro application a prefixed view of the `localStorage` method API. It imports only qiankun's public type and uses only the public Compartment API.

```ts
import type { IsolationPlugin } from 'qiankun';

export function localStoragePrefix(prefix: string): IsolationPlugin {
  return {
    name: `local-storage:${prefix}`,
    bootstrap({ compartment }) {
      const nativeStorage = window.localStorage;
      const keys = () =>
        Array.from({ length: nativeStorage.length }, (_, index) => nativeStorage.key(index))
          .filter((key): key is string => key?.startsWith(prefix) ?? false)
          .map((key) => key.slice(prefix.length));
      const storage = Object.freeze({
        get length() {
          return keys().length;
        },
        clear: () => keys().forEach((key) => nativeStorage.removeItem(`${prefix}${key}`)),
        getItem: (key: string) => nativeStorage.getItem(`${prefix}${key}`),
        key: (index: number) => keys()[index] ?? null,
        removeItem: (key: string) => nativeStorage.removeItem(`${prefix}${key}`),
        setItem: (key: string, value: string) => nativeStorage.setItem(`${prefix}${key}`, value),
      });

      compartment.defineUnshadowableGlobals({
        localStorage: {
          configurable: true,
          enumerable: true,
          value: storage,
          writable: false,
        },
      });

      return () => () => Promise.resolve();
    },
  };
}
```

This intentionally exposes the `Storage` method API rather than property-style access such as `storage.theme`. A Proxy-based implementation that supports named properties must virtualize `get`, `set`, `deleteProperty`, `has`, `ownKeys`, and property descriptors together. Forwarding unknown operations to the native `Storage` object would expose unprefixed keys.

Register it per application:

```ts
loadMicroApp(app, {
  sandbox: {
    plugins: [localStoragePrefix('reporting:')],
  },
});
```

## Lifecycle contract

Plugins are appended after qiankun's built-in isolation plugins.

- `bootstrap(context)` runs once, before any application script is evaluated.
- `mount(context)` runs on every mount and may return either a `Free` function or a promise for one.
- Calling `Free` during unmount releases side effects and returns a `Rebuild` function.
- `Rebuild(container)` restores the recorded side effects before the next mount completes.

```ts
type Free = () => Rebuild;
type Rebuild = (container: HTMLElement) => Promise<void>;
```

Keep per-application state inside the hook closure. Patches to shared prototypes need browser-realm coordination and reference counting so that one compartment cannot restore a prototype while another still uses it. When separately bundled qiankun copies can coexist, store that coordination record behind a stable `Symbol.for(...)` key on the native global instead of relying on module-local state.

Plugins may depend on the public `Compartment` interface only. The membrane, evaluator, and module linker are replaceable mechanisms. Document virtualization, dynamic DOM insertion, style isolation, and timer/listener cleanup remain qiankun-owned browser integration even if a native Compartment becomes available.

## Supplying module hooks

Advanced integrations can customize module resolution and loading through the module hooks on the `sandbox` configuration:

```ts
import { precompileModuleSource } from 'qiankun';

const entryUrl = new URL('/private-app/entry.js', location.href).href;
const dependencyUrl = new URL('./dependency.js', entryUrl).href;
const resolveHook = (specifier: string, referrer: string) => new URL(specifier, referrer).href;

// Run this linking step before the hook is installed (normally in the build or
// artifact-loading pipeline). The result can be cached or serialized.
const artifacts = new Map([
  [
    entryUrl,
    precompileModuleSource({
      source: `import { message } from './dependency.js';
const status = document.querySelector('#status');
if (status) status.textContent = message;`,
      url: entryUrl,
      globalsBaseSet: ['document'],
      resolveHook,
    }),
  ],
  [
    dependencyUrl,
    precompileModuleSource({
      source: `export const message = 'ready';`,
      url: dependencyUrl,
      globalsBaseSet: ['document'],
      resolveHook,
    }),
  ],
]);

loadMicroApp(app, {
  sandbox: {
    resolveHook,
    async importHook(fullSpecifier) {
      const source = artifacts.get(fullSpecifier);
      if (!source) throw new Error(`Missing module artifact: ${fullSpecifier}`);
      return { source };
    },
  },
});
```

Returning `{ source: string }` skips the default fetch but still sends the source through qiankun's lexer and linking rewrite. `precompileModuleSource` instead returns a complete, portable `ModuleSource`: its static dependencies are already canonical and its linked code contains an instance-neutral placeholder. The engine clones the descriptor and relocates only the generated static-import prefixes to a private key for each compartment, without fetching or rewriting it again; placeholder-looking user text and canonical URLs remain untouched. The retained original `source` is used if collision probing has to rebuild the module with a smaller injected-globals set.

List every browser global that the artifact reads as a bare identifier in `globalsBaseSet`; those names are routed through the compartment view. Keep precompilation outside `importHook` when the goal is for the hook path to avoid source-linking rewrite work; the engine still parses the linked artifact once to relocate only its generated import prefixes.

`modules` entries take precedence over `importHook`. `loadHook` is an alias for `importHook`; do not provide different functions for both names. Hooks must return equivalent descriptors when a new compartment loads the same module.
