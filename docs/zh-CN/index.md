---
layout: home

hero:
  name: qiankun
  text: 运行时组装的微前端
  tagline: 基于 single-spa 的完整微前端方案 —— 流式加载任意 HTML Entry，用 Proxy 隔离膜为每个应用建立沙箱，并原生执行 ES 模块，无需构建步骤。
  actions:
    - theme: brand
      text: 快速上手
      link: /zh-CN/guide/getting-started
    - theme: alt
      text: 什么是 qiankun
      link: /zh-CN/guide/what-is-qiankun
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/umijs/qiankun

features:
  - icon:
      src: /icons/stream.svg
    title: 流式 HTML Entry 加载
    details: 只需给 qiankun 一个微应用的 HTML 地址。loader 通过 writable-dom 流式解析、虚拟化 head，并在资源到达时逐个预加载 —— 无需 manifest，也无需手工维护 entry 约定。
    link: /zh-CN/concepts/html-entry-loading
    linkText: 加载机制
  - icon:
      src: /icons/sandbox.svg
    title: Proxy 隔离膜 JS 沙箱
    details: 每个微应用都运行在自己的代理 window 与 document 之上。全局变量、定时器、事件监听与 history 都会被追踪，并在卸载时还原，应用得以挂载、卸载、共存而互不污染。
    link: /zh-CN/concepts/js-sandbox
    linkText: JS 沙箱
  - icon:
      src: /icons/esm.svg
    title: 原生 ESM 执行
    details: 携带原生 script type=module 的微应用会被抓取、经词法分析改写以将全局访问路由进隔离膜、配上合成的 import map，再交由浏览器自身的模块加载器求值。Vite 开发服务器开箱即用。
    link: /zh-CN/concepts/esm-sandbox
    linkText: ESM 沙箱
  - icon:
      src: /icons/scope.svg
    title: 运行时样式隔离
    details: 一个 styleIsolation 开关即可开启。样式在运行时被包进 CSS @scope 并限定到已挂载的应用 —— 不用 Shadow DOM、不做构建期改写，外部样式表也一并处理。
    link: /zh-CN/concepts/style-isolation
    linkText: 样式隔离
  - icon:
      src: /icons/agnostic.svg
    title: 框架无关
    details: React、Vue、Angular 或纯 HTML —— 微应用只需导出 bootstrap、mount、unmount。React 与 Vue 提供一等的 MicroApp 组件绑定，create-qiankun 几秒即可脚手架出可运行的工程。
    link: /zh-CN/ecosystem/
    linkText: 了解生态
  - icon:
      src: /icons/singlespa.svg
    title: 基于 single-spa
    details: 路由、激活与生命周期编排由久经考验的 single-spa 内核负责，qiankun 在其之上补齐加载、沙箱与资源管线，因此基于路由的挂载与手动挂载都是一等能力。
    link: /zh-CN/concepts/architecture
    linkText: 架构概览
---
