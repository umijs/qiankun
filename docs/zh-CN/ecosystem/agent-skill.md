# Agent skill

qiankun 以 [Agent Skills](https://github.com/vercel-labs/skills) 格式随主仓库分发一份面向 coding agent 的使用手册。安装后，Claude Code、Cursor 等 agent 可以按官方约定为你创建主应用和微应用，或将现有 Vite 应用改造为微应用。

skill 与文档站同源维护：agent 生成的项目结构与[教程](/zh-CN/tutorial/)手动搭建的结果一致，skill 只是把这份约定交给 agent 执行。

## 安装

在准备创建项目的目录中执行：

```bash
npx skills add umijs/qiankun
```

命令会从 qiankun 仓库拉取名为 `qiankun` 的 skill，并安装到当前 agent 的技能目录（例如 `.claude/skills/`）。仓库始终分发与最新文档同步的版本，无需关心 skill 自身的版本号。

## 使用

安装后，用自然语言向 agent 描述目标即可，例如：

> 用 qiankun 创建一个 React 主应用（端口 7099）和一个 Vue 微应用（端口 7101）

agent 会按 skill 中的指令完成以下工作：

- 使用 create-vite 创建项目（React 或 Vue，TypeScript 或 JavaScript）；
- 微应用：安装 `@qiankunjs/bundler-plugin`、注册 Vite 插件并固定端口、改写入口模块以导出 `bootstrap` / `mount` / `update` / `unmount` 生命周期，并保留独立运行分支；
- 主应用：安装 `qiankun` 及可选的 React/Vue `MicroApp` 组件绑定，接入加载代码；
- 启动两个开发服务器，验证微应用既能独立运行、也能被主应用加载和卸载。

## 覆盖范围

当前版本覆盖创建环节：新建主应用/微应用，以及改造现有 Vite 应用。迁移、样式隔离、排障等其余主题请查阅本文档站对应章节。

## 相关内容

- [快速上手](/zh-CN/guide/getting-started)
- [教程：搭建主应用和微应用](/zh-CN/tutorial/)
- [接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)
- [@qiankunjs/bundler-plugin](/zh-CN/ecosystem/bundler-plugin)
