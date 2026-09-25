# 快速上手

本指南借助官方 [Agent skill](/zh-CN/ecosystem/agent-skill) 创建并运行一个主应用和一个微应用。主应用通过 `loadMicroApp` 管理微应用实例。

开始前，请安装 Node.js `>=20.19` 和 npm，并准备基于 Chromium 的浏览器（Chrome、Edge 等）或 Safari（完整浏览器要求见[浏览器支持](/zh-CN/guide/browser-support)）。

## 创建并运行应用

在一个空的工作目录中安装 skill，然后让你的 coding agent（Claude Code、Cursor 等）创建两个项目：

```bash
mkdir qiankun-demo
cd qiankun-demo
npx skills add umijs/qiankun
```

向 agent 描述目标，例如：

> 用 qiankun 创建一个 React + TypeScript 主应用 main-app（端口 7099，用 loadMicroApp 加载微应用）和一个 React + TypeScript 微应用 sub-app（端口 7101）

如果不使用 agent，可按[教程](/zh-CN/tutorial/)手动搭建相同结构，本页其余内容同样适用。

项目创建完成后，打开两个终端，在 `qiankun-demo` 目录下分别启动两个应用：

::: code-group

```bash [微应用]
cd sub-app
npm install
npm run dev
# http://localhost:7101
```

```bash [主应用]
cd main-app
npm install
npm run dev
# http://localhost:7099
```

:::

访问 **http://localhost:7099**，可查看主应用中挂载的微应用。直接访问 **http://localhost:7101**，可确认微应用能够独立运行。

skill 的安装方式、能力范围和生成内容的完整说明见 [Agent skill](/zh-CN/ecosystem/agent-skill)。

::: warning Firefox 与 ESM 应用
ESM 沙箱依赖动态注入 import map，而 Firefox 目前还不支持这项能力。请使用基于 Chromium 的浏览器（Chrome、Edge 等）或 Safari 完成本指南。Classic 模式的微应用不受影响。
:::

## 主应用如何管理微应用

生成的主应用运行在 `7099` 端口。React 创建容器元素后，`App.tsx` 通过以下代码加载微应用：

```tsx
import { loadMicroApp } from 'qiankun';
import { useEffect, useRef } from 'react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const microApp = loadMicroApp({
      name: 'sub-app',
      entry: '//localhost:7101',
      container,
    });

    return () => {
      void microApp.unmount().catch((error: unknown) => {
        console.error('sub-app 卸载失败：', error);
      });
    };
  }, []);

  return <div ref={containerRef} />;
}
```

传给 `loadMicroApp` 的配置对象包含三个必填字段：

| 字段 | 作用 |
| --- | --- |
| `name` | 当前微应用实例的名称。不同容器中的多个实例可以使用同一名称。 |
| `entry` | 微应用的 HTML 入口。本例指向运行在 `7101` 端口的开发服务器。 |
| `container` | 用于挂载微应用的 `HTMLElement`。 |

`loadMicroApp` 返回一个 `MicroApp` 实例句柄。在实例存续期间应保留该句柄，并在清理时调用 `unmount()`，以便 qiankun 执行微应用的 `unmount` 生命周期并完成卸载。`useEffect` 的清理函数不能返回 Promise，因此本例只是发起卸载，并捕获可能的失败。如果主应用的清理流程支持异步等待，则应在移除容器前等待 `unmount()` 完成。

## 微应用的接入要求

生成的微应用仍是标准的 Vite 应用，仅增加以下两部分 qiankun 接入代码：

- `@qiankunjs/bundler-plugin` 为 qiankun 配置 HTML 入口和开发服务器。
- 入口模块导出 `bootstrap`、`mount` 和 `unmount`。`mount` 在主应用提供的容器内渲染，`unmount` 销毁框架根节点。

直接访问 `7101` 端口时，微应用会走独立运行分支自行渲染。因此，该应用既可独立开发，也可由主应用加载。

## 路由驱动的应用

如果实例的创建和销毁由业务代码决定，应优先使用 `loadMicroApp`。如果微应用的激活状态完全取决于当前 URL，可使用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。本页流程无需使用这两个 API。

## 下一步

- 按照[教程](/zh-CN/tutorial/)一步步手动搭建相同结构。
- 在[微应用生命周期与 props](/zh-CN/concepts/lifecycle-and-props)中了解应用契约。
- 改造一个现有的 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 应用。
- 在 [`loadMicroApp` API](/zh-CN/api/load-micro-app)中查看全部选项和方法。
