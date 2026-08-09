# create-qiankun

`create-qiankun` 是 qiankun v3 的官方脚手架，用于创建可直接集成的 Vite 主应用和微应用。

生成的主应用以 [`loadMicroApp`](/zh-CN/api/load-micro-app) 加载微应用；生成的微应用保留独立运行能力，并导出 qiankun 生命周期。

## 环境要求

- Node.js `>=20.19`

## 创建项目

不带参数时，CLI 会交互式询问应用类型、名称和微应用模板：

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

也可通过命令行一次性指定全部选项：

```bash
# React + TypeScript 微应用
npx create-qiankun@latest sub-app --type sub --template react-ts

# 主应用
npx create-qiankun@latest main-app --type main
```

## 命令行选项

| 参数 | 别名 | 取值 | 默认值 |
| --- | --- | --- | --- |
| `<app-name>` | — | 项目名称与目标目录名称 | 交互询问 |
| `--type` | `-T` | `main`、`sub` | 交互询问；提供 `--template` 时为 `sub` |
| `--template` | `-t` | `react-ts`、`react`、`vue-ts`、`vue` | 交互询问 |

`--template` 只适用于微应用。主应用固定使用 React + TypeScript；同时传入 `--type main` 和 `--template` 会报错。

交互式名称输入只接受小写字母、数字和连字符。未提供应用名时，默认名称分别为 `qiankun-main-app` 和 `qiankun-sub-app`。目标目录已经存在时，CLI 不会覆盖它。

## 生成目录

生成位置取决于命令的执行目录：

- 如果当前目录的父目录包含 `pnpm-workspace.yaml`，则生成到 `<父目录>/packages/<app-name>`；
- 其他情况下生成到当前目录下的 `<app-name>`。

完成后终端会输出实际目录和下一步命令。

## 生成内容

| 类型 | 生成内容 | 默认端口 |
| --- | --- | --- |
| 主应用 | React + TypeScript；安装 `qiankun`；通过 `loadMicroApp` 加载并在清理时卸载微应用 | `7099` |
| React 微应用 | Vite 插件、生命周期入口、独立运行分支 | `7101` |
| Vue 微应用 | Vite 插件、生命周期入口、独立运行分支 | `7101` |

微应用使用 `@qiankunjs/bundler-plugin/vite` 配置开发服务器和 HTML 入口。`dev`/`preview` 提供的页面和 `build` 的构建产物，均可由 qiankun 直接加载，无需额外生成 SystemJS 或 UMD 格式的构建产物。

脚手架生成的代码仅作为项目的初始实现，不构成新的公共 API。接入约定以[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props) 和 [`loadMicroApp` API](/zh-CN/api/load-micro-app)为准。

## 默认连接方式

主应用默认从 `//localhost:7101` 加载微应用，并根据 React 组件的生命周期管理返回的实例句柄：容器创建后调用 `loadMicroApp`，组件清理时调用 `unmount()`。

如果需要多个微应用，请为每个开发服务器设置不同端口，并为每个实例提供独立容器。参见[运行多个微应用实例](/zh-CN/cookbook/run-multiple-instances)。

如果微应用的激活状态完全取决于路由，可将主应用改为使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。这两个 API 并非默认生成方案的前置步骤。

## 运行项目

分别进入两个目录安装依赖并启动：

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

访问 `http://localhost:7099` 可查看组合后的页面；访问 `http://localhost:7101` 可独立开发微应用。完整过程参见[快速上手](/zh-CN/guide/getting-started)。

## 相关内容

- [快速上手](/zh-CN/guide/getting-started)。
- [接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)。
- [@qiankunjs/bundler-plugin](/zh-CN/ecosystem/bundler-plugin)。
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。
