---
layout: home

hero:
  name: qiankun
  text: A micro-frontends solution
  tagline: Assemble independently built and deployed front-end apps into one product at runtime. Framework agnostic, easy to adopt.
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
  - icon:
      src: /icons/agnostic.svg
    title: Framework agnostic
    details: React, Vue, Angular, even legacy jQuery — mix new and old however you like. A micro-app only needs to export three lifecycle functions.
  - icon:
      src: /icons/sandbox.svg
    title: Apps stay out of each other's way
    details: Each micro-app runs in its own JS sandbox. Globals, timers and event listeners are reverted on unmount, so apps mounted side by side never pollute one another.
  - icon:
      src: /icons/scope.svg
    title: Styles that don't leak
    details: Turn on style isolation with a single flag. It builds on the browser's native CSS @scope — no Shadow DOM — and handles external stylesheets too.
  - icon:
      src: /icons/esm.svg
    title: Vite apps, zero rework
    details: Run a micro-app's native ES modules directly, Vite dev server included. No separate UMD build just to make an app loadable.
  - icon:
      src: /icons/stream.svg
    title: Faster switching
    details: The HTML entry streams in and assets preload as they are parsed, so switching apps feels instant. You don't hand-write a preload strategy.
  - icon:
      src: /icons/singlespa.svg
    title: Battle tested
    details: Built on single-spa and hardened across a large number of production apps inside and outside Ant Group. Safe to ship.
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
  {
    name: 'vue-app',
    entry: '//localhost:7101',
    container: document.getElementById('subapp-container')!,
    activeRule: '/vue',
  },
]);

start();
```

On the micro-app side you only export three lifecycle functions — `bootstrap`, `mount`, `unmount` — with no change to your build output format. To skip the boilerplate, [`create-qiankun`](/ecosystem/create-qiankun) scaffolds a working setup in one command.

For the full flow see [Getting started](/guide/getting-started), or build one line by line in the [hand-built tutorial](/tutorial/).

## Community

- [GitHub repository](https://github.com/umijs/qiankun) — source, issues, stars
- [Discussions](https://github.com/umijs/qiankun/discussions) — ask questions, share setups, join design threads
- [v3 roadmap](https://github.com/umijs/qiankun/discussions/1378) — where 3.0 is headed
- [Changelog](https://github.com/umijs/qiankun/releases) — what changed in each release

Stuck on something? Check the [FAQ](/faq/) first — it likely has your answer.
