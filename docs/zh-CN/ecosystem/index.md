# 生态概览

qiankun 的核心运行时负责通过 `loadMicroApp` 加载和管理实例。官方配套包分别解决项目创建、微应用构建和框架组件集成。

## 官方包

| 包 | 用途 | 什么时候使用 |
| --- | --- | --- |
| [`qiankun`](/zh-CN/api/) | 核心运行时和 `loadMicroApp` API | 主应用需要直接控制实例时 |
| [`create-qiankun`](/zh-CN/ecosystem/create-qiankun) | Vite 项目脚手架 | 创建新的主应用或微应用时 |
| [`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin) | Vite 与 Webpack 构建集成 | 把已有项目准备成微应用时 |
| [`@qiankunjs/react`](/zh-CN/ecosystem/react) | React `<MicroApp>` 组件 | 希望由 React 组件生命周期管理实例时 |
| [`@qiankunjs/vue`](/zh-CN/ecosystem/vue) | Vue `<MicroApp>` 组件 | 希望由 Vue 组件生命周期管理实例时 |

应用代码不应直接依赖文档未列出的内部 workspace 包。

## 选择接入方式

- **直接调用 `loadMicroApp`**：默认方式，适合需要完整实例控制权的主应用。
- **React 或 Vue `<MicroApp>`**：在组件树中声明式加载；底层仍然使用 `loadMicroApp`。
- **`registerMicroApps + start`**：仅用于 URL 完全决定应用激活状态的路由驱动方案。

三种主应用写法共享同一套微应用 HTML Entry、生命周期和隔离模型。

## 创建新项目

最快的入口是官方脚手架：

```bash
pnpm dlx create-qiankun@latest
```

它可以生成一个默认使用 `loadMicroApp` 的 React 主应用，以及 React 或 Vue 微应用。完整参数见 [create-qiankun](/zh-CN/ecosystem/create-qiankun)。

## 接入已有微应用

使用 `@qiankunjs/bundler-plugin` 准备 HTML Entry，然后按构建工具选择操作指南：

- [接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)
- [接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)

插件的导出、选项和兼容范围见 [bundler plugin 参考](/zh-CN/ecosystem/bundler-plugin)。

## 在框架组件中加载

React 和 Vue 绑定负责创建容器、调用 `loadMicroApp`、传递 props，并在组件销毁时卸载实例：

- [React `<MicroApp>`](/zh-CN/ecosystem/react)
- [Vue `<MicroApp>`](/zh-CN/ecosystem/vue)

使用组件封装并不会改变微应用契约。微应用仍应渲染到 `props.container`，并在 `unmount` 中释放自己的资源。

## 下一步

- [5 分钟上手](/zh-CN/guide/getting-started)
- [加载一个微应用实例](/zh-CN/concepts/architecture)
- [`loadMicroApp` API](/zh-CN/api/load-micro-app)
