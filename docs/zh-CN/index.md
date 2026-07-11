---
layout: home

hero:
  name: 微前端运行时
  text: 独立交付，按需组合
  tagline: 用 loadMicroApp 将不同团队、不同技术栈的前端应用挂载到任意页面区域。每个应用保留自己的开发与发布节奏。
  image:
    src: /hero-runtime.svg
    alt: 主应用在运行时组合多个独立交付的微应用
  actions:
    - theme: brand
      text: 加载第一个微应用
      link: /zh-CN/guide/getting-started
    - theme: alt
      text: 了解适用场景
      link: /zh-CN/guide/what-is-qiankun

features:
  - icon:
      src: /icons/agnostic.svg
      alt: 独立的应用边界
      width: 22
      height: 22
      wrap: true
    title: 发布无需齐步走
    details: 每个微应用保留自己的技术栈、仓库和发布节奏；主应用只在运行时组合它们。
  - icon:
      src: /icons/scope.svg
      alt: 挂载到页面区域的应用
      width: 22
      height: 22
      wrap: true
    title: 生命周期由业务控制
    details: 用 loadMicroApp 挂载到任意 HTMLElement，再通过返回的实例句柄按需更新或卸载。
  - icon:
      src: /icons/sandbox.svg
      alt: 隔离的运行边界
      width: 22
      height: 22
      wrap: true
    title: 不同应用减少干扰
    details: JavaScript 沙箱、可选样式隔离和原生 ESM 支持，帮助不同技术栈共存于同一页面。
---

## 控制一个微应用实例

在主应用中安装 qiankun：

```bash
pnpm add qiankun
```

等容器就绪后加载微应用，并保存返回的句柄，用于观察状态和完成卸载：

```ts
import { loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

const microApp = loadMicroApp({
  name: 'orders',
  entry: '//localhost:7101',
  container,
});

await microApp.mountPromise;

// 当前页面区域移除时：
await microApp.unmount();
```

微应用导出 `bootstrap`、`mount` 和 `unmount`；qiankun 将它加载到这个 `HTMLElement`，并驱动相应生命周期。跟随[快速上手](/zh-CN/guide/getting-started)完成一套可运行的接入。

如果应用完全由 URL 决定何时激活，可以改用路由驱动的 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。
