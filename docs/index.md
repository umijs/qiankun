---
layout: home

hero:
  name: qiankun
  tagline: Probably the most complete micro-frontends solution you'll ever meet🧐
  image:
    src: /logo.png
    alt: qiankun
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: What is qiankun
      link: /guide/what-is-qiankun
    - theme: alt
      text: GitHub
      link: https://github.com/umijs/qiankun

features:
  - icon: 🚀
    title: Simple
    details: Works with any JavaScript framework. Building a micro-frontend system is as simple as using iframes, except it isn't iframes.
  - icon: 🛡️
    title: Complete
    details: Ships almost everything a micro-frontend system needs — style isolation, a JS sandbox, preloading, and more.
  - icon: 🔧
    title: Production ready
    details: Battle-tested and hardened across a large number of production apps inside and outside Ant Group.
  - icon: ⚡
    title: High performance
    details: Streams the HTML entry and preloads assets as they are parsed, so switching between apps stays fast.
  - icon: 🎯
    title: Framework agnostic
    details: The main app puts no constraints on a micro-app's stack; each micro-app keeps full autonomy.
  - icon: 🧬
    title: State isolation
    details: A complete JS sandbox, plus native ESM-sandbox support, keeps apps from affecting one another.
---

## Quick start

Install qiankun:

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

Register your micro-apps in the main app, then start:

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

On the micro-app side you only export three lifecycle functions — `bootstrap`, `mount`, `unmount` — with no change to your build output. See [Getting started](/guide/getting-started) for the full flow.
