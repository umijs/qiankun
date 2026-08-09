---
layout: home

hero:
  name: qiankun · 微前端运行时
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
    - theme: alt
      text: 在线示例
      link: https://examples.qiankunjs.com

features:
  - icon:
      src: /icons/agnostic.svg
      alt: 独立的应用边界
      width: 22
      height: 22
      wrap: true
    title: 独立开发与发布
    details: 每个微应用可独立选择技术栈、管理代码仓库并安排发布，主应用只在运行时把它们组合到页面上。
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
npm install qiankun@rc
```

::: tip v3 目前发布在 `rc` 标签上
qiankun 3.0 仍处于 RC 阶段，npm 的 `latest` 标签指向的仍是 2.x。安装时需显式指定 `@rc` 才能获得 v3。
:::

容器创建后即可加载微应用。记得保存返回的实例句柄，后续查询状态、卸载实例都要靠它：

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

仓库中的示例应用（两个主应用加载同一组微应用）已部署在 [examples.qiankunjs.com](https://examples.qiankunjs.com)，可直接在线体验。
