# 生态概览

qiankun 核心运行时通过 `loadMicroApp` 加载和管理微应用实例。官方配套包用于创建项目、配置微应用构建流程和集成框架组件。

## 官方包

| 包 | 用途 | 适用场景 |
| --- | --- | --- |
| [`qiankun`](/zh-CN/api/) | 核心运行时和 `loadMicroApp` API | 主应用需要直接管理实例生命周期时 |
| [`create-qiankun`](/zh-CN/ecosystem/create-qiankun) | Vite 项目脚手架 | 创建新的主应用或微应用时 |
| [`@qiankunjs/bundler-plugin`](/zh-CN/ecosystem/bundler-plugin) | Vite 与 Webpack 构建集成 | 将现有项目改造为微应用时 |
| [`@qiankunjs/react`](/zh-CN/ecosystem/react) | React `<MicroApp>` 组件 | 由 React 组件生命周期管理实例时 |
| [`@qiankunjs/vue`](/zh-CN/ecosystem/vue) | Vue `<MicroApp>` 组件 | 由 Vue 组件生命周期管理实例时 |

应用代码不应直接依赖文档未列出的内部工作区包。

## 选择接入方式

- **直接调用 `loadMicroApp`**：默认方式，适用于需要直接管理实例生命周期的主应用。
- **React 或 Vue `<MicroApp>`**：在组件树中以声明式方式加载微应用，内部仍调用 `loadMicroApp`。
- **`registerMicroApps + start`**：仅用于 URL 完全决定应用激活状态的路由驱动方案。

以上三种接入方式均使用相同的微应用 HTML 入口、生命周期和隔离机制。

## 创建新项目

创建新项目时，可使用官方脚手架：

```bash
npx create-qiankun@latest
```

该命令可生成默认使用 `loadMicroApp` 的 React 主应用，以及 React 或 Vue 微应用。完整参数参见 [create-qiankun](/zh-CN/ecosystem/create-qiankun)。

## 接入已有微应用

使用 `@qiankunjs/bundler-plugin` 生成符合要求的 HTML 入口，并根据构建工具选择相应指南：

- [接入 Vite 应用](/zh-CN/cookbook/prepare-a-vite-app)
- [接入 Webpack 应用](/zh-CN/cookbook/prepare-a-webpack-app)

插件的导出、选项和兼容范围参见 [构建插件参考](/zh-CN/ecosystem/bundler-plugin)。

## 在框架组件中加载

React 和 Vue 绑定会创建容器、调用 `loadMicroApp`、传递 props，并在组件销毁时卸载实例：

- [React `<MicroApp>`](/zh-CN/ecosystem/react)
- [Vue `<MicroApp>`](/zh-CN/ecosystem/vue)

使用组件封装并不会改变微应用契约。微应用仍应渲染到 `props.container`，并在 `unmount` 中释放自己的资源。

## 下一步

- [快速上手](/zh-CN/guide/getting-started)
- [了解微应用实例的加载过程](/zh-CN/concepts/architecture)
- [`loadMicroApp` API](/zh-CN/api/load-micro-app)
