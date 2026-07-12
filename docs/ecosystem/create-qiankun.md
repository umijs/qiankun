# create-qiankun

`create-qiankun` is the official qiankun v3 scaffolder. It creates Vite host and micro-app projects that run together out of the box.

The generated host loads the micro-app with [`loadMicroApp`](/api/load-micro-app). The generated micro-app remains runnable by itself and exports the qiankun lifecycle.

## Requirements

- Node.js `>=20.19`

## Create a project

With no arguments, the CLI asks for the app type, name, and micro-app template:

::: code-group

```bash [npm]
npx create-qiankun@latest
```

```bash [pnpm]
pnpm dlx create-qiankun@latest
```

```bash [Yarn]
yarn create qiankun@latest
```

:::

You can also provide every choice in one command:

```bash
# React + TypeScript micro-app
npx create-qiankun@latest sub-app --type sub --template react-ts

# Host application
npx create-qiankun@latest main-app --type main
```

## CLI options

| Argument | Alias | Values | Default |
| --- | --- | --- | --- |
| `<app-name>` | — | project name and target-directory name | prompted |
| `--type` | `-T` | `main`, `sub` | prompted; `sub` when `--template` is provided |
| `--template` | `-t` | `react-ts`, `react`, `vue-ts`, `vue` | prompted |

`--template` applies only to micro-apps. The host is always React + TypeScript; combining `--type main` with `--template` is an error.

The interactive name prompt accepts lowercase letters, digits, and hyphens. When no name is provided, the defaults are `qiankun-main-app` and `qiankun-sub-app`. The CLI does not overwrite an existing target directory.

## Target directory

Directory placement depends on where the command runs:

- if the current directory's parent contains `pnpm-workspace.yaml`, it generates `<parent>/packages/<app-name>`;
- otherwise, it generates `<app-name>` under the current directory.

The completion message prints the resolved directory and the next commands.

## Generated capabilities

| Type | Generated behavior | Default port |
| --- | --- | --- |
| Host | React + TypeScript; installs `qiankun`; loads with `loadMicroApp` and unmounts during cleanup | `7099` |
| React micro-app | Vite plugin, lifecycle entry, and standalone branch | `7101` |
| Vue micro-app | Vite plugin, lifecycle entry, and standalone branch | `7101` |

Micro-apps use `@qiankunjs/bundler-plugin/vite` to prepare the development server and HTML Entry. Ordinary `dev`, `build`, and `preview` output is loadable by qiankun; there is no separate SystemJS or UMD build mode.

Generated files are an editable starting point, not another public API. Use [Lifecycle and props](/concepts/lifecycle-and-props) and the [`loadMicroApp` reference](/api/load-micro-app) as the source of truth for the integration contract.

## Default connection

The host loads the micro-app from `//localhost:7101` and binds the returned handle to the React component lifecycle: call `loadMicroApp` after the container exists, then call `unmount()` during cleanup.

For several micro-apps, assign a distinct development port to each server and provide a separate container for every concurrent instance. See [Run multiple micro-app instances](/cookbook/run-multiple-instances).

When the URL completely determines activation, you can replace the default host flow with [`registerMicroApps`](/api/register-micro-apps) and [`start`](/api/start). They are not prerequisites for the generated path.

## Run the projects

Install and start each generated project in its own terminal:

```bash
cd sub-app
npm install
npm run dev
```

```bash
cd main-app
npm install
npm run dev
```

Open `http://localhost:7099` for the composed page, or `http://localhost:7101` to develop the micro-app independently. See [Getting started](/guide/getting-started) for the complete flow.

## Related

- [Getting started](/guide/getting-started)
- [Prepare an existing Vite app](/cookbook/prepare-a-vite-app)
- [@qiankunjs/bundler-plugin](/ecosystem/bundler-plugin)
- [Native ESM support](/concepts/esm-sandbox)
