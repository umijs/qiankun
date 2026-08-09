# 第 3 步：运行并验证

两个应用均已准备就绪。本步骤将验证以下关键行为：从独立开发服务器加载微应用、将其挂载到指定元素、显式卸载实例，以及独立运行微应用。

## 启动两个开发服务器

从 `qiankun-tutorial` 目录打开两个终端：

::: code-group

```bash [微应用]
cd sub-app
npm run dev
# http://localhost:7101
```

```bash [主应用]
cd main-app
npm run dev
# http://localhost:7099
```

:::

先启动微应用，再打开 **http://localhost:7099**。

## 验证生命周期

1. 页面初始显示主应用标题、按钮，以及 `sub-app` 渲染的界面。
2. 点击**卸载微应用**。React 移除 `MicroAppSlot`，清理函数会用之前保存的句柄调用 `unmount()`，微应用界面随之消失。
3. 点击**挂载微应用**。页面创建新的容器和 `MicroApp` 句柄，应用再次出现。
4. 直接访问 **http://localhost:7101**，确认同一个微应用无需主应用也能独立渲染。

以上检查全部通过，就说明主应用与微应用已按约定接入完毕。主应用无需了解微应用内部的渲染方式，只负责创建容器并管理返回的实例句柄。

## 构建两个应用

将该结构集成到实际项目之前，应确认两个应用均能完成生产构建：

::: code-group

```bash [微应用]
cd sub-app
npm run build
```

```bash [主应用]
cd main-app
npm run build
```

:::

微应用的构建插件会在构建产物的 HTML 中标记入口脚本。

## 常见问题

| 现象 | 检查项 |
| --- | --- |
| 容器为空，同时入口请求失败 | 确认 `sub-app` 运行在 `7101` 端口，并且 `entry` 指向 `//localhost:7101`。 |
| 浏览器报告 CORS 错误 | 确认微应用的 Vite 配置包含来自 `@qiankunjs/bundler-plugin/vite` 的 `qiankun()`。 |
| qiankun 找不到生命周期函数 | 确认入口模块导出了 `bootstrap`、`mount` 和 `unmount`，并且 Vite 配置包含 qiankun 插件。 |
| 应用首次出现，但无法正常重新挂载 | 确认微应用在 `unmount` 中销毁了 React 根节点，并且主应用调用了句柄的 `unmount()`。 |
| Vite 在其他端口启动 | 添加 `strictPort: true`，释放 `7099` 和 `7101` 端口后重新启动。 |

ESM 微应用请使用基于 Chromium 的浏览器（Chrome、Edge 等）或 Safari；Firefox 目前还不支持 ESM 沙箱所需的动态注入 import map。

## 下一步

- 通过 [`loadMicroApp` props](/zh-CN/api/load-micro-app)向实例传递数据。
- 在[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)中了解主应用与微应用各自的职责。
- 在需要时启用[样式隔离](/zh-CN/cookbook/enable-style-isolation)。
- 在主应用中处理[加载和运行时错误](/zh-CN/cookbook/handle-errors)。
- 使用 [React](/zh-CN/ecosystem/react) 或 [Vue](/zh-CN/ecosystem/vue) 绑定提供的声明式组件 API。
