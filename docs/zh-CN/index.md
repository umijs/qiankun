---
layout: home

hero:
  name: qiankun
  text: 微前端解决方案
  tagline: 把多个独立开发、独立部署的前端应用，在运行时拼成一个整体。技术栈无关，接入简单。
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
  - icon:
      src: /icons/agnostic.svg
    title: 技术栈无关
    details: React、Vue、Angular 还是老的 jQuery，都能接进来，新老框架混用也没问题。微应用只要导出三个生命周期函数就行。
  - icon:
      src: /icons/sandbox.svg
    title: 应用之间互不干扰
    details: 每个微应用跑在自己的 JS 沙箱里。全局变量、定时器、事件监听在卸载时自动还原，多个应用同时挂载也不会互相污染。
  - icon:
      src: /icons/scope.svg
    title: 样式不串味
    details: 一个开关就能开启样式隔离，基于浏览器原生的 CSS @scope，不依赖 Shadow DOM，外部样式表也一并处理。
  - icon:
      src: /icons/esm.svg
    title: Vite 应用零改造
    details: 直接运行微应用的原生 ES 模块，连 Vite 的 dev server 都能直接接。不用再为了接入而单独打一份 UMD 包。
  - icon:
      src: /icons/stream.svg
    title: 切换更快
    details: HTML 流式加载，资源边解析边预载，应用切换几乎无感。不用你手写预加载策略。
  - icon:
      src: /icons/singlespa.svg
    title: 久经考验
    details: 基于 single-spa 构建，在蚂蚁集团内外的大量线上应用中长期打磨，可以放心用在生产环境。
---

## 快速开始

装上 qiankun:

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
  {
    name: 'vue-app',
    entry: '//localhost:7101',
    container: document.getElementById('subapp-container')!,
    activeRule: '/vue',
  },
]);

start();
```

微应用侧只需导出 `bootstrap`、`mount`、`unmount` 三个生命周期函数，不用改造构建产物的格式。想少写点样板，用 [`create-qiankun`](/zh-CN/ecosystem/create-qiankun) 一条命令就能生成可运行的工程。

完整流程见 [快速上手](/zh-CN/guide/getting-started)，想逐行搭一遍就走 [手把手教程](/zh-CN/tutorial/)。

## 社区

- [GitHub 仓库](https://github.com/umijs/qiankun) —— 源码、Issue、Star
- [社区讨论](https://github.com/umijs/qiankun/discussions) —— 提问、分享方案、参与设计讨论
- [v3 路线图](https://github.com/umijs/qiankun/discussions/1378) —— 了解 3.0 的规划与进展
- [更新日志](https://github.com/umijs/qiankun/releases) —— 每个版本改了什么

遇到问题先翻一遍 [常见问题](/zh-CN/faq/)，多半能找到答案。
