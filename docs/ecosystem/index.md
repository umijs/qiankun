# Ecosystem overview

The qiankun core runtime loads and manages instances through `loadMicroApp`. Official companion packages cover project creation, micro-app builds, and framework component integration.

## Official packages

| Package | Purpose | Use it when |
| --- | --- | --- |
| [`qiankun`](/api/) | Core runtime and `loadMicroApp` API | The host needs direct control over instances |
| [`create-qiankun`](/ecosystem/create-qiankun) | Vite project scaffolder | Creating a new host or micro-app |
| [`@qiankunjs/bundler-plugin`](/ecosystem/bundler-plugin) | Vite and Webpack integration | Preparing an existing project as a micro-app |
| [`@qiankunjs/react`](/ecosystem/react) | React `<MicroApp>` component | React component lifecycles should manage instances |
| [`@qiankunjs/vue`](/ecosystem/vue) | Vue `<MicroApp>` component | Vue component lifecycles should manage instances |

Application code should not depend directly on undocumented internal workspace packages.

## Choose an integration style

- **Call `loadMicroApp` directly**: the default when the host needs full instance control.
- **Use React or Vue `<MicroApp>`**: declarative loading in a component tree, still backed by `loadMicroApp`.
- **Use `registerMicroApps + start`**: only for the route-driven alternative where the URL completely determines activation.

All three host styles use the same micro-app HTML Entry, lifecycle, and isolation model.

## Create a new project

The fastest path is the official scaffolder:

```bash
npx create-qiankun@latest
```

It can generate a React host that uses `loadMicroApp` by default and a React or Vue micro-app. See [create-qiankun](/ecosystem/create-qiankun) for all options.

## Prepare an existing micro-app

Use `@qiankunjs/bundler-plugin` to prepare the HTML Entry, then follow the guide for your build tool:

- [Prepare a Vite app](/cookbook/prepare-a-vite-app)
- [Prepare a Webpack app](/cookbook/prepare-a-webpack-app)

See the [bundler plugin reference](/ecosystem/bundler-plugin) for exports, options, and compatibility.

## Load from a framework component

The React and Vue bindings create the container, call `loadMicroApp`, pass props, and unmount the instance with the component:

- [React `<MicroApp>`](/ecosystem/react)
- [Vue `<MicroApp>`](/ecosystem/vue)

Using a wrapper does not change the micro-app contract. The micro-app still renders into `props.container` and releases its own resources in `unmount`.

## Next steps

- [Get started in 5 minutes](/guide/getting-started)
- [Loading a micro-app instance](/concepts/architecture)
- [`loadMicroApp` API](/api/load-micro-app)
