---
layout: home

hero:
  name: qiankun
  text: Micro-Frontend Solution
  tagline: Probably the most complete micro-frontends solution you ever met🧐
  image:
    src: /logo.png
    alt: qiankun
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/umijs/qiankun

features:
  - icon: 🚀
    title: Simple
    details: Works with any javascript framework. Build your micro-frontend system just like using with iframe, but not iframe actually.
  - icon: 🛡️
    title: Complete
    details: Includes almost all the basic capabilities required to build a micro-frontend system, such as style isolation, js sandbox, preloading, and so on.
  - icon: 🔧
    title: Production-Ready
    details: Had been extensively tested and polished by a large number of online applications both inside and outside of Ant Financial, the robustness is trustworthy.
  - icon: ⚡
    title: High Performance
    details: Supports application preloading to optimize user experience and improve application switching speed.
  - icon: 🎯
    title: Technology Agnostic
    details: The main application does not limit the technology stack of accessing applications, and micro applications have complete autonomy.
  - icon: 🔄
    title: State Isolation
    details: Provides a complete JS sandbox mechanism to ensure that applications do not affect each other.
---

## 📦 Installation

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

## 🔨 Quick Start

### Main Application

```typescript
import { registerMicroApps, start } from 'qiankun';

// register micro apps
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

// start qiankun
start();
```

### Micro Application

```typescript
/**
 * bootstrap will only be called once when the micro application is initialized
 * mount will be called every time the micro application enters
 * unmount will be called every time the micro application leaves
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

## 🌟 Why qiankun?

<div class="features-grid">
<div class="feature-card">
<h3>🎯 Zero Intrusion</h3>
<p>Almost no intrusion to existing applications, only need to expose necessary lifecycle functions</p>
</div>

<div class="feature-card">
<h3>📱 All Scenarios</h3>
<p>Supports both route-based and manual loading of micro applications</p>
</div>

<div class="feature-card">
<h3>🔒 Secure Isolation</h3>
<p>Complete sandbox solution with JS isolation and CSS isolation</p>
</div>

<div class="feature-card">
<h3>⚡ High Performance</h3>
<p>Supports preloading, caching and other performance optimization solutions</p>
</div>
</div>

## 👥 Community

| GitHub Discussions | DingTalk Group | WeChat Group |
| --- | --- | --- |
| [qiankun discussions](https://github.com/umijs/qiankun/discussions) | <img src="https://mdn.alipayobjects.com/huamei_zvchwx/afts/img/A*GG8zTJaUnTAAAAAAAAAAAAAADuWEAQ/original" width="150" /> | [view group QR code](https://github.com/umijs/qiankun/discussions/2343) |

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