---
layout: home

hero:
  name: qiankun
  text: 微前端解决方案
  tagline: 可能是你见过的最完善的微前端解决方案🧐
  image:
    src: /logo.png
    alt: qiankun
  actions:
    - theme: brand
      text: 快速开始
      link: /zh-CN/guide/quick-start
    - theme: alt
      text: 在 GitHub 上查看
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
    details: 支持应用预加载，优化用户体验并提高应用切换速度。
  - icon: 🎯
    title: 技术栈无关
    details: 主应用不限制接入应用的技术栈，微应用具备完全自主权。
  - icon: 🔄
    title: 状态隔离
    details: 提供完整的 JS 沙箱机制，确保应用之间不会相互影响。
---

## 📦 安装

::: code-group

```bash [npm]
npm install qiankun
```

```bash [yarn]
yarn add qiankun
```

```bash [pnpm]
pnpm add qiankun
```

:::

## 🔨 快速开始

### 主应用

```typescript
import { registerMicroApps, start } from 'qiankun';

// 注册微应用
registerMicroApps([
  {
    name: 'reactApp',
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/yourActiveRule',
  },
  {
    name: 'vueApp',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);

// 启动 qiankun
start();
```

### 微应用

```typescript
/**
 * bootstrap 只会在微应用初始化的时候调用一次
 * mount 会在每次进入微应用时调用
 * unmount 会在每次切出/卸载微应用时调用
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}

export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}
```

## 🌟 为什么选择 qiankun？

<div class="features-grid">
<div class="feature-card">
<h3>🎯 零侵入</h3>
<p>对现有应用几乎零侵入，只需要暴露必要的生命周期函数即可</p>
</div>

<div class="feature-card">
<h3>📱 全场景</h3>
<p>支持基于路由的微应用加载和手动加载模式</p>
</div>

<div class="feature-card">
<h3>🔒 安全隔离</h3>
<p>完整的沙箱解决方案，包括 JS 隔离和 CSS 隔离</p>
</div>

<div class="feature-card">
<h3>⚡ 高性能</h3>
<p>支持预加载、缓存等多种性能优化方案</p>
</div>
</div>

## 👥 社区

| GitHub 讨论 | 钉钉群 | 微信群 |
| --- | --- | --- |
| [qiankun 讨论](https://github.com/umijs/qiankun/discussions) | <img src="https://mdn.alipayobjects.com/huamei_zvchwx/afts/img/A*GG8zTJaUnTAAAAAAAAAAAAAADuWEAQ/original" width="150" /> | [查看群二维码](https://github.com/umijs/qiankun/discussions/2343) |

<style>
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.feature-card {
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition: border-color 0.25s;
}

.feature-card:hover {
  border-color: var(--vp-c-brand-1);
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.feature-card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style> 