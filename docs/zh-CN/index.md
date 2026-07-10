---
layout: home

hero:
  name: qiankun
  tagline: 在一个页面中，按需加载并管理独立交付的微应用
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
    details: 兼容任何 JavaScript 框架。把微应用加载进一个 HTMLElement，再用一组精简的 API 管理它的生命周期。
  - icon: 🛡️
    title: 完整
    details: 提供微前端系统所需的核心能力，包括 JavaScript 隔离、可选的样式隔离和预加载。
  - icon: 🔧
    title: 生产就绪
    details: 已经过蚂蚁集团内外大量线上应用的长期验证和打磨。
  - icon: ⚡
    title: 高性能
    details: 采用 HTML Entry 流式加载，并在解析时预加载资源，让应用加载保持流畅。
  - icon: 🎯
    title: 技术栈无关
    details: 主应用不限制微应用的框架和发布流程。
  - icon: 🧬
    title: 运行时隔离
    details: JavaScript 沙箱与原生 ESM 支持，帮助独立开发的应用共存于同一个页面。
---

## 加载第一个微应用

在主应用中安装 qiankun：

```bash
pnpm add qiankun
```

等容器就绪后加载微应用，并保存返回的句柄，以便在不再需要时卸载：

```tsx
import { loadMicroApp } from 'qiankun';
import { useEffect, useRef } from 'react';

export function MicroAppSlot() {
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

微应用导出 `bootstrap`、`mount` 和 `unmount`；qiankun 将它加载到这个 `HTMLElement`，并驱动相应生命周期。跟随[快速上手](/zh-CN/guide/getting-started)，运行端口为 `7099` 的主应用和端口为 `7101` 的微应用。

如果应用完全由 URL 决定何时激活，可以改用路由驱动的 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。
