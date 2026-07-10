# 快速上手

本指南使用官方脚手架 `create-qiankun` 运行一个主应用和一个微应用。主应用通过 `loadMicroApp` 直接控制微应用。

开始前请准备 Node.js `>=20.19`、pnpm，以及现代 Chromium 浏览器或 Safari。

## 创建并运行应用

在一个空的工作目录中创建两个项目：

```bash
mkdir qiankun-demo
cd qiankun-demo
pnpm dlx create-qiankun@latest main-app --type main
pnpm dlx create-qiankun@latest sub-app --template react-ts
```

打开两个终端，并在 `qiankun-demo` 目录下分别启动它们：

::: code-group

```bash [微应用]
cd sub-app
pnpm install
pnpm dev
# http://localhost:7101
```

```bash [主应用]
cd main-app
pnpm install
pnpm dev
# http://localhost:7099
```

:::

打开 **http://localhost:7099**，页面中已经包含了独立运行的微应用。你也可以打开 **http://localhost:7101**，确认微应用仍然可以单独运行。

交互式命令、Vue 模板、npm 或 Yarn 用法，以及生成文件的完整说明，请查看 [`create-qiankun` 参考](/zh-CN/ecosystem/create-qiankun)。

::: warning Firefox 与 ESM 应用
ESM 沙箱依赖动态注入 import map，而 Firefox 目前还不支持这项能力。请使用 Chromium 浏览器或 Safari 完成本指南。经典模式的微应用不受影响。
:::

## 主应用如何控制微应用

生成的主应用运行在 `7099` 端口。React 创建好容器元素后，`App.tsx` 按照下面的方式加载微应用：

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

应用描述包含三个必填字段：

| 字段 | 作用 |
| --- | --- |
| `name` | 标识这个微应用。 |
| `entry` | 指向它的 HTML 入口；这里是 `7101` 端口上的开发服务器。 |
| `container` | 接收微应用的 `HTMLElement`。 |

`loadMicroApp` 返回一个 `MicroApp` 句柄。实例存在期间应当保留这个句柄，并在清理时调用 `unmount()`。这样 qiankun 才能执行微应用的 `unmount` 生命周期，并完整释放这个实例。React effect 清理函数不能返回 Promise，因此示例会启动卸载并处理 rejection；主应用流程允许异步等待时，应在移除容器前等待 `unmount()`。

## 微应用提供什么

生成的微应用是一个普通 Vite 应用，只增加了两部分接入代码：

- `@qiankunjs/bundler-plugin` 为 qiankun 准备 HTML 入口和开发服务器。
- 入口模块导出 `bootstrap`、`mount` 和 `unmount`。`mount` 在主应用提供的容器内渲染，`unmount` 销毁框架根节点。

单独打开 `7101` 端口时，独立运行分支会渲染同一个应用。因此微应用既可以独立开发，也可以由主应用加载。

## 路由驱动的应用

当业务代码决定某个实例何时存在时，优先使用 `loadMicroApp`。如果应用是否激活需要完全由当前 URL 决定，可以改用 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。本页的流程不需要这两个 API。

## 下一步

- 通过[手动教程](/zh-CN/tutorial/)在不使用脚手架的情况下搭建相同结构。
- 在[生命周期与 props](/zh-CN/concepts/lifecycle-and-props)中了解应用契约。
- 改造一个现有的 [Vite](/zh-CN/cookbook/prepare-a-vite-app) 或 [Webpack](/zh-CN/cookbook/prepare-a-webpack-app) 应用。
- 在 [`loadMicroApp` API](/zh-CN/api/load-micro-app)中查看全部选项和方法。
