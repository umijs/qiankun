# 第 3 步：连接、运行并验证

两个应用已经准备完成。本步骤验证用户真正依赖的行为：从独立服务器加载、挂载到指定元素、显式卸载，以及独立开发。

## 启动两个开发服务器

从 `qiankun-tutorial` 目录打开两个终端：

::: code-group

```bash [微应用]
cd sub-app
pnpm dev
# http://localhost:7101
```

```bash [主应用]
cd main-app
pnpm dev
# http://localhost:7099
```

:::

先启动微应用，再打开 **http://localhost:7099**。

## 验证生命周期

1. 页面初始显示主应用标题、按钮，以及 `sub-app` 渲染的界面。
2. 点击 **Unmount micro-app**。React 移除 `MicroAppSlot`，它的清理函数调用所保存句柄的 `unmount()` 方法，微应用界面随之消失。
3. 点击 **Mount micro-app**。页面创建新的容器和 `MicroApp` 句柄，应用再次出现。
4. 直接打开 **http://localhost:7101**，同一个微应用可以脱离主应用独立渲染。

这些检查足以确认应用之间的接入契约。主应用无需了解微应用内部如何渲染；它只负责拥有容器和返回的句柄。

## 构建两个应用

将这套结构放入更大的项目之前，请确认两个生产构建都能成功：

::: code-group

```bash [微应用]
cd sub-app
pnpm build
```

```bash [主应用]
cd main-app
pnpm build
```

:::

微应用的 bundler plugin 会在构建过程中准备生产环境的 HTML 入口。

## 常见的首次运行问题

| 现象 | 检查项 |
| --- | --- |
| 容器为空，同时入口请求失败 | 确认 `sub-app` 运行在 `7101` 端口，并且 `entry` 指向 `//localhost:7101`。 |
| 浏览器报告 CORS 错误 | 确认微应用的 Vite 配置包含来自 `@qiankunjs/bundler-plugin/vite` 的 `qiankun()`。 |
| qiankun 找不到生命周期函数 | 确认入口模块导出了 `bootstrap`、`mount` 和 `unmount`，并且 Vite 配置包含 qiankun 插件。 |
| 应用首次出现，但无法正常重新挂载 | 确认微应用在 `unmount` 中销毁了 React 根节点，并且主应用调用了句柄的 `unmount()`。 |
| Vite 在其他端口启动 | 添加 `strictPort: true`，释放 `7099` 和 `7101` 端口后重新启动。 |

ESM 微应用请使用 Chromium 浏览器或 Safari；Firefox 目前还不支持 ESM 沙箱所需的动态注入 import map。

## 下一步

- 通过 [`loadMicroApp` props](/zh-CN/api/load-micro-app)向实例传递数据。
- 在[生命周期与 props](/zh-CN/concepts/lifecycle-and-props)中了解双方的保证和责任。
- 在需要时启用[样式隔离](/zh-CN/cookbook/enable-style-isolation)。
- 在主应用中处理[加载和运行时错误](/zh-CN/cookbook/handle-errors)。
- 使用 [React](/zh-CN/ecosystem/react) 或 [Vue](/zh-CN/ecosystem/vue) 绑定获得声明式组件 API。
