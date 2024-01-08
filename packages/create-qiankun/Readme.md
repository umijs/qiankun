# @qiankunjs/create-qiankun

`@qiankunjs/create-qiankun` 是一个为 [qiankun](https://github.com/umijs/qiankun) 微前端框架设计的脚手架功能。旨在快速启动示例项目，方便开发者快速上手。

## 功能

- 支持选择一个或多个子应用来创建一个新的项目
- 支持主,子应用路由模式 `(hash, history)` 选择
- 支持一键生成 `npm/yarn/pnpm/pnpm workspace` 工程
- 注入启动应用脚本以及端口冲突检测

## 环境要求

1. 建议使用 Node.js 版本 v18 或更高版本。,推荐使用 [fnm](https://github.com/Schniz/fnm) 管理 node 版本

## 安装

使用 npm:

```bash
npx create-qiankun@latest
```

或使用 yarn:

```bash
yarn create qiankun@latest
```

或使用 pnpm:

```bash
pnpm dlx create-qiankun@latest
```

## 使用

## 模板列表

### 主应用模板

| 模板名称        |     |
| --------------- | --- |
| React18+Webpack |     |
| Vue3+Webpack    |     |
| React18+umi     |     |

### 子应用模板

| 模板名称        |                             |
| --------------- | --------------------------- |
| React18+Webpack |                             |
| React16+Webpack |                             |
| Vue3+Webpack    |                             |
| Vue2+Webpack    | ❗ 在 pnpm workspace 有问题 |
| Vite+Vue3       | 🚧 建设中                   |
| Vite+React18    | 🚧 建设中                   |

## 贡献

欢迎任何形式的贡献！请提交 PR 或开启 issue 讨论。

## 许可证

MIT
