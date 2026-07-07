---
layout: home

hero:
  name: qiankun
  tagline: 可能是你见过的最完善的微前端解决方案🧐
  image:
    src: /logo.png
    alt: qiankun
  actions:
    - theme: brand
      text: 快速上手
      link: /zh-CN/guide/getting-started
    - theme: alt
      text: 什么是 qiankun
      link: /zh-CN/guide/what-is-qiankun
    - theme: alt
      text: GitHub
      link: https://github.com/umijs/qiankun

features:
  - icon: 🚀
    title: 简单
    details: 兼容任何 JavaScript 框架。构建微前端系统就像使用 iframe 一样简单，但实际上不是 iframe。
  - icon: 🛡️
    title: 完整
    details: 包含构建微前端系统所需的几乎所有基本功能，如样式隔离、JS 沙箱、预加载等。
  - icon: 🔧
    title: 生产就绪
    details: 已经过蚂蚁集团内外大量线上应用的广泛测试和打磨，健壮性值得信赖。
  - icon: ⚡
    title: 高性能
    details: 采用 HTML Entry 流式加载，资源边解析边预载，应用切换更快。
  - icon: 🎯
    title: 技术栈无关
    details: 主应用不限制接入应用的技术栈，微应用具备完全自主权。
  - icon: 🧬
    title: 状态隔离
    details: 提供完整的 JS 沙箱机制，并原生支持 ESM 沙箱，确保应用之间互不影响。
---

## 快速开始

安装 qiankun：

::: code-group

```bash [npm]
npm install qiankun
```

```bash [pnpm]
pnpm add qiankun
```

```bash [yarn]
yarn add qiankun
```

:::

在主应用里注册微应用，然后启动：

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react-app',
    entry: '//localhost:7100',
    container: document.getElementById('subapp-container')!,
    activeRule: '/react',
  },
]);

start();
```

微应用侧只需导出 `bootstrap`、`mount`、`unmount` 三个生命周期函数，不用改造构建产物的格式。完整流程见 [快速上手](/zh-CN/guide/getting-started)。
