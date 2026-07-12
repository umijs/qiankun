---
layout: home

hero:
  name: 微前端运行时
  text: 独立交付，按需组合
  tagline: 使用 loadMicroApp，可将不同团队、不同技术栈的前端应用挂载到页面中的指定区域；各应用均可独立开发和发布。
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
    title: 独立开发与发布
    details: 每个微应用可独立选择技术栈、管理代码仓库并安排发布，主应用仅在运行时进行组合。
  - icon:
      src: /icons/scope.svg
      alt: 挂载到页面区域的应用
      width: 22
      height: 22
      wrap: true
    title: 按需管理实例
    details: 使用 loadMicroApp 将应用挂载到指定的 HTMLElement，并通过返回的实例句柄执行更新或卸载。
  - icon:
      src: /icons/sandbox.svg
      alt: 隔离的运行边界
      width: 22
      height: 22
      wrap: true
    title: 隔离不同技术栈
    details: JavaScript 沙箱、可选的样式隔离和原生 ESM 支持，可减少多个应用在同一页面中运行时的相互影响。
---

## 管理单个微应用实例

在主应用中安装 qiankun：

```bash
npm install qiankun
```

容器创建后即可加载微应用。应保存返回的实例句柄，以便查询状态并执行卸载：

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

// 页面区域销毁前卸载微应用
await microApp.unmount();
```

微应用需要导出 `bootstrap`、`mount` 和 `unmount`。qiankun 会将其加载到指定的 `HTMLElement` 中，并调用相应的生命周期函数。[快速上手](/zh-CN/guide/getting-started)提供了完整的可运行示例。

如果微应用的激活状态完全取决于当前 URL，可使用基于路由的 [`registerMicroApps`](/zh-CN/api/register-micro-apps) 和 [`start`](/zh-CN/api/start)。
